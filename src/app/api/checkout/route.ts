import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations/checkout";

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${date}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Vous devez être connecté pour passer commande" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { items, shippingAddress } = parsed.data;

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, message: "Un ou plusieurs produits sont introuvables" },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalPrice = 0;
    const lineItems: { productId: string; quantity: number; unitPrice: number; name: string }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) continue;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Stock insuffisant pour ${product.name}` },
          { status: 400 }
        );
      }
      const unitPrice = Number(product.price);
      totalPrice += unitPrice * item.quantity;
      lineItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        name: product.name,
      });
    }

    const orderNumber = generateOrderNumber();
    const origin = request.headers.get("origin") ?? "http://localhost:3000";

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        status: "PENDING",
        totalPrice,
        shippingAddress: shippingAddress ?? null,
        items: {
          create: lineItems.map((li) => ({
            productId: li.productId,
            quantity: li.quantity,
            unitPrice: li.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    const stripeSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      payment_intent_data: {
        metadata: { orderId: order.id },
      },
      line_items: lineItems.map((li) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: li.name,
            images: productMap.get(li.productId)?.images?.slice(0, 1),
          },
          unit_amount: Math.round(li.unitPrice * 100),
        },
        quantity: li.quantity,
      })),
      metadata: { orderId: order.id },
      success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier`,
      customer_email: session.user.email ?? undefined,
    });

    return NextResponse.json({
      sessionUrl: stripeSession.url,
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors du paiement" },
      { status: 500 }
    );
  }
}

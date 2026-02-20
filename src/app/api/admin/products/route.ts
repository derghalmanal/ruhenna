import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      stock,
      isGiftOption,
      category,
      images,
      featured,
      active,
    } = body as {
      name: string;
      slug: string;
      description: string;
      price: number;
      compareAtPrice?: number;
      stock: number;
      isGiftOption?: boolean;
      category: string;
      images: string[];
      featured?: boolean;
      active?: boolean;
    };

    if (!name || !slug || !description || price == null || stock == null || !category) {
      return NextResponse.json(
        { success: false, message: "name, slug, description, price, stock, category requis" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        compareAtPrice: compareAtPrice ?? null,
        stock,
        isGiftOption: isGiftOption ?? false,
        category,
        images: Array.isArray(images) ? images : [],
        featured: featured ?? false,
        active: active ?? true,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

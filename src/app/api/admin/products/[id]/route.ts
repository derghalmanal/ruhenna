/**
 * API admin — Produits (ressource).
 *
 * Routes :
 * - GET    /api/admin/products/:id : récupérer un produit
 * - PATCH  /api/admin/products/:id : modifier un produit
 * - DELETE /api/admin/products/:id : supprimer un produit (et supprimer ses images Cloudinary)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteCloudinaryImages } from "@/lib/cloudinary";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      },
    });
  } catch (error) {
    console.error("Admin product GET error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      category,
      images,
      active,
    } = body as {
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      compareAtPrice?: number | null;
      category?: string | null;
      images?: string[];
      active?: boolean;
    };

    const normalizedCategory =
      category === undefined
        ? undefined
        : category == null || String(category).trim() === ""
          ? null
          : String(category).trim();

    if (normalizedCategory) {
      const exists = await prisma.productCategory.findUnique({ where: { slug: normalizedCategory } });
      if (!exists) {
        return NextResponse.json(
          { success: false, message: "Catégorie invalide" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name != null && { name }),
        ...(slug != null && { slug }),
        ...(description != null && { description }),
        ...(price != null && { price }),
        ...(compareAtPrice !== undefined && { compareAtPrice }),
        ...(normalizedCategory !== undefined && { category: normalizedCategory }),
        ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Admin product PATCH error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id }, select: { images: true } });
    await prisma.product.delete({ where: { id } });
    if (product?.images?.length) {
      await deleteCloudinaryImages(product.images);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin product DELETE error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

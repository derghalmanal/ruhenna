/**
 * API admin - Produits (ressource).
 *
 * Routes :
 * - GET    /api/admin/products/:id : recuperer un produit
 * - PATCH  /api/admin/products/:id : modifier un produit
 * - DELETE /api/admin/products/:id : supprimer un produit et ses images Cloudinary
 */
import { NextRequest, NextResponse } from "next/server";
import type { Product, ProductCategory } from "@prisma/client";
import prisma from "@/lib/prisma";
import { deleteCloudinaryImages } from "@/lib/cloudinary";

type ProductWithCategory = Product & { category: ProductCategory | null };

function serializeProduct(product: ProductWithCategory) {
  return {
    ...product,
    category: product.category?.slug ?? null,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json({ product: serializeProduct(product) });
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

    const categoryRecord = normalizedCategory
      ? await prisma.productCategory.findUnique({ where: { slug: normalizedCategory } })
      : null;

    if (normalizedCategory && !categoryRecord) {
      return NextResponse.json(
        { success: false, message: "Categorie invalide" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      include: { category: true },
      data: {
        ...(name != null && { name }),
        ...(slug != null && { slug }),
        ...(description != null && { description }),
        ...(price != null && { price }),
        ...(compareAtPrice !== undefined && { compareAtPrice }),
        ...(normalizedCategory !== undefined && { categoryId: categoryRecord?.id ?? null }),
        ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error("Admin product PATCH error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
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

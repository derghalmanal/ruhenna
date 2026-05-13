/**
 * API admin - Produits (collection).
 *
 * Routes :
 * - GET  /api/admin/products : lister les produits
 * - POST /api/admin/products : creer un produit
 */
import { NextRequest, NextResponse } from "next/server";
import type { Product, ProductCategory } from "@prisma/client";
import prisma from "@/lib/prisma";

type ProductWithCategory = Product & { category: ProductCategory | null };

function serializeProduct(product: ProductWithCategory) {
  return {
    ...product,
    category: product.category?.slug ?? null,
  };
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products: products.map(serializeProduct) });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
      name: string;
      slug: string;
      description: string;
      price: number;
      compareAtPrice?: number;
      category?: string | null;
      images: string[];
      active?: boolean;
    };

    if (!name || !slug || !description || price == null) {
      return NextResponse.json(
        { success: false, message: "name, slug, description, price requis" },
        { status: 400 }
      );
    }

    const normalizedCategory =
      category == null || String(category).trim() === "" ? null : String(category).trim();

    const categoryRecord = normalizedCategory
      ? await prisma.productCategory.findUnique({ where: { slug: normalizedCategory } })
      : null;

    if (normalizedCategory && !categoryRecord) {
      return NextResponse.json(
        { success: false, message: "Categorie invalide" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      include: { category: true },
      data: {
        name,
        slug,
        description,
        price,
        compareAtPrice: compareAtPrice ?? null,
        categoryId: categoryRecord?.id ?? null,
        images: Array.isArray(images) ? images : [],
        active: active ?? true,
      },
    });

    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

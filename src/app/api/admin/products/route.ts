/**
 * API admin — Produits (collection).
 *
 * Routes :
 * - GET  /api/admin/products : lister les produits
 * - POST /api/admin/products : créer un produit
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
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

    if (normalizedCategory) {
      const exists = await prisma.productCategory.findUnique({ where: { slug: normalizedCategory } });
      if (!exists) {
        return NextResponse.json(
          { success: false, message: "Catégorie invalide" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        compareAtPrice: compareAtPrice ?? null,
        category: normalizedCategory,
        images: Array.isArray(images) ? images : [],
        active: active ?? true,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

/**
 * API admin — Catégorie (ressource).
 *
 * Routes :
 * - PATCH  /api/admin/categories/:id : modifier slug/label (et réaffecter les produits si slug change)
 * - DELETE /api/admin/categories/:id : supprimer une catégorie (en rebasculant les produits)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.productCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Catégorie introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const { slug, label } = body;
    const data: { slug?: string; label?: string } = {};
    if (slug !== undefined) data.slug = String(slug);
    if (label !== undefined) data.label = String(label);
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, message: "Aucune donnée à mettre à jour" }, { status: 400 });
    }
    await prisma.$transaction(async (tx: any) => {
      await tx.productCategory.update({ where: { id }, data });
      if (data.slug && data.slug !== existing.slug) {
        await tx.product.updateMany({
          where: { category: existing.slug },
          data: { category: data.slug },
        });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin category PATCH error:", error);
    const err = error as { code?: string };
    if (err.code === "P2002") {
      return NextResponse.json({ success: false, message: "Ce slug existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.productCategory.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ success: false, message: "Catégorie introuvable" }, { status: 404 });
    }

    // Les produits de cette catégorie seront placés dans la première catégorie restante
    const firstOther = await prisma.productCategory.findFirst({
      where: { id: { not: id } },
      orderBy: { sortOrder: "asc" },
    });

    await prisma.$transaction(async (tx: any) => {
      if (firstOther) {
        await tx.product.updateMany({
          where: { category: category.slug },
          data: { category: firstOther.slug },
        });
      }
      await tx.productCategory.delete({ where: { id } });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin category DELETE error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

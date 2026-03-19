/**
 * API admin — Catégories (collection).
 *
 * Routes :
 * - GET   /api/admin/categories : lister les catégories
 * - POST  /api/admin/categories : créer une catégorie
 * - PATCH /api/admin/categories : réordonner les catégories
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.productCategory.findMany({
    where: { slug: { not: "tout" } },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, label, sortOrder } = body;
    if (!slug || !label) {
      return NextResponse.json({ success: false, message: "slug et label requis" }, { status: 400 });
    }
    if (String(slug) === "tout") {
      return NextResponse.json({ success: false, message: "Catégorie réservée" }, { status: 400 });
    }
    const maxSort = await prisma.productCategory.aggregate({ _max: { sortOrder: true } });
    await prisma.productCategory.create({
      data: {
        slug: String(slug),
        label: String(label),
        sortOrder:
          typeof sortOrder === "number" ? sortOrder : (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin categories POST error:", error);
    const err = error as { code?: string };
    if (err.code === "P2002") {
      return NextResponse.json({ success: false, message: "Cette catégorie existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { ids } = (await request.json()) as { ids: string[] };
    if (!Array.isArray(ids)) {
      return NextResponse.json({ success: false, message: "ids requis" }, { status: 400 });
    }
    const existing = await prisma.productCategory.findMany({
      where: { slug: { not: "tout" } },
      select: { id: true },
      orderBy: { sortOrder: "asc" },
    });
    const idSet = new Set(existing.map((c: any) => c.id));
    const ordered = ids.filter((id) => idSet.has(id));
    const missing = existing.map((c: any) => c.id).filter((id: any) => !ordered.includes(id));
    const normalized = [...ordered, ...missing];

    await prisma.$transaction(
      normalized.map((id, index) =>
        prisma.productCategory.update({ where: { id }, data: { sortOrder: index } })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin categories reorder error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

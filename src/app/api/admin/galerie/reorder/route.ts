/**
 * API admin — ré-ordonnancement galerie.
 *
 * Route : PATCH /api/admin/galerie/reorder
 * Body : { ids: string[] } (liste ordonnée)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const { ids } = (await request.json()) as { ids: string[] };
    if (!Array.isArray(ids)) {
      return NextResponse.json({ success: false, message: "ids requis" }, { status: 400 });
    }
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.galleryImage.update({ where: { id }, data: { sortOrder: index } })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery reorder error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

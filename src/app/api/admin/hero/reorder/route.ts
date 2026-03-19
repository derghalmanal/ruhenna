/**
 * API admin — ré-ordonnancement des images “Hero”.
 *
 * Route : PATCH /api/admin/hero/reorder
 * Body : { ids: string[] } (liste ordonnée)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const { ids } = await request.json();
    await prisma.$transaction(
      ids.map((id: string, index: number) =>
        prisma.heroImage.update({ where: { id }, data: { sortOrder: index } })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero reorder error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

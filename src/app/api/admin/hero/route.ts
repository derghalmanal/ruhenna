/**
 * API admin — Images “Hero” (collection).
 *
 * Routes :
 * - GET  /api/admin/hero : lister les images
 * - POST /api/admin/hero : ajouter une image (URL) avec un sortOrder
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.heroImage.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Hero images GET error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ success: false, message: "imageUrl requis" }, { status: 400 });
    }
    const maxOrder = await prisma.heroImage.aggregate({ _max: { sortOrder: true } });
    const image = await prisma.heroImage.create({
      data: { imageUrl, sortOrder: (maxOrder._max.sortOrder ?? -1) + 1 },
    });
    return NextResponse.json({ image });
  } catch (error) {
    console.error("Hero images POST error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

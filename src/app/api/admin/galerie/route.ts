/**
 * API admin — Galerie (collection).
 *
 * Routes :
 * - GET  /api/admin/galerie : lister les images
 * - POST /api/admin/galerie : ajouter une image
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Admin gallery GET error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération de la galerie" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, featured, sortOrder } = body;
    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, message: "Titre et imageUrl requis" },
        { status: 400 },
      );
    }
    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description ?? null,
        imageUrl,
        featured: featured ?? false,
        sortOrder: sortOrder ?? 0,
      },
    });
    return NextResponse.json({ image });
  } catch (error) {
    console.error("Admin gallery POST error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la création de l'image" },
      { status: 500 },
    );
  }
}

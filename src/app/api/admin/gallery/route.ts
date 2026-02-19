import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
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
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
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

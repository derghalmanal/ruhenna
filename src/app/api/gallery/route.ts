import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const where: { featured?: boolean } = {};
    if (featured === "true") where.featured = true;
    const images = await prisma.galleryImage.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération de la galerie" },
      { status: 500 },
    );
  }
}

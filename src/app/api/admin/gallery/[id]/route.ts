import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const { title, description, imageUrl, featured, sortOrder } = body;
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (featured !== undefined) data.featured = featured;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    const image = await prisma.galleryImage.update({
      where: { id },
      data,
    });
    return NextResponse.json({ image });
  } catch (error) {
    console.error("Admin gallery PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la mise à jour de l'image" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression de l'image" },
      { status: 500 },
    );
  }
}

/**
 * API admin — Galerie (ressource).
 *
 * Routes :
 * - PATCH  /api/admin/galerie/:id : modifier une image (titre/desc/ordre)
 * - DELETE /api/admin/galerie/:id : supprimer une image (et supprimer côté Cloudinary)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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
    const { id } = await params;
    const image = await prisma.galleryImage.findUnique({ where: { id }, select: { imageUrl: true } });
    await prisma.galleryImage.delete({ where: { id } });
    if (image?.imageUrl) {
      await deleteCloudinaryImage(image.imageUrl);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression de l'image" },
      { status: 500 },
    );
  }
}

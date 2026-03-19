/**
 * API admin — Image “Hero” (ressource).
 *
 * Routes :
 * - PATCH  /api/admin/hero/:id : activer/désactiver une image
 * - DELETE /api/admin/hero/:id : supprimer une image (et supprimer côté Cloudinary)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const image = await prisma.heroImage.update({
      where: { id },
      data: { active: body.active },
    });
    return NextResponse.json({ image });
  } catch (error) {
    console.error("Hero image PATCH error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}


export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;
    const image = await prisma.heroImage.findUnique({ where: { id }, select: { imageUrl: true } });
    await prisma.heroImage.delete({ where: { id } });
    if (image?.imageUrl) await deleteCloudinaryImage(image.imageUrl);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero image DELETE error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

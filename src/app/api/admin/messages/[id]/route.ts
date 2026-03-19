/**
 * API admin — Message (ressource).
 *
 * Routes :
 * - PATCH  /api/admin/messages/:id : marquer lu/non-lu, archiver/désarchiver
 * - DELETE /api/admin/messages/:id : suppression logique (deletedAt)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { read, archive } = body;

  const updateData: { read?: boolean; archivedAt?: Date | null } = {};
  if (typeof read === "boolean") updateData.read = read;
  if (typeof archive === "boolean") {
    updateData.archivedAt = archive ? new Date() : null;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Aucune modification" }, { status: 400 });
  }

  const message = await prisma.contactMessage.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json({ message });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.contactMessage.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ success: true });
}

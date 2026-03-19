/**
 * API admin — Messages (contact).
 *
 * Route : GET /api/admin/messages?view=inbox|archive
 * Rôle : lister les messages (inbox ou archive) en excluant les messages supprimés.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") ?? "inbox";

  const where =
    view === "archive"
      ? { archivedAt: { not: null }, deletedAt: null }
      : { archivedAt: null, deletedAt: null };

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ messages });
}

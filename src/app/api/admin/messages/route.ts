import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
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

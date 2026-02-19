import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { title, slug, excerpt, content, coverImage, published } = body;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  const updateData: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string | null;
    published?: boolean;
    publishedAt?: Date | null;
  } = {};

  if (typeof title === "string") updateData.title = title;
  if (typeof slug === "string") updateData.slug = slug;
  if (typeof excerpt === "string") updateData.excerpt = excerpt;
  if (typeof content === "string") updateData.content = content;
  if (coverImage !== undefined) updateData.coverImage = coverImage || null;
  if (typeof published === "boolean") {
    updateData.published = published;
    if (published && !existing.published) {
      updateData.publishedAt = new Date();
    } else if (!published) {
      updateData.publishedAt = null;
    }
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json({ post });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

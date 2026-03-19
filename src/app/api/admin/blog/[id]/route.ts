/**
 * API admin — Blog (ressource).
 *
 * Routes :
 * - GET    /api/admin/blog/:id : récupérer un article
 * - PATCH  /api/admin/blog/:id : modifier un article
 * - DELETE /api/admin/blog/:id : supprimer un article (et supprimer l’image Cloudinary associée)
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { coverImage: true } });
  await prisma.blogPost.delete({ where: { id } });
  if (post?.coverImage) {
    await deleteCloudinaryImage(post.coverImage);
  }
  return NextResponse.json({ success: true });
}

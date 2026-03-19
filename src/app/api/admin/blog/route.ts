/**
 * API admin — Blog (collection).
 *
 * Routes :
 * - GET  /api/admin/blog : lister les articles
 * - POST /api/admin/blog : créer un article
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {

  const body = await request.json().catch(() => ({}));
  const { title, slug, excerpt, content, coverImage, published } = body;

  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json(
      { error: "title, slug, excerpt et content sont requis" },
      { status: 400 }
    );
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || null,
      published: !!published,
      publishedAt: published ? new Date() : null,
    },
  });
  return NextResponse.json({ post }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
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

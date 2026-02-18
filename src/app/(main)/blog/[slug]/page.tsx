import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/env";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  });
  return {
    title: post ? `${post.title} | ${siteConfig.brandName}` : "Article",
    description: post?.excerpt?.slice(0, 160) ?? undefined,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  });

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split(/\n\n/).filter(Boolean);

  return (
    <main>
      <article className="section-padding bg-bg">
        <div className="container-narrow max-w-3xl">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage ?? "/assets/logo.png"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
          <header className="mt-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <time className="mt-4 block text-text-light">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </time>
          </header>
          <div className="mt-8 space-y-6 text-text-light">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <footer className="mt-12 border-t border-warm-dark/30 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-accent"
            >
              <LuArrowLeft className="h-4 w-4" />
              Retour au blog
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
}

/**
 * Page Article de blog (route `/blog/[slug]`).
 *
 * Rôle : charger l’article publié par slug, générer les métadonnées SEO et afficher
 * le contenu HTML (issu de l’éditeur admin).
 */
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/env";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

  return (
    <main>
      <article className="section-padding bg-bg">
        <div className="container-narrow max-w-3xl">
          <div className="relative mx-auto max-w-2xl aspect-[21/9] overflow-hidden rounded-2xl">
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
          <div
            className="mt-8 space-y-4 text-text-light leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-text [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline [&_img]:rounded-xl [&_img]:my-4 [&_strong]:text-text [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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

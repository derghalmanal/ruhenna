/**
 * Page Blog (route `/blog`).
 *
 * Rôle : lister les articles publiés (server component) et afficher des cartes d’articles.
 */
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main>
      <section className="pt-25 pb-0 bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-light">
            Conseils, traditions et inspirations autour de l&apos;art du henné.
          </p>
        </div>
      </section>
      <section className="section-padding bg-bg">
        <div className="container-narrow">
          {posts.length === 0 ? (
            <p className="py-12 text-center text-text-light">Aucun article pour le moment</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <article
                  key={post.slug}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-warm-dark/20 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.coverImage ?? "/assets/logo.png"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <time className="text-sm text-text-light">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </time>
                    <h2 className="mt-2 font-heading text-xl font-semibold text-text">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 flex-1 text-text-light line-clamp-3">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-accent"
                    >
                      Lire la suite
                      <LuArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

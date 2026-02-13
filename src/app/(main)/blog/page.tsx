import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

const MOCK_POSTS = [
  { slug: "traditions-henne-mariage", title: "Les traditions du henné dans les mariages", excerpt: "Découvrez l'histoire et la symbolique du henné dans les cérémonies de mariage à travers les cultures.", date: "15 février 2026", image: "/assets/logo.png" },
  { slug: "conseils-preparation-henne", title: "Conseils pour préparer sa peau au henné", excerpt: "Comment préparer vos mains et pieds pour une application optimale et des motifs qui durent plus longtemps.", date: "8 janvier 2026", image: "/assets/logo.png" },
  { slug: "motifs-traditionnels-maroc", title: "Les motifs traditionnels marocains", excerpt: "Un voyage à travers les motifs emblématiques du Maroc et leur signification culturelle.", date: "2 décembre 2026", image: "/assets/logo.png" },
  { slug: "henne-mariage-invites", title: "Henné pour les invités : idées et tendances", excerpt: "Comment intégrer le henné dans votre mariage pour une expérience partagée avec vos invités.", date: "20 octobre 2025", image: "/assets/logo.png" },
  { slug: "soins-apres-henne", title: "Prendre soin de son henné après application", excerpt: "Les gestes essentiels pour prolonger la durée de vie de vos motifs et garder une belle couleur.", date: "12 septembre 2025", image: "/assets/logo.png" },
  { slug: "atelier-henne-famille", title: "Organiser un atelier henné en famille", excerpt: "Idées et conseils pour un moment de partage et de créativité autour du henné.", date: "5 août 2025", image: "/assets/logo.png" },
] as const;

export default function BlogPage() {
  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl">Blog</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-light">Conseils, traditions et inspirations autour de l&apos;art du henné.</p>
        </div>
      </section>
      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_POSTS.map((post) => (
              <article key={post.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-warm-dark/20 bg-white shadow-sm transition-all hover:shadow-lg">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <time className="text-sm text-text-light">{post.date}</time>
                  <h2 className="mt-2 font-heading text-xl font-semibold text-text">
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-primary">{post.title}</Link>
                  </h2>
                  <p className="mt-2 flex-1 text-text-light line-clamp-3">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-accent">
                    Lire la suite
                    <LuArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

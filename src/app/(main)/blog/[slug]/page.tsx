import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/env";

const MOCK_ARTICLES: Record<string, { title: string; date: string; image: string; body: string[] }> = {
  "traditions-henne-mariage": {
    title: "Les traditions du henné dans les mariages",
    date: "15 février 2026",
    image: "/assets/logo.png",
    body: [
      "Le henné occupe une place centrale dans de nombreuses cérémonies de mariage à travers le monde. En Inde, au Maroc, au Pakistan et dans d'autres cultures, la nuit du henné (Mehndi) est un moment sacré où la future mariée reçoit des motifs complexes censés porter bonheur et fertilité.",
      "Les motifs traditionnels varient selon les régions : motifs floraux en Inde, géométriques au Maghreb, ou encore des symboles représentant l'amour et la prospérité. Chaque dessin raconte une histoire et transmet des vœux pour le couple.",
      "Aujourd'hui, de plus en plus de mariées occidentales adoptent cette tradition pour ajouter une touche d'exotisme et de symbolisme à leur journée. Le henné naturel offre une teinte cuivrée qui s'intensifie dans les jours suivant l'application, créant un souvenir durable de ce moment unique.",
    ],
  },
  "conseils-preparation-henne": {
    title: "Conseils pour préparer sa peau au henné",
    date: "8 janvier 2026",
    image: "/assets/logo.png",
    body: [
      "Une bonne préparation de la peau garantit une application optimale et des motifs qui dureront plus longtemps. Quelques jours avant votre rendez-vous, hydratez régulièrement vos mains et pieds pour éviter les peaux mortes.",
      "Le jour J, évitez les crèmes grasses qui pourraient empêcher le henné de bien adhérer. Une peau propre et légèrement exfoliée offre la meilleure base. Pensez également à éviter l'exposition au soleil juste avant l'application.",
      "Après l'application, laissez le henné poser le plus longtemps possible (idéalement 6 à 8 heures) pour une couleur plus intense. Une fois retiré, appliquez un mélange de citron et sucre pour fixer la teinte.",
    ],
  },
  "motifs-traditionnels-maroc": {
    title: "Les motifs traditionnels marocains",
    date: "2 décembre 2025",
    image: "/assets/logo.png",
    body: [
      "Le Maroc possède une riche tradition de henné aux motifs géométriques et floraux distinctifs. Les designs marocains se caractérisent par des lignes fines, des points et des formes symétriques inspirées de l'art islamique.",
      "Les motifs les plus courants incluent les fleurs de jasmin, les étoiles à huit branches, les losanges et les entrelacs. Chaque région du Maroc développe ses propres variations, créant une diversité fascinante.",
      "Ces motifs ne sont pas uniquement décoratifs : ils portent une symbolique de protection, de fertilité et de bonheur. Les mariées marocaines arborent traditionnellement des motifs jusqu'aux coudes et aux genoux pour les grandes occasions.",
    ],
  },
  "henne-mariage-invites": {
    title: "Henné pour les invités : idées et tendances",
    date: "20 octobre 2025",
    image: "/assets/logo.png",
    body: [
      "Intégrer le henné dans votre mariage pour vos invités crée une expérience immersive et mémorable. De plus en plus de couples proposent un coin henné lors de leur cocktail ou de leur soirée.",
      "Les options sont variées : motifs simples sur le dos de la main pour un effet discret, ou ateliers participatifs où chacun repart avec son propre design.",
      "Pensez à prévoir un espace dédié avec des tabourets confortables et une ambiance tamisée. Un artiste henné professionnel peut gérer une vingtaine d'invités en quelques heures.",
    ],
  },
  "soins-apres-henne": {
    title: "Prendre soin de son henné après application",
    date: "12 septembre 2025",
    image: "/assets/logo.png",
    body: [
      "Les premiers jours sont cruciaux pour obtenir une belle couleur durable. Évitez l'eau pendant les 12 premières heures après le retrait du henné.",
      "Appliquez régulièrement une huile naturelle (amande douce, coco ou sésame) pour nourrir la peau et intensifier la teinte.",
      "Avec ces soins, vos motifs peuvent durer de une à trois semaines. La couleur évolue : elle atteint son intensité maximale 48 à 72 heures après l'application.",
    ],
  },
  "atelier-henne-famille": {
    title: "Organiser un atelier henné en famille",
    date: "5 août 2025",
    image: "/assets/logo.png",
    body: [
      "Un atelier henné en famille est une merveilleuse façon de partager un moment créatif et culturel. Que ce soit pour un anniversaire, les fêtes ou simplement un dimanche en famille, l'activité convient à tous les âges.",
      "Les enfants adorent découvrir les cônes et créer leurs premiers motifs. Commencez par des formes simples : points, lignes, cœurs.",
      "Prévoyez un espace calme, de la musique douce et des encas. Chaque participant repartira avec ses propres créations et des souvenirs précieux de ce moment de complicité.",
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES[slug];
  return {
    title: article ? `${article.title} | ${siteConfig.brandName}` : "Article",
    description: article?.body[0]?.slice(0, 160) ?? undefined,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = MOCK_ARTICLES[slug];

  if (!article) {
    return (
      <main className="section-padding">
        <div className="container-narrow text-center">
          <h1 className="font-heading text-2xl font-bold text-text">Article non trouvé</h1>
          <Link href="/blog" className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent">
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <article className="section-padding bg-bg">
        <div className="container-narrow max-w-3xl">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image src={article.image} alt={article.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
          <header className="mt-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-text md:text-4xl lg:text-5xl">{article.title}</h1>
            <time className="mt-4 block text-text-light">{article.date}</time>
          </header>
          <div className="mt-8 space-y-6 text-text-light">
            {article.body.map((paragraph, i) => (
              <p key={i} className="leading-relaxed">{paragraph}</p>
            ))}
          </div>
          <footer className="mt-12 border-t border-warm-dark/30 pt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-accent">
              <ArrowLeft className="h-4 w-4" />
              Retour au blog
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
}

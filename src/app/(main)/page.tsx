/**
 * Page d’accueil du site (route `/`).
 *
 * Rôle : afficher la bannière (hero), des sections “services”, des témoignages
 * et des contenus mis en avant (images hero + galerie).
 */
import Link from "next/link";
import Image from "next/image";
import {
  LuSparkles,
  LuCalendar,
  LuShoppingBag,
} from "react-icons/lu";
import { siteConfig } from "@/lib/env";
import { HeroCarousel } from "@/components/HeroCarousel";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const services = [
  {
    icon: LuSparkles,
    title: "Art du henné",
    description:
      "Découvrez des créations uniques et sur-mesure pour sublimer vos événements.",
    href: "/galerie",
  },
  {
    icon: LuCalendar,
    title: "Événements",
    description:
      "Mariages, anniversaires… Je m'adapte à chaque occasion.",
    href: "/contact",
  },
  {
    icon: LuShoppingBag,
    title: "Boutique en ligne",
    description:
      "Explorez des cônes de henné frais, des kits complets et des accessoires artisanaux.",
    href: "/boutique",
  },
];

const testimonials = [
  {
    quote: "Parfait! 👍 Couleurs bien voyantes.",
    name: "Sasha L.",
    date: "Janvier 2026",
  },
  {
    quote: "Très gentille et le colis est bien emballé franchement 10/10 merci beaucoup",
    name: "Amira K.",
    date: "Novembre 2025",
  },
  {
    quote: "Henné super , il tient très bien !! Fait maison, pas cher et vendeuse très agréable qui met à disposition une petite notice !! foncez je recommande !! 👌🏻",
    name: "Lucille G.",
    date: "Septembre 2025",
  },
  {
    quote: "Parfait vendeuse très agréable et très rapide pour l’envoi. Milles mercis je recommande fortement !!!!",
    name: "Iliana B.",
    date: "Juillet 2025",
  },
];

export default async function HomePage() {
  let heroImages: { id: string; imageUrl: string }[] = [];
  let featuredGalleryImages: { id: string; imageUrl: string; title: string }[] = [];

  try {
    // Récupération des images pour le HeroCarousel
    heroImages = await prisma.heroImage.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, imageUrl: true },
    });

    // Récupération des images "Featured" pour la section Réalisations
    featuredGalleryImages = await prisma.galleryImage.findMany({
      where: { featured: true },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ],
      take: 6, // On limite à 6 images pour ne pas surcharger la page d'accueil
      select: { id: true, imageUrl: true, title: true },
    });
  } catch (error) {
    // Keep homepage functional even if DB is temporarily unavailable.
    console.error("Home page DB fallback:", error);
  }

  return (
    <main>
      {/* --- HERO SECTION --- */}
      <section className="relative flex h-[60vh] min-h-[400px] max-h-[600px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroCarousel images={heroImages} />
          <div
            className="absolute inset-0 bg-gradient-to-b from-bg-dark/60 via-bg-dark/40 to-bg-dark/80"
            aria-hidden
          />
        </div>
        <div className="container-narrow relative z-10 flex flex-col items-center text-center">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-text-inverse drop-shadow-lg md:text-6xl lg:text-7xl">
            {siteConfig.brandName}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-warm/95 md:text-2xl">
            {siteConfig.brandTagline}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/galerie"
              className="rounded-full bg-primary px-8 py-4 font-semibold text-text-inverse shadow-lg transition-all hover:bg-primary-light hover:shadow-xl"
            >
              Découvrir la Galerie
            </Link>
            <Link
              href="/reservation"
              className="rounded-full border-2 border-primary-light bg-white/10 px-8 py-4 font-semibold text-text-inverse backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Prendre Rendez-vous
            </Link>
          </div>
        </div>
      </section>

      {/* --- MES SERVICES --- */}
      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Mes Services
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map(({ icon: Icon, title, description, href }) => (
              <div
                key={title}
                className="glass-card flex flex-col p-8 transition-shadow hover:shadow-xl"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-text">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-text-light">{description}</p>
                <Link
                  href={href}
                  className="mt-4 font-medium text-primary transition-colors hover:text-accent"
                >
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MES RÉALISATIONS --- */}
      <section className="section-padding bg-warm/30">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Mes Réalisations
          </h2>
          
          {featuredGalleryImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {featuredGalleryImages.map((img) => (
                <Link
                  key={img.id}
                  href="/galerie"
                  className="group relative aspect-[1/1] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.title || "Réalisation au henné"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-light italic">
              Bientôt de nouvelles réalisations à découvrir !
            </p>
          )}
          
          <div className="mt-10 text-center">
            <Link
              href="/galerie"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-text-inverse"
            >
              Voir toute la galerie
            </Link>
          </div>
        </div>
      </section>

      {/* --- TÉMOIGNAGES --- */}
      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Ils m'ont fait confiance
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map(({ quote, name, date }) => (
              <div key={name} className="glass-card flex flex-col p-8">
                <p className="flex-1 italic text-text-light">&ldquo;{quote}&rdquo;</p>
                <div className="mt-6 border-t border-warm-dark/30 pt-4">
                  <p className="font-semibold text-text">{name}</p>
                  <p className="text-sm text-text-light">{date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="section-padding bg-gradient-to-br from-primary/20 via-warm to-accent/20">
        <div className="container-narrow text-center">
          <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
            Prête à sublimer votre événement ?
          </h2>
          <p className="mt-4 text-lg text-text-light">
            Réservez dès maintenant et offrez-vous un moment d&apos;exception.
          </p>
          <Link
            href="/reservation"
            className="mt-8 inline-block rounded-full bg-accent px-10 py-4 font-semibold text-text-inverse shadow-lg transition-all hover:bg-accent-light hover:shadow-xl"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </section>
    </main>
  );
}
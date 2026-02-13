import Link from "next/link";
import Image from "next/image";
import {
  LuSparkles,
  LuCalendar,
  LuGift,
  LuTruck,
  LuShield,
  LuStar,
  LuCreditCard,
} from "react-icons/lu";
import { siteConfig } from "@/lib/env";

const galleryImages = [
  "/assets/galery/henne_1.jpg",
  "/assets/galery/henne_2.jpg",
  "/assets/galery/henne_3.jpg",
  "/assets/galery/henne_4.jpg",
  "/assets/galery/henne_5.jpg",
  "/assets/galery/henne_6.jpg",
];

const services = [
  {
    icon: LuSparkles,
    title: "Art du henné",
    description:
      "Découvrez nos créations uniques et sur-mesure pour sublimer vos événements.",
    href: "/services/henne",
  },
  {
    icon: LuCalendar,
    title: "Événements",
    description:
      "Mariages, anniversaires… Nous nous adaptons à chaque occasion.",
    href: "/services/evenements",
  },
  {
    icon: LuGift,
    title: "Cadeaux personnalisés",
    description:
      "Offrez un moment d'exception avec nos coffrets et prestations cadeaux.",
    href: "/services/cadeaux",
  },
];

const testimonials = [
  {
    quote: "Vendeuse agréable et serviable 💖 Je recommande",
    name: "Cliente A",
    date: "Décembre 2025",
  },
  {
    quote: "travail soigné et envoi parfait, très sympathique et professionnel , je recommande",
    name: "Cliente B",
    date: "Décembre 2025",
  },
  {
    quote: "très bonne qualité ! Eh l’odeur des huiles essentielles sont agréables et non dérangeantes ! Merci beaucoup",
    name: "Cliente C",
    date: "Décembre 2025",
  },
  {
    quote: "génial ! envoi rapide, vendeuse arrangeante, et surtout : un henné de qualité ! très bonne communication. je recommande",
    name: "Cliente D",
    date: "Décembre 2025",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/placeholders/hero-poster.svg"
          >
            <source src="" type="video/mp4" />
          </video>
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

      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Nos Services
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

      <section className="section-padding bg-warm/30">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Nos Réalisations
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryImages.map((src, i) => (
              <Link
                key={i}
                href="/galerie"
                className="group relative aspect-[1/1] overflow-hidden rounded-2xl"
              >
                <Image
                  src={src}
                  alt={`Réalisation ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </Link>
            ))}
          </div>
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

      <section className="border-y border-warm-dark/30 bg-bg py-12">
        <div className="container-narrow">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LuTruck className="h-6 w-6" />
              </div>
              <span className="font-medium text-text">Livraison soignée</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LuShield className="h-6 w-6" />
              </div>
              <span className="font-medium text-text">Qualité artisanale</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LuStar className="h-6 w-6" />
              </div>
              <span className="font-medium text-text">Avis 5 étoiles</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LuCreditCard className="h-6 w-6" />
              </div>
              <span className="font-medium text-text">Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Ils nous font confiance
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

      <section className="section-padding bg-gradient-to-br from-primary/20 via-warm to-accent/20">
        <div className="container-narrow text-center">
          <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
            Prêt(e) à sublimer votre événement ?
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

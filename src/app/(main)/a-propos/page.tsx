import Image from "next/image";
import Link from "next/link";
import { LuHeart, LuAward, LuGem } from "react-icons/lu";

const MILESTONES = [
  { year: "2023", title: "Début de l'aventure", description: "Premiers pas dans l'art du henné et formation aux techniques traditionnelles." },
  { year: "2024", title: "Ouverture de l'atelier", description: "Création de mon propre espace dédié aux prestations et ateliers." },
  { year: "2025", title: "Spécialisation mariages", description: "Développement d'une expertise reconnue pour les cérémonies de mariage." },
  { year: "2026", title: "Aujourd'hui", description: "Des dizaines de clients satisfaits et une passion toujours intacte." },
];

const VALUES = [
  { icon: LuHeart, title: "Passion", description: "Chaque motif est créé avec amour et dévouement à l'art ancestral du henné." },
  { icon: LuAward, title: "Qualité", description: "Des produits naturels et des techniques soignées pour un résultat durable." },
  { icon: LuGem, title: "Authenticité", description: "Respect des traditions tout en apportant une touche personnelle et créative." },
];

export default function AProposPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-warm-dark/30 bg-warm/30">
              <Image
                src="/assets/logo.png"
                alt="Portrait"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl">
                À propos
              </h1>
              <p className="mt-6 text-lg text-text-light">
                Artisane passionnée par l&apos;art du henné depuis plus de dix ans, je vous
                accompagne pour sublimer vos moments précieux. Mariages, événements ou
                ateliers créatifs : chaque prestation est unique et réalisée sur mesure.
              </p>
              <p className="mt-4 text-text-light">
                Mon parcours m&apos;a conduite à explorer les traditions du henné à travers
                différentes cultures, tout en développant un style personnel qui allie
                authenticité et modernité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Mon parcours
          </h2>
          <div className="space-y-8">
            {MILESTONES.map(({ year, title, description }) => (
              <div
                key={year}
                className="glass-card flex flex-col gap-4 p-6 sm:flex-row sm:items-start"
              >
                <span className="shrink-0 font-heading text-2xl font-bold text-primary">
                  {year}
                </span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-text">
                    {title}
                  </h3>
                  <p className="mt-2 text-text-light">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-warm/30">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Mes valeurs
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass-card flex flex-col items-center p-8 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-text">
                  {title}
                </h3>
                <p className="mt-2 text-text-light">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary/20 via-warm to-accent/20">
        <div className="container-narrow text-center">
          <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
            Envie d&apos;en savoir plus ?
          </h2>
          <p className="mt-4 text-lg text-text-light">
            N&apos;hésitez pas à me contacter pour toute question ou projet.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-accent px-10 py-4 font-semibold text-text-inverse shadow-lg transition-all hover:bg-accent-light hover:shadow-xl"
          >
            Me contacter
          </Link>
        </div>
      </section>
    </main>
  );
}

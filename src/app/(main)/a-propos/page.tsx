/**
 * Page publique “À propos” (route `/a-propos`).
 *
 * Rôle : présenter l’artisane, son parcours et ses valeurs, avec un contenu statique.
 */
import Image from "next/image";
import Link from "next/link";
import { LuHeart, LuSparkles, LuLeaf, LuPalette } from "react-icons/lu";

// 1. Contenu textuel enrichi
const CONTENT = {
  title: "L'Art du Henné par Sumeyra Solak",
  paragraph1: "Bienvenue dans mon univers créatif, où la tradition rencontre la passion. Je suis Sumeyra Solak, artisane henné dévouée. Ce qui n’était au départ qu’une curiosité est devenu, une véritable vocation.",
  paragraph2: "Mon exigence commence par la matière première : je fabrique moi-même mes propres cônes de henné de qualité supérieure. Chaque mélange est le fruit d'une sélection rigoureuse pour garantir une texture onctueuse et une couleur profonde. Pour moi, le henné ne s'improvise pas, c'est pourquoi j'ai suivi une formation spécialisée afin de maîtriser toutes les subtilités de cet art ancestral.",
  paragraph3: "Je passe d'innombrables heures à m'entraîner et à affiner mes tracés. Chaque main est pour moi une toile blanche où je m'efforce de transformer vos idées en bijoux de peau éphémères. Je suis ouverte à toutes les demandes, des plus traditionnelles aux plus audacieuses.",
};

// 2. Valeurs mises à jour
const VALUES = [
  { 
    icon: LuLeaf, 
    title: "100% Naturel", 
    description: "J'utilise exclusivement du henné naturel fabriqué à base de poudre de henné du Rajasthan et du jagua, sans aucun produit chimique, pour le respect de votre peau." 
  },
  { 
    icon: LuHeart, 
    title: "Passion & Pratique", 
    description: "Un entraînement quotidien et une passion sans limite pour créer des motifs toujours plus fins et précis." 
  },
  { 
    icon: LuSparkles, 
    title: "Qualité Artisanale", 
    description: "Mes cônes sont faits maison, frais et testés pour offrir un flux régulier et une tenue irréprochable." 
  },
  { 
    icon: LuPalette, 
    title: "Créativité", 
    description: "Formée et à l'écoute, je m'adapte à tous les styles pour réaliser le tatouage éphémère de vos rêves." 
  },
];

export default function AProposPage() {
  return (
    <main>
      {/* En-tête & Présentation */}
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Image de profil / Logo */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-warm-dark/30 shadow-xl">
              <Image
                src="/assets/hennecommande.png" 
                alt="Sumeyra Solak - Artiste Henné"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Texte de présentation */}
            <div className="space-y-6">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl">
                {CONTENT.title}
              </h1>
              <p className="text-lg leading-relaxed text-text-light">
                {CONTENT.paragraph1}
              </p>
              <p className="leading-relaxed text-text-light">
                {CONTENT.paragraph2}
              </p>
              <p className="leading-relaxed text-text-light">
                {CONTENT.paragraph3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs / Points forts */}
      <section className="section-padding bg-warm/20">
        <div className="container-narrow">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-text md:text-4xl">
            Mon Engagement
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass-card flex flex-col items-center p-8 text-center transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-text">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-text-light">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-bg to-accent/10">
        <div className="container-narrow text-center">
          <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
            Une idée ? Un projet particulier ?
          </h2>
          <p className="mt-4 text-lg text-text-light">
            Je suis à votre écoute pour sublimer vos événements ou répondre à vos questions sur mes produits.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/reservation"
              className="rounded-full bg-primary px-10 py-4 font-semibold text-text-inverse shadow-lg transition-all hover:bg-primary-light"
            >
              Réserver une séance
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-primary px-10 py-4 font-semibold text-primary transition-all hover:bg-primary/5"
            >
              Me contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
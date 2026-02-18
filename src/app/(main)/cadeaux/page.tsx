import Image from "next/image";
import Link from "next/link";
import { LuGift, LuShoppingCart, LuFileText } from "react-icons/lu";
import { prisma } from "@/lib/db";

export default async function CadeauxPage() {
  const products = await prisma.product.findMany({
    where: { isGiftOption: true, active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LuGift className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl">
            Cadeaux Invités
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-light">
            Offrez à vos invités un moment d&apos;exception avec nos coffrets et sets cadeaux
            personnalisés pour mariages et événements.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading mb-6 text-2xl font-bold text-text md:text-3xl">
              Le concept
            </h2>
            <p className="text-text-light leading-relaxed">
              Pour sublimer votre mariage ou événement, offrez à vos invités des cadeaux henné
              qui marqueront les esprits. Nos coffrets personnalisables incluent cônes de henné
              de qualité, accessoires et soins post-application. Une attention délicate qui
              transforme chaque invité en participant actif de votre célébration.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-warm/30">
        <div className="container-narrow">
          <h2 className="font-heading mb-10 text-center text-2xl font-bold text-text md:text-3xl">
            Nos coffrets cadeaux
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-warm-dark/20 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images?.[0] ?? "/assets/logo.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-heading font-semibold text-text line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-bold text-primary">
                      {Number(product.price).toFixed(2)} €
                    </span>
                    {product.compareAtPrice != null && (
                      <span className="text-sm text-text-light line-through">
                        {Number(product.compareAtPrice).toFixed(2)} €
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-text-inverse transition-colors hover:bg-primary-light"
                  >
                    <LuShoppingCart className="h-4 w-4" />
                    Ajouter au panier
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary/20 via-warm to-accent/20">
        <div className="container-narrow text-center">
          <h2 className="font-heading text-2xl font-bold text-text md:text-3xl">
            Commande personnalisée ?
          </h2>
          <p className="mt-3 text-text-light">
            Besoin d&apos;un coffret sur-mesure pour votre événement ? Demandez un devis gratuit.
          </p>
          <Link
            href="/contact?objet=devis"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-text-inverse shadow-lg transition-all hover:bg-accent-light hover:shadow-xl"
          >
            <LuFileText className="h-5 w-5" />
            Demander un devis
          </Link>
        </div>
      </section>
    </main>
  );
}

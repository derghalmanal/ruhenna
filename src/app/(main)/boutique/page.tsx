/**
 * Page Boutique (route `/boutique`).
 *
 * Rôle : charger les produits + l’ordre des catégories, puis déléguer l’interaction
 * (filtres) au composant client `BoutiqueClient`.
 */
import prisma from "@/lib/prisma";
import BoutiqueClient from "./BoutiqueClient";

export const dynamic = "force-dynamic";

export default async function BoutiquePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productCategory.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const productItems = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
    image: p.images?.[0] ?? "/assets/logo.png",
    category: p.category,
  }));

  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl">
            Boutique
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-light">
            Découvrez des produits d&apos;exception pour l&apos;art du henné.
          </p>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <BoutiqueClient
            products={productItems}
            categoryOrder={categories.map((c) => ({ id: c.slug, label: c.label }))}
          />
        </div>
      </section>
    </main>
  );
}

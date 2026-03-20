"use client";

/**
 * Boutique (client) — listing + filtre de catégories.
 *
 * Rôle : afficher les produits et permettre de filtrer par catégorie côté UI.
 */
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuChevronDown } from "react-icons/lu";

export type ProductItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  category: string | null;
};

type Props = {
  products: ProductItem[];
  categoryOrder?: { id: string; label: string }[];
};

export default function BoutiqueClient({ products, categoryOrder }: Props) {
  const [category, setCategory] = useState<string>("tout-voir");
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // --- LOGIQUE DES CATÉGORIES ---
  const categories = useMemo(() => {
    if (categoryOrder && categoryOrder.length > 0) {
      return [{ id: "tout-voir", label: "Tout voir" }, ...categoryOrder];
    }
    const cats = Array.from(
      new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c)))
    ).sort((a, b) => a.localeCompare(b, "fr"));
    return [{ id: "tout-voir", label: "Tout voir" }, ...cats.map((c) => ({ id: c, label: c }))];
  }, [products, categoryOrder]);

  // --- FILTRAGE ---
  const filteredProducts = category === "tout-voir" 
    ? [...products] 
    : products.filter((p) => p.category === category);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:block w-56 shrink-0">
        <h3 className="font-heading mb-4 text-lg font-semibold text-text">Catégories</h3>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`block w-full rounded-lg px-4 py-2.5 text-left font-medium transition-colors ${
                category === cat.id ? "bg-primary/15 text-primary" : "text-text hover:bg-warm/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Menu Déroulant (Mobile) */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-warm-dark/40 bg-white px-4 py-3 font-medium text-text"
        >
          {categories.find((c) => c.id === category)?.label ?? "Catégorie"}
          <LuChevronDown className={`h-5 w-5 transition-transform ${mobileCategoryOpen ? "rotate-180" : ""}`} />
        </button>
        {mobileCategoryOpen && (
          <div className="mt-2 rounded-xl border border-warm-dark/40 bg-white p-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setMobileCategoryOpen(false);
                }}
                className={`block w-full rounded-lg px-4 py-2.5 text-left font-medium ${
                  category === cat.id ? "bg-primary/15 text-primary" : "text-text"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Liste des Produits */}
      <div className="flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-text-light">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-warm-dark/20 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <Link href={`/boutique/${product.slug}`} className="contents">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-heading font-semibold text-text line-clamp-2">{product.name}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-bold text-primary">{product.price.toFixed(2)} €</span>
                    {product.compareAtPrice != null && (
                      <span className="text-sm text-text-light line-through">
                        {product.compareAtPrice.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
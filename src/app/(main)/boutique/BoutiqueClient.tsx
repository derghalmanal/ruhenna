"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { LuShoppingCart, LuChevronDown } from "react-icons/lu";

export type ProductItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  category: string;
};

const SORT_OPTIONS = [
  { id: "default", label: "Tri par défaut" },
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "new", label: "Nouveautés" },
] as const;

type Props = {
  products: ProductItem[];
};

export default function BoutiqueClient({ products }: Props) {
  const [category, setCategory] = useState<string>("tous");
  const [sort, setSort] = useState<string>("default");
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return [{ id: "tous", label: "Tous" }, ...cats.map((c) => ({ id: c, label: c }))];
  }, [products]);

  const filteredProducts = category === "tous" ? [...products] : products.filter((p) => p.category === category);
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="hidden lg:block w-56 shrink-0">
        <h3 className="font-heading mb-4 text-lg font-semibold text-text">Catégories</h3>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`block w-full rounded-lg px-4 py-2.5 text-left font-medium transition-colors ${category === cat.id ? "bg-primary/15 text-primary" : "text-text hover:bg-warm/50"}`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </aside>

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
                className={`block w-full rounded-lg px-4 py-2.5 text-left font-medium ${category === cat.id ? "bg-primary/15 text-primary" : "text-text"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-text-light">
            {sortedProducts.length} produit{sortedProducts.length > 1 ? "s" : ""}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 font-medium text-text"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {sortedProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-warm-dark/20 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
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
        <div className="mt-12 flex justify-center gap-2">
          <button
            type="button"
            disabled
            className="rounded-lg border border-warm-dark/40 px-4 py-2 text-text-light opacity-50"
          >
            Précédent
          </button>
          <span className="flex items-center px-4 py-2 font-medium text-text">Page 1</span>
          <button
            type="button"
            disabled
            className="rounded-lg border border-warm-dark/40 px-4 py-2 text-text-light opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

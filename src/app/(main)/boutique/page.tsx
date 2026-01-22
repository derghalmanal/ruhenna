"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { id: "tous", label: "Tous" },
  { id: "cones", label: "Cônes de Henné" },
  { id: "accessoires", label: "Accessoires" },
  { id: "coffrets", label: "Coffrets" },
] as const;

const SORT_OPTIONS = [
  { id: "default", label: "Tri par défaut" },
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "new", label: "Nouveautés" },
] as const;

const MOCK_PRODUCTS = [
  { id: 1, name: "Cône Henné Traditionnel Marocain", price: 12.9, compareAtPrice: 15.9, image: "/assets/logo.png", category: "cones" },
  { id: 2, name: "Set 6 Cônes Henné Noir", price: 34.9, compareAtPrice: null, image: "/assets/logo.png", category: "cones" },
  { id: 3, name: "Coffret Découverte Henné", price: 49.9, compareAtPrice: 59.9, image: "/assets/logo.png", category: "coffrets" },
  { id: 4, name: "Pochoir Motifs Traditionnels", price: 8.5, compareAtPrice: null, image: "/assets/logo.png", category: "accessoires" },
  { id: 5, name: "Huile de Soin Post-Henné", price: 18.0, compareAtPrice: 22.0, image: "/assets/logo.png", category: "accessoires" },
  { id: 6, name: "Coffret Mariage Premium", price: 89.0, compareAtPrice: null, image: "/assets/logo.png", category: "coffrets" },
] as const;

export default function BoutiquePage() {
  const [category, setCategory] = useState<string>("tous");
  const [sort, setSort] = useState<string>("default");
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const filteredProducts = category === "tous" ? [...MOCK_PRODUCTS] : MOCK_PRODUCTS.filter((p) => p.category === category);
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl">Boutique</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-light">Découvrez nos produits d&apos;exception pour l&apos;art du henné.</p>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="hidden lg:block w-56 shrink-0">
              <h3 className="font-heading mb-4 text-lg font-semibold text-text">Catégories</h3>
              <nav className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)} className={`block w-full rounded-lg px-4 py-2.5 text-left font-medium transition-colors ${category === cat.id ? "bg-primary/15 text-primary" : "text-text hover:bg-warm/50"}`}>{cat.label}</button>
                ))}
              </nav>
            </aside>

            <div className="lg:hidden">
              <button onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)} className="flex w-full items-center justify-between rounded-xl border border-warm-dark/40 bg-white px-4 py-3 font-medium text-text">
                {CATEGORIES.find((c) => c.id === category)?.label ?? "Catégorie"}
                <ChevronDown className={`h-5 w-5 transition-transform ${mobileCategoryOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileCategoryOpen && (
                <div className="mt-2 rounded-xl border border-warm-dark/40 bg-white p-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => { setCategory(cat.id); setMobileCategoryOpen(false); }} className={`block w-full rounded-lg px-4 py-2.5 text-left font-medium ${category === cat.id ? "bg-primary/15 text-primary" : "text-text"}`}>{cat.label}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-text-light">{sortedProducts.length} produit{sortedProducts.length > 1 ? "s" : ""}</p>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 font-medium text-text">
                  {SORT_OPTIONS.map((opt) => (<option key={opt.id} value={opt.id}>{opt.label}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {sortedProducts.map((product) => (
                  <article key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-warm-dark/20 bg-white shadow-sm transition-shadow hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-heading font-semibold text-text line-clamp-2">{product.name}</h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-bold text-primary">{product.price.toFixed(2)} €</span>
                        {product.compareAtPrice && (<span className="text-sm text-text-light line-through">{product.compareAtPrice.toFixed(2)} €</span>)}
                      </div>
                      <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-text-inverse transition-colors hover:bg-primary-light">
                        <ShoppingCart className="h-4 w-4" />
                        Ajouter au panier
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-12 flex justify-center gap-2">
                <button type="button" disabled className="rounded-lg border border-warm-dark/40 px-4 py-2 text-text-light opacity-50">Précédent</button>
                <span className="flex items-center px-4 py-2 font-medium text-text">Page 1</span>
                <button type="button" disabled className="rounded-lg border border-warm-dark/40 px-4 py-2 text-text-light opacity-50">Suivant</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

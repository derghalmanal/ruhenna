"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuPlus, LuPencil, LuTrash2, LuSearch } from "react-icons/lu";

const MOCK_PRODUCTS = [
  {
    id: 1,
    nom: "Cône Henné Traditionnel Marocain",
    categorie: "Cônes",
    prix: "12,90 €",
    stock: 45,
    cadeau: true,
    actif: true,
    image: "/assets/logo.png",
  },
  {
    id: 2,
    nom: "Set 6 Cônes Henné Noir",
    categorie: "Cônes",
    prix: "34,90 €",
    stock: 12,
    cadeau: false,
    actif: true,
    image: "/assets/logo.png",
  },
  {
    id: 3,
    nom: "Coffret Découverte Henné",
    categorie: "Coffrets",
    prix: "49,90 €",
    stock: 8,
    cadeau: true,
    actif: true,
    image: "/assets/logo.png",
  },
  {
    id: 4,
    nom: "Pochoir Motifs Traditionnels",
    categorie: "Accessoires",
    prix: "8,50 €",
    stock: 0,
    cadeau: false,
    actif: false,
    image: "/assets/logo.png",
  },
  {
    id: 5,
    nom: "Huile de Soin Post-Henné",
    categorie: "Accessoires",
    prix: "18,00 €",
    stock: 25,
    cadeau: false,
    actif: true,
    image: "/assets/logo.png",
  },
  {
    id: 6,
    nom: "Coffret Mariage Premium",
    categorie: "Coffrets",
    prix: "89,00 €",
    stock: 5,
    cadeau: true,
    actif: true,
    image: "/assets/logo.png",
  },
];

const CATEGORIES = ["Toutes", "Cônes", "Coffrets", "Accessoires"];

export default function AdminProduitsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "Toutes" || p.categorie === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          Gestion des Produits
        </h1>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
        >
          <LuPlus className="h-4 w-4" />
          Ajouter un produit
        </Link>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-warm-dark/40 bg-white py-2.5 pl-10 pr-4 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 font-medium text-text"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-xl border border-warm-dark/20 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-dark/20 bg-warm/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Cadeau?
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Actif?
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-dark/10">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-warm/20">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-warm/30">
                      <Image
                        src={product.image}
                        alt={product.nom}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text">
                    {product.nom}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                    {product.categorie}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                    {product.prix}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                    {product.stock}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.cadeau ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.cadeau ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.actif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.actif ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-text hover:bg-primary/15 hover:text-primary transition-colors"
                        aria-label="Modifier"
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-text hover:bg-red-100 hover:text-red-600 transition-colors"
                        aria-label="Supprimer"
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

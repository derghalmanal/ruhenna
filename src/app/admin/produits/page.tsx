"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuPlus, LuPencil, LuTrash2, LuSearch } from "react-icons/lu";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  isGiftOption: boolean;
  active: boolean;
  images: string[];
}

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const categories = ["Toutes", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Toutes" || p.category === category;
    return matchSearch && matchCategory;
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setDeleteId(null);
        fetchProducts();
      } else {
        setDeleteError(data.message || "Erreur");
      }
    } catch (e) {
      setDeleteError("Erreur");
    }
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(p);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Gestion des Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
        >
          <LuPlus className="h-4 w-4" />
          Ajouter un produit
        </Link>
      </div>

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
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

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
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-text-light">
                    Chargement…
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-warm/20">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-warm/30">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            unoptimized={product.images[0].startsWith("http")}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-text-light">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text">{product.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {product.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {formatPrice(Number(product.price))}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {product.stock}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.isGiftOption ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.isGiftOption ? "Oui" : "Non"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.active ? "Oui" : "Non"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/produits/modifier/${product.id}`}
                          className="rounded-lg p-2 text-text transition-colors hover:bg-primary/15 hover:text-primary"
                          aria-label="Modifier"
                        >
                          <LuPencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(product.id)}
                          className="rounded-lg p-2 text-text transition-colors hover:bg-red-100 hover:text-red-600"
                          aria-label="Supprimer"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-bg-dark/40 backdrop-blur-sm"
            onClick={() => !deleteError && setDeleteId(null)}
            aria-hidden
          />
          <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <h3 className="font-heading mb-4 text-xl font-bold text-text">
              Supprimer ce produit ?
            </h3>
            {deleteError && (
              <p className="mb-4 text-sm text-red-600">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-warm-dark/40 px-4 py-2 font-medium text-text"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

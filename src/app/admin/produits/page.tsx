"use client";

/**
 * Admin — Produits (liste + recherche + suppression).
 *
 * Rôle : permettre à l’artisane de gérer le catalogue (CRUD via API admin).
 */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { LuPlus, LuPencil, LuTrash2, LuSearch, LuPackage } from "react-icons/lu";
import ConfirmModal from "@/components/admin/ConfirmModal";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  compareAtPrice: number | string | null;
  category: string;
  images: string[];
  active: boolean;
  createdAt: string;
};

function formatPrice(value: number | string): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return Number.isNaN(n) ? "—" : `${n.toFixed(2)} €`;
}

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tout voir");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ["Tout voir", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Tout voir" || p.category === category;
    return matchSearch && matchCategory;
  });

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeletingId(productToDelete.id);
      setDeleteError(null);
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.message ?? "Erreur lors de la suppression");
        return;
      }
      setProductToDelete(null);
      await fetchProducts();
    } catch {
      setDeleteError("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text text-center sm:text-left">
          Gestion des Produits
        </h1>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-text-inverse shadow-md transition-all hover:bg-primary-light active:scale-95"
        >
          <LuPlus className="h-5 w-5" />
          Ajouter un produit
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-warm-dark/40 bg-white py-3 pl-10 pr-4 text-text placeholder:text-text-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-warm-dark/40 bg-white px-4 py-3 font-medium text-text outline-none focus:ring-2 focus:ring-primary/20 sm:w-48"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-text-light">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p>Chargement des produits...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:hidden">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-warm-dark/20 bg-warm/5 py-12 text-center text-text-light">
                Aucun produit trouvé.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="rounded-2xl border border-warm-dark/20 bg-white p-4 shadow-sm">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-warm/30">
                      {product.images?.[0] && (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-text leading-tight">{product.name}</h3>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${product.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {product.active ? "Actif" : "Inactif"}
                          </span>
                        </div>
                        <p className="text-xs text-text-light mt-1">{product.category}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                        <div className="flex gap-2">
                          <Link href={`/admin/produits/modifier/${product.id}`} className="p-2 bg-warm/20 rounded-lg text-text"><LuPencil className="h-5 w-5" /></Link>
                          <button onClick={() => setProductToDelete(product)} className="p-2 bg-red-50 rounded-lg text-red-600"><LuTrash2 className="h-5 w-5" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden sm:block overflow-hidden rounded-2xl border border-warm-dark/20 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-dark/20 bg-warm/30">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-light">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-light">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-light">Catégorie</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-light">Prix</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-light">Actif?</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-text-light">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-dark/10">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-text-light italic">Aucun produit trouvé.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-warm/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-warm/30">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-text-light">—</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-text">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-text">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-text">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${product.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {product.active ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/produits/modifier/${product.id}`} className="rounded-lg p-2 text-text hover:bg-primary/10 hover:text-primary transition-colors">
                            <LuPencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => { setProductToDelete(product); setDeleteError(null); }}
                            disabled={deletingId === product.id}
                            className="rounded-lg p-2 text-text hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
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
        </>
      )}

      <ConfirmModal
        open={!!productToDelete}
        title="Supprimer le produit"
        message={
          deleteError
            ? deleteError
            : `Êtes-vous sûr de vouloir supprimer « ${productToDelete?.name} » ? Cette action est irréversible.`
        }
        loading={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => { setProductToDelete(null); setDeleteError(null); }}
      />
    </div>
  );
}
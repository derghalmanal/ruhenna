"use client";

/**
 * Admin — Produits (création).
 *
 * Rôle : créer un produit (texte, prix, catégorie, images, mis en avant).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { LuSave, LuX } from "react-icons/lu";
import ImageUploader from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";

type CategoryOption = {
  id: string;
  label: string;
};

export default function NouveauProduitPage() {
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [prixCompare, setPrixCompare] = useState("");
  const [categorie, setCategorie] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [misEnAvant, setMisEnAvant] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok && Array.isArray(data.categories) && data.categories.length > 0) {
        const normalized = data.categories.map((c: { slug: string; label: string }) => ({
          id: c.slug,
          label: c.label,
        }));
        setCategories(normalized);
        if (!normalized.some((c: CategoryOption) => c.id === categorie)) {
          setCategorie(normalized[0].id);
        }
      }
    } catch {
      // fallback to default category list
    }
  };

  useEffect(() => {
    refreshCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNomChange = (value: string) => {
    setNom(value);
    setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nom,
          slug,
          description,
          price: parseFloat(prix) || 0,
          compareAtPrice: prixCompare ? parseFloat(prixCompare) : null,
          category: categorie,
          images: images.length ? images : ["/assets/logo.png"],
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = "/admin/produits";
      } else {
        setError(data.message ?? "Erreur lors de l'enregistrement");
      }
    } catch {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          Nouveau produit
        </h1>
        <Link
          href="/admin/produits"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
        >
          <LuX className="h-4 w-4" />
          Annuler
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-text">
              Nom
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => handleNomChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nom du produit"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-text">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              disabled
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-warm/30 px-4 py-2.5 text-text-light"
              placeholder="slug-auto-genere"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Description du produit..."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="prix" className="block text-sm font-medium text-text">
              Prix (€)
            </label>
            <input
              id="prix"
              type="text"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="12.90"
            />
          </div>
          <div>
            <label htmlFor="prixCompare" className="block text-sm font-medium text-text-light">
              Prix comparé (optionnel)
            </label>
            <input
              id="prixCompare"
              type="text"
              value={prixCompare}
              onChange={(e) => setPrixCompare(e.target.value)}
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="15.90"
            />
          </div>
        </div>

        <div>
          <label htmlFor="categorie" className="block text-sm font-medium text-text">
            Catégorie
          </label>
          <select
            id="categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            onFocus={refreshCategories}
            className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Images
          </label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light disabled:opacity-50 cursor-pointer"
          >
            <LuSave className="h-4 w-4" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

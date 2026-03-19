"use client";

/**
 * Admin — Produits (édition).
 *
 * Rôle : charger un produit par id, modifier ses champs et enregistrer via l’API admin.
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LuSave, LuX } from "react-icons/lu";
import ImageUploader from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";

type CategoryOption = {
  id: string;
  label: string;
};

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  images: string[];
  active: boolean;
}

export default function ModifierProduitPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [prixCompare, setPrixCompare] = useState("");
  const [categorie, setCategorie] = useState<string>("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [actif, setActif] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const handleNomChange = (value: string) => {
    setNom(value);
    setSlug(slugify(value));
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(
          data.categories.map((c: { slug: string; label: string }) => ({
            id: c.slug,
            label: c.label,
          })),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data.product) {
          const p = data.product as Product;
          setNom(p.name);
          setSlug(p.slug);
          setDescription(p.description);
          setPrix(String(Number(p.price)));
          setPrixCompare(p.compareAtPrice ? String(Number(p.compareAtPrice)) : "");
          setCategorie(p.category);
          setActif(p.active);
          setImages(Array.isArray(p.images) ? p.images : []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    refreshCategories();
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const categoryOptions = categories.some((c) => c.id === categorie)
    ? categories
    : [{ id: categorie, label: categorie }, ...categories];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const price = parseFloat(prix.replace(",", "."));
      const compareAtPrice = prixCompare ? parseFloat(prixCompare.replace(",", ".")) : null;

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nom,
          slug: slug || slugify(nom),
          description,
          price,
          compareAtPrice,
          category: categorie,
          active: actif,
          images,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin/produits");
      } else {
        setError(data.message || "Erreur lors de l'enregistrement");
      }
    } catch (e) {
      setError("Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-text">Modifier le produit</h1>
        <p className="text-text-light">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Modifier le produit</h1>
        <Link
          href="/admin/produits"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
        >
          <LuX className="h-4 w-4" />
          Annuler
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

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
              required
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
            required
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
              required
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
            {categoryOptions.map((cat) => (
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

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={actif}
              onChange={(e) => setActif(e.target.checked)}
              className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">Actif</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light disabled:opacity-50 cursor-pointer"
          >
            <LuSave className="h-4 w-4" />
            {submitting ? "Enregistrement…" : "Enregistrer"}
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

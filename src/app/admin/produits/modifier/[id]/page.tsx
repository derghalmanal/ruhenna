"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LuSave, LuX } from "react-icons/lu";

const DEFAULT_CATEGORIES = ["Coffrets", "Poudres", "Kits", "Soins", "Accessoires", "Cônes"];

function getCategories(current?: string) {
  if (current && !DEFAULT_CATEGORIES.includes(current)) {
    return [current, ...DEFAULT_CATEGORIES];
  }
  return DEFAULT_CATEGORIES;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isGiftOption: boolean;
  category: string;
  images: string[];
  featured: boolean;
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
  const [stock, setStock] = useState("0");
  const [categorie, setCategorie] = useState(DEFAULT_CATEGORIES[0]);
  const [cadeauInvites, setCadeauInvites] = useState(false);
  const [misEnAvant, setMisEnAvant] = useState(false);
  const [actif, setActif] = useState(true);
  const [imagesInput, setImagesInput] = useState("");

  const handleNomChange = (value: string) => {
    setNom(value);
    setSlug(slugify(value));
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
          setStock(String(p.stock));
          setCategorie(p.category);
          setCadeauInvites(p.isGiftOption);
          setMisEnAvant(p.featured);
          setActif(p.active);
          setImagesInput(Array.isArray(p.images) ? p.images.join(", ") : "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const price = parseFloat(prix.replace(",", "."));
      const compareAtPrice = prixCompare ? parseFloat(prixCompare.replace(",", ".")) : null;
      const images = imagesInput
        ? imagesInput.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nom,
          slug: slug || slugify(nom),
          description,
          price,
          compareAtPrice,
          stock: parseInt(stock, 10) || 0,
          category: categorie,
          isGiftOption: cadeauInvites,
          featured: misEnAvant,
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
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
          <label htmlFor="stock" className="block text-sm font-medium text-text">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min={0}
            className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="categorie" className="block text-sm font-medium text-text">
            Catégorie
          </label>
          <select
            id="categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {getCategories(categorie).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-text mb-2">
            Images (URLs séparées par des virgules)
          </label>
          <input
            id="images"
            type="text"
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            className="w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="/assets/logo.png, https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={cadeauInvites}
              onChange={(e) => setCadeauInvites(e.target.checked)}
              className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">Option cadeau</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={misEnAvant}
              onChange={(e) => setMisEnAvant(e.target.checked)}
              className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">Mis en avant</span>
          </label>
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
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light disabled:opacity-50"
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

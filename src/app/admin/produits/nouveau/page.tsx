"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, X } from "lucide-react";

const CATEGORIES = [
  { id: "cones", label: "Cônes de Henné" },
  { id: "accessoires", label: "Accessoires" },
  { id: "coffrets", label: "Coffrets" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function NouveauProduitPage() {
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [prixCompare, setPrixCompare] = useState("");
  const [stock, setStock] = useState("");
  const [categorie, setCategorie] = useState("cones");
  const [cadeauInvites, setCadeauInvites] = useState(false);
  const [misEnAvant, setMisEnAvant] = useState(false);

  const handleNomChange = (value: string) => {
    setNom(value);
    setSlug(slugify(value));
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
          <X className="h-4 w-4" />
          Annuler
        </Link>
      </div>

      <form className="space-y-6 rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
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
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={cadeauInvites}
              onChange={(e) => setCadeauInvites(e.target.checked)}
              className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">
              Cadeau invités
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={misEnAvant}
              onChange={(e) => setMisEnAvant(e.target.checked)}
              className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">
              Mis en avant
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Images
          </label>
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-warm-dark/40 bg-warm/20 text-text-light">
            Glissez-déposez vos images ou cliquez pour sélectionner
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
          >
            <Save className="h-4 w-4" />
            Enregistrer
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

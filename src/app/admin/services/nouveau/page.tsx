"use client";

/**
 * Admin — Services (création).
 *
 * Rôle : créer une nouvelle prestation (nom, slug, durée, prix, actif).
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuSave, LuX } from "react-icons/lu";
import { slugify } from "@/lib/utils";

export default function NouveauServicePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          description: description || "",
          duration: parseInt(duration, 10) || 0,
          price: parseFloat(price) || 0,
          active,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Grâce à ton API, data.service.id existe bien !
        if (data.service && data.service.id) {
          // On téléporte l'utilisateur sur la page de modification de son tout nouveau service
          router.push(`/admin/services/modifier/${data.service.id}`);
        } else {
          router.push("/admin/services");
        }
      } else {
        setError(data.message ?? "Erreur lors de la création.");
      }
    } catch (e) {
      console.error(e);
      setError("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          Nouveau service
        </h1>
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
        >
          <LuX className="h-4 w-4" />
          Annuler
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm"
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text">
              Nom *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nom du service"
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
          <label
            htmlFor="description"
            className="block text-sm font-medium text-text"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Description du service..."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-text"
            >
              Durée (minutes) *
            </label>
            <input
              id="duration"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="45"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-text">
              Prix (€) *
            </label>
            <input
              id="price"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="25.00"
            />
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-text">Actif</span>
        </label>

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
            href="/admin/services"
            className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

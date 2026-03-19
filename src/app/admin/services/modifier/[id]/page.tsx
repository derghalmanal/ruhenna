"use client";

/**
 * Admin — Services (édition + disponibilités).
 *
 * Rôle : modifier une prestation et gérer ses règles de disponibilité (créneaux par jour/période).
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { LuSave, LuX, LuPlus, LuTrash2 } from "react-icons/lu";
import { slugify } from "@/lib/utils";

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  price: string;
  image: string | null;
  active: boolean;
};

type Availability = {
  id: string;
  dayOfWeek: number | null;
  startDate?: string | null;
  endDate?: string | null;
  startTime: string;
  endTime: string;
};

export default function ModifierServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [newDayOfWeek, setNewDayOfWeek] = useState<string>("tout");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("19:00");

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
  };

  const fetchAvailabilities = () => {
    if (!id) return;
    fetch(`/api/admin/services/${id}/availability`)
      .then((res) => res.json())
      .then((data) => {
        if (data.availabilities) setAvailabilities(data.availabilities);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/services/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.service) {
          const s = data.service as Service;
          setName(s.name);
          setSlug(s.slug);
          setDescription(s.description ?? "");
          setDuration(String(s.duration));
          setPrice(String(s.price));
          setActive(s.active);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    fetchAvailabilities();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
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
        router.push("/admin/services");
      } else {
        setError(data.message ?? "Erreur lors de la mise à jour.");
      }
    } catch (e) {
      console.error(e);
      setError("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/services/${id}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayOfWeek: newDayOfWeek === "tout" ? null : Number(newDayOfWeek),
          startDate: newStartDate || null,
          endDate: newEndDate || null,
          startTime: newStartTime,
          endTime: newEndTime,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAvailabilities((prev) => [...prev, data.availability]);
        setShowAddAvailability(false);
        setNewDayOfWeek("tout");
        setNewStartDate("");
        setNewEndDate("");
        setNewStartTime("09:00");
        setNewEndTime("19:00");
      } else {
        setError(data.message ?? "Erreur lors de l'ajout.");
      }
    } catch (e) {
      console.error(e);
      setError("Erreur réseau.");
    }
  };

  const handleDeleteAvailability = async (availabilityId: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}/availability`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilityId }),
      });
      if (res.ok) {
        setAvailabilities((prev) => prev.filter((a) => a.id !== availabilityId));
      } else {
        const data = await res.json();
        setError(data.message ?? "Erreur lors de la suppression.");
      }
    } catch (e) {
      console.error(e);
      setError("Erreur réseau.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-text">Modifier le service</h1>
        <p className="text-text-light">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Modifier le service</h1>
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
        >
          <LuX className="h-4 w-4" />
          Annuler
        </Link>
      </div>

      {/* Formulaire Principal */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text">Nom *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-text">Slug</label>
            <input
              id="slug"
              type="text"
              value={slug}
              disabled
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-warm/30 px-4 py-2.5 text-text-light"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text">Description</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-text">Durée (minutes) *</label>
            <input
              id="duration"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-text">Prix (€) *</label>
            <input
              id="price"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light disabled:opacity-50"
          >
            <LuSave className="h-4 w-4" />
            {submitting ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>

      {/* Section Disponibilités */}
      <section className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-heading text-lg font-bold text-text">Horaires de disponibilité</h2>
        <p className="mb-4 text-sm text-text-light">
          Définissez des règles récurrentes (par jour) ou spécifiques (par dates).
        </p>

        <ul className="mb-4 space-y-2">
          {availabilities.length === 0 ? (
            <li className="rounded-lg bg-warm/20 px-4 py-3 text-sm italic text-text-light">Aucun horaire configuré</li>
          ) : (
            availabilities.map((av) => (
              <li key={av.id} className="flex items-center justify-between rounded-lg border border-warm-dark/20 bg-warm/10 px-4 py-2.5">
                <span className="text-sm font-medium text-text">
                  {av.dayOfWeek == null ? "Tous les jours" : DAY_NAMES[av.dayOfWeek]}
                  {(av.startDate || av.endDate) && (
                    <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {av.startDate ? `du ${new Date(av.startDate).toLocaleDateString('fr-FR')}` : ""}
                      {av.endDate ? ` au ${new Date(av.endDate).toLocaleDateString('fr-FR')}` : ""}
                    </span>
                  )}
                  <span className="mx-2">:</span>
                  {av.startTime} – {av.endTime}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteAvailability(av.id)}
                  className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                >
                  <LuTrash2 className="h-4 w-4" />
                </button>
              </li>
            ))
          )}
        </ul>

        {showAddAvailability ? (
          <form onSubmit={handleAddAvailability} className="space-y-4 rounded-lg border border-warm-dark/20 bg-warm/10 p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-text">Récurrence Jour</label>
                <select
                  value={newDayOfWeek}
                  onChange={(e) => setNewDayOfWeek(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-3 py-2 text-sm text-text focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="tout">Tous les jours</option>
                  {DAY_NAMES.map((name, i) => <option key={i} value={i}>{name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text">Date début (optionnel)</label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-3 py-2 text-sm text-text outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text">Date fin (optionnel)</label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-3 py-2 text-sm text-text outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-text">Heure de début</label>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-3 py-2 text-sm text-text outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text">Heure de fin</label>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-3 py-2 text-sm text-text outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-text-inverse hover:bg-primary-light transition-colors">
                <LuPlus className="h-3.5 w-3.5" /> Ajouter la règle
              </button>
              <button type="button" onClick={() => setShowAddAvailability(false)} className="rounded-lg border border-warm-dark/40 px-3 py-2 text-sm font-medium text-text hover:bg-warm/50 transition-colors">
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddAvailability(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-warm/50"
          >
            <LuPlus className="h-4 w-4" />
            Ajouter un horaire
          </button>
        )}
      </section>
    </div>
  );
}
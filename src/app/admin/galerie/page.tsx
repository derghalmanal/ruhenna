"use client";

import { useState } from "react";
import Image from "next/image";
import { LuPlus, LuPencil, LuTrash2, LuGripVertical } from "react-icons/lu";

const MOCK_IMAGES = [
  { id: 1, src: "/assets/logo.png", categorie: "Mariages" },
  { id: 2, src: "/assets/logo.png", categorie: "Mains" },
  { id: 3, src: "/assets/logo.png", categorie: "Pieds" },
  { id: 4, src: "/assets/logo.png", categorie: "Mariages" },
  { id: 5, src: "/assets/logo.png", categorie: "Événements" },
  { id: 6, src: "/assets/logo.png", categorie: "Mains" },
];

const CATEGORIES = ["Toutes", "Mariages", "Mains", "Pieds", "Événements"];

export default function AdminGaleriePage() {
  const [category, setCategory] = useState("Toutes");

  const filteredImages =
    category === "Toutes"
      ? MOCK_IMAGES
      : MOCK_IMAGES.filter((img) => img.categorie === category);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          Gestion de la Galerie
        </h1>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
        >
          <LuPlus className="h-4 w-4" />
          Ajouter une image
        </button>
      </div>

      {/* Category filter */}
      <div>
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

      {/* Upload area */}
      <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-warm-dark/40 bg-warm/20 text-text-light transition-colors hover:border-primary/50 hover:bg-warm/30">
        Glissez-déposez vos images ici ou cliquez pour sélectionner
      </div>

      {/* Gallery grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-warm-dark/20 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Image
              src={img.src}
              alt={`Galerie ${img.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-bg-dark/60 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                className="rounded-lg bg-white/90 p-2 text-text hover:bg-white"
                aria-label="Réordonner"
              >
                <LuGripVertical className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-lg bg-white/90 p-2 text-text hover:bg-white"
                aria-label="Modifier"
              >
                <LuPencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-lg bg-white/90 p-2 text-red-600 hover:bg-white"
                aria-label="Supprimer"
              >
                <LuTrash2 className="h-4 w-4" />
              </button>
            </div>
            <span className="absolute bottom-2 left-2 rounded bg-bg-dark/80 px-2 py-1 text-xs text-text-inverse">
              {img.categorie}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

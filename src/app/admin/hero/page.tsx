"use client";

/**
 * Admin — gestion des images “Hero” (bannière).
 *
 * Rôle : ajouter/supprimer/activer et réordonner les images affichées sur la page d’accueil.
 * API utilisée : `/api/admin/hero` et `/api/admin/hero/reorder`.
 */
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LuPlus,
  LuTrash2,
  LuMonitor,
  LuGripVertical,
  LuX,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SingleImageUploader from "@/components/admin/SingleImageUploader";
import ConfirmModal from "@/components/admin/ConfirmModal";

type HeroImage = {
  id: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
};

function SortableHeroItem({
  img,
  onDelete,
  onToggleVisibility,
}: {
  img: HeroImage;
  onDelete: (img: HeroImage) => void;
  onToggleVisibility: (img: HeroImage) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-2xl border border-warm-dark/20 bg-white shadow-sm transition-all hover:shadow-md ${
        isDragging ? "z-50 opacity-90 shadow-lg" : ""
      } ${!img.active ? "opacity-50" : ""}`}
    >
      {/* C'est ici que ça change : Remplacement de 'aspect-video' par 'aspect-[21/9]' ou une hauteur fixe */}
      <div className="relative h-48 w-full bg-warm/10 overflow-hidden">
        
        {/* Le bouton Drag & Drop */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className={`absolute left-2 top-2 z-10 flex h-8 w-8 cursor-grab items-center justify-center rounded-lg bg-black/50 text-white transition-opacity active:cursor-grabbing group-hover:opacity-100 ${
            isDragging ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Réorganiser"
        >
          <LuGripVertical className="h-4 w-4" />
        </button>
        
        {/* Badge Masqué */}
        {!img.active && (
          <div className="absolute top-2 right-2 z-10 rounded-lg bg-red-500/80 px-2 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
            Masqué
          </div>
        )}
        
        {/* L'image recadrée exactement comme sur la page d'accueil */}
        <Image
          src={img.imageUrl}
          alt="Aperçu Bannière"
          fill
          className="object-cover object-center" 
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />

        {/* Overlay pour mieux voir qu'il s'agit d'une "bannière" */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />

        {/* Boutons d'action au survol */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity backdrop-blur-[2px] group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(img);
            }}
            className="rounded-full bg-white p-3 text-primary shadow-lg transition-transform hover:scale-110"
            aria-label={img.active ? "Masquer" : "Afficher"}
          >
            {img.active ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(img);
            }}
            className="rounded-full bg-white p-3 text-red-600 shadow-lg transition-transform hover:scale-110"
            aria-label="Supprimer"
          >
            <LuTrash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminHeroPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState<HeroImage | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [reorderSubmitting, setReorderSubmitting] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/admin/hero");
      const data = await res.json();
      if (res.ok) setImages(data.images ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAddImageWithUrl = async (url: string) => {
    setAddSubmitting(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      if (res.ok) {
        setAddOpen(false);
        fetchImages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleToggleVisibility = async (img: HeroImage) => {
    setImages((prev) =>
      prev.map((i) => (i.id === img.id ? { ...i, active: !i.active } : i))
    );
    try {
      const res = await fetch(`/api/admin/hero/${img.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !img.active }),
      });
      if (!res.ok) fetchImages();
    } catch (e) {
      console.error(e);
      fetchImages();
    }
  };

  const handleDelete = async () => {
    if (!deleteOpen) return;
    setDeleteSubmitting(true);
    try {
      const res = await fetch(`/api/admin/hero/${deleteOpen.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteOpen(null);
        fetchImages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteSubmitting(false);
    }
  };



  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...images];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);
    setImages(reordered);

    setReorderSubmitting(true);
    try {
      const res = await fetch("/api/admin/hero/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((img) => img.id) }),
      });
      if (!res.ok) {
        setImages(images);
        fetchImages();
      }
    } catch (e) {
      console.error(e);
      setImages(images);
      fetchImages();
    } finally {
      setReorderSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          Gestion de la Bannière
        </h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-text-inverse shadow-md transition-all hover:bg-primary-light active:scale-95 cursor-pointer"
        >
          <LuPlus className="h-4 w-4" />
          Ajouter une image
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-light">Chargement…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-warm-dark/20 bg-warm/5 py-20">
              <LuMonitor className="h-12 w-12 text-warm-dark/40" />
              <p className="text-text-light italic">Aucune image de bannière.</p>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-text-inverse shadow-md transition-all hover:bg-primary-light"
              >
                <LuPlus className="h-4 w-4" />
                Ajouter une image
              </button>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={rectSortingStrategy}
              >
                {images.map((img) => (
                  <SortableHeroItem
                    key={img.id}
                    img={img}
                    onDelete={setDeleteOpen}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}

      {reorderSubmitting && (
        <p className="text-center text-sm text-text-light">
          Mise à jour de l&apos;ordre…
        </p>
      )}

      {/* Add Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-bg-dark/40 backdrop-blur-sm"
            onClick={() => !addSubmitting && setAddOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-text">
                Ajouter une image de bannière
              </h2>
              <button
                type="button"
                onClick={() => !addSubmitting && setAddOpen(false)}
                className="rounded-lg p-1 text-text-light hover:bg-warm/50 hover:text-text"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text">
                  Image *
                </label>
                <div className="mt-1">
                  <SingleImageUploader
                    image={null}
                    onChange={(url) => {
                      if (url) handleAddImageWithUrl(url);
                    }}
                  />
                </div>
              </div>
              {addSubmitting && (
                <p className="text-sm text-primary">En cours d&apos;ajout…</p>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="flex-1 rounded-xl border border-warm-dark/20 px-4 py-2 font-medium text-text transition-colors hover:bg-warm/50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteOpen}
        title="Supprimer l'image de bannière"
        message={
          deleteOpen
            ? "Cette image sera définitivement supprimée de la bannière."
            : ""
        }
        loading={deleteSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(null)}
      />
    </div>
  );
}

"use client";

/**
 * Admin — Galerie.
 *
 * Rôle : ajouter/modifier/supprimer des images, définir “mis en avant”, et réordonner (drag & drop).
 */
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuImage,
  LuStar,
  LuX,
  LuSave,
  LuGripVertical,
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

type GalleryImage = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
};

function SortableGalleryItem({
  img,
  onEdit,
  onDelete,
}: {
  img: GalleryImage;
  onEdit: (img: GalleryImage) => void;
  onDelete: (img: GalleryImage) => void;
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
      }`}
    >
      <div className="relative aspect-square">
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
        <Image
          src={img.imageUrl}
          alt={img.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-bg-dark/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(img);
              }}
              className="rounded-lg bg-white/90 p-2 text-text hover:bg-white"
              aria-label="Modifier"
            >
              <LuPencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(img);
              }}
              className="rounded-lg bg-white/90 p-2 text-red-600 hover:bg-white"
              aria-label="Supprimer"
            >
              <LuTrash2 className="h-4 w-4" />
            </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-text group-hover:text-primary transition-colors">
          {img.title}
        </h3>
        {img.description && (
          <p className="mt-1 text-sm text-text-light">
            {img.description}
          </p>
        )}
        {img.featured && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            <LuStar className="h-3 w-3" />
            À la une
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdminGaleriePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<GalleryImage | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<GalleryImage | null>(null);
  const [reorderSubmitting, setReorderSubmitting] = useState(false);

  // Add form state
  const [addTitle, setAddTitle] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addImageUrl, setAddImageUrl] = useState<string | null>(null);
  const [addFeatured, setAddFeatured] = useState(false);
  const [addSortOrder, setAddSortOrder] = useState(0);
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete state
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/admin/galerie");
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

  const openEdit = (img: GalleryImage) => {
    setEditOpen(img);
    setEditTitle(img.title);
    setEditDescription(img.description ?? "");
    setEditImageUrl(img.imageUrl);
    setEditFeatured(img.featured);
    setEditSortOrder(img.sortOrder);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addImageUrl) return;
    setAddSubmitting(true);
    try {
      const res = await fetch("/api/admin/galerie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: addTitle,
          description: addDescription || undefined,
          imageUrl: addImageUrl,
          featured: addFeatured,
          sortOrder: addSortOrder,
        }),
      });
      if (res.ok) {
        setAddOpen(false);
        setAddTitle("");
        setAddDescription("");
        setAddImageUrl(null);
        setAddFeatured(false);
        setAddSortOrder(0);
        fetchImages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOpen) return;
    const imageUrl = editImageUrl ?? editOpen.imageUrl;
    if (!imageUrl) return;
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/admin/galerie/${editOpen.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription || null,
          imageUrl,
          featured: editFeatured,
          sortOrder: editSortOrder,
        }),
      });
      if (res.ok) {
        setEditOpen(null);
        fetchImages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteOpen) return;
    setDeleteSubmitting(true);
    try {
      const res = await fetch(`/api/admin/galerie/${deleteOpen.id}`, {
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
      const res = await fetch("/api/admin/galerie/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: reordered.map((img) => img.id),
        }),
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
          Gestion de la Galerie
        </h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-text-inverse shadow-md transition-all hover:bg-primary-light active:scale-95"
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
              <LuImage className="h-12 w-12 text-warm-dark/40" />
              <p className="text-text-light italic">Aucune image dans la galerie.</p>
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
                  <SortableGalleryItem
                    key={img.id}
                    img={img}
                    onEdit={openEdit}
                    onDelete={setDeleteOpen}
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
            onClick={() => setAddOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-text">
                Ajouter une image
              </h2>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="rounded-lg p-1 text-text-light hover:bg-warm/50 hover:text-text"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label htmlFor="add-title" className="block text-sm font-medium text-text">
                  Titre *
                </label>
                <input
                  id="add-title"
                  type="text"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">
                  Image *
                </label>
                <div className="mt-1">
                  <SingleImageUploader
                    image={addImageUrl}
                    onChange={setAddImageUrl}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="add-description" className="block text-sm font-medium text-text-light">
                  Description (optionnel)
                </label>
                <textarea
                  id="add-description"
                  rows={2}
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={addFeatured}
                  onChange={(e) => setAddFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text">À la une</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="flex-1 rounded-xl border border-warm-dark/20 px-4 py-2 font-medium text-text transition-colors hover:bg-warm/50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting || !addImageUrl}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-light disabled:opacity-50"
                >
                  <LuSave className="h-4 w-4" />
                  {addSubmitting ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-bg-dark/40 backdrop-blur-sm"
            onClick={() => setEditOpen(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-text">
                Modifier l&apos;image
              </h2>
              <button
                type="button"
                onClick={() => setEditOpen(null)}
                className="rounded-lg p-1 text-text-light hover:bg-warm/50 hover:text-text"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-text">
                  Titre *
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">
                  Image *
                </label>
                <div className="mt-1">
                  <SingleImageUploader
                    image={editImageUrl}
                    onChange={setEditImageUrl}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-text-light">
                  Description (optionnel)
                </label>
                <textarea
                  id="edit-description"
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editFeatured}
                  onChange={(e) => setEditFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text">À la une</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditOpen(null)}
                  className="flex-1 rounded-xl border border-warm-dark/20 px-4 py-2 font-medium text-text transition-colors hover:bg-warm/50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-light disabled:opacity-50"
                >
                  <LuSave className="h-4 w-4" />
                  {editSubmitting ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!deleteOpen}
        title="Supprimer cette image ?"
        message={
          deleteOpen
            ? `"${deleteOpen.title}" sera définitivement supprimée.`
            : ""
        }
        loading={deleteSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(null)}
      />
    </div>
  );
}

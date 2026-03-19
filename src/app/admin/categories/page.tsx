"use client";

/**
 * Admin — Catégories produits.
 *
 * Rôle : créer/éditer/supprimer et réordonner les catégories (drag & drop).
 */
import { useState, useEffect } from "react";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuGripVertical,
  LuX,
} from "react-icons/lu";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { slugify } from "@/lib/utils";
import ConfirmModal from "@/components/admin/ConfirmModal";

type Category = {
  id: string;
  slug: string;
  label: string;
  sortOrder: number;
  createdAt: string;
};

function SortableCategoryItem({
  cat,
  onEdit,
  onDelete,
}: {
  cat: Category;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 rounded-xl border border-warm-dark/20 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        isDragging ? "z-50 opacity-90 shadow-lg" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex items-center justify-center rounded-lg p-2 text-text-light transition-colors hover:bg-primary/10 hover:text-primary active:cursor-grabbing"
        aria-label="Réorganiser"
      >
        <LuGripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1">
        <p className="font-heading font-semibold text-text">{cat.label}</p>
        <p className="text-sm text-text-light">{cat.slug}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(cat)}
          className="rounded-lg p-2 text-text-light transition-colors hover:bg-primary/10 hover:text-primary"
          aria-label="Modifier"
        >
          <LuPencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(cat)}
          className="rounded-lg p-2 text-text-light transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Supprimer"
        >
          <LuTrash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<Category | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<Category | null>(null);
  const [reorderSubmitting, setReorderSubmitting] = useState(false);
  const [addLabel, setAddLabel] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [editLabel, setEditLabel] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok) setCategories(data.categories ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addLabel.trim()) return;
    const slug = slugify(addLabel.trim());
    setAddSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          label: addLabel.trim(),
          sortOrder: categories.length,
        }),
      });
      if (res.ok) {
        setAddOpen(false);
        setAddLabel("");
        fetchCategories();
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
    if (!editLabel.trim()) return;
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${editOpen.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editLabel.trim(),
          slug: slugify(editLabel.trim()),
        }),
      });
      if (res.ok) {
        setEditOpen(null);
        fetchCategories();
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
      const res = await fetch(`/api/admin/categories/${deleteOpen.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteOpen(null);
        fetchCategories();
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

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...categories];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);
    setCategories(reordered);

    setReorderSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((c) => c.id) }),
      });
      if (!res.ok) {
        setCategories(categories);
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
      setCategories(categories);
      fetchCategories();
    } finally {
      setReorderSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          Gestion des Catégories
        </h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-text-inverse shadow-md transition-all hover:bg-primary-light active:scale-95"
        >
          <LuPlus className="h-4 w-4" />
          Ajouter une catégorie
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-warm-dark/20 bg-white py-24 text-center">
          <p className="text-text-light">Chargement...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-warm-dark/20 bg-warm/5 py-20">
              <p className="text-text-light italic">Aucune catégorie.</p>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-text-inverse shadow-md transition-all hover:bg-primary-light"
              >
                <LuPlus className="h-4 w-4" />
                Ajouter une catégorie
              </button>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((cat) => (
                  <SortableCategoryItem
                    key={cat.id}
                    cat={cat}
                    onEdit={(c) => {
                      setEditOpen(c);
                      setEditLabel(c.label);
                    }}
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
            onClick={() => !addSubmitting && setAddOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-text">
                Ajouter une catégorie
              </h2>
              <button
                type="button"
                onClick={() => !addSubmitting && setAddOpen(false)}
                className="rounded-lg p-1 text-text-light hover:bg-warm/50 hover:text-text"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label htmlFor="add-label" className="block text-sm font-medium text-text">
                  Libellé
                </label>
                <input
                  id="add-label"
                  type="text"
                  value={addLabel}
                  onChange={(e) => setAddLabel(e.target.value)}
                  placeholder="Ex: Accessoires"
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-text-light">
                  Slug auto généré : {addLabel.trim() ? slugify(addLabel.trim()) : "—"}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  disabled={addSubmitting}
                  className="rounded-lg border border-warm-dark/40 px-4 py-2 text-sm font-medium text-text"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting || !addLabel.trim()}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-inverse shadow-md hover:bg-primary-light disabled:opacity-50"
                >
                  {addSubmitting ? "Ajout..." : "Ajouter"}
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
            onClick={() => !editSubmitting && setEditOpen(null)}
            aria-hidden
          />
          <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-text">
                Modifier la catégorie
              </h2>
              <button
                type="button"
                onClick={() => !editSubmitting && setEditOpen(null)}
                className="rounded-lg p-1 text-text-light hover:bg-warm/50 hover:text-text"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label htmlFor="edit-label" className="block text-sm font-medium text-text">
                  Libellé
                </label>
                <input
                  id="edit-label"
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditOpen(null)}
                  disabled={editSubmitting}
                  className="rounded-lg border border-warm-dark/40 px-4 py-2 text-sm font-medium text-text"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting || !editLabel.trim()}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-inverse shadow-md hover:bg-primary-light disabled:opacity-50"
                >
                  {editSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteOpen}
        title="Supprimer la catégorie"
        message={
          deleteOpen
            ? `Supprimer "${deleteOpen.label}" ? Les produits liés seront automatiquement déplacés vers la catégorie "Tout voir".`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={deleteSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(null)}
      />
    </div>
  );
}

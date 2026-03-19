"use client";

/**
 * Modale de confirmation (admin).
 *
 * Rôle : demander une confirmation avant une action destructive (ex. suppression).
 */
import { LuTriangleAlert } from "react-icons/lu";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Confirmation",
  message,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmCls =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-amber-500 text-white hover:bg-amber-600";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-bg-dark/40 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <LuTriangleAlert className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-bold text-text">{title}</h3>
            <p className="mt-2 text-sm text-text-light">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-warm-dark/40 px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-warm/50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${confirmCls}`}
          >
            {loading ? "Suppression…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

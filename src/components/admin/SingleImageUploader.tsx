"use client";

/**
 * Uploader image unique (admin).
 *
 * Rôle : envoyer un seul fichier vers `/api/upload` et retourner l’URL Cloudinary.
 * Utilisé par exemple pour les images hero ou une image de couverture.
 */
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { LuUpload, LuX, LuLoader } from "react-icons/lu";

interface SingleImageUploaderProps {
  image: string | null;
  onChange: (url: string | null) => void;
}

export default function SingleImageUploader({
  image,
  onChange,
}: SingleImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      const formData = new FormData();
      formData.append("files", file);

      setUploading(true);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message ?? "Erreur lors de l'upload");
          return;
        }
        onChange(data.urls[0]);
      } catch {
        setError("Erreur réseau lors de l'upload");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload],
  );

  if (image) {
    return (
      <div className="space-y-2">
        <div className="group relative inline-block overflow-hidden rounded-xl border border-warm-dark/20">
          <Image
            src={image}
            alt="Image"
            width={240}
            height={160}
            className="h-40 w-60 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
          dragging
            ? "border-primary bg-primary/10"
            : "border-warm-dark/40 bg-warm/20 hover:border-primary/60"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <>
            <LuLoader className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-text-light">Upload en cours…</span>
          </>
        ) : (
          <>
            <LuUpload className="h-6 w-6 text-text-light" />
            <span className="text-sm text-text-light">
              Glissez une image ou cliquez
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
          className="hidden"

        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

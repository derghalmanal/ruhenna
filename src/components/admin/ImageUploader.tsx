"use client";

/**
 * Uploader multi-images (admin).
 *
 * Rôle : envoyer une liste d’images via `/api/upload` et retourner les URLs Cloudinary
 * au parent via `onChange`.
 */
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { LuUpload, LuX, LuLoader } from "react-icons/lu";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxImages} images atteint`);
        return;
      }
      const batch = fileArray.slice(0, remaining);

      const formData = new FormData();
      for (const file of batch) {
        formData.append("files", file);
      }

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
        onChange([...images, ...data.urls]);
      } catch {
        setError("Erreur réseau lors de l'upload");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [images, maxImages, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) {
        upload(e.dataTransfer.files);
      }
    },
    [upload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        upload(e.target.files);
      }
    },
    [upload],
  );

  const removeImage = useCallback(
    (index: number) => {
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange],
  );

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex min-h-[8rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
          dragging
            ? "border-primary bg-primary/10"
            : "border-warm-dark/40 bg-warm/20 hover:border-primary/60"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <>
            <LuLoader className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-medium text-text-light">
              Upload en cours…
            </span>
          </>
        ) : (
          <>
            <LuUpload className="h-8 w-8 text-text-light" />
            <span className="text-sm font-medium text-text-light">
              Glissez-déposez vos images ou cliquez pour sélectionner
            </span>
            <span className="text-xs text-text-light/70">
              JPEG, PNG, WebP — max 5 Mo — {images.length}/{maxImages}
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-warm-dark/20"
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <LuX className="h-3.5 w-3.5" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-text-inverse">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

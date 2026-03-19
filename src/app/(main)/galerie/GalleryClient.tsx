"use client";

/**
 * Galerie (client).
 *
 * Rôle : afficher une grille d’images et une “lightbox” (zoom) au clic.
 */
import { useState } from "react";
import Image from "next/image";
import { LuX } from "react-icons/lu";

export type GalleryImageItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
};

type Props = {
  images: GalleryImageItem[];
};

export default function GalleryClient({ images }: Props) {
  const [lightboxImage, setLightboxImage] = useState<GalleryImageItem | null>(null);

  return (
    <>
      {/* --- GRILLE DE LA GALERIE --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-[1/1] cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-xl"
            onClick={() => setLightboxImage(img)}
          >
            <Image
              src={img.imageUrl}
              alt={img.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
              <p className="font-heading text-lg font-semibold text-text-inverse">
                {img.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODALE LIGHTBOX (Aperçu plein écran) --- */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/95 p-4 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          {/* Bouton Fermer */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 z-[60] rounded-full bg-white/10 p-2 text-text-inverse transition-all hover:scale-110 hover:bg-white/20"
          >
            <LuX className="h-6 w-6" />
          </button>

          {/* Conteneur */}
          <div
            className="relative flex flex-col overflow-hidden rounded-2xl bg-bg shadow-2xl w-fit max-w-[95vw] max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full justify-center">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto object-contain block"
              />
            </div>

            <div className="bg-bg p-6 text-center w-full">
              <h3 className="font-heading text-xl font-bold text-text">
                {lightboxImage.title}
              </h3>
              {lightboxImage.description && (
                <p className="mt-2 text-sm text-text-light max-w-xs mx-auto">
                  {lightboxImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
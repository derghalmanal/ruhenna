"use client";

import { useState } from "react";
import Image from "next/image";
import { LuX } from "react-icons/lu";

export type GalleryImageItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type Props = {
  images: GalleryImageItem[];
};

export default function GalleryClient({ images }: Props) {
  const [lightboxImage, setLightboxImage] = useState<GalleryImageItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-[1/1] overflow-hidden rounded-2xl cursor-pointer shadow-lg transition-all hover:shadow-xl"
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
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <p className="font-heading text-lg font-semibold text-text-inverse">
                {img.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 rounded-full p-2 text-text-inverse transition-colors hover:bg-white/20"
            aria-label="Fermer"
          >
            <LuX className="h-8 w-8" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-4xl w-full aspect-[1/1]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.imageUrl}
              alt={lightboxImage.title}
              fill
              className="rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

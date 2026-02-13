"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuX, LuCalendar } from "react-icons/lu";

const GALLERY_IMAGES = [
  { id: 1, src: "/assets/galery/henne_1.jpg", title: "Création henné 1" },
  { id: 2, src: "/assets/galery/henne_2.jpg", title: "Création henné 2" },
  { id: 3, src: "/assets/galery/henne_3.jpg", title: "Création henné 3" },
  { id: 4, src: "/assets/galery/henne_4.jpg", title: "Création henné 4" },
  { id: 5, src: "/assets/galery/henne_5.jpg", title: "Création henné 5" },
  { id: 6, src: "/assets/galery/henne_6.jpg", title: "Création henné 6" },
];

export default function GaleriePage() {
  const [lightboxImage, setLightboxImage] = useState<(typeof GALLERY_IMAGES)[0] | null>(null);

  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl">
            Galerie
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-light">
            Découvrez nos créations uniques et l&apos;art du henné à travers nos réalisations.
          </p>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_IMAGES.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-[1/1] overflow-hidden rounded-2xl cursor-pointer shadow-lg transition-all hover:shadow-xl"
                onClick={() => setLightboxImage(img)}
              >
                <Image
                  src={img.src}
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
        </div>
      </section>

      <section className="section-padding bg-warm/30">
        <div className="container-narrow text-center">
          <h2 className="font-heading text-2xl font-bold text-text md:text-3xl">
            Envie de créer votre propre moment ?
          </h2>
          <p className="mt-3 text-text-light">
            Réservez une prestation et laissez-nous sublimer votre événement.
          </p>
          <Link
            href="/reservation"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-text-inverse shadow-lg transition-all hover:bg-primary-light hover:shadow-xl"
          >
            <LuCalendar className="h-5 w-5" />
            Prendre rendez-vous
          </Link>
        </div>
      </section>

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
              src={lightboxImage.src}
              alt={lightboxImage.title}
              fill
              className="rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </main>
  );
}

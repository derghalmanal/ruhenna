/**
 * Page Galerie (route `/galerie`).
 *
 * Rôle : charger les images depuis la base, puis afficher la grille via `GalleryClient`.
 */
import Link from "next/link";
import { LuCalendar } from "react-icons/lu";
import prisma from "@/lib/prisma";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GaleriePage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const galleryItems = images.map((img: any) => ({
    id: img.id,
    title: img.title,
    imageUrl: img.imageUrl,
    description: img.description || "",
  }));

  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl">
            Galerie
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-light">
            Découvrez des créations uniques et l&apos;art du henné à travers mes réalisations.
          </p>
        </div>
      </section>

      <section>
        <div className="container-narrow">
          <GalleryClient images={galleryItems} />
        </div>
      </section>

      <section className="section-padding bg-warm/30">
        <div className="container-narrow text-center">
          <h2 className="font-heading text-2xl font-bold text-text md:text-3xl">
            Envie de créer votre propre moment ?
          </h2>
          <p className="mt-3 text-text-light">
            Réservez une prestation et laissez-moi sublimer votre événement.
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
    </main>
  );
}

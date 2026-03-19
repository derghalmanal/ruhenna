"use client";

/**
 * Détail produit (client).
 *
 * Rôle : afficher les informations d’un produit (images, description, prix) et proposer une action de contact (demande).
 */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuArrowLeft, LuMessageSquare } from "react-icons/lu";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  images: string[];
}

export default function ProductDetailClient({ product }: { product: ProductData }) {
  const images = product.images.length ? product.images : ["/assets/logo.png"];
  const [selectedImage, setSelectedImage] = useState(0);

  const descriptionParagraphs = product.description.split(/\n\n/).filter(Boolean);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-warm-dark/20 bg-white">
          <Image
            src={images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-warm-dark/20 hover:border-primary/50"
                }`}
              >
                <Image
                  src={url}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-medium uppercase tracking-wide text-primary">
          {product.category}
        </span>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-text md:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            {product.price.toFixed(2)} €
          </span>
          {product.compareAtPrice != null && (
            <span className="text-lg text-text-light line-through">
              {product.compareAtPrice.toFixed(2)} €
            </span>
          )}
        </div>

        <div className="mt-6 space-y-4 text-text-light leading-relaxed">
          {descriptionParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm font-medium text-text">
            Intéressée par ce produit ? Contactez-nous directement pour passer commande.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-text-inverse transition-colors hover:bg-primary-light"
          >
            <LuMessageSquare className="h-5 w-5" />
            Nous contacter
          </Link>
        </div>

        <Link
          href="/boutique"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-text-light transition-colors hover:text-primary"
        >
          <LuArrowLeft className="h-4 w-4" />
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}

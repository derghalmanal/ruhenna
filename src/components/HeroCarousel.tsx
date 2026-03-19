"use client";

/**
 * Carrousel d’images (bannière d’accueil).
 *
 * Rôle : faire défiler automatiquement les images (avec transition) côté client.
 */
import { useState, useEffect } from "react";
import Image from "next/image";

type HeroImage = {
  id: string;
  imageUrl: string;
};

interface HeroCarouselProps {
  images: HeroImage[];
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/30 via-warm to-accent/30"
        aria-hidden
      />
    );
  }

  return (
    <div className="absolute inset-0">
      {images.map((img, index) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
          aria-hidden={index !== currentIndex}
        >
          <Image
            src={img.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}

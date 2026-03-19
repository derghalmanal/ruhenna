/**
 * Layout Galerie.
 *
 * Rôle : définir les métadonnées SEO de la page Galerie.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Découvrez des créations uniques et l'art du henné à travers mes réalisations.",
};

export default function GalerieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

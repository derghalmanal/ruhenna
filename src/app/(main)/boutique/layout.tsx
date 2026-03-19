/**
 * Layout Boutique.
 *
 * Rôle : définir les métadonnées SEO de la section boutique.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Découvrez des produits d'exception pour l'art du henné : cônes, accessoires et coffrets.",
};

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}

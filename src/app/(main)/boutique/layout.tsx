import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Découvrez nos produits d'exception pour l'art du henné : cônes, accessoires et coffrets.",
};

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}

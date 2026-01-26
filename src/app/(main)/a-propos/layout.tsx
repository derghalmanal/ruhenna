import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez mon parcours, mes valeurs et ma passion pour l'art du henné.",
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return children;
}

/**
 * Layout Mentions légales.
 *
 * Rôle : définir les métadonnées SEO de la page.
 */
import type { Metadata } from "next";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    `Mentions légales du site ${siteConfig.brandName} — éditeur, hébergement, propriété intellectuelle et crédits.`,
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

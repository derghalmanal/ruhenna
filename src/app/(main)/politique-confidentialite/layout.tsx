/**
 * Layout Politique de confidentialité.
 *
 * Rôle : définir les métadonnées SEO de la page.
 */
import type { Metadata } from "next";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    `Politique de confidentialité de ${siteConfig.brandName} — données collectées, finalités, durée de conservation et droits RGPD.`,
};

export default function PolitiqueConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

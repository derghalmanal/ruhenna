/**
 * Layout CGV.
 *
 * Rôle : définir les métadonnées SEO de la page CGV.
 */
import type { Metadata } from "next";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description:
    `Conditions Générales de Vente de ${siteConfig.brandName} — artisanat henné, commandes, paiement, livraison et droit de rétractation.`,
};

export default function CGVLayout({ children }: { children: React.ReactNode }) {
  return children;
}

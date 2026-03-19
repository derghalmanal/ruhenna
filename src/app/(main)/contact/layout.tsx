/**
 * Layout Contact.
 *
 * Rôle : définir les métadonnées SEO de la page Contact.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question ? Contactez-nous pour toute demande d'information, réservation ou devis.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

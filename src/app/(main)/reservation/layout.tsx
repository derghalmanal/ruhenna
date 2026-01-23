import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réservation",
  description: "Choisissez votre prestation henné et réservez en quelques clics. Henné mariée, événement ou atelier.",
};

export default function ReservationLayout({ children }: { children: React.ReactNode }) {
  return children;
}

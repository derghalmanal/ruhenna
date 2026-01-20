import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Ruhenna",
  description: "Découvrez Ruhenna : votre spécialiste de l'art du henné. Achat de cônes de henné en ligne et réservation de prestations sur mesure pour vos événements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

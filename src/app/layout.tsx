/**
 * Layout racine Next.js.
 *
 * Rôle : définir les métadonnées globales (SEO, OpenGraph) et appliquer les polices
 * ainsi que la feuille de style globale.
 */
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/app/globals.css";
import { siteConfig } from "@/lib/env";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.brandName}`,
    default: siteConfig.brandName,
  },
  description: siteConfig.brandDescription,
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: siteConfig.brandName,
    images: [{ url: "/assets/logo.png", width: 500, height: 500 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen font-body">
        {children}
      </body>
    </html>
  );
}

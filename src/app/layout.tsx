import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/app/globals.css";
import { siteConfig } from "@/lib/env";
import { Footer } from "@/components/layout/Footer";

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

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.brandName}`,
    default: siteConfig.brandName,
  },
  description: siteConfig.brandDescription,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
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
        <Footer />
      </body>
    </html>
  );
}

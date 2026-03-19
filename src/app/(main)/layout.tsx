/**
 * Layout du site public (hors admin).
 *
 * Rôle : afficher le header/footer et injecter des données structurées (JSON-LD)
 * pour aider le référencement local (type LocalBusiness).
 */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/env";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.brandName,
  description: siteConfig.brandDescription,
  url: baseUrl,
  telephone: siteConfig.contactPhone,
  image: `${baseUrl}/assets/logo.png`,
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Header />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <Footer />
    </>
  );
}

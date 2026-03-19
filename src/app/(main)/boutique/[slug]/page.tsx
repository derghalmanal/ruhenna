/**
 * Page Détail produit (route `/boutique/[slug]`).
 *
 * Rôle : charger un produit par `slug`, générer les métadonnées SEO et afficher
 * le composant client `ProductDetailClient` pour l’interaction.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { LuChevronRight } from "react-icons/lu";
import { siteConfig } from "@/lib/env";
import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product || !product.active) {
    return { title: "Produit introuvable" };
  }

  return {
    title: `${product.name} | ${siteConfig.brandName}`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : "../assets/logo.png",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product || !product.active) {
    notFound();
  }

  const productData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    category: product.category,
    images: product.images,
  };

  return (
    <main>
      <section className="bg-bg pb-2 pt-6">
        <div className="container-narrow">
          <nav className="flex items-center gap-1.5 text-sm text-text-light">
            <Link href="/boutique" className="transition-colors hover:text-primary">
              Boutique
            </Link>
            <LuChevronRight className="h-3.5 w-3.5" />
            <span className="capitalize">{product.category}</span>
            <LuChevronRight className="h-3.5 w-3.5" />
            <span className="text-text font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <ProductDetailClient product={productData} />
        </div>
      </section>
    </main>
  );
}

/**
 * Layout Blog.
 *
 * Rôle : définir les métadonnées SEO de la section blog.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conseils, traditions et inspirations autour de l'art du henné.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

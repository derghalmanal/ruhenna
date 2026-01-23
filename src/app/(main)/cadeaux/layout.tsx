import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadeaux Invités",
  description: "Coffrets et sets cadeaux henné personnalisés pour mariages et événements. Offrez à vos invités un moment d'exception.",
};

export default function CadeauxLayout({ children }: { children: React.ReactNode }) {
  return children;
}

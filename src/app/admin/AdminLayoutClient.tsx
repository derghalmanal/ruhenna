"use client";

/**
 * Layout client de l’administration.
 *
 * Rôle : afficher la navigation (sidebar).
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuPackage,
  LuScissors,
  LuImage,
  LuCalendar,
  LuMessageSquare,
  LuFileText,
  LuMonitor,
  LuMenu,
  LuX,
  LuExternalLink,
  LuInfo,
  LuTags,
} from "react-icons/lu";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LuLayoutDashboard },
  { href: "/admin/hero", label: "Bannière", icon: LuMonitor },
  { href: "/admin/produits", label: "Produits", icon: LuPackage },
  { href: "/admin/categories", label: "Catégories", icon: LuTags },
  { href: "/admin/services", label: "Services", icon: LuScissors },
  { href: "/admin/galerie", label: "Galerie", icon: LuImage },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: LuCalendar },
  { href: "/admin/messages", label: "Messages", icon: LuMessageSquare },
  { href: "/admin/blog", label: "Blog", icon: LuFileText },
];

export function AdminLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40 border-r border-warm-dark/20 bg-white">
        <div className="flex h-16 shrink-0 items-center border-b border-warm-dark/20 px-6">
          <span className="font-heading text-xl font-bold text-primary">
            Administration
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-text hover:bg-warm/50 hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-bg-dark/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-warm-dark/20 bg-white transition-transform duration-200 ease-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-warm-dark/20 px-4">
          <span className="font-heading text-lg font-bold text-primary">
            Administration
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-text hover:bg-warm/50"
            aria-label="Fermer le menu"
          >
            <LuX className="h-6 w-6" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-text hover:bg-warm/50"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 w-full lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-warm-dark/20 bg-white px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-text hover:bg-warm/50 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <LuMenu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-end items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text hover:bg-warm/50 transition-colors"
            >
              <LuExternalLink className="h-4 w-4" />
              Retour au site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
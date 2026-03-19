"use client";

/**
 * En-tête du site (navigation).
 *
 * Rôle : afficher le logo, les liens principaux et un menu mobile (burger) sur petits écrans.
 * Remarque : "use client" est nécessaire car on gère de l'état React (menu ouvert/fermé).
 */
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { siteConfig } from "@/lib/env";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/galerie", label: "Galerie" },
  { href: "/boutique", label: "Boutique" },
  { href: "/reservation", label: "Réservation" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-xl">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-text-inverse focus:outline-none"
        >
          Aller au contenu principal
        </a>

        <div className="container-narrow flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="relative flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt={siteConfig.brandName}
              width={42}
              height={42}
              className="h-10 w-auto md:h-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-text transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-text transition-colors hover:bg-primary/10 md:hidden"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <HiXMark className="h-7 w-7" />
              ) : (
                <HiBars3 className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-bg-dark/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform bg-bg shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-warm-dark/20 px-6">
          <span className="font-heading text-lg font-bold text-primary">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-text hover:bg-primary/10"
            aria-label="Fermer le menu"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-lg font-medium text-text transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

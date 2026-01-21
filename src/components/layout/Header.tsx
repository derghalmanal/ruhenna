"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineShoppingBag, HiBars3, HiXMark } from "react-icons/hi2";
import { siteConfig } from "@/lib/env";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/galerie", label: "Galerie" },
  { href: "/boutique", label: "Boutique" },
  { href: "/cadeaux", label: "Cadeaux" },
  { href: "/reservation", label: "Réservation" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-xl">
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

        <div className="flex items-center gap-4">
          <Link
            href="/panier"
            className="relative rounded-full p-2 text-text transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Panier"
          >
            <HiOutlineShoppingBag className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-text-inverse">
              0
            </span>
          </Link>

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

      <div
        className={`fixed inset-0 top-16 z-40 transform bg-bg transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
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
    </header>
  );
}

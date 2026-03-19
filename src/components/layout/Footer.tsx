/**
 * Pied de page du site.
 *
 * Rôle : navigation secondaire + liens sociaux + mentions légales (selon configuration).
 */
import Link from "next/link";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
import { siteConfig } from "@/lib/env";

const footerNav = [
  { href: "/", label: "Accueil" },
  { href: "/galerie", label: "Galerie" },
  { href: "/boutique", label: "Boutique" },
  { href: "/reservation", label: "Réservation" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: siteConfig.socialInstagram, icon: SiInstagram, label: "Instagram" },
  { href: siteConfig.socialTiktok, icon: SiTiktok, label: "TikTok" },
  { href: siteConfig.socialWhatsapp, icon: SiWhatsapp, label: "WhatsApp" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-warm-dark bg-bg-dark text-text-inverse">
      <div className="container-narrow section-padding">
        <div className="mb-12 text-center">
          <h3 className="font-heading text-2xl font-bold text-primary-light md:text-3xl">
            {siteConfig.brandName}
          </h3>
          <p className="mt-2 text-warm/90">{siteConfig.brandTagline}</p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 justify-items-center">
          <div>
            <h4 className="mb-4 font-semibold uppercase tracking-wider text-primary-light">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm/90 transition-colors hover:text-primary-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold uppercase tracking-wider text-primary-light">
              Informations
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/cgv" className="text-warm/90 transition-colors hover:text-primary-light">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-warm/90 transition-colors hover:text-primary-light">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-warm/90 transition-colors hover:text-primary-light">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold uppercase tracking-wider text-primary-light">
              Suivez-nous
            </h4>
            <div className="flex gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-warm/90 transition-colors hover:bg-primary/20 hover:text-primary-light"
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-warm-dark/50 pt-8 text-center text-sm text-warm/70">
          <p>
            © {currentYear} {siteConfig.brandName}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

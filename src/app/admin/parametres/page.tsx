"use client";

import Link from "next/link";
import {
  LuBuilding2,
  LuShare2,
  LuFileText,
  LuZap,
  LuExternalLink,
  LuBookOpen,
  LuGlobe,
} from "react-icons/lu";
import { siteConfig } from "@/lib/env";

export default function AdminParametresPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold text-text">Paramètres</h1>

      {/* Section 1: Site Info */}
      <section className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-text">
          <LuBuilding2 className="h-5 w-5 text-primary" />
          Informations du site
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-text-light">Nom de la marque</dt>
            <dd className="mt-1 text-text">{siteConfig.brandName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-light">Slogan</dt>
            <dd className="mt-1 text-text">{siteConfig.brandTagline}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-text-light">Description</dt>
            <dd className="mt-1 text-text">{siteConfig.brandDescription}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-light">Email de contact</dt>
            <dd className="mt-1 text-text">{siteConfig.contactEmail}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-light">Téléphone</dt>
            <dd className="mt-1 text-text">{siteConfig.contactPhone}</dd>
          </div>
        </dl>
      </section>

      {/* Section 2: Social Links */}
      <section className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-text">
          <LuShare2 className="h-5 w-5 text-primary" />
          Réseaux sociaux
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-text-light">Instagram</dt>
            <dd className="mt-1">
              <a
                href={siteConfig.socialInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                {siteConfig.socialInstagram}
                <LuExternalLink className="h-3.5 w-3.5" />
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-light">TikTok</dt>
            <dd className="mt-1">
              <a
                href={siteConfig.socialTiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                {siteConfig.socialTiktok}
                <LuExternalLink className="h-3.5 w-3.5" />
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-light">WhatsApp</dt>
            <dd className="mt-1">
              <a
                href={siteConfig.socialWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                {siteConfig.socialWhatsapp}
                <LuExternalLink className="h-3.5 w-3.5" />
              </a>
            </dd>
          </div>
        </dl>
      </section>

      {/* Section 3: Legal Info */}
      <section className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-text">
          <LuFileText className="h-5 w-5 text-primary" />
          Informations légales
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-text-light">SIRET</dt>
            <dd className="mt-1 text-text">{siteConfig.siret}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-light">TVA intracommunautaire</dt>
            <dd className="mt-1 text-text">{siteConfig.tvaIntra}</dd>
          </div>
        </dl>
      </section>

      {/* Section 4: Quick Actions */}
      <section className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-text">
          <LuZap className="h-5 w-5 text-primary" />
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-warm-dark/30 bg-warm/20 px-4 py-3">
            <LuBookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm text-text">
              Accéder au studio Prisma : exécutez <code className="rounded bg-warm-dark/20 px-1.5 py-0.5 font-mono text-xs">npx prisma studio</code> en local
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
          >
            <LuGlobe className="h-4 w-4" />
            Voir le site
          </Link>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
          >
            <LuBookOpen className="h-4 w-4" />
            Documentation
          </a>
        </div>
      </section>

      <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Pour modifier ces paramètres, mettez à jour les variables d&apos;environnement dans votre hébergeur (Vercel).
      </p>
    </div>
  );
}

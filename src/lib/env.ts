/**
 * Configuration publique du site.
 *
 * Rôle : centraliser les informations affichées dans l’UI (nom de marque, contacts,
 * réseaux sociaux, infos légales) à partir des variables d’environnement `NEXT_PUBLIC_*`.
 *
 * Important : ces variables sont publiques (envoyées au navigateur).
 */

export const siteConfig = {
  // Brand
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME ?? "RUHENNA",
  brandTagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? "L'art du henné naturel, de la confection à la création.",
  brandDescription:
    process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ?? "Artisane spécialisée dans le henné naturel. RUHENNA vous propose des cônes de henné de qualité professionnelle faits main et des prestations artistiques sur mesure pour vos mariages et événements.",

  // Contact
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "Sol.sumeyraafc@gmail.com",
  contactPhone:
    process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+33 6 68 77 85 19",
  contactAddress:
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? "{{STREET}}, {{CITY}} {{POSTAL}}",

  // Social
  socialInstagram:
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ??
    "https://www.instagram.com/ruh.enna/",
  socialTiktok:
    process.env.NEXT_PUBLIC_SOCIAL_TIKTOK ?? "https://www.tiktok.com/@ruhenna0",
  socialWhatsapp:
    process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP ?? "https://wa.me/33668778519",

  // Legal
  siret: process.env.NEXT_PUBLIC_SIRET ?? "88465159700012",
  tvaIntra: process.env.NEXT_PUBLIC_TVA_INTRA ?? "FR77884651597",
} as const;

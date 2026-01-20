export const siteConfig = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME ?? "{{BRAND_NAME}}",
  brandTagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? "{{BRAND_TAGLINE}}",
  brandDescription: process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ?? "{{BRAND_DESCRIPTION}}",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@example.com",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+33 X XX XX XX XX",
  socialInstagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "https://instagram.com/{{HANDLE}}",
  socialFacebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "https://facebook.com/{{HANDLE}}",
  socialTiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK ?? "https://tiktok.com/@{{HANDLE}}",
  socialWhatsapp: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP ?? "https://wa.me/33XXXXXXXXX",
  siret: process.env.NEXT_PUBLIC_SIRET ?? "{{SIRET_NUMBER}}",
  tvaIntra: process.env.NEXT_PUBLIC_TVA_INTRA ?? "{{TVA_NUMBER}}",
} as const;

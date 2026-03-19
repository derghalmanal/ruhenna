/**
 * Client Cloudinary + helpers.
 *
 * Rôle : configurer Cloudinary via les variables d’environnement et fournir
 * des fonctions utilitaires pour extraire le `publicId` depuis une URL et
 * supprimer des images côté Cloudinary quand elles ne sont plus utilisées.
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export function extractPublicId(url: string): string | null {
  try {
    // Exemple d’URL : https://res.cloudinary.com/.../upload/v1234/dossier/image.webp
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export async function deleteCloudinaryImage(url: string): Promise<boolean> {
  const publicId = extractPublicId(url);
  if (!publicId) return false;
  try {
    // Suppression “best effort” : on ne bloque pas l’app si Cloudinary est indisponible.
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

export async function deleteCloudinaryImages(urls: string[]): Promise<void> {
  // On filtre : certaines URLs peuvent être externes ou vides.
  const cloudinaryUrls = urls.filter((u) => u.includes("cloudinary.com"));
  await Promise.allSettled(cloudinaryUrls.map(deleteCloudinaryImage));
}

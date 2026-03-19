/**
 * Utilitaires génériques.
 *
 * Rôle : fonctions réutilisables “sans état” (ex. génération de slug).
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

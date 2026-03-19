/**
 * Validation (Zod) — formulaire de contact.
 *
 * Rôle : définir les règles de validation côté serveur (API `/api/contact`).
 */
import { z } from "zod";

export const contactSchema = z.object({
  senderName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000, "Le message ne peut pas dépasser 2000 caractères"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

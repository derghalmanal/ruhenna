/**
 * Validation (Zod) — réservation / rendez-vous.
 *
 * Rôle : définir les règles de validation côté serveur (API `/api/rendez-vous`).
 * Les regex permettent de forcer un format de date/heure simple et stable.
 */
import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const frenchPhoneRegex = /^(?:(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4})$/;

export const bookingSchema = z.object({
  serviceId: z.string().cuid("Veuillez sélectionner un service valide"),
  date: z.string().regex(dateRegex, "Format de date invalide (attendu : AAAA-MM-JJ)"),
  startTime: z.string().regex(timeRegex, "Format d'heure invalide (attendu : HH:MM)"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .regex(frenchPhoneRegex, "Numéro de téléphone invalide. Format attendu : 06 12 34 56 78 ou +33 6 12 34 56 78")
    .optional()
    .or(z.literal("")),
  city: z.string().max(100, "La ville ne peut pas dépasser 100 caractères").optional().or(z.literal("")),
  notes: z.string().max(500, "Les notes ne peuvent pas dépasser 500 caractères").optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

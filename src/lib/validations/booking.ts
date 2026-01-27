import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const frenchPhoneRegex = /^(?:(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}|0[1-9][\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2})$/;

export const bookingSchema = z.object({
  serviceId: z.string().cuid("ID de service invalide"),
  date: z.string().regex(dateRegex, "Format de date invalide (YYYY-MM-DD)"),
  startTime: z.string().regex(timeRegex, "Format d'heure invalide (HH:MM)"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().regex(frenchPhoneRegex).optional().or(z.literal("")),
  notes: z.string().max(500, "Les notes ne peuvent pas dépasser 500 caractères").optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

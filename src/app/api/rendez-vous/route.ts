/**
 * API publique : création d’une demande de rendez-vous.
 *
 * Route : POST /api/rendez-vous
 * Rôle : valider la demande (Zod), vérifier que le service existe et que le créneau
 * est encore disponible, puis enregistrer un rendez-vous en statut PENDING.
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations/rendez-vous";

function parseTime(t: string): number { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function formatTime(m: number): string { return `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`; }

export async function POST(request: Request) {
  try {

    const body = await request.json();
    // Validation forte du payload : évite de persister des données incohérentes.
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });

    const { serviceId, date, startTime, name, email, phone, city, notes } = parsed.data;
    const service = await prisma.service.findUnique({ where: { id: serviceId, active: true } });
    if (!service) return NextResponse.json({ success: false, message: "Service non trouvé" }, { status: 404 });

    // Calcul de l’heure de fin à partir de la durée du service.
    const endTime = formatTime(parseTime(startTime) + service.duration);
    const [y, mo, d] = date.split("-").map(Number);
    const appointmentDate = new Date(y, mo - 1, d);
    const startOfDay = new Date(y, mo - 1, d, 0, 0, 0, 0);
    const endOfDay = new Date(y, mo - 1, d, 23, 59, 59, 999);

    const existing = await prisma.appointment.findMany({
      where: { date: { gte: startOfDay, lte: endOfDay }, status: { not: "CANCELLED" } },
    });

    // Conflit si chevauchement : (s1 < e2) && (e1 > s2)
    const slotTaken = existing.some((apt: any) => {
      const s1 = parseTime(startTime), e1 = parseTime(endTime);
      const s2 = parseTime(apt.startTime), e2 = parseTime(apt.endTime);
      return s1 < e2 && e1 > s2;
    });
    if (slotTaken) return NextResponse.json({ success: false, message: "Ce créneau n'est plus disponible" }, { status: 409 });

    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        date: appointmentDate,
        startTime,
        endTime,
        status: "PENDING",
        notes: notes || null,
        clientPhone: phone || null,
        clientName: name || null,
        clientEmail: email || null,
        clientCity: city || null,
      },
    });
    return NextResponse.json({ success: true, appointmentId: appointment.id }, { status: 201 });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json({ success: false, message: "Erreur lors de la réservation" }, { status: 500 });
  }
}

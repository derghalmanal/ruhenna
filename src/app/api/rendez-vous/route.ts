/**
 * API publique : creation d'une demande de rendez-vous.
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations/rendez-vous";

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(m: number): string {
  return `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`;
}

function parseDateInput(date: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
}

function getDayRange(date: string) {
  const [y, mo, d] = date.split("-").map(Number);
  return {
    startOfDay: new Date(Date.UTC(y, mo - 1, d, 0, 0, 0, 0)),
    endOfDay: new Date(Date.UTC(y, mo - 1, d, 23, 59, 59, 999)),
  };
}

function overlaps(startA: string, endA: string, startB: string, endB: string): boolean {
  const s1 = parseTime(startA);
  const e1 = parseTime(endA);
  const s2 = parseTime(startB);
  const e2 = parseTime(endB);
  return s1 < e2 && e1 > s2;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { serviceId, date, startTime, name, email, phone, city, notes } = parsed.data;
    const service = await prisma.service.findUnique({ where: { id: serviceId, active: true } });
    if (!service) {
      return NextResponse.json({ success: false, message: "Service non trouve" }, { status: 404 });
    }

    const endTime = formatTime(parseTime(startTime) + service.duration);
    const appointmentDate = parseDateInput(date);
    const { startOfDay, endOfDay } = getDayRange(date);

    const existing = await prisma.appointment.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: { not: "CANCELLED" },
      },
    });

    const slotTaken = existing.some((apt) =>
      overlaps(startTime, endTime, apt.startTime, apt.endTime)
    );

    if (slotTaken) {
      return NextResponse.json(
        { success: false, message: "Ce creneau n'est plus disponible" },
        { status: 409 }
      );
    }

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
    return NextResponse.json(
      { success: false, message: "Erreur lors de la reservation" },
      { status: 500 }
    );
  }
}

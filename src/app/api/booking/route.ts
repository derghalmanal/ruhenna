import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/validations/booking";
import { sanitizeObject } from "@/lib/sanitize";

function parseTime(t: string): number { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function formatTime(m: number): string { return `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`; }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });

    const { serviceId, date, startTime, name, email, notes } = sanitizeObject(parsed.data);
    const service = await prisma.service.findUnique({ where: { id: serviceId, active: true } });
    if (!service) return NextResponse.json({ success: false, message: "Service non trouvé" }, { status: 404 });

    const endTime = formatTime(parseTime(startTime) + service.duration);
    const [y, mo, d] = date.split("-").map(Number);
    const appointmentDate = new Date(y, mo - 1, d);
    const startOfDay = new Date(y, mo - 1, d, 0, 0, 0, 0);
    const endOfDay = new Date(y, mo - 1, d, 23, 59, 59, 999);

    const existing = await prisma.appointment.findMany({
      where: { date: { gte: startOfDay, lte: endOfDay }, status: { not: "CANCELLED" } },
    });

    const slotTaken = existing.some((apt) => {
      const s1 = parseTime(startTime), e1 = parseTime(endTime);
      const s2 = parseTime(apt.startTime), e2 = parseTime(apt.endTime);
      return s1 < e2 && e1 > s2;
    });
    if (slotTaken) return NextResponse.json({ success: false, message: "Ce créneau n'est plus disponible" }, { status: 409 });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name, hashedPassword: await hash(crypto.randomUUID(), 10), role: "CLIENT" } });
    }

    const appointment = await prisma.appointment.create({
      data: { userId: user.id, serviceId, date: appointmentDate, startTime, endTime, status: "PENDING", notes: notes || null },
    });
    return NextResponse.json({ success: true, appointmentId: appointment.id }, { status: 201 });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json({ success: false, message: "Erreur lors de la réservation" }, { status: 500 });
  }
}

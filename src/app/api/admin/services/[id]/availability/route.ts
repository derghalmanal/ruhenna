/**
 * API admin — Disponibilités d’un service.
 *
 * Routes :
 * - GET    /api/admin/services/:id/availability : lister les règles
 * - POST   /api/admin/services/:id/availability : créer une règle (jour / dates / horaires)
 * - DELETE /api/admin/services/:id/availability : supprimer une règle
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function parseDateInput(dateStr: string): Date | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const availabilities = await prisma.serviceAvailability.findMany({
      where: { serviceId: id },
      orderBy: { dayOfWeek: "asc" },
    });
    return NextResponse.json({ availabilities });
  } catch (error) {
    console.error("Availability GET error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { dayOfWeek, startDate, endDate, startTime, endTime } = body;

    if (!startTime || !endTime) {
      return NextResponse.json({ success: false, message: "Heures requises" }, { status: 400 });
    }

    const availability = await prisma.serviceAvailability.create({
      data: {
        serviceId: id,
        dayOfWeek: dayOfWeek != null ? Number(dayOfWeek) : null,
        // On utilise notre Helper ici 👇
        startDate: startDate ? parseDateInput(startDate) : null,
        endDate: endDate ? parseDateInput(endDate) : null,
        startTime,
        endTime,
      },
    });
    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Availability POST error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { availabilityId } = await request.json();
    await prisma.serviceAvailability.delete({ where: { id: availabilityId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Availability DELETE error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}
/**
 * API admin - Rendez-vous.
 */
import { NextRequest, NextResponse } from "next/server";
import { AppointmentStatus, type Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(m: number): string {
  return `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`;
}

function parseDateInput(date: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
}

function formatDateInput(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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

async function hasAppointmentConflict(params: {
  date: string;
  startTime: string;
  endTime: string;
  excludeId?: string;
}) {
  const { startOfDay, endOfDay } = getDayRange(params.date);
  const appointments = await prisma.appointment.findMany({
    where: {
      ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
      date: { gte: startOfDay, lte: endOfDay },
      status: { not: "CANCELLED" },
    },
  });

  return appointments.some((appointment) =>
    overlaps(params.startTime, params.endTime, appointment.startTime, appointment.endTime)
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const where: Prisma.AppointmentWhereInput = {};
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (statusParam && validStatuses.includes(statusParam)) {
      where.status = statusParam as AppointmentStatus;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Admin appointments GET error:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, date, startTime, serviceId, name, email, phone, notes } = body;

    if (!id) return NextResponse.json({ message: "ID du rendez-vous requis" }, { status: 400 });

    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: { service: { select: { id: true, duration: true } } },
    });

    if (!existing) return NextResponse.json({ message: "Rendez-vous introuvable" }, { status: 404 });

    const updateData: Prisma.AppointmentUncheckedUpdateInput = {};
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (status && validStatuses.includes(status)) {
      updateData.status = status;
    }

    if (name !== undefined) updateData.clientName = name.trim() || null;
    if (email !== undefined) updateData.clientEmail = email.trim() || null;
    if (phone !== undefined) updateData.clientPhone = phone.trim() || null;
    if (notes !== undefined) updateData.notes = notes.trim() || null;

    const hasTimeChange = date !== undefined || startTime !== undefined;
    const hasServiceChange = serviceId !== undefined && serviceId !== existing.serviceId;

    if (hasTimeChange || hasServiceChange) {
      const targetServiceId = serviceId ?? existing.serviceId;
      const targetDateStr = date ?? formatDateInput(existing.date);
      const targetStartTime = startTime ?? existing.startTime;

      let targetDuration = existing.service.duration;
      if (hasServiceChange) {
        const targetService = await prisma.service.findUnique({
          where: { id: targetServiceId },
          select: { duration: true },
        });
        if (!targetService) return NextResponse.json({ message: "Nouveau service introuvable" }, { status: 404 });
        targetDuration = targetService.duration;
      }

      const parsedDate = parseDateInput(targetDateStr);
      if (!parsedDate) return NextResponse.json({ message: "Format de date invalide (YYYY-MM-DD)" }, { status: 400 });

      const targetEndTime = formatTime(parseTime(targetStartTime) + targetDuration);
      const conflict = await hasAppointmentConflict({
        date: targetDateStr,
        startTime: targetStartTime,
        endTime: targetEndTime,
        excludeId: id,
      });

      if (conflict) {
        return NextResponse.json({ message: "Ce creneau est deja reserve" }, { status: 409 });
      }

      updateData.serviceId = targetServiceId;
      updateData.date = parsedDate;
      updateData.startTime = targetStartTime;
      updateData.endTime = targetEndTime;
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: { service: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ message: "Erreur lors de la mise a jour" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceId, date, startTime, notes } = body;

    if (!serviceId) return NextResponse.json({ message: "L'ID du service est requis" }, { status: 400 });

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true, duration: true },
    });

    if (!service) return NextResponse.json({ message: "Service introuvable" }, { status: 404 });

    const targetDateStr = date ?? formatDateInput(new Date());
    const parsedDate = parseDateInput(targetDateStr);
    if (!parsedDate) return NextResponse.json({ message: "Format de date invalide" }, { status: 400 });

    const finalStartTime = startTime || "09:00";
    const finalEndTime = formatTime(parseTime(finalStartTime) + service.duration);

    const conflict = await hasAppointmentConflict({
      date: targetDateStr,
      startTime: finalStartTime,
      endTime: finalEndTime,
    });

    if (conflict) {
      return NextResponse.json({ message: "Ce creneau est deja reserve" }, { status: 409 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        serviceId: service.id,
        date: parsedDate,
        startTime: finalStartTime,
        endTime: finalEndTime,
        status: "CONFIRMED",
        clientName: name?.trim() || "Invite",
        clientEmail: email?.trim() || null,
        clientPhone: phone?.trim() || null,
        notes: notes?.trim() || null,
      },
      include: { service: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "Erreur lors de la creation" }, { status: 500 });
  }
}

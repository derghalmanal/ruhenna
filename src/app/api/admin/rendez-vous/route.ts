/**
 * API admin — Rendez-vous.
 *
 * Routes :
 * - GET   /api/admin/rendez-vous : lister (filtrable par statut)
 * - PATCH /api/admin/rendez-vous : mettre à jour (statut, infos client, date/heure)
 * - POST  /api/admin/rendez-vous : créer un rendez-vous confirmé manuellement
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// --- HELPERS ---

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
  // Important: On force l'heure à midi pour éviter les problèmes de fuseau horaire
  return new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
}

function formatDateInput(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// --- ROUTES ---

/**
 * GET : Récupère les rendez-vous filtrés par STATUT uniquement
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const where: any = {};

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (statusParam && validStatuses.includes(statusParam)) {
      where.status = statusParam;
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

/**
 * PATCH : Met à jour un rendez-vous (Statut, Infos Client, ou Horaire)
 */
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

    const updateData: any = {};

    // 1. Mise à jour du statut
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (status && validStatuses.includes(status)) {
      updateData.status = status;
    }

    // 2. Mise à jour des infos client
    if (name !== undefined) updateData.clientName = name.trim() || null;
    if (email !== undefined) updateData.clientEmail = email.trim() || null;
    if (phone !== undefined) updateData.clientPhone = phone.trim() || null;
    if (notes !== undefined) updateData.notes = notes.trim() || null;

    // 3. Gestion du changement de service, de date ou d'horaire
    const hasTimeChange = date !== undefined || startTime !== undefined;
    const hasServiceChange = serviceId !== undefined && serviceId !== existing.serviceId;

    if (hasTimeChange || hasServiceChange) {
      // Déterminer les nouvelles valeurs (ou garder les anciennes)
      const targetServiceId = serviceId ?? existing.serviceId;
      const targetDateStr = date ?? formatDateInput(existing.date);
      const targetStartTime = startTime ?? existing.startTime;

      // Récupérer la durée du service cible
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

      // Vérification des conflits (si on change l'heure ou la date)
      if (hasTimeChange) {
        const conflict = await prisma.appointment.findFirst({
          where: { 
            id: { not: id }, // Exclure le RDV actuel
            date: parsedDate, 
            startTime: targetStartTime,
            status: { not: "CANCELLED" } // Optionnel : Ignorer les RDV annulés
          },
        });

        if (conflict) return NextResponse.json({ message: "Ce créneau est déjà réservé" }, { status: 409 });
      }

      // Appliquer les changements horaires
      updateData.serviceId = targetServiceId;
      updateData.date = parsedDate;
      updateData.startTime = targetStartTime;
      updateData.endTime = formatTime(parseTime(targetStartTime) + targetDuration);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: { service: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ message: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

/**
 * POST : Création manuelle d'un rendez-vous par l'Admin
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceId, date, startTime, notes } = body;

    if (!serviceId) return NextResponse.json({ message: "L'ID du service est requis" }, { status: 400 });

    const service = await prisma.service.findUnique({ 
      where: { id: serviceId }, 
      select: { id: true, duration: true } 
    });

    if (!service) return NextResponse.json({ message: "Service introuvable" }, { status: 404 });

    const parsedDate = date ? parseDateInput(date) : new Date();
    if (!parsedDate) return NextResponse.json({ message: "Format de date invalide" }, { status: 400 });

    const finalStartTime = startTime || "09:00";

    const appointment = await prisma.appointment.create({
      data: {
        serviceId: service.id,
        date: parsedDate,
        startTime: finalStartTime,
        endTime: formatTime(parseTime(finalStartTime) + service.duration),
        status: "CONFIRMED",
        clientName: name?.trim() || "Invité",
        clientEmail: email?.trim() || null,
        clientPhone: phone?.trim() || null,
        notes: notes?.trim() || null,
      },
      include: { service: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "Erreur lors de la création" }, { status: 500 });
  }
}
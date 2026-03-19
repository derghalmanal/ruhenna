/**
 * API publique : calcul des créneaux disponibles.
 *
 * Route : GET /api/rendez-vous/slots?date=YYYY-MM-DD&serviceId=...
 * Rôle : renvoyer une liste d’horaires disponibles en fonction :
 * - du service (durée)
 * - des règles de disponibilité
 * - des rendez-vous existants (pas de chevauchement)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");

    if (!dateStr || !serviceId) {
      return NextResponse.json(
        { success: false, message: "Paramètres date et serviceId requis" },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { success: false, message: "Format de date invalide" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId, active: true },
      include: { availabilities: true },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service non trouvé" },
        { status: 404 }
      );
    }

    const [y, mo, d] = dateStr.split("-").map(Number);
    // On force “midi UTC” pour stabiliser le calcul du jour de semaine (évite certains effets de fuseau horaire).
    const requestedDateUTC = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
    const dayOfWeek = requestedDateUTC.getUTCDay();

    const startOfDay = new Date(Date.UTC(y, mo - 1, d, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(y, mo - 1, d, 23, 59, 59, 999));

    // On récupère les rendez-vous de la journée (hors annulations) pour vérifier les conflits.
    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: { not: "CANCELLED" },
      },
    });

    const timeWindows: { start: number; end: number }[] = [];
    const DEFAULT_START = 540; // 09:00 (en minutes)
    const DEFAULT_END = 1140;  // 19:00 (en minutes)

    if (service.availabilities.length === 0) {
      // Aucune règle n'a été créée pour ce service -> Par défaut 9h-19h
      timeWindows.push({ start: DEFAULT_START, end: DEFAULT_END });
    } else {
      // Des règles existent, on filtre celles qui s'appliquent à aujourd'hui
      const matchingRules = service.availabilities.filter((av: any) => {
        // Vérification du jour (null = tous les jours)
        const matchesDay = av.dayOfWeek === null || av.dayOfWeek === dayOfWeek;
        
        // On extrait la date au format string (YYYY-MM-DD) pour éviter les sauts de timezone
        const avStartStr = av.startDate ? av.startDate.toISOString().split('T')[0] : null;
        const avEndStr = av.endDate ? av.endDate.toISOString().split('T')[0] : null;

        const matchesStart = !avStartStr || avStartStr <= dateStr;
        const matchesEnd = !avEndStr || avEndStr >= dateStr;

        return matchesDay && matchesStart && matchesEnd;
      });

      const specificRules = matchingRules.filter((av: any) => av.startDate || av.endDate);
      const generalRules = matchingRules.filter((av: any) => !av.startDate && !av.endDate);
      
      const activeRules = specificRules.length > 0 ? specificRules : generalRules;

      for (const av of activeRules) {
        const start = parseTime(av.startTime);
        const end = parseTime(av.endTime);
        if (start < end) timeWindows.push({ start, end });
      }
    }

    const availableSlots: string[] = [];
    
    for (const { start: windowStart, end: windowEnd } of timeWindows) {
      // On génère un créneau toutes les 30 minutes
      for (let m = windowStart; m + service.duration <= windowEnd; m += 30) {
        const s1 = m;
        const e1 = m + service.duration;
        
        // Vérifie si le créneau coupe un rendez-vous existant
        const conflictWithAppointment = appointments.some((a: any) => {
          const s2 = parseTime(a.startTime);
          const e2 = parseTime(a.endTime);
          return s1 < e2 && e1 > s2; // Condition mathématique de chevauchement
        });
        
        if (!conflictWithAppointment) {
          availableSlots.push(formatTime(m));
        }
      }
    }

    // On supprime les doublons (si deux règles se chevauchent) et on trie l'heure
    const uniqueSlots = [...new Set(availableSlots)].sort();
    
    return NextResponse.json({ slots: uniqueSlots });

  } catch (error) {
    console.error("Slots API error:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
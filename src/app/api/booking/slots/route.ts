import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function parseTime(t: string): number { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function formatTime(m: number): string { return `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`; }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");
    if (!dateStr || !serviceId) return NextResponse.json({ success: false, message: "Paramètres date et serviceId requis" }, { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return NextResponse.json({ success: false, message: "Format de date invalide" }, { status: 400 });

    const service = await prisma.service.findUnique({ where: { id: serviceId, active: true } });
    if (!service) return NextResponse.json({ success: false, message: "Service non trouvé" }, { status: 404 });

    const slots: { startTime: string; endTime: string; available: boolean }[] = [];
    for (let m = 540; m + service.duration <= 1140; m += 30) {
      slots.push({ startTime: formatTime(m), endTime: formatTime(m + service.duration), available: true });
    }

    const [y, mo, d] = dateStr.split("-").map(Number);
    const appointments = await prisma.appointment.findMany({
      where: { date: { gte: new Date(y, mo - 1, d), lte: new Date(y, mo - 1, d, 23, 59, 59, 999) }, status: { not: "CANCELLED" } },
    });

    for (const slot of slots) {
      if (appointments.some((a) => parseTime(slot.startTime) < parseTime(a.endTime) && parseTime(slot.endTime) > parseTime(a.startTime))) {
        slot.available = false;
      }
    }
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Slots API error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const STATUS_MAP: Record<string, "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"> = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const monthParam = searchParams.get("month"); // YYYY-MM

    const where: { status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; date?: { gte: Date; lte: Date } } = {};

    if (statusParam && STATUS_MAP[statusParam]) {
      where.status = STATUS_MAP[statusParam];
    }

    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split("-").map(Number);
      where.date = {
        gte: new Date(y, m - 1, 1),
        lte: new Date(y, m, 0, 23, 59, 59, 999),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        service: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Admin appointments GET error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body as { id: string; status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" };

    if (!id || !status || !STATUS_MAP[status]) {
      return NextResponse.json({ success: false, message: "id et status requis" }, { status: 400 });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        service: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("Admin appointments PATCH error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

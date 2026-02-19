import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startStr = searchParams.get("start"); // YYYY-MM-DD
    const endStr = searchParams.get("end"); // YYYY-MM-DD

    if (!startStr || !endStr || !/^\d{4}-\d{2}-\d{2}$/.test(startStr) || !/^\d{4}-\d{2}-\d{2}$/.test(endStr)) {
      return NextResponse.json(
        { success: false, message: "Paramètres start et end (YYYY-MM-DD) requis" },
        { status: 400 }
      );
    }

    const [sy, sm, sd] = startStr.split("-").map(Number);
    const [ey, em, ed] = endStr.split("-").map(Number);

    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        date: {
          gte: new Date(sy, sm - 1, sd),
          lte: new Date(ey, em - 1, ed, 23, 59, 59, 999),
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ blockedSlots });
  } catch (error) {
    console.error("Admin blocked-slots GET error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { date, startTime, endTime, reason } = body as {
      date: string;
      startTime: string;
      endTime: string;
      reason?: string;
    };

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "date, startTime et endTime requis" },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ success: false, message: "Format date invalide (YYYY-MM-DD)" }, { status: 400 });
    }

    const [y, m, d] = date.split("-").map(Number);
    const slot = await prisma.blockedSlot.create({
      data: {
        date: new Date(y, m - 1, d),
        startTime,
        endTime,
        reason: reason ?? null,
      },
    });

    return NextResponse.json({ blockedSlot: slot });
  } catch (error) {
    console.error("Admin blocked-slots POST error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Paramètre id requis" }, { status: 400 });
    }

    await prisma.blockedSlot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blocked-slots DELETE error:", error);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}

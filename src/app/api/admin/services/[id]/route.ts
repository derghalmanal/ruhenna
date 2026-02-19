import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json({ success: false, message: "Service introuvable" }, { status: 404 });
    }
    return NextResponse.json({
      service: {
        ...service,
        price: service.price.toString(),
      },
    });
  } catch (error) {
    console.error("Admin services GET [id] error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération du service" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, duration, price, image, active } = body;
    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (duration !== undefined) data.duration = Number(duration);
    if (price !== undefined) data.price = Number(price);
    if (image !== undefined) data.image = image;
    if (active !== undefined) data.active = active;
    const service = await prisma.service.update({
      where: { id },
      data,
    });
    return NextResponse.json({ service });
  } catch (error) {
    console.error("Admin services PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la mise à jour du service" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
    const { id } = await params;
    const pending = await prisma.appointment.count({
      where: {
        serviceId: id,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (pending > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Impossible de supprimer : ${pending} rendez-vous en attente ou confirmés sont liés à ce service.`,
        },
        { status: 400 },
      );
    }
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin services DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression du service" },
      { status: 500 },
    );
  }
}

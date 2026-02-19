import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Admin services GET error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des services" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }
    const body = await request.json();
    const { name, slug, description, duration, price, image, active } = body;
    if (!name || !slug || description == null || duration == null || price == null) {
      return NextResponse.json(
        { success: false, message: "name, slug, description, duration et price requis" },
        { status: 400 },
      );
    }
    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description: description ?? "",
        duration: Number(duration),
        price: Number(price),
        image: image ?? null,
        active: active ?? true,
      },
    });
    return NextResponse.json({ service });
  } catch (error) {
    console.error("Admin services POST error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la création du service" },
      { status: 500 },
    );
  }
}

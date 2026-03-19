/**
 * API admin — Services (collection).
 *
 * Routes :
 * - GET  /api/admin/services : lister les services
 * - POST /api/admin/services : créer un service
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
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
    const body = await request.json();
    const { name, slug, description, duration, price, image, active } = body;
    if (!name || !slug || description == null || duration == null || price == null) {
      return NextResponse.json(
        { success: false, message: "nom, slug, description, duree, prix requis" },
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

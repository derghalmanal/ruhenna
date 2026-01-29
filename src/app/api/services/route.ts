import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const services = await prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Services API error:", error);
    return NextResponse.json({ success: false, message: "Erreur lors de la récupération des services" }, { status: 500 });
  }
}

/**
 * API publique : formulaire de contact.
 *
 * Route : POST /api/contact
 * Rôle : valider le payload (Zod) et enregistrer le message en base (table ContactMessage).
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";

function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const data = parsed.data;
    await prisma.contactMessage.create({
      data: {
        senderName: data.senderName,
        email: data.email || null,
        phone: data.phone ?? "",
        subject: data.subject,
        message: data.message,
      },
    });
    return NextResponse.json(
      { success: true, message: "Message envoyé avec succès" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'envoi du message" },
      { status: 500 },
    );
  }
}

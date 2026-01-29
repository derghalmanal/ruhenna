import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    const { senderName, email, subject, message } = parsed.data;
    await prisma.contactMessage.create({ data: { senderName, email, subject, message } });
    return NextResponse.json({ success: true, message: "Message envoyé avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, message: "Erreur lors de l'envoi du message" }, { status: 500 });
  }
}

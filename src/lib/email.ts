import { Resend } from "resend";
import type { Order, OrderItem, Appointment, Service } from "@prisma/client";
import { prisma } from "@/lib/db";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY is not set - email sending will fail");
    return new Resend("re_placeholder");
  }
  return new Resend(key);
}

const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";

export async function sendOrderConfirmation(
  order: Order & { items: (OrderItem & { product: { name: string } })[] }
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: order.userId },
    });
    if (!user?.email) {
      return { success: false, error: "User email not found" };
    }

    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr><td>${item.product.name}</td><td>${item.quantity}</td><td>${Number(item.unitPrice).toFixed(2)} €</td></tr>`
      )
      .join("");

    const html = `
      <h1>Confirmation de commande</h1>
      <p>Bonjour,</p>
      <p>Votre commande <strong>#${order.orderNumber}</strong> a bien été enregistrée.</p>
      <h2>Récapitulatif</h2>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead><tr><th>Produit</th><th>Quantité</th><th>Prix unitaire</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>Total : ${Number(order.totalPrice).toFixed(2)} €</strong></p>
      ${order.shippingAddress ? `<p>Adresse de livraison : ${order.shippingAddress}</p>` : ""}
      <p>Merci pour votre confiance !</p>
    `;

    const { error } = await getResend().emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Confirmation de commande #${order.orderNumber}`,
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}

export async function sendBookingConfirmation(
  appointment: Appointment & { service: Service }
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: appointment.userId },
    });
    if (!user?.email) {
      return { success: false, error: "User email not found" };
    }

    const dateStr = new Date(appointment.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = `
      <h1>Confirmation de rendez-vous</h1>
      <p>Bonjour ${user.name ?? ""},</p>
      <p>Votre rendez-vous a bien été enregistré.</p>
      <h2>Détails</h2>
      <ul>
        <li><strong>Service :</strong> ${appointment.service.name}</li>
        <li><strong>Date :</strong> ${dateStr}</li>
        <li><strong>Heure :</strong> ${appointment.startTime} - ${appointment.endTime}</li>
      </ul>
      <p>Nous vous attendons !</p>
    `;

    const { error } = await getResend().emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Confirmation de rendez-vous - ${appointment.service.name}`,
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}

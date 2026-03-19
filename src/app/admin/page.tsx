/**
 * Admin — Tableau de bord (route `/admin`).
 *
 * Rôle : afficher des indicateurs (RDV, messages non lus, produits) et une liste
 * de prochains rendez-vous pour aider au suivi quotidien.
 */
import Link from "next/link";
import {
  LuCalendar,
  LuMessageSquare,
  LuPlus,
  LuPackage,
} from "react-icons/lu";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();

  const [upcomingAppointmentsCount, unreadMessagesCount, productsCount, upcomingAppointments] =
    await Promise.all([
      prisma.appointment.count({
        where: {
          date: { gte: now },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),
      prisma.contactMessage.count({
        where: {
          read: false,
          deletedAt: null,
          archivedAt: null,
        },
      }),
      prisma.product.count({ where: { active: true } }),
      prisma.appointment.findMany({
        where: {
          date: { gte: now },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        take: 5,
        orderBy: { date: "asc" },
        include: { service: true },
      }),
    ]);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold text-text">
        Tableau de bord
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-light">
                RDV à venir
              </p>
              <p className="mt-1 text-2xl font-bold text-text">
                {upcomingAppointmentsCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <LuCalendar className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-light">
                Messages non lus
              </p>
              <p className="mt-1 text-2xl font-bold text-text">
                {unreadMessagesCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <LuMessageSquare className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-light">
                Produits actifs
              </p>
              <p className="mt-1 text-2xl font-bold text-text">
                {productsCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <LuPackage className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-warm-dark/20 bg-white shadow-sm">
        <div className="border-b border-warm-dark/20 px-6 py-4">
          <h2 className="font-heading text-lg font-semibold text-text">
            Rendez-vous à venir
          </h2>
        </div>
        <div className="divide-y divide-warm-dark/10 p-4">
          {upcomingAppointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-light">
              Aucun rendez-vous à venir
            </p>
          ) : (
            upcomingAppointments.map((apt: any) => (
              <div
                key={apt.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-text">
                    {apt.clientName ?? apt.clientEmail ?? "—"}
                  </p>
                  <p className="text-sm text-text-light">
                    {apt.service?.name ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text">
                    {new Date(apt.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-text-light">
                    {apt.startTime} - {apt.endTime}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
        >
          <LuPlus className="h-4 w-4" />
          Ajouter un produit
        </Link>
        <Link
          href="/admin/rendez-vous"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
        >
          <LuCalendar className="h-4 w-4" />
          Gérer les rendez-vous
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  LuShoppingBag,
  LuEuro,
  LuCalendar,
  LuMessageSquare,
  LuPlus,
  LuBan,
} from "react-icons/lu";
import { prisma } from "@/lib/db";
import { startOfDay, startOfMonth } from "date-fns";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfToday = startOfDay(now);
  const startOfThisMonth = startOfMonth(now);

  const [ordersToday, revenueThisMonth, upcomingAppointmentsCount, unreadMessagesCount, recentOrders, upcomingAppointments] =
    await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.order.aggregate({
        where: {
          status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
          createdAt: { gte: startOfThisMonth },
        },
        _sum: { totalPrice: true },
      }),
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
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.appointment.findMany({
        where: {
          date: { gte: now },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        take: 5,
        orderBy: { date: "asc" },
        include: { service: true, user: true },
      }),
    ]);

  const revenue = Number(revenueThisMonth._sum.totalPrice ?? 0);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold text-text">
        Tableau de bord
      </h1>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-light">
                Commandes aujourd&apos;hui
              </p>
              <p className="mt-1 text-2xl font-bold text-text">{ordersToday}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <LuShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-light">
                Revenus du mois
              </p>
              <p className="mt-1 text-2xl font-bold text-text">
                {revenue.toFixed(2)} €
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <LuEuro className="h-6 w-6" />
            </div>
          </div>
        </div>
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
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-xl border border-warm-dark/20 bg-white shadow-sm">
          <div className="border-b border-warm-dark/20 px-6 py-4">
            <h2 className="font-heading text-lg font-semibold text-text">
              Commandes récentes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-dark/20 bg-warm/30">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-dark/10">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-text-light"
                    >
                      Aucune commande récente
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-warm/20">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text">
                        {order.orderNumber}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                        {order.user?.name ?? order.user?.email ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                        {Number(order.totalPrice).toFixed(2)} €
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-text-light">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming appointments */}
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
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-text">
                      {apt.user?.name ?? apt.user?.email ?? "—"}
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
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
        >
          <LuPlus className="h-4 w-4" />
          Ajouter un produit
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
        >
          <LuBan className="h-4 w-4" />
          Bloquer un créneau
        </button>
      </div>
    </div>
  );
}

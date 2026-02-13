"use client";

import Link from "next/link";
import {
  LuShoppingBag,
  LuEuro,
  LuCalendar,
  LuMessageSquare,
  LuPlus,
  LuBan,
} from "react-icons/lu";

const MOCK_ORDERS = [
  { numero: "CMD-001", client: "Marie D.", montant: "89,00 €", statut: "PAID", date: "28 fév. 2025" },
  { numero: "CMD-002", client: "Sophie L.", montant: "34,90 €", statut: "PENDING", date: "28 fév. 2025" },
  { numero: "CMD-003", client: "Claire M.", montant: "49,90 €", statut: "SHIPPED", date: "27 fév. 2025" },
  { numero: "CMD-004", client: "Julie B.", montant: "12,90 €", statut: "DELIVERED", date: "26 fév. 2025" },
  { numero: "CMD-005", client: "Anne T.", montant: "18,00 €", statut: "PAID", date: "26 fév. 2025" },
];

const MOCK_APPOINTMENTS = [
  { client: "Marie D.", service: "Henné mains complètes", date: "1 mars 2025", heure: "14h00" },
  { client: "Sophie L.", service: "Henné pieds", date: "2 mars 2025", heure: "10h30" },
  { client: "Claire M.", service: "Henné mariage", date: "3 mars 2025", heure: "16h00" },
];

export default function AdminDashboardPage() {
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
              <p className="mt-1 text-2xl font-bold text-text">0</p>
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
              <p className="mt-1 text-2xl font-bold text-text">0 EUR</p>
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
              <p className="mt-1 text-2xl font-bold text-text">0</p>
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
              <p className="mt-1 text-2xl font-bold text-text">0</p>
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
                {MOCK_ORDERS.map((order) => (
                  <tr key={order.numero} className="hover:bg-warm/20">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text">
                      {order.numero}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {order.client}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {order.montant}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/15 text-primary">
                        {order.statut}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text-light">
                      {order.date}
                    </td>
                  </tr>
                ))}
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
            {MOCK_APPOINTMENTS.map((apt, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-text">{apt.client}</p>
                  <p className="text-sm text-text-light">{apt.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text">{apt.date}</p>
                  <p className="text-sm text-text-light">{apt.heure}</p>
                </div>
              </div>
            ))}
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

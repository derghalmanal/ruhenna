"use client";

import { Fragment, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_ORDERS = [
  { id: 1, numero: "CMD-001", client: "Marie D.", articles: "Coffret Mariage Premium", montant: "89,00 €", statut: "PAID", date: "28 fév. 2025" },
  { id: 2, numero: "CMD-002", client: "Sophie L.", articles: "Set 6 Cônes Henné Noir", montant: "34,90 €", statut: "PENDING", date: "28 fév. 2025" },
  { id: 3, numero: "CMD-003", client: "Claire M.", articles: "Coffret Découverte, Huile de Soin", montant: "67,90 €", statut: "SHIPPED", date: "27 fév. 2025" },
  { id: 4, numero: "CMD-004", client: "Julie B.", articles: "Cône Henné Traditionnel", montant: "12,90 €", statut: "DELIVERED", date: "26 fév. 2025" },
  { id: 5, numero: "CMD-005", client: "Anne T.", articles: "Huile de Soin Post-Henné", montant: "18,00 €", statut: "CANCELLED", date: "25 fév. 2025" },
];

const STATUT_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUT_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export default function AdminCommandesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const filteredOrders = MOCK_ORDERS.filter((o) => {
    const matchStatut = statutFilter === "Tous" || o.statut === statutFilter;
    const matchSearch =
      !search ||
      o.numero.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-text">
        Gestion des Commandes
      </h1>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-warm-dark/20 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-warm-dark/40 bg-white py-2.5 pl-10 pr-4 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
          className="rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 font-medium text-text"
        >
          <option value="Tous">Tous les statuts</option>
          {Object.entries(STATUT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text"
          />
        </div>
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-xl border border-warm-dark/20 bg-white shadow-sm">
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
                  Articles
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
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-dark/10">
              {filteredOrders.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className="hover:bg-warm/20 cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === order.id ? null : order.id)
                    }
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text">
                      {order.numero}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {order.client}
                    </td>
                    <td className="px-6 py-4 text-sm text-text max-w-[200px] truncate">
                      {order.articles}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text">
                      {order.montant}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUT_COLORS[order.statut] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUT_LABELS[order.statut] ?? order.statut}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text-light">
                      {order.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-text hover:bg-warm/50"
                        aria-label="Détails"
                      >
                        {expandedId === order.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr className="bg-warm/10">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="rounded-lg border border-warm-dark/20 bg-white p-4">
                          <h3 className="font-heading font-semibold text-text mb-2">
                            Détail de la commande {order.numero}
                          </h3>
                          <p className="text-sm text-text-light">
                            Client: {order.client}
                          </p>
                          <p className="text-sm text-text-light">
                            Articles: {order.articles}
                          </p>
                          <p className="text-sm text-text-light">
                            Montant total: {order.montant}
                          </p>
                          <p className="text-sm text-text-light">
                            Date: {order.date}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

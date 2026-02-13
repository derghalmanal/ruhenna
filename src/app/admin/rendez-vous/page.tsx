"use client";

import { useState } from "react";
import { LuCalendar, LuList, LuBan, LuCheck, LuX } from "react-icons/lu";

const MOCK_APPOINTMENTS = [
  { id: 1, client: "Marie D.", service: "Henné mains complètes", date: "1 mars 2025", heure: "14h00", statut: "En attente" },
  { id: 2, client: "Sophie L.", service: "Henné pieds", date: "2 mars 2025", heure: "10h30", statut: "Confirmé" },
  { id: 3, client: "Claire M.", service: "Henné mariage", date: "3 mars 2025", heure: "16h00", statut: "En attente" },
  { id: 4, client: "Julie B.", service: "Henné mains", date: "5 mars 2025", heure: "11h00", statut: "Annulé" },
];

const BOOKED_DAYS = [1, 3, 5, 8, 12, 15, 18, 22, 25, 28];

const STATUT_FILTERS = ["Tous", "En attente", "Confirmés", "Annulés"];

export default function AdminRendezVousPage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [statutFilter, setStatutFilter] = useState("Tous");

  const filteredAppointments =
    statutFilter === "Tous"
      ? MOCK_APPOINTMENTS
      : MOCK_APPOINTMENTS.filter((a) => {
          if (statutFilter === "En attente") return a.statut === "En attente";
          if (statutFilter === "Confirmés") return a.statut === "Confirmé";
          if (statutFilter === "Annulés") return a.statut === "Annulé";
          return true;
        });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          Gestion des Rendez-vous
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex rounded-lg border border-warm-dark/40 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "calendar"
                  ? "bg-primary/15 text-primary"
                  : "text-text hover:bg-warm/50"
              }`}
            >
              <LuCalendar className="h-4 w-4" />
              Calendrier
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-primary/15 text-primary"
                  : "text-text hover:bg-warm/50"
              }`}
            >
              <LuList className="h-4 w-4" />
              Liste
            </button>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
          >
            <LuBan className="h-4 w-4" />
            Bloquer un créneau
          </button>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {STATUT_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatutFilter(s)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statutFilter === s
                ? "bg-primary/15 text-primary"
                : "border border-warm-dark/40 bg-white text-text hover:bg-warm/50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {viewMode === "calendar" ? (
        /* Calendar view - simple month grid */
        <div className="rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text">
            Mars 2025
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
              <div
                key={d}
                className="py-2 text-center text-xs font-medium text-text-light"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`flex aspect-square items-center justify-center rounded-lg text-sm font-medium ${
                  BOOKED_DAYS.includes(day)
                    ? "bg-primary/20 text-primary"
                    : "bg-warm/20 text-text-light"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List view */
        <div className="overflow-hidden rounded-xl border border-warm-dark/20 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-dark/20 bg-warm/30">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-dark/10">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-warm/20">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text">
                      {apt.client}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {apt.service}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {apt.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                      {apt.heure}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          apt.statut === "Confirmé"
                            ? "bg-green-100 text-green-700"
                            : apt.statut === "Annulé"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {apt.statut}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {apt.statut === "En attente" && (
                          <button
                            type="button"
                            className="rounded-lg p-2 text-green-600 hover:bg-green-100 transition-colors"
                            aria-label="Confirmer"
                          >
                            <LuCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-100 transition-colors"
                          aria-label="Annuler"
                        >
                          <LuX className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

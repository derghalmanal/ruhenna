"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LuCalendar,
  LuList,
  LuBan,
  LuCheck,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuUser,
} from "react-icons/lu";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  user: { id: string; name: string | null; email: string };
  service: { id: string; name: string };
}

interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
}

const STATUT_FILTERS = [
  { label: "Tous", value: "" },
  { label: "En attente", value: "PENDING" },
  { label: "Confirmés", value: "CONFIRMED" },
  { label: "Annulés", value: "CANCELLED" },
];

function toMonthParam(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getMonthRange(d: Date): { start: string; end: string } {
  const y = d.getFullYear();
  const m = d.getMonth();
  return {
    start: toDateStr(new Date(y, m, 1)),
    end: toDateStr(new Date(y, m + 1, 0)),
  };
}

export default function AdminRendezVousPage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [statutFilter, setStatutFilter] = useState("");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockForm, setBlockForm] = useState({
    date: toDateStr(new Date()),
    startTime: "09:00",
    endTime: "10:00",
    reason: "",
  });
  const [blockSubmitting, setBlockSubmitting] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statutFilter) params.set("status", statutFilter);
      if (viewMode === "calendar") {
        params.set("month", toMonthParam(currentDate));
      }
      const res = await fetch(`/api/admin/appointments?${params}`);
      const data = await res.json();
      if (data.appointments) setAppointments(data.appointments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statutFilter, viewMode, currentDate]);

  const fetchBlockedSlots = useCallback(async () => {
    const { start, end } = getMonthRange(currentDate);
    try {
      const res = await fetch(`/api/admin/blocked-slots?start=${start}&end=${end}`);
      const data = await res.json();
      if (data.blockedSlots) setBlockedSlots(data.blockedSlots);
    } catch (e) {
      console.error(e);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    fetchBlockedSlots();
  }, [fetchBlockedSlots]);

  useEffect(() => {
    if (viewMode === "calendar" && selectedDay === null) {
      setSelectedDay(currentDate.getDate());
    }
  }, [viewMode, currentDate]);

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const submitBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockSubmitting(true);
    try {
      const res = await fetch("/api/admin/blocked-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: blockForm.date,
          startTime: blockForm.startTime,
          endTime: blockForm.endTime,
          reason: blockForm.reason || undefined,
        }),
      });
      if (res.ok) {
        setIsBlockModalOpen(false);
        setBlockForm({ date: toDateStr(new Date()), startTime: "09:00", endTime: "10:00", reason: "" });
        fetchBlockedSlots();
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBlockSubmitting(false);
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const monthName = currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" });

  const selectedDayAppointments = appointments.filter((apt) => {
    const d = new Date(apt.date);
    return (
      selectedDay !== null &&
      d.getDate() === selectedDay &&
      d.getMonth() === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    );
  });

  const getDayAppointments = (day: number) =>
    appointments.filter((apt) => {
      const d = new Date(apt.date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });

  const getDayBlockedSlots = (day: number) =>
    blockedSlots.filter((bs) => {
      const d = new Date(bs.date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });

  const statusBadge = (status: AppointmentStatus) => {
    const map: Record<AppointmentStatus, { label: string; cls: string }> = {
      PENDING: { label: "En attente", cls: "bg-amber-100 text-amber-700" },
      CONFIRMED: { label: "Confirmé", cls: "bg-green-100 text-green-700" },
      CANCELLED: { label: "Annulé", cls: "bg-red-100 text-red-700" },
      COMPLETED: { label: "Terminé", cls: "bg-slate-100 text-slate-700" },
    };
    const { label, cls } = map[status];
    return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Gestion des Rendez-vous</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex rounded-lg border border-warm-dark/40 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "calendar" ? "bg-primary/15 text-primary" : "text-text hover:bg-warm/50"
              }`}
            >
              <LuCalendar className="h-4 w-4" />
              Calendrier
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "list" ? "bg-primary/15 text-primary" : "text-text hover:bg-warm/50"
              }`}
            >
              <LuList className="h-4 w-4" />
              Liste
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsBlockModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
          >
            <LuBan className="h-4 w-4" />
            Bloquer un créneau
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUT_FILTERS.map(({ label, value }) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => setStatutFilter(value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statutFilter === value ? "bg-primary/15 text-primary" : "border border-warm-dark/40 bg-white text-text hover:bg-warm/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {viewMode === "calendar" ? (
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-bold text-text capitalize">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
                  }
                  className="rounded-lg border border-warm-dark/40 p-2 hover:bg-warm/50 transition-colors"
                >
                  <LuChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
                  }
                  className="rounded-lg border border-warm-dark/40 p-2 hover:bg-warm/50 transition-colors"
                >
                  <LuChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-warm-dark/20 border border-warm-dark/20 rounded-lg overflow-hidden">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                <div
                  key={d}
                  className="bg-warm/30 py-3 text-center text-[10px] font-bold text-text-light uppercase tracking-widest"
                >
                  {d}
                </div>
              ))}

              {Array.from({ length: offset }).map((_, i) => (
                <div key={`pad-${i}`} className="min-h-[110px] bg-warm/5" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dayApts = getDayAppointments(day);
                const dayBlocked = getDayBlockedSlots(day);
                const hasAny = dayApts.length > 0 || dayBlocked.length > 0;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[110px] flex flex-col gap-1 border-t border-l border-warm-dark/5 bg-white p-2 text-left hover:bg-warm/20 transition-all ${
                      selectedDay === day ? "ring-2 ring-inset ring-primary bg-primary/5" : ""
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${selectedDay === day ? "text-primary" : "text-text-light"}`}
                    >
                      {day}
                    </span>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {dayApts.slice(0, 2).map((apt) => (
                        <div
                          key={apt.id}
                          className={`truncate rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            apt.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {apt.startTime} {apt.user.name || apt.user.email}
                        </div>
                      ))}
                      {dayBlocked.slice(0, 2).map((bs) => (
                        <div
                          key={bs.id}
                          className="truncate rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700"
                        >
                          {bs.startTime}-{bs.endTime} bloqué
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-warm-dark/20 bg-white shadow-sm flex flex-col h-fit">
            <div className="p-5 border-b border-warm-dark/10 bg-warm/5">
              <h3 className="font-heading font-bold text-text">
                {selectedDay !== null
                  ? `Détails du ${selectedDay} ${currentDate.toLocaleString("fr-FR", { month: "long" })}`
                  : "Sélectionnez un jour"}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {loading ? (
                <div className="text-center py-8 text-sm text-text-light">Chargement…</div>
              ) : selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="space-y-2 rounded-xl border border-warm-dark/10 border-l-4 border-l-primary bg-white p-3"
                  >
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                        {apt.startTime}
                      </span>
                      {statusBadge(apt.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-text">
                      <LuUser className="h-3 w-3" />
                      {apt.user.name || apt.user.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-light">
                      <LuClock className="h-3 w-3" />
                      {apt.service.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs italic opacity-40">
                  Aucun rendez-vous
                  {statutFilter ? ` (filtre actif)` : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-light">
                      Chargement…
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-warm/20">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text">
                        {apt.user.name || apt.user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                        {apt.service.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                        {new Date(apt.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-text">
                        {apt.startTime}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">{statusBadge(apt.status)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {apt.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(apt.id, "CONFIRMED")}
                              className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-100"
                              aria-label="Confirmer"
                            >
                              <LuCheck className="h-4 w-4" />
                            </button>
                          )}
                          {apt.status !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(apt.id, "CANCELLED")}
                              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
                              aria-label="Annuler"
                            >
                              <LuX className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isBlockModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-bg-dark/40 backdrop-blur-sm"
            onClick={() => !blockSubmitting && setIsBlockModalOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <h3 className="font-heading mb-4 text-xl font-bold text-text">Bloquer un créneau</h3>
            <form onSubmit={submitBlockSlot} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Date</label>
                <input
                  type="date"
                  required
                  value={blockForm.date}
                  onChange={(e) => setBlockForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Début</label>
                  <input
                    type="time"
                    required
                    value={blockForm.startTime}
                    onChange={(e) => setBlockForm((f) => ({ ...f, startTime: e.target.value }))}
                    className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Fin</label>
                  <input
                    type="time"
                    required
                    value={blockForm.endTime}
                    onChange={(e) => setBlockForm((f) => ({ ...f, endTime: e.target.value }))}
                    className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Raison (optionnel)</label>
                <input
                  type="text"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm((f) => ({ ...f, reason: e.target.value }))}
                  placeholder="Ex: Congés"
                  className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => !blockSubmitting && setIsBlockModalOpen(false)}
                  className="flex-1 rounded-lg border border-warm-dark/40 px-4 py-2 font-medium text-text"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={blockSubmitting}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-text-inverse disabled:opacity-50"
                >
                  {blockSubmitting ? "Envoi…" : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

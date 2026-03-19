"use client";

/**
 * Admin — Rendez-vous (planning).
 *
 * Rôle : visualiser les demandes, confirmer/annuler, et créer des rendez-vous.
 */
import { useState, useEffect, useCallback } from "react";
import {
  LuCheck,
  LuX,
  LuPlus,
  LuRefreshCw,
  LuPencil,
} from "react-icons/lu";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string | null;
  clientPhone: string | null;
  clientName: string | null;
  clientEmail: string | null;
  service: { id: string; name: string };
}

interface Service {
  id: string;
  name: string;
}

const STATUT_FILTERS = [
  { label: "Tout", value: "" },
  { label: "En attente", value: "PENDING" },
  { label: "Confirmés", value: "CONFIRMED" },
  { label: "Annulés", value: "CANCELLED" },
];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function AdminRendezVousPage() {
  const [statutFilter, setStatutFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    date: toDateStr(new Date()),
    startTime: "09:00",
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    date: "",
    startTime: "",
    notes: "",
    status: "PENDING" as AppointmentStatus,
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Récupération de tous les rendez-vous (sans filtre de mois)
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statutFilter) params.set("status", statutFilter);
      const res = await fetch(`/api/admin/rendez-vous?${params}`);
      const data = await res.json();
      if (data.appointments) setAppointments(data.appointments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statutFilter]);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.services) setServices(data.services);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch("/api/admin/rendez-vous", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const openEditModal = (apt: Appointment) => {
    setEditAppointment(apt);
    setEditForm({
      name: apt.clientName || "",
      email: apt.clientEmail || "",
      phone: apt.clientPhone || "",
      serviceId: apt.service.id,
      date: toDateStr(new Date(apt.date)),
      startTime: apt.startTime,
      notes: apt.notes || "",
      status: apt.status,
    });
  };

  const submitEditAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAppointment) return;
    setEditSubmitting(true);
    try {
      const payload = {
        id: editAppointment.id,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        serviceId: editForm.serviceId || undefined,
        date: editForm.date || undefined,
        startTime: editForm.startTime || undefined,
        notes: editForm.notes,
        status: editForm.status,
      };
      const res = await fetch("/api/admin/rendez-vous", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditAppointment(null);
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditSubmitting(false);
    }
  };

  const submitCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const res = await fetch("/api/admin/rendez-vous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          email: createForm.email,
          phone: createForm.phone || undefined,
          serviceId: createForm.serviceId,
          date: createForm.date,
          startTime: createForm.startTime,
        }),
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        setCreateForm({
          name: "",
          email: "",
          phone: "",
          serviceId: "",
          date: toDateStr(new Date()),
          startTime: "09:00",
        });
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const getClientName = (apt: Appointment) =>
    apt.clientName || apt.clientEmail || "—";

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

  const renderActions = (apt: Appointment) => (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => openEditModal(apt)}
        className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
        aria-label="Modifier"
      >
        <LuPencil className="h-4 w-4" />
      </button>
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
      {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
        <button
          type="button"
          onClick={() => updateStatus(apt.id, "CANCELLED")}
          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
          aria-label="Annuler"
        >
          <LuX className="h-4 w-4" />
        </button>
      )}
      {apt.status === "CANCELLED" && (
        <button
          type="button"
          onClick={() => updateStatus(apt.id, "PENDING")}
          className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
          aria-label="Restaurer"
        >
          <LuRefreshCw className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Gestion des Rendez-vous</h1>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
        >
          <LuPlus className="h-4 w-4" />
          Nouveau rendez-vous
        </button>
      </div>

      {/* Filtres par statut */}
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

      {/* Tableau des rendez-vous avec notes visibles */}
      <div className="overflow-hidden rounded-xl border border-warm-dark/20 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-dark/20 bg-warm/30">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Tél</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Heure</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Notes</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-dark/10">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-text-light">Chargement…</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-text-light">Aucun rendez-vous</td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-warm/20">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-text">{getClientName(apt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-text">{apt.clientEmail || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-text">{apt.clientPhone || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-text">{apt.service.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-text">{new Date(apt.date).toLocaleDateString("fr-FR")}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-text">{apt.startTime}</td>
                    <td className="whitespace-nowrap px-4 py-3">{statusBadge(apt.status)}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-sm text-text-light" title={apt.notes ?? ""}>
                      {apt.notes || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">{renderActions(apt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale de création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-bg-dark/40 backdrop-blur-sm" onClick={() => !createSubmitting && setIsCreateModalOpen(false)} aria-hidden />
          <div className="relative w-full max-w-md rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <h3 className="font-heading mb-4 text-xl font-bold text-text">Nouveau rendez-vous</h3>
            <form onSubmit={submitCreateAppointment} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Nom</label>
                <input type="text" value={createForm.name} onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Email</label>
                <input type="email" value={createForm.email} onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Téléphone</label>
                <input type="tel" value={createForm.phone} onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Service</label>
                <select value={createForm.serviceId} onChange={(e) => setCreateForm((f) => ({ ...f, serviceId: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Sélectionner un service</option>
                  {services.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Date</label>
                <input type="date" value={createForm.date} onChange={(e) => setCreateForm((f) => ({ ...f, date: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Heure de début</label>
                <input type="time" value={createForm.startTime} onChange={(e) => setCreateForm((f) => ({ ...f, startTime: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => !createSubmitting && setIsCreateModalOpen(false)} className="flex-1 rounded-lg border border-warm-dark/40 px-4 py-2 font-medium text-text">Annuler</button>
                <button type="submit" disabled={createSubmitting} className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-text-inverse disabled:opacity-50">{createSubmitting ? "Envoi…" : "Créer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de modification */}
      {editAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-bg-dark/40 backdrop-blur-sm" onClick={() => !editSubmitting && setEditAppointment(null)} aria-hidden />
          <div className="relative w-full max-w-lg rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <h3 className="font-heading mb-4 text-xl font-bold text-text">Modifier le rendez-vous</h3>
            <form onSubmit={submitEditAppointment} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Nom</label>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Téléphone</label>
                  <input type="tel" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Service</label>
                  <select value={editForm.serviceId} onChange={(e) => setEditForm((f) => ({ ...f, serviceId: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Sélectionner un service</option>
                    {services.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Statut</label>
                  <select value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as AppointmentStatus }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="PENDING">En attente</option>
                    <option value="CONFIRMED">Confirmé</option>
                    <option value="CANCELLED">Annulé</option>
                    <option value="COMPLETED">Terminé</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Date</label>
                  <input type="date" value={editForm.date} onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Heure</label>
                  <input type="time" value={editForm.startTime} onChange={(e) => setEditForm((f) => ({ ...f, startTime: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Notes</label>
                <textarea rows={3} value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} className="w-full rounded-lg border border-warm-dark/40 px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => !editSubmitting && setEditAppointment(null)} className="flex-1 rounded-lg border border-warm-dark/40 px-4 py-2 font-medium text-text">Annuler</button>
                <button type="submit" disabled={editSubmitting} className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-text-inverse disabled:opacity-50">{editSubmitting ? "Enregistrement…" : "Enregistrer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

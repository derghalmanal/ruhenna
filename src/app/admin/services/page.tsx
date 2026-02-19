"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuClock,
  LuEuro,
  LuAlertCircle,
} from "react-icons/lu";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  price: string;
  image: string | null;
  active: boolean;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (res.ok) setServices(data.services ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setServiceToDelete(null);
        fetchServices();
      } else {
        setDeleteError(data.message ?? "Erreur lors de la suppression.");
      }
    } catch (e) {
      console.error(e);
      setDeleteError("Erreur réseau.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          Gestion des Services
        </h1>
        <Link
          href="/admin/services/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-text-inverse shadow-md transition-all hover:bg-primary-light active:scale-95"
        >
          <LuPlus className="h-4 w-4" />
          Ajouter un service
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-light">Chargement…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.length === 0 ? (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-warm-dark/20 bg-warm/5 py-20 text-center">
              <p className="text-text-light italic">
                Aucun service configuré pour le moment.
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="group rounded-2xl border border-warm-dark/20 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-heading font-bold text-text transition-colors group-hover:text-primary">
                    {service.name}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      service.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {service.active ? "Actif" : "Inactif"}
                  </span>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-light">
                    <LuClock className="h-4 w-4 text-primary" />
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-light">
                    <LuEuro className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-text">
                      {service.price} €
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-warm-dark/10 pt-4">
                  <Link
                    href={`/admin/services/modifier/${service.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-warm-dark/20 py-2 text-sm font-medium text-text-light transition-colors hover:bg-warm/50"
                  >
                    <LuPencil className="h-3.5 w-3.5" /> Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => setServiceToDelete(service)}
                    className="rounded-lg border border-red-100 p-2 text-red-500 transition-colors hover:bg-red-50"
                    title="Supprimer le service"
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-bg-dark/40 backdrop-blur-sm"
            onClick={() => {
              setServiceToDelete(null);
              setDeleteError(null);
            }}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-warm-dark/20 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <LuAlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <h3 className="text-center font-heading text-lg font-bold text-text">
              Supprimer le service ?
            </h3>
            <p className="mt-2 text-center text-sm text-text-light">
              Attention, cela pourrait impacter les réservations en cours liées
              à ce service.
            </p>
            {deleteError && (
              <p className="mt-2 text-center text-sm text-red-600">
                {deleteError}
              </p>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setServiceToDelete(null);
                  setDeleteError(null);
                }}
                className="flex-1 rounded-xl border border-warm-dark/20 px-4 py-2 font-medium text-text transition-colors hover:bg-warm/50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

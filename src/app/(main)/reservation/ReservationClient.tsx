"use client";

/**
 * Formulaire de réservation (client).
 *
 * Rôle : guider l’utilisateur en plusieurs étapes et communiquer avec :
 * - GET `/api/rendez-vous/slots` (charger les créneaux)
 * - POST `/api/rendez-vous` (envoyer une demande)
 */
import { useState, useCallback, useEffect } from "react";
import { LuChevronLeft, LuChevronRight, LuCheck } from "react-icons/lu";

type ServiceAvailability = {
  dayOfWeek: number | null;
  startDate: string | null;
  endDate: string | null;
  startTime: string;
  endTime: string;
};

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  availabilities: ServiceAvailability[];
};

const STEPS = ["Service", "Date", "Horaire", "Informations", "Récapitulatif"];

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (number | null)[] = [];
  const startOffset = first.getDay() === 0 ? 6 : first.getDay() - 1;
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const FRENCH_PHONE_REGEX = /^(?:(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4})$/;

export default function ReservationClient({ services }: { services: Service[] }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [telephoneError, setTelephoneError] = useState<string | null>(null);
  const [ville, setVille] = useState("");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const today = new Date();
  const isCurrentDay = (d: number) =>
    today.getDate() === d &&
    today.getMonth() === calendarMonth &&
    today.getFullYear() === calendarYear;
  const isSelected = (d: number) =>
    selectedDate?.getDate() === d &&
    selectedDate?.getMonth() === calendarMonth &&
    selectedDate?.getFullYear() === calendarYear;

  const days = getDaysInMonth(calendarYear, calendarMonth);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else setCalendarMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else setCalendarMonth((m) => m + 1);
  };

  const fetchSlots = useCallback(async () => {
    if (!selectedDate || !selectedService) return;
    setSlotsLoading(true);
    setSlots([]);
    setSelectedTime(null);
    try {
      const dateStr = formatDate(selectedDate);
      const res = await fetch(
        `/api/rendez-vous/slots?date=${dateStr}&serviceId=${encodeURIComponent(selectedService)}`
      );
      const data = await res.json();
      if (data.slots) setSlots(data.slots);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [selectedDate, selectedService]);

  const service = services.find((s) => s.id === selectedService);

  const isDateAvailableForService = useCallback(
    (date: Date) => {
      const day = stripTime(date);
      const todayDay = stripTime(new Date());
      if (day < todayDay) return false;

      if (!service || !service.availabilities || service.availabilities.length === 0) {
        return true;
      }

      return service.availabilities.some((av) => {
        if (av.dayOfWeek != null && av.dayOfWeek !== day.getDay()) return false;

        if (av.startDate) {
          const [y, m, d] = av.startDate.split("-").map(Number);
          const start = new Date(y, m - 1, d);
          if (day < start) return false;
        }
        if (av.endDate) {
          const [y, m, d] = av.endDate.split("-").map(Number);
          const end = new Date(y, m - 1, d);
          if (day > end) return false;
        }
        return true;
      });
    },
    [service],
  );

  useEffect(() => {
    if (!selectedDate) return;
    if (!isDateAvailableForService(selectedDate)) {
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [selectedDate, isDateAvailableForService]);

  const handlePhoneChange = (value: string) => {
    setTelephone(value);
    if (value && !FRENCH_PHONE_REGEX.test(value)) {
      setTelephoneError("Format attendu : 06 12 34 56 78 ou +33 6 12 34 56 78");
    } else {
      setTelephoneError(null);
    }
  };

  const handleConfirm = async () => {
    if (!service || !selectedDate || !selectedTime) return;

    // Validation finale du téléphone
    if (telephone && !FRENCH_PHONE_REGEX.test(telephone)) {
      setConfirmError("Veuillez corriger le numéro de téléphone avant de confirmer.");
      return;
    }

    setConfirming(true);
    setConfirmError(null);
    try {
      const res = await fetch("/api/rendez-vous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          date: formatDate(selectedDate),
          startTime: selectedTime,
          name: `${prenom} ${nom}`.trim(),
          email,
          phone: telephone || undefined,
          city: ville || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else if (data.errors) {
        // Affichage des erreurs de validation serveur
        const msgs = Object.entries(data.errors)
          .map(([, v]) => (Array.isArray(v) ? v.join(", ") : v))
          .join(" — ");
        setConfirmError(msgs);
      } else {
        setConfirmError(data.message ?? "Une erreur est survenue.");
      }
    } catch {
      setConfirmError("Une erreur est survenue.");
    } finally {
      setConfirming(false);
    }
  };

  const goToStep = (next: number) => {
    setStep(next);
    if (next === 3 && selectedDate && selectedService) fetchSlots();
  };

  if (success) {
    return (
      <main>
        <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
          <div className="container-narrow">
            <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-text md:text-5xl">
              Demande envoyée
            </h1>
          </div>
        </section>
        <section className="section-padding bg-bg">
          <div className="container-narrow max-w-2xl text-center">
            <div className="glass-card p-8">
              <LuCheck className="mx-auto h-16 w-16 text-primary" />
              <p className="mt-4 text-lg font-medium text-text">
                Votre demande de rendez-vous a bien été reçue.
              </p>
              <p className="mt-2 text-text-light">
                Nous vous recontacterons prochainement pour confirmer le rendez-vous.
              </p>
              <div className="mt-6 rounded-xl bg-warm/30 p-4 text-sm text-text-light">
                <p>
                  <span className="font-medium text-text">Prestation :</span>{" "}
                  {service?.name}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-text">Date souhaitée :</span>{" "}
                  {selectedDate?.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-text">Horaire :</span>{" "}
                  {selectedTime}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow">
          <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-text md:text-5xl">
            Réservation
          </h1>
          <p className="mt-4 text-center text-lg text-text-light">
            Choisissez votre prestation et réservez en quelques clics.
          </p>

          {/* Mention zone d'intervention */}
          <p className="mt-2 text-center text-sm text-text-light">
            Basée à <strong>Drancy (93)</strong>, je me déplace dans toute l&apos;Île-de-France.
            Des frais de déplacement peuvent s&apos;appliquer selon la distance.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium ${
                  step === i + 1
                    ? "bg-primary text-text-inverse"
                    : step > i + 1
                      ? "bg-primary/20 text-primary"
                      : "bg-warm-dark/40 text-text-light"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow max-w-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Choisissez votre prestation
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(s.id)}
                    className={`glass-card flex flex-col items-center p-6 text-left transition-all ${
                      selectedService === s.id
                        ? "border-2 border-primary bg-primary/10 ring-2 ring-primary shadow-md"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <h3 className="font-heading font-semibold text-text">{s.name}</h3>
                    <p className="mt-1 text-sm text-text-light">{s.duration} min</p>
                    <p className="mt-2 font-bold text-primary">{s.price} €</p>
                    <p className="mt-1 text-xs text-text-light line-clamp-2">{s.description}</p>
                    {selectedService === s.id && (
                      <span className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                        <LuCheck className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Choisissez une date
              </h2>
              <div className="glass-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="rounded-full p-2 text-text-light transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <LuChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="font-semibold text-text">
                    {MONTHS[calendarMonth]} {calendarYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="rounded-full p-2 text-text-light transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <LuChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                    <div key={d} className="font-medium text-text-light">
                      {d}
                    </div>
                  ))}
                  {days.map((d, i) => {
                    if (!d) {
                      return (
                        <button key={i} type="button" disabled className="invisible rounded-lg py-2 text-sm">
                          {d ?? ""}
                        </button>
                      );
                    }

                    const candidate = new Date(calendarYear, calendarMonth, d);
                    const isDisabled = !isDateAvailableForService(candidate);

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedDate(candidate)}
                        className={`rounded-lg py-2 text-sm ${
                          isDisabled
                            ? "bg-gray-100 text-gray-400 line-through"
                            : isSelected(d)
                              ? "bg-primary text-text-inverse"
                              : isCurrentDay(d)
                                ? "ring-2 ring-primary text-primary"
                                : "text-text hover:bg-primary/10"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Choisissez un créneau
              </h2>
              {slotsLoading ? (
                <p className="text-text-light">Chargement des créneaux...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.length === 0 && !slotsLoading ? (
                    <p className="text-text-light">
                      Aucun créneau disponible pour cette date.
                    </p>
                  ) : (
                    slots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`rounded-xl px-4 py-2 font-medium transition-all ${
                          selectedTime === t
                            ? "bg-primary text-text-inverse"
                            : "glass-card hover:shadow-md"
                        }`}
                      >
                        {t}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Vos informations
              </h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nom" className="mb-2 block font-medium text-text">
                      Nom
                    </label>
                    <input
                      id="nom"
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="prenom" className="mb-2 block font-medium text-text">
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      required
                      className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block font-medium text-text">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="telephone" className="mb-2 block font-medium text-text">
                    Téléphone
                  </label>
                  <input
                    id="telephone"
                    type="tel"
                    value={telephone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-text focus:outline-none focus:ring-2 ${
                      telephoneError
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-warm-dark/40 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {telephoneError && (
                    <p className="mt-1 text-sm text-red-600">{telephoneError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="ville" className="mb-2 block font-medium text-text">
                    Ville
                  </label>
                  <input
                    id="ville"
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    placeholder="Ex : Drancy, Paris, Bobigny…"
                    className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="mt-1 text-xs text-text-light">
                    Basée à Drancy (93). Déplacements en Île-de-France possibles (frais supplémentaires selon distance).
                  </p>
                </div>
                <div>
                  <label htmlFor="notes" className="mb-2 block font-medium text-text">
                    Informations complémentaires
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </form>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Récapitulatif
              </h2>
              <div className="glass-card space-y-4 p-6">
                <p>
                  <span className="font-medium text-text-light">Prestation :</span>{" "}
                  {service?.name} ({service?.duration} min – {service?.price} €)
                </p>
                <p>
                  <span className="font-medium text-text-light">Date :</span>{" "}
                  {selectedDate?.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <span className="font-medium text-text-light">Horaire :</span>{" "}
                  {selectedTime}
                </p>
                <p>
                  <span className="font-medium text-text-light">Client :</span>{" "}
                  {prenom} {nom}
                </p>
                <p>
                  <span className="font-medium text-text-light">Email :</span> {email}
                </p>
                <p>
                  <span className="font-medium text-text-light">Téléphone :</span>{" "}
                  {telephone || "—"}
                </p>
                <p>
                  <span className="font-medium text-text-light">Ville :</span>{" "}
                  {ville || "—"}
                </p>
                {notes && (
                  <p>
                    <span className="font-medium text-text-light">Notes :</span>{" "}
                    {notes}
                  </p>
                )}
                {confirmError && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{confirmError}</p>
                )}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="mt-6 w-full rounded-full bg-primary px-6 py-4 font-semibold text-text-inverse transition-all hover:bg-primary-light hover:shadow-lg disabled:opacity-50"
                >
                  {confirming ? "Confirmation..." : "Confirmer"}
                </button>
              </div>
            </div>
          )}

          {step < 5 && (
            <div className="mt-10 flex justify-between">
              <button
                type="button"
                onClick={() => goToStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary transition-colors disabled:opacity-50"
              >
                <LuChevronLeft className="h-5 w-5" />
                Retour
              </button>
              <button
                type="button"
                onClick={() => goToStep(Math.min(5, step + 1))}
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && !selectedDate) ||
                  (step === 3 && !selectedTime) ||
                  (step === 4 && (
                    !prenom.trim() || 
                    !!telephoneError
                  ))
                }
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-text-inverse transition-all hover:bg-primary-light disabled:opacity-50"
              >
                Suivant
                <LuChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuCheck } from "react-icons/lu";

const SERVICES = [
  { id: "henne-mariee", name: "Henné Mariée", duration: "90 min", price: 120 },
  { id: "henne-evenement", name: "Henné Événement", duration: "60 min", price: 80 },
  { id: "atelier-henne", name: "Atelier Henné", duration: "30 min", price: 40 },
] as const;

const STEPS = ["Service", "Date", "Horaire", "Informations", "Récapitulatif"];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

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

export default function ReservationPage() {
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
  const [notes, setNotes] = useState("");

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

  const service = SERVICES.find((s) => s.id === selectedService);

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

          {/* Step indicator */}
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
                {step > i + 1 && <LuCheck className="h-4 w-4" />}
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow max-w-2xl">
          {/* Step 1: Services */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Choisissez votre prestation
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(s.id)}
                    className={`glass-card flex flex-col items-center p-6 text-left transition-all ${
                      selectedService === s.id
                        ? "ring-2 ring-primary"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <h3 className="font-heading font-semibold text-text">{s.name}</h3>
                    <p className="mt-1 text-sm text-text-light">{s.duration}</p>
                    <p className="mt-2 font-bold text-primary">{s.price} €</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Calendar */}
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
                  {days.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={!d}
                      onClick={() =>
                        d && setSelectedDate(new Date(calendarYear, calendarMonth, d))
                      }
                      className={`rounded-lg py-2 text-sm ${
                        !d
                          ? "invisible"
                          : isSelected(d)
                            ? "bg-primary text-text-inverse"
                            : isCurrentDay(d)
                              ? "ring-2 ring-primary text-primary"
                              : "text-text hover:bg-primary/10"
                      }`}
                    >
                      {d ?? ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Time slots */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Choisissez un créneau
              </h2>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
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
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Form */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Vos informations
              </h2>
              <form className="space-y-4">
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
                    onChange={(e) => setTelephone(e.target.value)}
                    required
                    className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="mb-2 block font-medium text-text">
                    Notes <span className="text-text-light">(optionnel)</span>
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

          {/* Step 5: Summary */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-text">
                Récapitulatif
              </h2>
              <div className="glass-card space-y-4 p-6">
                <p>
                  <span className="font-medium text-text-light">Prestation :</span>{" "}
                  {service?.name} ({service?.duration} – {service?.price} €)
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
                  {telephone}
                </p>
                {notes && (
                  <p>
                    <span className="font-medium text-text-light">Notes :</span>{" "}
                    {notes}
                  </p>
                )}
                <button
                  type="button"
                  className="mt-6 w-full rounded-full bg-primary px-6 py-4 font-semibold text-text-inverse transition-all hover:bg-primary-light hover:shadow-lg"
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 5 && (
            <div className="mt-10 flex justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary transition-colors disabled:opacity-50"
              >
                <LuChevronLeft className="h-5 w-5" />
                Retour
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && !selectedDate) ||
                  (step === 3 && !selectedTime)
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

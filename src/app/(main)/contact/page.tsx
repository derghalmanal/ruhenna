"use client";

/**
 * Page Contact (route `/contact`).
 *
 * Rôle : afficher un formulaire et envoyer les données à l’API POST `/api/contact`.
 */
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiSend, FiPhone, FiMail } from "react-icons/fi";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
import { siteConfig } from "@/lib/env";

const OBJETS = [
  "Demande d'information",
  "Réservation",
  "Devis",
  "Autre",
] as const;

function ContactForm() {
  const searchParams = useSearchParams();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [objet, setObjet] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const objetParam = searchParams.get("objet");
    if (objetParam === "devis") setObjet("Devis");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: `${prenom} ${nom}`.trim(),
          email,
          phone: telephone || undefined,
          subject: objet,
          message,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        if (data.errors) {
          setErrors(data.errors as Record<string, string>);
        } else {
          setErrors({ form: data.message ?? "Une erreur est survenue." });
        }
      }
    } catch {
      setErrors({ form: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow">
          <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-text md:text-5xl">
            Contact
          </h1>
          <p className="mt-4 text-center text-lg text-text-light">
            Une question ? N&apos;hésitez pas à nous contacter.
          </p>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="glass-card p-8">
              {submitted ? (
                <div className="py-12 text-center">
                  <p className="text-lg font-medium text-text">
                    Merci ! Votre message a bien été envoyé.
                  </p>
                  <p className="mt-2 text-text-light">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.form && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {errors.form}
                    </p>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2">
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
                      {errors.senderName && (
                        <p className="mt-1 text-sm text-red-600">{errors.senderName}</p>
                      )}
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
                      Email <span className="text-text-light">(facultatif)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
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
                      placeholder="06 12 34 56 78"
                      className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="objet" className="mb-2 block font-medium text-text">
                      Objet
                    </label>
                    <select
                      id="objet"
                      value={objet}
                      onChange={(e) => setObjet(e.target.value)}
                      required
                      className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Sélectionnez un objet</option>
                      {OBJETS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block font-medium text-text">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full rounded-xl border border-warm-dark/40 bg-white px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-text-inverse transition-all hover:bg-primary-light hover:shadow-lg disabled:opacity-50"
                  >
                    Envoyer
                    <FiSend className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="glass-card p-8">
                <h2 className="font-heading mb-6 text-xl font-semibold text-text">
                  Mes coordonnées
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <FiPhone className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium text-text">Appel :</span>
                    <a
                      href={`tel:${siteConfig.contactPhone?.replace(/\s/g, "")}`}
                      className="text-text-light transition-colors hover:text-primary"
                    >
                      {siteConfig.contactPhone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <FiMail className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium text-text">Email :</span>
                    <a
                      href={`mailto:${siteConfig.contactEmail}`}
                      className="text-text-light transition-colors hover:text-primary"
                    >
                      {siteConfig.contactEmail}
                    </a>
                  </li>
                </ul>

                <div className="mt-8 flex gap-4">
                  {siteConfig.socialInstagram && (
                    <a
                      href={siteConfig.socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full p-2 text-text-light transition-colors hover:bg-primary/10 hover:text-primary"
                      aria-label="Instagram"
                    >
                      <SiInstagram className="h-6 w-6" />
                    </a>
                  )}
                  {siteConfig.socialTiktok && (
                    <a
                      href={siteConfig.socialTiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full p-2 text-text-light transition-colors hover:bg-primary/10 hover:text-primary"
                      aria-label="TikTok"
                    >
                      <SiTiktok className="h-6 w-6" />
                    </a>
                  )}
                  {siteConfig.socialWhatsapp && (
                    <a
                      href={siteConfig.socialWhatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full p-2 text-text-light transition-colors hover:bg-primary/10 hover:text-primary"
                      aria-label="WhatsApp"
                    >
                      <SiWhatsapp className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <main className="section-padding">
          <div className="container-narrow text-center text-text-light">
            Chargement...
          </div>
        </main>
      }
    >
      <ContactForm />
    </Suspense>
  );
}

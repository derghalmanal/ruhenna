"use client";

import { useState } from "react";
import { Mail, Archive, Check } from "lucide-react";

const MOCK_MESSAGES = [
  { id: 1, sender: "Marie D.", subject: "Question sur le henné pour mariage", date: "28 fév. 2025, 14h30", read: false, content: "Bonjour, je souhaiterais avoir des informations sur vos prestations henné pour un mariage prévu en juin. Pourriez-vous me recontacter ? Merci." },
  { id: 2, sender: "Sophie L.", subject: "Demande de devis", date: "27 fév. 2025, 10h15", read: true, content: "Bonjour, je recherche un devis pour une prestation henné mains et pieds pour environ 20 personnes. Merci de me tenir informée." },
  { id: 3, sender: "Claire M.", subject: "Réservation confirmée", date: "26 fév. 2025, 16h45", read: true, content: "Merci pour la confirmation de mon rendez-vous du 3 mars. Je confirme ma présence à 16h00." },
  { id: 4, sender: "Julie B.", subject: "Produits disponibles ?", date: "25 fév. 2025, 09h00", read: false, content: "Bonjour, le Coffret Découverte Henné sera-t-il à nouveau disponible prochainement ?" },
];

export default function AdminMessagesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [archivedIds, setArchivedIds] = useState<Set<number>>(new Set());

  const visibleMessages = MOCK_MESSAGES.filter((m) => !archivedIds.has(m.id));
  const selectedMessage = MOCK_MESSAGES.find((m) => m.id === selectedId);
  const unreadCount = MOCK_MESSAGES.filter((m) => !m.read && !archivedIds.has(m.id)).length;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-text">Messages</h1>
      <div className="flex gap-4 rounded-xl border border-warm-dark/20 bg-white shadow-sm overflow-hidden min-h-[400px]">
        <div className="w-full md:w-96 border-r border-warm-dark/20 flex flex-col">
          <div className="border-b border-warm-dark/20 p-4 flex items-center justify-between">
            <span className="font-medium text-text">Boîte de réception</span>
            {unreadCount > 0 && (<span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-text-inverse">{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</span>)}
          </div>
          <div className="flex-1 overflow-y-auto">
            {visibleMessages.map((msg) => (
              <button key={msg.id} type="button" onClick={() => setSelectedId(msg.id)} className={`w-full flex flex-col gap-1 p-4 text-left border-b border-warm-dark/10 transition-colors hover:bg-warm/30 ${selectedId === msg.id ? "bg-primary/10" : ""} ${!msg.read ? "bg-warm/20" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-text truncate">{msg.sender}</span>
                  {!msg.read && (<span className="h-2 w-2 shrink-0 rounded-full bg-primary" />)}
                </div>
                <span className="text-sm text-text-light truncate">{msg.subject}</span>
                <span className="text-xs text-text-light">{msg.date}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          {selectedMessage ? (
            <>
              <div className="border-b border-warm-dark/20 p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-heading font-semibold text-text">{selectedMessage.subject}</h2>
                  <p className="text-sm text-text-light">De {selectedMessage.sender} • {selectedMessage.date}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-3 py-2 text-sm font-medium text-text hover:bg-warm/50 transition-colors">
                    <Check className="h-4 w-4" />Marquer comme lu
                  </button>
                  <button type="button" onClick={() => setArchivedIds((prev) => new Set(prev).add(selectedMessage.id))} className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-3 py-2 text-sm font-medium text-text hover:bg-warm/50 transition-colors">
                    <Archive className="h-4 w-4" />Archiver
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-text whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-light p-8">
              <Mail className="h-16 w-16 mb-4 opacity-50" />
              <p>Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

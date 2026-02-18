"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LuMail,
  LuArchive,
  LuCheck,
  LuTrash2,
  LuUser,
  LuReply,
  LuInbox,
  LuX,
} from "react-icons/lu";

type Message = {
  id: string;
  senderName: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  archivedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
};

type View = "inbox" | "archive";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<View>("inbox");
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/messages?view=${view}`);
    if (res.ok) {
      const { messages: data } = await res.json();
      setMessages(data);
      if (selectedId && !data.find((m: Message) => m.id === selectedId)) {
        setSelectedId(data[0]?.id ?? null);
      } else if (!selectedId && data.length > 0) {
        setSelectedId(data[0].id);
      }
    }
    setLoading(false);
  }, [view]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const selectedMessage = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.read).length;

  const patchMessage = async (id: string, body: { read?: boolean; archive?: boolean }) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const { message } = await res.json();
      setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
    }
  };

  const handleSelect = (msg: Message) => {
    setSelectedId(msg.id);
    if (!msg.read) patchMessage(msg.id, { read: true });
  };

  const handleMarkRead = () => {
    if (selectedMessage) {
      patchMessage(selectedMessage.id, { read: !selectedMessage.read });
    }
  };

  const handleArchive = () => {
    if (selectedMessage) {
      patchMessage(selectedMessage.id, { archive: true });
      setSelectedId(null);
      fetchMessages();
    }
  };

  const handleRestore = () => {
    if (selectedMessage) {
      patchMessage(selectedMessage.id, { archive: false });
      setSelectedId(null);
      fetchMessages();
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    const res = await fetch(`/api/admin/messages/${messageToDelete.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessageToDelete(null);
      setSelectedId((id) => (id === messageToDelete.id ? null : id));
      fetchMessages();
    }
  };

  const handleReply = () => {
    if (!selectedMessage) return;
    const subject = encodeURIComponent(`Re: ${selectedMessage.subject}`);
    const mailto = `mailto:${selectedMessage.email}?subject=${subject}`;
    window.location.href = mailto;
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-text">Messages</h1>
      <div className="flex gap-4 rounded-xl border border-warm-dark/20 bg-white shadow-sm overflow-hidden min-h-[400px]">
        <div className="w-full md:w-96 border-r border-warm-dark/20 flex flex-col">
          <div className="border-b border-warm-dark/20 p-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("inbox")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === "inbox" ? "bg-primary/20 text-primary" : "text-text hover:bg-warm/50"}`}
            >
              <LuInbox className="h-4 w-4" /> Boîte de réception
            </button>
            <button
              type="button"
              onClick={() => setView("archive")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === "archive" ? "bg-primary/20 text-primary" : "text-text hover:bg-warm/50"}`}
            >
              <LuArchive className="h-4 w-4" /> Archives
            </button>
          </div>
          {view === "inbox" && unreadCount > 0 && (
            <div className="px-4 pb-2">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-text-inverse">
                {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-text-light">Chargement...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-text-light">Aucun message</div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => handleSelect(msg)}
                  className={`w-full flex flex-col gap-1 p-4 text-left border-b border-warm-dark/10 transition-colors hover:bg-warm/30 ${selectedId === msg.id ? "bg-primary/10" : ""} ${!msg.read ? "bg-warm/20 border-l-4 border-l-primary" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-text truncate">{msg.senderName}</span>
                    {!msg.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <span className="text-sm text-text-light truncate">{msg.subject}</span>
                  <span className="text-xs text-text-light">{formatDate(msg.createdAt)}</span>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          {selectedMessage ? (
            <>
              <div className="border-b border-warm-dark/20 p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-heading font-semibold text-text">{selectedMessage.subject}</h2>
                  <p className="text-sm text-text-light flex items-center gap-1">
                    <LuUser className="h-3.5 w-3.5" /> {selectedMessage.senderName} • {selectedMessage.email} • {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleMarkRead}
                    className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-3 py-2 text-sm font-medium text-text hover:bg-warm/50 transition-colors"
                  >
                    <LuCheck className="h-4 w-4" />
                    {selectedMessage.read ? "Marquer comme non lu" : "Marquer comme lu"}
                  </button>
                  {view === "inbox" ? (
                    <button
                      type="button"
                      onClick={handleArchive}
                      className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-3 py-2 text-sm font-medium text-text hover:bg-warm/50 transition-colors"
                    >
                      <LuArchive className="h-4 w-4" /> Archiver
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRestore}
                      className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-3 py-2 text-sm font-medium text-text hover:bg-warm/50 transition-colors"
                    >
                      <LuArchive className="h-4 w-4" /> Restaurer
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReply}
                    className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-3 py-2 text-sm font-medium text-text hover:bg-warm/50 transition-colors"
                  >
                    <LuReply className="h-4 w-4" /> Répondre
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageToDelete(selectedMessage)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LuTrash2 className="h-4 w-4" /> Supprimer
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-text whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-light p-8">
              <LuMail className="h-16 w-16 mb-4 opacity-50" />
              <p>Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>

      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl border border-warm-dark/20 bg-white p-6 shadow-lg">
            <h3 className="font-heading text-lg font-semibold text-text">Supprimer ce message ?</h3>
            <p className="mt-2 text-sm text-text-light">
              Cette action est irréversible. Le message sera définitivement supprimé.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2 text-sm font-medium text-text hover:bg-warm/50"
              >
                <LuX className="h-4 w-4" /> Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <LuTrash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

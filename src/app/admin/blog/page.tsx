"use client";

import Link from "next/link";
import { Plus, Pencil, Send, Trash2 } from "lucide-react";

const MOCK_POSTS = [
  { id: 1, titre: "Les traditions du henné dans les mariages", statut: "publié", date: "15 janv. 2025" },
  { id: 2, titre: "Conseils pour préparer sa peau au henné", statut: "brouillon", date: "8 janv. 2025" },
  { id: 3, titre: "Les motifs traditionnels marocains", statut: "publié", date: "2 janv. 2025" },
  { id: 4, titre: "Henné pour les invités : idées et tendances", statut: "publié", date: "20 déc. 2024" },
  { id: 5, titre: "Prendre soin de son henné après application", statut: "brouillon", date: "12 déc. 2024" },
];

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Gestion du Blog</h1>
        <Link href="/admin/blog/nouveau" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light">
          <Plus className="h-4 w-4" />Nouvel article
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-warm-dark/20 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-dark/20 bg-warm/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-dark/10">
              {MOCK_POSTS.map((post) => (
                <tr key={post.id} className="hover:bg-warm/20">
                  <td className="px-6 py-4 text-sm font-medium text-text">{post.titre}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${post.statut === "publié" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{post.statut}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-light">{post.date}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" className="rounded-lg p-2 text-text hover:bg-primary/15 hover:text-primary transition-colors" aria-label="Modifier"><Pencil className="h-4 w-4" /></button>
                      {post.statut === "brouillon" && (<button type="button" className="rounded-lg p-2 text-text hover:bg-green-100 hover:text-green-600 transition-colors" aria-label="Publier"><Send className="h-4 w-4" /></button>)}
                      <button type="button" className="rounded-lg p-2 text-text hover:bg-red-100 hover:text-red-600 transition-colors" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

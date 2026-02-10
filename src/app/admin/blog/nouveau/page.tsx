"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, X } from "lucide-react";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default function NouveauBlogPage() {
  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [extrait, setExtrait] = useState("");
  const [contenu, setContenu] = useState("");
  const [publier, setPublier] = useState(false);

  const handleTitreChange = (value: string) => { setTitre(value); setSlug(slugify(value)); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Nouvel article</h1>
        <Link href="/admin/blog" className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"><X className="h-4 w-4" />Annuler</Link>
      </div>
      <form className="space-y-6 rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div><label htmlFor="titre" className="block text-sm font-medium text-text">Titre</label><input id="titre" type="text" value={titre} onChange={(e) => handleTitreChange(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Titre de l'article" /></div>
          <div><label htmlFor="slug" className="block text-sm font-medium text-text">Slug</label><input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="slug-de-larticle" /></div>
        </div>
        <div><label htmlFor="extrait" className="block text-sm font-medium text-text">Extrait</label><textarea id="extrait" rows={2} value={extrait} onChange={(e) => setExtrait(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Court résumé de l'article..." /></div>
        <div><label htmlFor="contenu" className="block text-sm font-medium text-text">Contenu</label><textarea id="contenu" rows={12} value={contenu} onChange={(e) => setContenu(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Contenu de l'article..." /></div>
        <div><label className="block text-sm font-medium text-text mb-2">Image de couverture</label><div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-warm-dark/40 bg-warm/20 text-text-light">Glissez-déposez une image ou cliquez pour sélectionner</div></div>
        <div><label className="flex items-center gap-3"><input type="checkbox" checked={publier} onChange={(e) => setPublier(e.target.checked)} className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary" /><span className="text-sm font-medium text-text">Publier</span></label></div>
        <div className="flex gap-4 pt-4">
          <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"><Save className="h-4 w-4" />Enregistrer</button>
          <Link href="/admin/blog" className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50">Annuler</Link>
        </div>
      </form>
    </div>
  );
}

"use client";

/**
 * Admin — Blog (édition).
 *
 * Rôle : charger un article existant par id, modifier les champs et enregistrer via l’API.
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { LuSave, LuX } from "react-icons/lu";
import { slugify } from "@/lib/utils";
import SingleImageUploader from "@/components/admin/SingleImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function ModifierBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [extrait, setExtrait] = useState("");
  const [contenu, setContenu] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [publier, setPublier] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleTitreChange = (value: string) => {
    setTitre(value);
    setSlug(slugify(value));
  };

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article introuvable");
        return res.json();
      })
      .then((data) => {
        const post = data?.post;
        if (post) {
          setTitre(post.title);
          setSlug(post.slug);
          setExtrait(post.excerpt);
          setContenu(post.content);
          setCoverImage(post.coverImage || null);
          setPublier(post.published);
        } else {
          setError("Article introuvable");
        }
      })
      .catch(() => setError("Article introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const stripped = contenu.replace(/<[^>]*>/g, "").trim();
    if (!stripped) {
      setError("Le contenu est requis");
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titre,
        slug: slug || slugify(titre),
        excerpt: extrait,
        content: contenu,
        coverImage: coverImage || undefined,
        published: publier,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (res.ok) {
      router.push("/admin/blog");
    } else {
      setError(data.error || "Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-text">Modifier l&apos;article</h1>
        <p className="text-text-light">Chargement...</p>
      </div>
    );
  }

  if (error && !titre) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-text">Modifier l&apos;article</h1>
        <p className="text-red-600">{error}</p>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text hover:bg-warm/50"
        >
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Modifier l&apos;article</h1>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text transition-colors hover:bg-warm/50"
        >
          <LuX className="h-4 w-4" /> Annuler
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-warm-dark/20 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-text">
              Titre
            </label>
            <input
              id="titre"
              type="text"
              value={titre}
              onChange={(e) => handleTitreChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Titre de l'article"
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-text">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              disabled
              className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-warm/30 px-4 py-2.5 text-text-light"
              placeholder="slug-de-larticle"
            />
          </div>
        </div>
        <div>
          <label htmlFor="extrait" className="block text-sm font-medium text-text">
            Extrait
          </label>
          <textarea
            id="extrait"
            rows={2}
            value={extrait}
            onChange={(e) => setExtrait(e.target.value)}
            className="mt-1 w-full rounded-lg border border-warm-dark/40 bg-white px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Court résumé de l'article..."
            required
          />
        </div>
        <div>
          <label htmlFor="contenu" className="block text-sm font-medium text-text">
            Contenu
          </label>
          <RichTextEditor content={contenu} onChange={setContenu} />
        </div>
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-text">
            Image de couverture
          </label>
          <SingleImageUploader image={coverImage} onChange={setCoverImage} />
        </div>
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={publier}
              onChange={(e) => setPublier(e.target.checked)}
              className="h-4 w-4 rounded border-warm-dark/40 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">Publier</span>
          </label>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light disabled:opacity-50"
          >
            <LuSave className="h-4 w-4" /> Enregistrer
          </button>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-warm-dark/40 px-4 py-2.5 font-medium text-text hover:bg-warm/50"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus, LuPencil, LuSend, LuTrash2 } from "react-icons/lu";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data?.posts) setPosts(data.posts);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTogglePublish = async (post: Post) => {
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) {
      const { post: updated } = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    const res = await fetch(`/api/admin/blog/${postToDelete.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPostToDelete(null);
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">Gestion du Blog</h1>
        <Link
          href="/admin/blog/nouveau"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-text-inverse transition-colors hover:bg-primary-light"
        >
          <LuPlus className="h-4 w-4" /> Ajouter un article
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-warm-dark/20 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-dark/20 bg-warm/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-dark/10">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-light">
                    Chargement...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-light">
                    Aucun article
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-warm/20">
                    <td className="px-6 py-4 text-sm font-medium text-text">{post.title}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${post.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {post.published ? "publié" : "brouillon"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-text-light">
                      {post.published ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/blog/modifier/${post.id}`}
                          className="rounded-lg p-2 text-text hover:bg-primary/15 hover:text-primary transition-colors"
                          aria-label="Modifier"
                        >
                          <LuPencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(post)}
                          className="rounded-lg p-2 text-text hover:bg-green-100 hover:text-green-600 transition-colors"
                          aria-label={post.published ? "Dépublier" : "Publier"}
                        >
                          <LuSend className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPostToDelete(post)}
                          className="rounded-lg p-2 text-text hover:bg-red-100 hover:text-red-600 transition-colors"
                          aria-label="Supprimer"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl border border-warm-dark/20 bg-white p-6 shadow-lg">
            <h3 className="font-heading text-lg font-semibold text-text">
              Supprimer cet article ?
            </h3>
            <p className="mt-2 text-sm text-text-light">
              &quot;{postToDelete.title}&quot; sera définitivement supprimé.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="rounded-lg border border-warm-dark/40 px-4 py-2 text-sm font-medium text-text hover:bg-warm/50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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

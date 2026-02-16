"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      window.location.href = callbackUrl;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-warm-dark/40 px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-warm-dark/40 px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-text-inverse transition-colors hover:bg-primary-light disabled:opacity-50"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

export default function ConnexionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-warm/50 to-bg p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-warm-dark/20 bg-white p-8 shadow-xl">
        <div className="text-center">
          <Image
            src="/assets/logo.png"
            alt="RUHENNA"
            width={64}
            height={64}
            className="mx-auto h-16 w-auto"
          />
          <h1 className="mt-4 font-heading text-2xl font-bold text-text">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-text-light">
            Accédez à l&apos;espace d&apos;administration
          </p>
        </div>
        <Suspense fallback={<div className="py-8 text-center text-text-light">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

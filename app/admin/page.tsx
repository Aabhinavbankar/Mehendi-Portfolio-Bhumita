"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/lib/site";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-semibold text-henna">
            {site.brand}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Owner access
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-line bg-cream p-7 shadow-sm">
          <h1 className="font-display text-xl font-semibold text-ink">Log in</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Sign in to manage your portfolio.
          </p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Email
              </span>
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-line bg-parchment px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-henna"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-lg border border-line bg-parchment px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-henna"
              />
            </label>

            {/* Reserved slot so showing the error doesn't resize the card. */}
            <p
              aria-live="polite"
              className="min-h-[1.25rem] text-sm text-red-600"
            >
              {error}
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-full bg-henna px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-henna-deep disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-ink-soft">
          Owner access only.
        </p>
      </div>
    </div>
  );
}

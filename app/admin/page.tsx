import Link from "next/link";
import { site } from "@/lib/site";

// Login screen. This is the UI only — credential verification will be wired to
// Supabase Auth next. For now, "Preview dashboard" opens the dashboard so the
// flow can be reviewed. There is intentionally no fake/mock authentication.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
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

          <form className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Email
              </span>
              <input
                type="email"
                name="email"
                autoComplete="username"
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
                placeholder="••••••••"
                className="rounded-lg border border-line bg-parchment px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-henna"
              />
            </label>

            {/* Inert until Supabase Auth is connected — no mock login. */}
            <button
              type="button"
              disabled
              className="mt-1 cursor-not-allowed rounded-full bg-henna/50 px-5 py-2.5 text-sm font-medium text-cream"
              title="Login activates once Supabase is connected"
            >
              Log in
            </button>
          </form>

          <p className="mt-4 rounded-lg bg-parchment px-3 py-2 text-center text-xs text-ink-soft">
            Sign-in activates once Supabase is connected.
          </p>
        </div>

        {/* Preview entry (temporary — removed once auth is live) */}
        <div className="mt-5 text-center">
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium text-henna underline underline-offset-4 hover:text-henna-deep"
          >
            Preview the dashboard →
          </Link>
          <p className="mt-1 text-xs text-ink-soft">
            (Auth not wired yet — this is for reviewing the UI.)
          </p>
        </div>
      </div>
    </div>
  );
}

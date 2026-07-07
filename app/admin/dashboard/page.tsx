"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/lib/site";
import DesignsPanel from "@/components/admin/DesignsPanel";
import TestimonialsPanel from "@/components/admin/TestimonialsPanel";
import ContentPanel from "@/components/admin/ContentPanel";
import ContactPanel from "@/components/admin/ContactPanel";

const TABS = [
  { key: "designs", label: "Designs" },
  { key: "testimonials", label: "Testimonials" },
  { key: "content", label: "About & Services" },
  { key: "contact", label: "Contact" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("designs");

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin");
    router.refresh();
  };

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate font-display text-base font-semibold text-henna sm:text-lg">
              {site.brand}
            </span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft sm:inline">
              Admin
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-henna hover:text-henna"
            >
              View site ↗
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-henna px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-henna-deep"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Body: sidebar + panel */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 md:flex-row md:px-8 md:py-8">
        {/* Tabs */}
        <nav className="grid grid-cols-2 gap-2 md:flex md:w-52 md:flex-col">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key}
              className={`rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors md:border-0 md:text-left ${
                tab === t.key
                  ? "border-henna bg-henna text-cream"
                  : "border-line bg-cream text-ink-soft hover:border-henna hover:text-henna md:bg-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Active panel */}
        <main className="min-w-0 flex-1">
          {tab === "designs" && <DesignsPanel notify={notify} />}
          {tab === "testimonials" && <TestimonialsPanel notify={notify} />}
          {tab === "content" && <ContentPanel notify={notify} />}
          {tab === "contact" && <ContactPanel notify={notify} />}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-cream shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

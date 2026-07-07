"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { about as fallbackAbout } from "@/lib/data";
import { Field, PanelHeader, btnGhost, btnPrimary, inputCls } from "./fields";

type About = { intro: string; body: string; areas: string };
type ServiceItem = { id: string | null; title: string; detail: string };

export default function ContentPanel({
  notify,
}: {
  notify: (msg: string) => void;
}) {
  const [supabase] = useState(() => createClient());
  const [about, setAbout] = useState<About>({ intro: "", body: "", areas: "" });
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [content, svc] = await Promise.all([
      supabase.from("site_content").select("*"),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
    ]);
    const m = Object.fromEntries(
      (content.data ?? []).map((r) => [r.key as string, r.value as string])
    );
    setAbout({
      intro: m.about_intro ?? fallbackAbout.intro,
      body: m.about_body ?? fallbackAbout.body,
      areas: m.about_areas ?? fallbackAbout.areas,
    });
    setServices(
      (svc.data ?? []).map((s) => ({
        id: s.id as string,
        title: s.title as string,
        detail: s.detail as string,
      }))
    );
    setDeleted([]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateService = (i: number, patch: Partial<ServiceItem>) =>
    setServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const addService = () =>
    setServices((prev) => [...prev, { id: null, title: "New service", detail: "" }]);

  const removeService = (i: number) =>
    setServices((prev) => {
      const s = prev[i];
      if (s.id) setDeleted((d) => [...d, s.id as string]);
      return prev.filter((_, idx) => idx !== i);
    });

  async function save() {
    setSaving(true);
    try {
      const { error: aErr } = await supabase.from("site_content").upsert(
        [
          { key: "about_intro", value: about.intro },
          { key: "about_body", value: about.body },
          { key: "about_areas", value: about.areas },
        ],
        { onConflict: "key" }
      );
      if (aErr) throw aErr;

      if (deleted.length) {
        const { error } = await supabase.from("services").delete().in("id", deleted);
        if (error) throw error;
      }

      for (let i = 0; i < services.length; i++) {
        const s = services[i];
        const row = { title: s.title, detail: s.detail, sort_order: i + 1 };
        const { error } = s.id
          ? await supabase.from("services").update(row).eq("id", s.id)
          : await supabase.from("services").insert(row);
        if (error) throw error;
      }

      await load();
      notify("Saved.");
    } catch (e) {
      notify(`Couldn't save — ${(e as Error).message ?? "try again."}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <p className="py-12 text-center text-sm text-ink-soft">Loading…</p>;

  return (
    <div>
      <PanelHeader
        title="About & Services"
        desc="Your story and what you offer, shown on the About page."
      />

      <section className="rounded-2xl border border-line bg-cream p-5">
        <h3 className="font-display text-lg font-semibold text-ink">About you</h3>
        <div className="mt-4 flex flex-col gap-4">
          <Field label="Intro" hint="The opening line on the About page and home teaser.">
            <textarea
              value={about.intro}
              onChange={(e) => setAbout({ ...about, intro: e.target.value })}
              rows={3}
              className={inputCls}
            />
          </Field>
          <Field label="Story">
            <textarea
              value={about.body}
              onChange={(e) => setAbout({ ...about, body: e.target.value })}
              rows={4}
              className={inputCls}
            />
          </Field>
          <Field label="Service areas">
            <input
              value={about.areas}
              onChange={(e) => setAbout({ ...about, areas: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-cream p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">Services</h3>
          <button type="button" onClick={addService} className={btnGhost}>
            + Add service
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {services.map((s, i) => (
            <div key={s.id ?? `new-${i}`} className="rounded-xl border border-line bg-parchment p-4">
              <div className="flex flex-col gap-3">
                <input
                  value={s.title}
                  onChange={(e) => updateService(i, { title: e.target.value })}
                  placeholder="Service name"
                  className={`${inputCls} font-medium`}
                />
                <textarea
                  value={s.detail}
                  onChange={(e) => updateService(i, { detail: e.target.value })}
                  rows={2}
                  placeholder="Short description"
                  className={inputCls}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeService(i)}
                    className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs text-red-600 transition-colors hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-sm text-ink-soft">No services yet — add one above.</p>
          )}
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className={btnPrimary}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

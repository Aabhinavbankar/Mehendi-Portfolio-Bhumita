"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { about as fallbackAbout } from "@/lib/data";
import { defaultImages } from "@/lib/site";
import { uploadImage, removeImage } from "@/lib/storage";
import { Field, PanelHeader, btnGhost, btnPrimary, inputCls } from "./fields";

type About = { intro: string; body: string; areas: string };
type ServiceItem = { id: string | null; title: string; detail: string };
// A brand image being edited: `existing` is what's live, `file`/`preview` the
// pending replacement (null until the owner picks one).
type ImgDraft = { existing: string; file: File | null; preview: string | null };
const emptyImg: ImgDraft = { existing: "", file: null, preview: null };

export default function ContentPanel({
  notify,
}: {
  notify: (msg: string) => void;
}) {
  const [supabase] = useState(() => createClient());
  const [about, setAbout] = useState<About>({ intro: "", body: "", areas: "" });
  const [hero, setHero] = useState<ImgDraft>(emptyImg);
  const [portrait, setPortrait] = useState<ImgDraft>(emptyImg);
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
    setHero({ existing: m.hero_image ?? "", file: null, preview: null });
    setPortrait({ existing: m.portrait_image ?? "", file: null, preview: null });
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

  const pickImage = (
    cur: ImgDraft,
    set: (v: ImgDraft) => void,
    file: File | null
  ) => {
    if (cur.preview) URL.revokeObjectURL(cur.preview);
    set({ ...cur, file, preview: file ? URL.createObjectURL(file) : null });
  };

  async function save() {
    setSaving(true);
    try {
      // Upload any newly-picked photos first so their URLs go into the same
      // content upsert. Remember the old URLs to clean up afterwards.
      const oldHero = hero.existing;
      const oldPortrait = portrait.existing;
      let heroUrl = hero.existing;
      let portraitUrl = portrait.existing;
      if (hero.file) heroUrl = await uploadImage(supabase, hero.file);
      if (portrait.file) portraitUrl = await uploadImage(supabase, portrait.file);

      const { error: aErr } = await supabase.from("site_content").upsert(
        [
          { key: "about_intro", value: about.intro },
          { key: "about_body", value: about.body },
          { key: "about_areas", value: about.areas },
          { key: "hero_image", value: heroUrl },
          { key: "portrait_image", value: portraitUrl },
        ],
        { onConflict: "key" }
      );
      if (aErr) throw aErr;

      // Replaced photos are now unreferenced — drop the old storage objects
      // (no-ops for the bundled placeholders). Best-effort; never blocks save.
      if (hero.file) await removeImage(supabase, oldHero);
      if (portrait.file) await removeImage(supabase, oldPortrait);

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
        <h3 className="font-display text-lg font-semibold text-ink">Photos</h3>
        <p className="mt-1 text-sm text-ink-soft">
          The hero image on your home page and your portrait on the About page.
          Leave a slot untouched to keep the current photo.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <PhotoField
            label="Home hero"
            hint="Large image beside the headline — a striking bridal shot works best."
            img={hero}
            fallback={defaultImages.hero}
            onPick={(f) => pickImage(hero, setHero, f)}
          />
          <PhotoField
            label="Portrait"
            hint="Shown on the home teaser and the About page."
            img={portrait}
            fallback={defaultImages.portrait}
            onPick={(f) => pickImage(portrait, setPortrait, f)}
          />
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

// One brand-image slot: preview + file picker + status line. Shows the live
// placeholder until the owner uploads their own photo.
function PhotoField({
  label,
  hint,
  img,
  fallback,
  onPick,
}: {
  label: string;
  hint: string;
  img: ImgDraft;
  fallback: string;
  onPick: (file: File | null) => void;
}) {
  const src = img.preview || img.existing || fallback;
  const usingPlaceholder = !img.preview && !img.existing;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="aspect-square w-20 shrink-0 rounded-xl border border-line object-cover"
        />
        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-line bg-parchment px-3 py-2 text-xs text-ink-soft file:mr-2 file:rounded file:border-0 file:bg-henna file:px-2 file:py-1 file:text-cream"
          />
          <span className="mt-1 block text-xs text-ink-soft/80">
            {img.preview
              ? "New photo selected — Save to apply."
              : usingPlaceholder
                ? "Using placeholder. Upload to set your own."
                : "Current photo. Choose a file to replace."}
          </span>
        </div>
      </div>
      <span className="text-xs text-ink-soft/80">{hint}</span>
    </div>
  );
}

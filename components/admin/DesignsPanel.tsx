"use client";

import { useEffect, useState } from "react";
import DesignImage from "@/components/DesignImage";
import { CATEGORIES, type Category } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import type { DesignRow } from "./types";
import {
  Field,
  PanelHeader,
  btnGhost,
  btnPrimary,
  iconBtn,
  inputCls,
} from "./fields";

type Draft = {
  id: string | null;
  category: Category;
  caption: string;
  featured: boolean;
  file: File | null;
  previewUrl: string | null;
  existingUrl: string | null;
};

export default function DesignsPanel({
  notify,
}: {
  notify: (msg: string) => void;
}) {
  const [supabase] = useState(() => createClient());
  const [items, setItems] = useState<DesignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setItems(data as DesignRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown =
    filter === "All" ? items : items.filter((d) => d.category === filter);
  const canReorder = filter === "All";

  const startAdd = () =>
    setDraft({
      id: null,
      category: "Bridal",
      caption: "",
      featured: false,
      file: null,
      previewUrl: null,
      existingUrl: null,
    });

  const startEdit = (d: DesignRow) =>
    setDraft({
      id: d.id,
      category: d.category,
      caption: d.caption,
      featured: d.is_featured,
      file: null,
      previewUrl: null,
      existingUrl: d.image_url,
    });

  const onPickFile = (file: File | null) => {
    if (!draft) return;
    setDraft({
      ...draft,
      file,
      previewUrl: file ? URL.createObjectURL(file) : null,
    });
  };

  async function uploadPhoto(file: File): Promise<string> {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("designs")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    return supabase.storage.from("designs").getPublicUrl(path).data.publicUrl;
  }

  async function save() {
    if (!draft) return;
    if (!draft.caption.trim()) return notify("Add a caption first.");
    if (!draft.id && !draft.file) return notify("Choose a photo first.");

    setSaving(true);
    try {
      let imageUrl = draft.existingUrl;
      if (draft.file) imageUrl = await uploadPhoto(draft.file);

      if (draft.id) {
        const { error } = await supabase
          .from("designs")
          .update({
            category: draft.category,
            caption: draft.caption.trim(),
            is_featured: draft.featured,
            ...(draft.file ? { image_url: imageUrl } : {}),
          })
          .eq("id", draft.id);
        if (error) throw error;
        notify("Design updated.");
      } else {
        const nextSort =
          items.reduce((m, d) => Math.max(m, d.sort_order), 0) + 1;
        const { error } = await supabase.from("designs").insert({
          image_url: imageUrl,
          category: draft.category,
          caption: draft.caption.trim(),
          is_featured: draft.featured,
          sort_order: nextSort,
        });
        if (error) throw error;
        notify("Design added.");
      }
      setDraft(null);
      await load();
    } catch (e) {
      notify(`Couldn't save — ${(e as Error).message ?? "try again."}`);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this design?")) return;
    const { error } = await supabase.from("designs").delete().eq("id", id);
    if (error) return notify("Couldn't delete.");
    setItems((prev) => prev.filter((d) => d.id !== id));
    notify("Design deleted.");
  }

  async function toggleFeatured(d: DesignRow) {
    const { error } = await supabase
      .from("designs")
      .update({ is_featured: !d.is_featured })
      .eq("id", d.id);
    if (error) return notify("Couldn't update.");
    setItems((prev) =>
      prev.map((x) => (x.id === d.id ? { ...x, is_featured: !x.is_featured } : x))
    );
  }

  async function move(id: string, dir: -1 | 1) {
    const i = items.findIndex((d) => d.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= items.length) return;
    const a = items[i];
    const b = items[j];
    const [e1, e2] = await Promise.all([
      supabase.from("designs").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("designs").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    if (e1.error || e2.error) return notify("Couldn't reorder.");
    await load();
  }

  return (
    <div>
      <PanelHeader
        title="Designs"
        desc="Upload, categorise, feature and reorder your portfolio."
        action={
          <button type="button" onClick={startAdd} className={btnPrimary}>
            + Add design
          </button>
        }
      />

      {/* Filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`flex-1 basis-20 whitespace-nowrap rounded-full border px-3 py-1.5 text-center text-xs transition-colors sm:flex-none sm:basis-auto ${
              filter === c
                ? "border-henna bg-henna text-cream"
                : "border-line bg-cream text-ink-soft hover:border-henna"
            }`}
          >
            {c}
            {c !== "All" && (
              <span className="ml-1 opacity-70">
                {items.filter((d) => d.category === c).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-soft">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((d) => (
              <div
                key={d.id}
                className="flex overflow-hidden rounded-2xl border border-line bg-cream sm:flex-col"
              >
                <div className="relative w-28 shrink-0 self-stretch sm:w-full">
                  <DesignImage url={d.image_url} className="h-full w-full sm:aspect-square" />
                  <button
                    type="button"
                    onClick={() => toggleFeatured(d)}
                    aria-pressed={d.is_featured}
                    title={d.is_featured ? "Featured on home" : "Not featured"}
                    className={`absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-sm transition-colors ${
                      d.is_featured
                        ? "bg-gold text-white"
                        : "bg-white/85 text-ink-soft hover:text-henna"
                    }`}
                  >
                    {d.is_featured ? "★" : "☆"}
                  </button>
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gold-ink">
                    {d.category}
                  </span>
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink">{d.caption}</p>
                  <div className="mt-3 flex items-center gap-1.5 sm:mt-auto sm:pt-3">
                    <button
                      type="button"
                      onClick={() => startEdit(d)}
                      className="flex-1 rounded-lg border border-line py-1.5 text-xs text-ink transition-colors hover:border-henna hover:text-henna"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => move(d.id, -1)}
                      disabled={!canReorder}
                      title="Move up"
                      className={iconBtn}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(d.id, 1)}
                      disabled={!canReorder}
                      title="Move down"
                      className={iconBtn}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(d.id)}
                      title="Delete"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {shown.length === 0 && (
            <p className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-soft">
              No designs {filter === "All" ? "yet" : "in this category"}.
            </p>
          )}

          {!canReorder && shown.length > 0 && (
            <p className="mt-4 text-xs text-ink-soft">
              Switch to “All” to reorder designs.
            </p>
          )}
        </>
      )}

      {/* Add / Edit modal */}
      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={() => !saving && setDraft(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-cream p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-semibold text-henna">
              {draft.id ? "Edit design" : "Add design"}
            </h3>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {draft.previewUrl || draft.existingUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(draft.previewUrl ?? draft.existingUrl) as string}
                    alt="Selected design"
                    className="aspect-square w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="grid aspect-square w-20 place-items-center rounded-xl border border-dashed border-line text-[10px] text-ink-soft">
                    No photo
                  </div>
                )}
                <label className="flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-parchment px-3 py-2 text-xs text-ink-soft file:mr-2 file:rounded file:border-0 file:bg-henna file:px-2 file:py-1 file:text-cream"
                  />
                  {draft.id && (
                    <span className="mt-1 block text-xs text-ink-soft/80">
                      Leave empty to keep the current photo.
                    </span>
                  )}
                </label>
              </div>

              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({ ...draft, category: e.target.value as Category })
                  }
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Caption">
                <input
                  value={draft.caption}
                  onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
                  placeholder="e.g. Full bridal hands & feet"
                  className={inputCls}
                />
              </Field>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) =>
                    setDraft({ ...draft, featured: e.target.checked })
                  }
                  className="h-4 w-4 accent-henna"
                />
                Feature on the home page
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                disabled={saving}
                className={btnGhost}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className={btnPrimary}
              >
                {saving ? "Saving…" : draft.id ? "Save changes" : "Add design"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

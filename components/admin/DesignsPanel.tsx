"use client";

import { useState } from "react";
import DesignImage from "@/components/DesignImage";
import { CATEGORIES, type Category } from "@/lib/data";
import type { AdminDesign } from "./types";
import {
  Field,
  PanelHeader,
  btnGhost,
  btnPrimary,
  iconBtn,
  inputCls,
} from "./fields";

const SEED_POOL = [
  "d01", "d02", "d03", "d04", "d05", "d06",
  "d07", "d08", "d09", "d10", "d11", "d12",
];

type Draft = {
  id: string | null;
  category: Category;
  caption: string;
  featured: boolean;
  seed: string;
};

export default function DesignsPanel({
  designs,
  setDesigns,
  notify,
}: {
  designs: AdminDesign[];
  setDesigns: (next: AdminDesign[]) => void;
  notify: (msg: string) => void;
}) {
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [draft, setDraft] = useState<Draft | null>(null);

  const shown =
    filter === "All" ? designs : designs.filter((d) => d.category === filter);
  const canReorder = filter === "All";

  const startAdd = () =>
    setDraft({
      id: null,
      category: "Bridal",
      caption: "",
      featured: false,
      seed: SEED_POOL[designs.length % SEED_POOL.length],
    });

  const startEdit = (d: AdminDesign) =>
    setDraft({
      id: d.id,
      category: d.category,
      caption: d.caption,
      featured: d.featured,
      seed: d.seed ?? d.id,
    });

  const save = () => {
    if (!draft) return;
    if (!draft.caption.trim()) {
      notify("Add a caption first.");
      return;
    }
    if (draft.id) {
      setDesigns(
        designs.map((d) =>
          d.id === draft.id
            ? { ...d, category: draft.category, caption: draft.caption.trim(), featured: draft.featured }
            : d
        )
      );
      notify("Design updated (preview).");
    } else {
      const id = `new-${designs.length + 1}-${draft.seed}`;
      setDesigns([
        { id, category: draft.category, caption: draft.caption.trim(), featured: draft.featured, seed: draft.seed },
        ...designs,
      ]);
      notify("Design added (preview).");
    }
    setDraft(null);
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this design?")) return;
    setDesigns(designs.filter((d) => d.id !== id));
    notify("Design deleted (preview).");
  };

  const toggleFeatured = (id: string) =>
    setDesigns(
      designs.map((d) => (d.id === id ? { ...d, featured: !d.featured } : d))
    );

  const move = (id: string, dir: -1 | 1) => {
    const i = designs.findIndex((d) => d.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= designs.length) return;
    const next = [...designs];
    [next[i], next[j]] = [next[j], next[i]];
    setDesigns(next);
  };

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

      {/* Filter — chips divide each row evenly on mobile, natural toolbar on sm+ */}
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
                {designs.filter((d) => d.category === c).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List on mobile (thumb + info side by side) → grid cards on sm+ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((d) => (
          <div
            key={d.id}
            className="flex overflow-hidden rounded-2xl border border-line bg-cream sm:flex-col"
          >
            <div className="relative w-28 shrink-0 self-stretch sm:w-full">
              <DesignImage
                seed={d.seed ?? d.id}
                className="h-full w-full sm:aspect-square"
              />
              <button
                type="button"
                onClick={() => toggleFeatured(d.id)}
                aria-pressed={d.featured}
                title={d.featured ? "Featured on home" : "Not featured"}
                className={`absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-sm transition-colors ${
                  d.featured
                    ? "bg-gold text-white"
                    : "bg-white/85 text-ink-soft hover:text-henna"
                }`}
              >
                {d.featured ? "★" : "☆"}
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
          No designs in this category yet.
        </p>
      )}

      {!canReorder && (
        <p className="mt-4 text-xs text-ink-soft">
          Switch to “All” to reorder designs.
        </p>
      )}

      {/* Add / Edit modal */}
      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={() => setDraft(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-cream p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-semibold text-henna">
              {draft.id ? "Edit design" : "Add design"}
            </h3>

            <div className="mt-5 flex flex-col gap-4">
              {/* Image placeholder (real upload wires to Supabase Storage) */}
              <div className="flex items-center gap-4">
                <DesignImage
                  seed={draft.seed}
                  className="aspect-square w-20 rounded-xl"
                />
                <label className="flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled
                    className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-dashed border-line bg-parchment px-3 py-2 text-xs text-ink-soft"
                  />
                  <span className="mt-1 block text-xs text-ink-soft/80">
                    Upload activates with Supabase Storage.
                  </span>
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
                className={btnGhost}
              >
                Cancel
              </button>
              <button type="button" onClick={save} className={btnPrimary}>
                {draft.id ? "Save changes" : "Add design"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

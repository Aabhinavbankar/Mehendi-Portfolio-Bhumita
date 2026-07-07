"use client";

import { useState } from "react";
import type { Testimonial } from "./types";
import {
  Field,
  PanelHeader,
  btnGhost,
  btnPrimary,
  inputCls,
} from "./fields";

type Draft = { id: string | null; brideName: string; quote: string };

export default function TestimonialsPanel({
  items,
  setItems,
  notify,
}: {
  items: Testimonial[];
  setItems: (next: Testimonial[]) => void;
  notify: (msg: string) => void;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);

  const startAdd = () => setDraft({ id: null, brideName: "", quote: "" });
  const startEdit = (t: Testimonial) =>
    setDraft({ id: t.id, brideName: t.brideName, quote: t.quote });

  const save = () => {
    if (!draft) return;
    if (!draft.brideName.trim() || !draft.quote.trim()) {
      notify("Add both a name and a quote.");
      return;
    }
    if (draft.id) {
      setItems(
        items.map((t) =>
          t.id === draft.id
            ? { ...t, brideName: draft.brideName.trim(), quote: draft.quote.trim() }
            : t
        )
      );
      notify("Testimonial updated (preview).");
    } else {
      setItems([
        ...items,
        { id: `t-${items.length + 1}`, brideName: draft.brideName.trim(), quote: draft.quote.trim() },
      ]);
      notify("Testimonial added (preview).");
    }
    setDraft(null);
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    setItems(items.filter((t) => t.id !== id));
    notify("Testimonial deleted (preview).");
  };

  return (
    <div>
      <PanelHeader
        title="Testimonials"
        desc="The kind words shown in the “What brides say” section."
        action={
          <button type="button" onClick={startAdd} className={btnPrimary}>
            + Add testimonial
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col rounded-2xl border border-line bg-cream p-5"
          >
            <blockquote className="flex-1 text-sm leading-relaxed text-ink">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-henna">
                {t.brideName}
              </span>
              <span className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  className="rounded-lg border border-line px-3 py-1 text-xs text-ink transition-colors hover:border-henna hover:text-henna"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-soft">
          No testimonials yet.
        </p>
      )}

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
              {draft.id ? "Edit testimonial" : "Add testimonial"}
            </h3>
            <div className="mt-5 flex flex-col gap-4">
              <Field label="Bride's name & city">
                <input
                  value={draft.brideName}
                  onChange={(e) =>
                    setDraft({ ...draft, brideName: e.target.value })
                  }
                  placeholder="e.g. Ananya, Nagpur"
                  className={inputCls}
                />
              </Field>
              <Field label="Quote">
                <textarea
                  value={draft.quote}
                  onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
                  rows={4}
                  placeholder="What she said about your work…"
                  className={inputCls}
                />
              </Field>
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
                {draft.id ? "Save changes" : "Add testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

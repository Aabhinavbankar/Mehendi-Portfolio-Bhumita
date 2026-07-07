"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TestimonialRow } from "./types";
import { Field, PanelHeader, btnGhost, btnPrimary, inputCls } from "./fields";

type Draft = { id: string | null; brideName: string; quote: string };

export default function TestimonialsPanel({
  notify,
}: {
  notify: (msg: string) => void;
}) {
  const [supabase] = useState(() => createClient());
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setItems(data as TestimonialRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAdd = () => setDraft({ id: null, brideName: "", quote: "" });
  const startEdit = (t: TestimonialRow) =>
    setDraft({ id: t.id, brideName: t.bride_name, quote: t.quote });

  async function save() {
    if (!draft) return;
    if (!draft.brideName.trim() || !draft.quote.trim())
      return notify("Add both a name and a quote.");

    setSaving(true);
    try {
      if (draft.id) {
        const { error } = await supabase
          .from("testimonials")
          .update({ bride_name: draft.brideName.trim(), quote: draft.quote.trim() })
          .eq("id", draft.id);
        if (error) throw error;
        notify("Testimonial updated.");
      } else {
        const nextSort =
          items.reduce((m, t) => Math.max(m, t.sort_order), 0) + 1;
        const { error } = await supabase.from("testimonials").insert({
          bride_name: draft.brideName.trim(),
          quote: draft.quote.trim(),
          sort_order: nextSort,
        });
        if (error) throw error;
        notify("Testimonial added.");
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
    if (!window.confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return notify("Couldn't delete.");
    setItems((prev) => prev.filter((t) => t.id !== id));
    notify("Testimonial deleted.");
  }

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

      {loading ? (
        <p className="py-12 text-center text-sm text-ink-soft">Loading…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((t) => (
              <figure
                key={t.id}
                className="flex flex-col rounded-2xl border border-line bg-cream p-5"
              >
                <blockquote className="flex-1 text-sm leading-relaxed text-ink">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-henna">
                    {t.bride_name}
                  </span>
                  <span className="flex shrink-0 gap-1.5">
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
        </>
      )}

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
                {saving ? "Saving…" : draft.id ? "Save changes" : "Add testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

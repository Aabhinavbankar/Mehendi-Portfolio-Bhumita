"use client";

import type { AboutInfo, Service } from "./types";
import {
  Field,
  PanelHeader,
  btnGhost,
  btnPrimary,
  inputCls,
} from "./fields";

export default function ContentPanel({
  about,
  setAbout,
  services,
  setServices,
  notify,
}: {
  about: AboutInfo;
  setAbout: (next: AboutInfo) => void;
  services: Service[];
  setServices: (next: Service[]) => void;
  notify: (msg: string) => void;
}) {
  const updateService = (i: number, patch: Partial<Service>) =>
    setServices(services.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const addService = () =>
    setServices([...services, { title: "New service", detail: "" }]);

  const removeService = (i: number) =>
    setServices(services.filter((_, idx) => idx !== i));

  return (
    <div>
      <PanelHeader
        title="About & Services"
        desc="Your story and what you offer, shown on the About page."
      />

      {/* About */}
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

      {/* Services */}
      <section className="mt-6 rounded-2xl border border-line bg-cream p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">Services</h3>
          <button type="button" onClick={addService} className={btnGhost}>
            + Add service
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {services.map((s, i) => (
            <div key={i} className="rounded-xl border border-line bg-parchment p-4">
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
          onClick={() => notify("Saved in preview — connect Supabase to persist.")}
          className={btnPrimary}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

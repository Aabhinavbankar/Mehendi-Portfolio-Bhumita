"use client";

import type { ContactInfo } from "./types";
import { Field, PanelHeader, btnPrimary, inputCls } from "./fields";

export default function ContactPanel({
  contact,
  setContact,
  notify,
}: {
  contact: ContactInfo;
  setContact: (next: ContactInfo) => void;
  notify: (msg: string) => void;
}) {
  const waPreview = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    contact.greeting
  )}`;

  return (
    <div>
      <PanelHeader
        title="Contact"
        desc="These power every WhatsApp, email and Instagram link on the site."
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl border border-line bg-cream p-5">
          <div className="flex flex-col gap-4">
            <Field
              label="WhatsApp number"
              hint="International format, digits only — e.g. 919764419671"
            >
              <input
                value={contact.whatsapp}
                onChange={(e) =>
                  setContact({ ...contact, whatsapp: e.target.value.replace(/\D/g, "") })
                }
                inputMode="numeric"
                className={inputCls}
              />
            </Field>
            <Field label="Email">
              <input
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                type="email"
                className={inputCls}
              />
            </Field>
            <Field label="Instagram handle" hint="Without the @">
              <input
                value={contact.instagram}
                onChange={(e) =>
                  setContact({ ...contact, instagram: e.target.value.replace(/^@/, "") })
                }
                className={inputCls}
              />
            </Field>
            <Field label="Location">
              <input
                value={contact.location}
                onChange={(e) => setContact({ ...contact, location: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field
              label="Prefilled WhatsApp greeting"
              hint="The message that opens when a bride taps WhatsApp."
            >
              <textarea
                value={contact.greeting}
                onChange={(e) => setContact({ ...contact, greeting: e.target.value })}
                rows={3}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => notify("Saved in preview — connect Supabase to persist.")}
              className={btnPrimary}
            >
              Save changes
            </button>
          </div>
        </section>

        {/* Live preview */}
        <section className="rounded-2xl border border-line bg-parchment p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-ink">
            Live preview
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <div>
              <span className="text-ink-soft">WhatsApp link</span>
              <p className="mt-1 break-all rounded-lg bg-cream p-2 text-xs text-ink">
                {waPreview}
              </p>
            </div>
            <div>
              <span className="text-ink-soft">Email</span>
              <p className="mt-1 rounded-lg bg-cream p-2 text-xs text-ink">
                {contact.email || "—"}
              </p>
            </div>
            <div>
              <span className="text-ink-soft">Instagram</span>
              <p className="mt-1 rounded-lg bg-cream p-2 text-xs text-ink">
                @{contact.instagram || "—"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

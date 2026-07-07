import type { Metadata } from "next";
import {
  emailUrl,
  instagramUrl,
  site,
  whatsappUrl,
} from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description: `Book Bhumita Farkunde for bridal or occasion mehendi in ${site.location}. Reach her on WhatsApp, email, or Instagram.`,
};

const channels = [
  {
    label: "WhatsApp",
    value: "Fastest way to reach me",
    href: whatsappUrl(),
    external: true,
    primary: true,
  },
  {
    label: "Email",
    value: site.email,
    href: emailUrl(),
    external: false,
    primary: false,
  },
  {
    label: "Instagram",
    value: `@${site.instagram}`,
    href: instagramUrl,
    external: true,
    primary: false,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-20">
      <div className="max-w-xl">
        <SectionHeading eyebrow="Get in touch" title="Let's plan your mehendi" />
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Tell me your event date, the style you love, and how many people need
          mehendi — I'll get back with availability and a quote. WhatsApp is the
          quickest way to reach me.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noopener noreferrer" : undefined}
            className={`flex flex-col gap-1 rounded-2xl border p-6 transition-colors ${
              c.primary
                ? "border-henna bg-henna text-cream hover:bg-henna-deep"
                : "border-line bg-cream text-ink hover:border-henna"
            }`}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-[0.15em] ${
                c.primary ? "text-cream/70" : "text-gold"
              }`}
            >
              {c.label}
            </span>
            <span className="text-base font-medium">{c.value}</span>
          </a>
        ))}
      </div>

      {/* Location */}
      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-parchment px-6 py-5">
        <span className="text-2xl" aria-hidden="true">
          📍
        </span>
        <div>
          <p className="font-medium text-ink">Based in {site.location}</p>
          <p className="text-sm text-ink-soft">
            Available across Nagpur and nearby towns for weddings & functions.
          </p>
        </div>
      </div>
    </div>
  );
}

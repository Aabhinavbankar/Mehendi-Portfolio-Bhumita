import type { Metadata } from "next";
import { getDesigns } from "@/lib/content";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse bridal, Arabic, minimal, and festive mehendi designs by Bhumita Farkunde in Nagpur.",
};

export default async function PortfolioPage() {
  const designs = await getDesigns();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <header className="mb-10 max-w-2xl text-center md:mx-0 md:text-left mx-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
          Portfolio
        </p>
        <h1 className="font-display text-4xl font-semibold text-henna text-balance md:text-5xl">
          A gallery of designs
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Filter by style, and tap any design to see it up close. New work is
          added after every wedding season.
        </p>
      </header>

      <Gallery designs={designs} />
    </div>
  );
}

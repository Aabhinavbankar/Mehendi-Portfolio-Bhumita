"use client";

import { useState } from "react";
import { CATEGORIES, type Category, type Design } from "@/lib/data";
import DesignImage from "@/components/DesignImage";

type Filter = "All" | Category;
const filters: Filter[] = ["All", ...CATEGORIES];

export default function Gallery({ designs }: { designs: Design[] }) {
  const [active, setActive] = useState<Filter>("All");
  const [lightbox, setLightbox] = useState<Design | null>(null);

  const shown =
    active === "All" ? designs : designs.filter((d) => d.category === active);

  return (
    <div>
      {/* Filter chips */}
      <div className="mb-8 flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active === f
                ? "border-henna bg-henna text-cream"
                : "border-line bg-cream text-ink-soft hover:border-henna hover:text-henna"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {shown.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setLightbox(d)}
            className="group relative aspect-square overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label={`View ${d.caption}`}
          >
            <DesignImage
              seed={d.id}
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {d.caption}
            </span>
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center text-ink-soft">
          No designs in this category yet.
        </p>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
          >
            ×
          </button>
          <figure
            className="max-h-[85vh] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <DesignImage
              seed={lightbox.id}
              className="aspect-square w-full rounded-2xl"
            />
            <figcaption className="mt-4 text-center text-sm text-cream">
              <span className="font-medium">{lightbox.caption}</span>
              <span className="mx-2 text-gold-soft">·</span>
              <span className="text-cream/70">{lightbox.category}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, type Category, type Design } from "@/lib/data";
import DesignImage from "@/components/DesignImage";

type Filter = "All" | Category;
const filters: Filter[] = ["All", ...CATEGORIES];

export default function Gallery({ designs }: { designs: Design[] }) {
  const [active, setActive] = useState<Filter>("All");
  const [index, setIndex] = useState<number | null>(null);

  const shown =
    active === "All" ? designs : designs.filter((d) => d.category === active);

  const current = index !== null ? shown[index] : null;

  // Remembers which tile opened the lightbox, so focus returns there on close.
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const open = (i: number, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setIndex(i);
  };
  const close = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus();
  }, []);
  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) =>
        i === null ? i : (i + dir + shown.length) % shown.length
      ),
    [shown.length]
  );

  // Modal behaviour: scroll-lock, keyboard (Esc / arrows), and focus trap.
  useEffect(() => {
    if (index === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      dialogRef.current
        ? Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button"))
        : [];
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        go(1);
      } else if (e.key === "ArrowLeft") {
        go(-1);
      } else if (e.key === "Tab") {
        const f = focusables();
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, go]);

  return (
    <div>
      {/* Filter chips */}
      <div className="mb-8 flex flex-wrap justify-center gap-2.5 md:justify-start">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            aria-pressed={active === f}
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
        {shown.map((d, i) => (
          <button
            key={d.id}
            type="button"
            onClick={(e) => open(i, e.currentTarget)}
            className="group relative aspect-square overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label={`View ${d.caption}`}
          >
            <DesignImage
              seed={d.id}
              decorative
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
      {current && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${current.caption} — ${current.category} mehendi design`}
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            ×
          </button>

          {/* Prev / Next (only when more than one image) */}
          {shown.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous design"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next design"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-6"
              >
                ›
              </button>
            </>
          )}

          <figure
            className="max-h-[85vh] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <DesignImage
              seed={current.id}
              alt={`${current.caption} — ${current.category} mehendi design by Bali`}
              className="aspect-square w-full rounded-2xl"
            />
            <figcaption className="mt-4 text-center text-sm text-cream">
              <span className="font-medium">{current.caption}</span>
              <span className="mx-2 text-gold-soft">·</span>
              <span className="text-cream/70">{current.category}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}

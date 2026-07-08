// Renders a design image. Pass `url` for a real photo (Supabase Storage public
// URL or any path), or `seed` to use a bundled /public/designs/<seed>.svg
// placeholder. `url` wins when both are given.
//
// Alt text:
//   - `decorative` → alt="" (something nearby names it)
//   - `alt`        → explicit description
//   - otherwise    → derived from `label`, else a sensible default

import Image from "next/image";

export default function DesignImage({
  seed,
  url,
  label,
  alt,
  decorative = false,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  className = "",
}: {
  seed?: string;
  url?: string;
  label?: string;
  alt?: string;
  decorative?: boolean;
  // Set on above-the-fold images (e.g. the hero) so they load eagerly and win
  // fetch priority — lazy-loading the LCP image needlessly delays first paint.
  priority?: boolean;
  // Responsive-source hint for next/image on remote photos; tune per slot.
  sizes?: string;
  className?: string;
}) {
  // `url` wins, but only when it's a non-empty string — an empty image_url from
  // the DB should fall back to the seed/default placeholder, not a broken <img>.
  const src = (url || undefined) ?? (seed ? `/designs/${seed}.svg` : "/designs/d01.svg");

  const altText = decorative
    ? ""
    : alt ?? (label ? `${label} mehendi design` : "Mehendi design by Bali");

  // Uploaded photos are remote (Supabase Storage) → optimize via next/image.
  // Bundled placeholders are small local SVGs → serve as-is (next/image would
  // need dangerouslyAllowSVG, which we avoid).
  const isRemote = /^https?:\/\//i.test(src);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-cream-deep ${className}`}
    >
      {isRemote ? (
        <Image
          src={src}
          alt={altText}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={altText}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
      )}

      {label && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/25 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white/90 backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}

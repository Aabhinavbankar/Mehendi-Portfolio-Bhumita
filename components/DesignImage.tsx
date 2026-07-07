// Renders a design image. Pass `url` for a real photo (Supabase Storage public
// URL or any path), or `seed` to use a bundled /public/designs/<seed>.svg
// placeholder. `url` wins when both are given.
//
// Alt text:
//   - `decorative` → alt="" (something nearby names it)
//   - `alt`        → explicit description
//   - otherwise    → derived from `label`, else a sensible default

export default function DesignImage({
  seed,
  url,
  label,
  alt,
  decorative = false,
  className = "",
}: {
  seed?: string;
  url?: string;
  label?: string;
  alt?: string;
  decorative?: boolean;
  className?: string;
}) {
  const src = url ?? (seed ? `/designs/${seed}.svg` : "/designs/d01.svg");

  const altText = decorative
    ? ""
    : alt ?? (label ? `${label} mehendi design` : "Mehendi design by Bali");

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-cream-deep ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={altText}
        loading="lazy"
        className="h-full w-full object-cover"
      />

      {label && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/25 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white/90 backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}

// Renders a design image from /public/designs/<seed>.svg.
// These are placeholder "dummy" mehendi designs — replace the files (or switch
// to Supabase Storage <Image> URLs) in phase 2 with Bhumita's real photos.

export default function DesignImage({
  seed,
  label,
  className = "",
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-cream-deep ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/designs/${seed}.svg`}
        alt={label ? `${label} mehendi design` : "Mehendi design by Bhumita"}
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

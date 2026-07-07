export default function SectionHeading({
  eyebrow,
  title,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "flex flex-col items-center text-center" : ""}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold text-henna text-balance md:text-4xl">
        {title}
      </h2>
      <div className={`rule-gold mt-5 ${center ? "" : ""}`} />
    </div>
  );
}

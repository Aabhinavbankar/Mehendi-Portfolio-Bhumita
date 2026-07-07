import type { ReactNode } from "react";

// Shared styling + tiny building blocks for the admin panels.

export const inputCls =
  "w-full rounded-lg border border-line bg-parchment px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-henna";

export const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-henna px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-henna-deep disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-cream px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-henna hover:text-henna";

export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50";

export const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-cream text-sm text-ink-soft transition-colors hover:border-henna hover:text-henna disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-soft";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      {children}
      {hint && <span className="text-xs text-ink-soft/80">{hint}</span>}
    </label>
  );
}

export function PanelHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-henna">
          {title}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{desc}</p>
      </div>
      {action && <div className="[&>button]:w-full sm:[&>button]:w-auto">{action}</div>}
    </div>
  );
}

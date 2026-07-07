"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site, whatsappUrl, defaultContact, type Contact } from "@/lib/site";

export default function Nav({ contact = defaultContact }: { contact?: Contact }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-henna"
          onClick={() => setOpen(false)}
        >
          {site.brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition-colors hover:text-henna ${
                  active ? "text-henna" : "text-ink-soft"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={whatsappUrl(contact)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-henna px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-henna-deep"
          >
            Book on WhatsApp
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col gap-1.5 p-1 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-ink transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-ink transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-ink transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-cream px-5 pb-6 pt-2 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line/60 py-3 text-base text-ink"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappUrl(contact)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-full bg-henna px-5 py-3 text-center text-base font-medium text-cream"
          >
            Book on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}

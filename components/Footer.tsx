import Link from "next/link";
import {
  emailUrl,
  instagramUrl,
  nav,
  site,
  whatsappUrl,
  defaultContact,
  type Contact,
} from "@/lib/site";

export default function Footer({
  contact = defaultContact,
}: {
  contact?: Contact;
}) {
  return (
    <footer className="mt-24 border-t border-line bg-parchment">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="flex flex-col gap-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="max-w-sm mx-auto md:mx-0">
            <p className="font-display text-2xl font-semibold text-henna">
              {site.brand}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {site.tagline} in {site.location}. Bookings open a limited number
              of dates each season.
            </p>
          </div>

          <div className="flex justify-center gap-14 md:justify-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
                Explore
              </p>
              <ul className="space-y-2 text-sm">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-ink transition-colors hover:text-henna"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
                Contact
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={whatsappUrl(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink transition-colors hover:text-henna"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={emailUrl(contact)}
                    className="text-ink transition-colors hover:text-henna"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href={instagramUrl(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink transition-colors hover:text-henna"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center text-xs text-ink-soft md:text-left">
          © {site.name}, {site.location}. Handcrafted mehendi.
        </div>
      </div>
    </footer>
  );
}

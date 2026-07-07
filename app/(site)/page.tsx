import Link from "next/link";
import { about, designs, testimonials } from "@/lib/data";
import { site } from "@/lib/site";
import DesignImage from "@/components/DesignImage";
import ContactButtons from "@/components/ContactButtons";
import SectionHeading from "@/components/SectionHeading";

export default function Home() {
  const featured = designs.filter((d) => d.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-parchment">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div className="text-center md:text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold-ink">
              {site.location}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-henna text-balance md:text-6xl">
              Mehendi, made a keepsake of your day.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              {site.tagline}. Intricate bridal, Arabic, and minimal designs —
              unhurried and personal to you.
            </p>
            <ContactButtons className="mt-8" />
          </div>

          {/* Hero image */}
          <div>
            <DesignImage
              seed="hero-main"
              label="Bridal"
              className="aspect-[4/5] w-full rounded-3xl shadow-xl shadow-henna/10"
            />
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:flex-wrap md:items-end md:justify-between md:text-left">
          <SectionHeading eyebrow="Selected work" title="Featured designs" />
          <Link
            href="/portfolio"
            className="text-sm font-medium text-henna hover:text-henna-deep"
          >
            View full portfolio →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {featured.map((d) => (
            <Link key={d.id} href="/portfolio" className="group block">
              <div className="overflow-hidden rounded-2xl">
                <DesignImage
                  seed={d.id}
                  decorative
                  className="aspect-[3/4] w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm text-ink">
                {d.caption}
                <span className="ml-2 text-xs uppercase tracking-wide text-ink-soft">
                  {d.category}
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-parchment">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-[1fr_1.2fr] md:px-8">
          <DesignImage
            seed="about-portrait"
            label="The artist"
            className="mx-auto aspect-square w-full max-w-sm rounded-3xl shadow-lg md:mx-0"
          />
          <div className="text-center md:text-left">
            <SectionHeading eyebrow="About" title="Meet Bali" />
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {about.intro}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-medium text-henna hover:text-henna-deep"
            >
              Read more about my work →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading eyebrow="Kind words" title="What brides say" center />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-2xl border border-line bg-cream p-7 text-center md:text-left"
            >
              <span className="font-display text-4xl leading-none text-gold-soft">
                “
              </span>
              <blockquote className="mt-2 flex-1 text-ink leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-henna">
                {t.brideName}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-henna">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
          <h2 className="font-display text-3xl font-semibold text-cream text-balance md:text-4xl">
            Booking a limited number of dates this season
          </h2>
          <p className="mt-4 text-cream/80">
            Tell me your event date and I'll share availability and details.
          </p>
          <div className="mt-8 flex justify-center">
            <ContactButtons className="[&_a:first-child]:bg-cream [&_a:first-child]:text-henna [&_a:first-child:hover]:bg-cream-deep [&_a:last-child]:border-cream [&_a:last-child]:text-cream [&_a:last-child:hover]:bg-cream [&_a:last-child:hover]:text-henna" />
          </div>
        </div>
      </section>
    </>
  );
}

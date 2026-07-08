import type { Metadata } from "next";
import { getServices, getSiteContent } from "@/lib/content";
import DesignImage from "@/components/DesignImage";
import ContactButtons from "@/components/ContactButtons";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About & Services",
  description:
    "About Bhumita Farkunde, bridal mehendi artist in Nagpur, and the services she offers. Contact for pricing.",
};

export default async function AboutPage() {
  const [{ about, contact, images }, services] = await Promise.all([
    getSiteContent(),
    getServices(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      {/* About */}
      <section className="grid items-start gap-10 md:grid-cols-[1fr_1.3fr]">
        <DesignImage
          url={images.portrait}
          seed="about-main"
          alt="Bhumita Farkunde — mehendi artist"
          className="mx-auto aspect-square w-full max-w-sm rounded-3xl shadow-lg md:mx-0 md:max-w-none"
        />
        <div className="text-center md:text-left">
          <SectionHeading eyebrow="About" title="A little about me" />
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            {about.intro}
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">{about.body}</p>
          <p className="mt-6 rounded-xl border border-line bg-parchment px-5 py-4 text-sm text-ink">
            <span className="font-semibold text-henna">Service areas:</span>{" "}
            {about.areas}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mt-20">
        <SectionHeading eyebrow="What I offer" title="Services" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-line bg-cream p-7 text-center md:text-left"
            >
              <h3 className="font-display text-xl font-semibold text-henna">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-parchment px-7 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="font-display text-xl font-semibold text-henna">
              Every event is priced individually.
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Share your date, design, and number of guests for a quote.
            </p>
          </div>
          <ContactButtons contact={contact} />
        </div>
      </section>
    </div>
  );
}

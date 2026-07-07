import type { Metadata } from "next";
import { Fraunces, Mulish } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--ff-display",
  display: "swap",
});

const body = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bhumitamehendi.com"),
  title: {
    default: `${site.brand} — ${site.tagline} in ${site.location}`,
    template: `%s · ${site.brand}`,
  },
  description: `${site.name} is a bridal & occasion mehendi artist in ${site.location}. Browse the portfolio and book on WhatsApp.`,
  keywords: [
    "mehendi artist Nagpur",
    "bridal mehendi Nagpur",
    "henna artist Nagpur",
    "bridal henna Maharashtra",
  ],
  openGraph: {
    title: `${site.brand} — ${site.tagline}`,
    description: `Bridal & occasion mehendi in ${site.location}.`,
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

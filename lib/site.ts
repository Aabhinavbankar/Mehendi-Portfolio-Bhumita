// Brand identity (static). Contact details are editable in the admin and stored
// in Supabase `site_content`; `defaultContact` is the fallback when the DB is
// unavailable, and drives everything before content is loaded.

export const site = {
  name: "Bhumita Farkunde",
  brand: "Mehendi by Bali",
  tagline: "Bridal & Occasion Mehendi Artist",
  location: "Nagpur, Maharashtra",
} as const;

export type Contact = {
  whatsapp: string;
  email: string;
  instagram: string;
  greeting: string;
  location: string;
};

export const defaultContact: Contact = {
  // WhatsApp: international format, digits only (91 = India).
  whatsapp: "919764419671",
  email: "bhumitaf17@gmail.com",
  instagram: "bhumita.mehendi",
  greeting:
    "Hi Bali! I saw your portfolio and I'm interested in bridal mehendi. My event is on ",
  location: "Nagpur, Maharashtra",
};

// Brand imagery editable in the admin (stored in `site_content` as the keys
// `hero_image` / `portrait_image`). Defaults are the bundled placeholder SVGs,
// so the site looks complete before the owner uploads real photos.
export type SiteImages = { hero: string; portrait: string };

export const defaultImages: SiteImages = {
  hero: "/designs/hero-main.svg",
  portrait: "/designs/about-main.svg",
};

/** wa.me deep link with the prefilled greeting. */
export function whatsappUrl(contact: Contact = defaultContact): string {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    contact.greeting
  )}`;
}

/** mailto: link with a preset subject + body. */
export function emailUrl(
  contact: Contact = defaultContact,
  subject = "Bridal Mehendi enquiry",
  body = "Hi Bali,\n\nI saw your portfolio and would like to enquire about mehendi for my event.\n\nEvent date:\nLocation:\n\nThank you!"
): string {
  return `mailto:${contact.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export function instagramUrl(contact: Contact = defaultContact): string {
  return `https://instagram.com/${contact.instagram}`;
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

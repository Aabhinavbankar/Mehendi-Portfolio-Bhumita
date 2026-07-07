// Central site config. Once the Supabase admin is live, the contact fields
// below are sourced from the `site_content` table instead — but these remain
// the safe fallbacks.

export const site = {
  name: "Bhumita Farkunde",
  brand: "Mehendi by Bali",
  tagline: "Bridal & Occasion Mehendi Artist",
  location: "Nagpur, Maharashtra",

  // Contact — WhatsApp must be in international format, digits only (91 = India).
  whatsapp: "919764419671",
  email: "bhumitaf17@gmail.com",
  instagram: "bhumita.mehendi",

  // Prefilled WhatsApp opener — gives Bali instant context on every lead.
  whatsappGreeting:
    "Hi Bali! I saw your portfolio and I'm interested in bridal mehendi. My event is on ",
} as const;

/** Builds a wa.me deep link with an optional prefilled message. */
export function whatsappUrl(message: string = site.whatsappGreeting): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Builds a mailto: link with a preset subject. */
export function emailUrl(
  subject = "Bridal Mehendi enquiry",
  body = "Hi Bali,\n\nI saw your portfolio and would like to enquire about mehendi for my event.\n\nEvent date:\nLocation:\n\nThank you!"
): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export const instagramUrl = `https://instagram.com/${site.instagram}`;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

import type { Design, Service, Testimonial } from "@/lib/data";

// In the admin prototype a design carries a `seed` for its placeholder image,
// separate from its id (real photos replace this once Supabase Storage is wired).
export type AdminDesign = Design & { seed?: string };

export type AboutInfo = { intro: string; body: string; areas: string };

export type ContactInfo = {
  whatsapp: string;
  email: string;
  instagram: string;
  greeting: string;
  location: string;
};

export type { Service, Testimonial };

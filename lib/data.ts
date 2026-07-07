// Sample content so the site looks complete before real photos are uploaded.
// In phase 2 this is replaced by reads from Supabase (designs / testimonials /
// site_content tables). The shapes below intentionally mirror that schema.

export const CATEGORIES = ["Bridal", "Arabic", "Minimal", "Festive"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Design = {
  id: string;
  category: Category;
  caption: string;
  featured: boolean;
};

// `id` also seeds the placeholder gradient, so each tile looks distinct.
export const designs: Design[] = [
  { id: "d01", category: "Bridal", caption: "Full bridal hands & feet", featured: true },
  { id: "d02", category: "Bridal", caption: "Portrait bridal with names", featured: true },
  { id: "d03", category: "Arabic", caption: "Bold Arabic trail", featured: true },
  { id: "d04", category: "Festive", caption: "Karwa Chauth special", featured: false },
  { id: "d05", category: "Minimal", caption: "Minimal floral band", featured: true },
  { id: "d06", category: "Bridal", caption: "Rajasthani dulhan set", featured: false },
  { id: "d07", category: "Arabic", caption: "Arabic with glitter finish", featured: false },
  { id: "d08", category: "Minimal", caption: "Single-finger vine", featured: false },
  { id: "d09", category: "Festive", caption: "Teej celebration design", featured: false },
  { id: "d10", category: "Bridal", caption: "Peacock motif bridal", featured: true },
  { id: "d11", category: "Arabic", caption: "Rose & leaf Arabic", featured: false },
  { id: "d12", category: "Minimal", caption: "Dainty back-hand pattern", featured: false },
];

export type Service = {
  title: string;
  detail: string;
};

export const services: Service[] = [
  {
    title: "Bridal Mehendi",
    detail: "Intricate full hands & feet for the bride, with names and personal motifs woven in.",
  },
  {
    title: "Engagement & Party",
    detail: "Elegant designs for engagements, sangeet, and family functions.",
  },
  {
    title: "Festive & Occasion",
    detail: "Karwa Chauth, Teej, Eid and celebration mehendi for groups at home.",
  },
];

export type Testimonial = {
  id: string;
  brideName: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    brideName: "Ananya, Nagpur",
    quote:
      "Bhumita made my bridal mehendi absolutely perfect. The detail on my hands had everyone at the wedding asking who my artist was!",
  },
  {
    id: "t2",
    brideName: "Sneha, Wardha",
    quote:
      "So patient and professional. She listened to exactly what I wanted and the colour came out beautifully dark.",
  },
  {
    id: "t3",
    brideName: "Rutuja, Nagpur",
    quote:
      "Booked her for my sangeet and the whole family loved their designs. Will definitely call her for every function.",
  },
];

export const about = {
  intro:
    "I'm Bhumita Farkunde, a bridal and occasion mehendi artist based in Nagpur. For every bride I treat her mehendi as a keepsake of her day — unhurried, personal, and rich in detail.",
  body:
    "From intricate full-bridal sets to delicate minimal patterns, I work closely with each client to design something that feels like theirs. I travel across Nagpur and nearby towns for weddings and functions, and take a limited number of bookings each season so every design gets the time it deserves.",
  areas: "Nagpur · Wardha · Amravati · nearby towns for destination weddings",
};

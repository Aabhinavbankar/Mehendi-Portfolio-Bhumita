import type { Category } from "@/lib/data";

// Public-facing shapes (no server imports — safe to import from client components).
export type PublicDesign = {
  id: string;
  imageUrl: string;
  category: Category;
  caption: string;
  featured: boolean;
};

export type PublicTestimonial = {
  id: string;
  brideName: string;
  quote: string;
};

export type PublicService = { title: string; detail: string };

export type AboutContent = { intro: string; body: string; areas: string };

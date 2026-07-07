import type { Category } from "@/lib/data";

// Database row shapes (snake_case, as stored in Supabase).
export type DesignRow = {
  id: string;
  image_url: string;
  category: Category;
  caption: string;
  is_featured: boolean;
  sort_order: number;
};

export type TestimonialRow = {
  id: string;
  bride_name: string;
  quote: string;
  sort_order: number;
};

export type ServiceRow = {
  id: string;
  title: string;
  detail: string;
  sort_order: number;
};

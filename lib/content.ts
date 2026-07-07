import "server-only";
import { createClient } from "@/lib/supabase/server";
import * as fallback from "@/lib/data";
import { defaultContact, type Contact } from "@/lib/site";
import type {
  AboutContent,
  PublicDesign,
  PublicService,
  PublicTestimonial,
} from "@/lib/types";

// Server-side reads for the public site. Every function falls back to the
// bundled sample data if Supabase is unreachable, so the site never breaks.

export async function getDesigns(): Promise<PublicDesign[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) throw error ?? new Error("empty");
    return data.map((r) => ({
      id: r.id as string,
      imageUrl: r.image_url as string,
      category: r.category,
      caption: r.caption as string,
      featured: r.is_featured as boolean,
    }));
  } catch {
    return fallback.designs.map((d) => ({
      id: d.id,
      imageUrl: `/designs/${d.id}.svg`,
      category: d.category,
      caption: d.caption,
      featured: d.featured,
    }));
  }
}

export async function getTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) throw error ?? new Error("empty");
    return data.map((r) => ({
      id: r.id as string,
      brideName: r.bride_name as string,
      quote: r.quote as string,
    }));
  } catch {
    return fallback.testimonials.map((t) => ({
      id: t.id,
      brideName: t.brideName,
      quote: t.quote,
    }));
  }
}

export async function getServices(): Promise<PublicService[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) throw error ?? new Error("empty");
    return data.map((r) => ({ title: r.title as string, detail: r.detail as string }));
  } catch {
    return fallback.services.map((s) => ({ ...s }));
  }
}

export async function getSiteContent(): Promise<{
  about: AboutContent;
  contact: Contact;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_content").select("*");
    if (error || !data) throw error ?? new Error("empty");
    const m = Object.fromEntries(data.map((r) => [r.key as string, r.value as string]));
    return {
      about: {
        intro: m.about_intro ?? fallback.about.intro,
        body: m.about_body ?? fallback.about.body,
        areas: m.about_areas ?? fallback.about.areas,
      },
      contact: {
        whatsapp: m.whatsapp ?? defaultContact.whatsapp,
        email: m.email ?? defaultContact.email,
        instagram: m.instagram ?? defaultContact.instagram,
        greeting: m.greeting ?? defaultContact.greeting,
        location: m.location ?? defaultContact.location,
      },
    };
  } catch {
    return { about: { ...fallback.about }, contact: { ...defaultContact } };
  }
}

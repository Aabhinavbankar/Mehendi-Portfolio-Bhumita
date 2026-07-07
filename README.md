# Bhumita Mehendi — Portfolio

Public portfolio site for **Bhumita Farkunde**, bridal & occasion mehendi artist in Nagpur, MH.
Built with **Next.js (App Router)** + **Tailwind CSS**, deployed on **Vercel**.

> **Status: Phase 1 — public site.** All content is currently sample data in
> `lib/data.ts`. The Supabase-backed admin (auth + upload) is phase 2; the code
> is already structured so it drops in cleanly.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

```
app/
  layout.tsx        root layout, fonts, SEO metadata, sticky WhatsApp
  page.tsx          Home (hero, featured, about teaser, testimonials, CTA)
  portfolio/        gallery with filter + lightbox
  about/            about + services ("contact for pricing")
  contact/          WhatsApp / email / Instagram / location
components/         Nav, Footer, Gallery, DesignImage (placeholder), etc.
lib/
  site.ts           brand + contact config, wa.me / mailto builders
  data.ts           SAMPLE designs, services, testimonials, about copy
```

## Before you deploy — edit these

1. **`lib/site.ts`** — set the real `whatsapp` number (intl format, e.g.
   `919876543210`), `email`, and `instagram` handle.
2. **`lib/data.ts`** — sample designs/testimonials until the admin is live.

Image tiles are CSS-gradient placeholders (`components/DesignImage.tsx`) so the
site looks complete before real photos exist. They're replaced by uploaded
photos in phase 2.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel → **New Project** → import the repo → **Deploy** (no config needed).
3. Add your custom domain (e.g. `bhumitamehendi.com`) in Project → Domains.

## Phase 2 — Supabase admin (planned)

- **Auth:** one owner account gates `/admin`.
- **Postgres:** `designs`, `testimonials`, `site_content` tables.
- **Storage:** `designs` bucket for photos (auto-optimized via Supabase image
  transforms, rendered through `next/image`).
- **RLS:** public `SELECT` only; authenticated owner does all writes.

Copy `.env.local.example` → `.env.local` and fill in Supabase keys when we build it.

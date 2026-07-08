# Bhumita Mehendi — Portfolio

Public portfolio site for **Bhumita Farkunde**, bridal & occasion mehendi artist in Nagpur, MH.
Built with **Next.js (App Router)** + **Tailwind CSS**, deployed on **Vercel**.

> **Status: public site + Supabase admin, both live.** Content is served from
> Supabase (designs, testimonials, services, about/contact, brand photos) and
> managed at `/admin`. If Supabase is unreachable the site falls back to the
> bundled sample data in `lib/data.ts`, so it never breaks.

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
components/         Nav, Footer, Gallery, DesignImage, admin panels, etc.
lib/
  site.ts           brand config + wa.me / mailto builders + default fallbacks
  content.ts        server-side reads from Supabase (with sample-data fallback)
  storage.ts        image upload (client-side compression) + cleanup helpers
  data.ts           SAMPLE content used only when Supabase is unreachable
supabase/
  schema.sql        tables, RLS, storage bucket, realtime, seed — safe to re-run
```

## First-time Supabase setup

1. Create a Supabase project.
2. **SQL Editor → New query →** paste `supabase/schema.sql` → **Run** (idempotent,
   safe to re-run).
3. Copy `.env.local.example` → `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`
   and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
4. **Authentication → Users → Add user** — create the single owner account. That
   email/password logs into `/admin`.

Everything (contact details, about copy, services, testimonials, designs, and the
hero/portrait photos) is then editable in the admin — no code changes needed.
Uploaded photos are downscaled in the browser before upload and served via
`next/image`. Bundled `/public/designs/*.svg` placeholders show until real photos
are added.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel → **New Project** → import the repo → add the two
   `NEXT_PUBLIC_SUPABASE_*` env vars → **Deploy**.
3. Add your custom domain (e.g. `bhumitamehendi.com`) in Project → Domains.

## Data model (see `supabase/schema.sql`)

- **Tables:** `designs`, `testimonials`, `services`, `site_content` (key/value for
  about copy, contact info, and the `hero_image` / `portrait_image` URLs).
- **Storage:** public `designs` bucket for uploaded photos.
- **RLS:** anyone may `SELECT`; only the authenticated owner may write.
- **Realtime:** content tables broadcast changes so the owner's open preview
  updates live.

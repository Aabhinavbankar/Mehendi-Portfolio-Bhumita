-- Mehendi by Bali — database schema
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

create table if not exists public.designs (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  category    text not null check (category in ('Bridal','Arabic','Minimal','Festive')),
  caption     text not null default '',
  is_featured boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  bride_name  text not null,
  quote       text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  detail      text not null default '',
  sort_order  int not null default 0
);

-- Simple key/value store for editable About + contact/business info.
create table if not exists public.site_content (
  key   text primary key,
  value text not null default ''
);

-- ─────────────────────────────────────────────────────────────
-- Row-Level Security: public can READ, only the owner can WRITE
-- ─────────────────────────────────────────────────────────────

alter table public.designs      enable row level security;
alter table public.testimonials enable row level security;
alter table public.services     enable row level security;
alter table public.site_content enable row level security;

do $$
declare t text;
begin
  foreach t in array array['designs','testimonials','services','site_content']
  loop
    execute format('drop policy if exists "public read %1$s" on public.%1$s', t);
    execute format('drop policy if exists "owner write %1$s" on public.%1$s', t);

    -- Anyone (anon + authenticated) may read.
    execute format(
      'create policy "public read %1$s" on public.%1$s for select using (true)', t);

    -- Only a logged-in session may insert/update/delete.
    execute format(
      'create policy "owner write %1$s" on public.%1$s for all
         to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────
-- Storage bucket for uploaded design photos (public read)
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('designs', 'designs', true)
on conflict (id) do nothing;

drop policy if exists "designs public read"   on storage.objects;
drop policy if exists "designs owner write"   on storage.objects;

create policy "designs public read" on storage.objects
  for select using (bucket_id = 'designs');

create policy "designs owner write" on storage.objects
  for all to authenticated
  using (bucket_id = 'designs') with check (bucket_id = 'designs');

-- ─────────────────────────────────────────────────────────────
-- Reorder helper: atomically renumber designs from an ordered id array.
-- Assigning positional ordinality in a single UPDATE makes reordering
-- transactional AND repairs any duplicate/tied sort_order values.
-- ─────────────────────────────────────────────────────────────

create or replace function public.reorder_designs(ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.designs d
  set sort_order = pos.ord
  from (
    select id, ordinality as ord
    from unnest(ids) with ordinality as u(id, ordinality)
  ) pos
  where d.id = pos.id;
end $$;

-- Only the authenticated owner may reorder (security definer bypasses RLS).
revoke all on function public.reorder_designs(uuid[]) from public, anon;
grant execute on function public.reorder_designs(uuid[]) to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Seed content (keeps the live site populated after switching to DB)
-- ─────────────────────────────────────────────────────────────

insert into public.site_content (key, value) values
  ('about_intro', 'I''m Bhumita Farkunde — Bali — a bridal and occasion mehendi artist based in Nagpur. For every bride I treat her mehendi as a keepsake of her day — unhurried, personal, and rich in detail.'),
  ('about_body',  'From intricate full-bridal sets to delicate minimal patterns, I work closely with each client to design something that feels like theirs. I travel across Nagpur and nearby towns for weddings and functions, and take a limited number of bookings each season so every design gets the time it deserves.'),
  ('about_areas', 'Nagpur · Wardha · Amravati · nearby towns for destination weddings'),
  ('whatsapp',    '919764419671'),
  ('email',       'bhumitaf17@gmail.com'),
  ('instagram',   'bhumita.mehendi'),
  ('greeting',    'Hi Bali! I saw your portfolio and I''m interested in bridal mehendi. My event is on '),
  ('location',    'Nagpur, Maharashtra'),
  -- Brand imagery, editable under Admin → About & Services → Photos.
  -- Empty = fall back to the bundled placeholder SVGs.
  ('hero_image',     ''),
  ('portrait_image', '')
on conflict (key) do nothing;

-- NOTE: designs / testimonials / services have surrogate uuid PKs, so a bare
-- `on conflict do nothing` would never fire on re-run and would duplicate every
-- seed row. Each seed is instead guarded by `where not exists (... any row)`,
-- so it only populates an empty table and is genuinely safe to re-run.

insert into public.services (title, detail, sort_order)
select * from (values
  ('Bridal Mehendi', 'Intricate full hands & feet for the bride, with names and personal motifs woven in.', 1),
  ('Engagement & Party', 'Elegant designs for engagements, sangeet, and family functions.', 2),
  ('Festive & Occasion', 'Karwa Chauth, Teej, Eid and celebration mehendi for groups at home.', 3)
) as v(title, detail, sort_order)
where not exists (select 1 from public.services);

insert into public.testimonials (bride_name, quote, sort_order)
select * from (values
  ('Ananya, Nagpur', 'Bhumita made my bridal mehendi absolutely perfect. The detail on my hands had everyone at the wedding asking who my artist was!', 1),
  ('Sneha, Wardha', 'So patient and professional. She listened to exactly what I wanted and the colour came out beautifully dark.', 2),
  ('Rutuja, Nagpur', 'Booked her for my sangeet and the whole family loved their designs. Will definitely call her for every function.', 3)
) as v(bride_name, quote, sort_order)
where not exists (select 1 from public.testimonials);

-- Seed the current placeholder designs so the gallery stays populated until
-- real photos are uploaded. These point at the bundled /public/designs SVGs;
-- uploaded photos will store a full Supabase Storage URL instead.
-- ─────────────────────────────────────────────────────────────
-- Realtime: broadcast row changes to subscribed browsers (live updates
-- without a page reload). Safe to re-run.
-- ─────────────────────────────────────────────────────────────

do $$
declare t text;
begin
  foreach t in array array['designs','testimonials','services','site_content']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────

insert into public.designs (image_url, category, caption, is_featured, sort_order)
select * from (values
  ('/designs/d01.svg', 'Bridal',  'Full bridal hands & feet',    true,  1),
  ('/designs/d02.svg', 'Bridal',  'Portrait bridal with names',  true,  2),
  ('/designs/d03.svg', 'Arabic',  'Bold Arabic trail',           true,  3),
  ('/designs/d04.svg', 'Festive', 'Karwa Chauth special',        false, 4),
  ('/designs/d05.svg', 'Minimal', 'Minimal floral band',         true,  5),
  ('/designs/d06.svg', 'Bridal',  'Rajasthani dulhan set',       false, 6),
  ('/designs/d07.svg', 'Arabic',  'Arabic with glitter finish',  false, 7),
  ('/designs/d08.svg', 'Minimal', 'Single-finger vine',          false, 8),
  ('/designs/d09.svg', 'Festive', 'Teej celebration design',     false, 9),
  ('/designs/d10.svg', 'Bridal',  'Peacock motif bridal',        true,  10),
  ('/designs/d11.svg', 'Arabic',  'Rose & leaf Arabic',          false, 11),
  ('/designs/d12.svg', 'Minimal', 'Dainty back-hand pattern',    false, 12)
) as v(image_url, category, caption, is_featured, sort_order)
where not exists (select 1 from public.designs);

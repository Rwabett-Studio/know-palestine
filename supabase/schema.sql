-- Know Palestine — content schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.

-- ---------- updated_at trigger helper ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- cities ----------
create table if not exists public.cities (
  id text primary key,
  name text not null,
  name_en text,
  region text not null,
  status text not null,
  founded_year text,
  founded_year_en text,
  population_before_1948 text,
  short_desc text not null default '',
  short_desc_en text,
  description text not null default '',
  description_en text,
  geography text not null default '',
  geography_en text,
  history text not null default '',
  history_en text,
  natives text not null default '',
  natives_en text,
  highlights text[] not null default '{}',
  highlights_en text[] not null default '{}',
  naming text not null default '',
  naming_en text,
  zionist_name text not null default '',
  zionist_name_en text,
  brief text not null default '',
  brief_en text,
  image text not null default '',
  gallery text[] not null default '{}',
  date text not null default '',
  date_en text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- articles ----------
create table if not exists public.articles (
  id text primary key,
  title text not null,
  title_en text,
  excerpt text not null default '',
  excerpt_en text,
  date text not null default '',
  date_en text,
  image text not null default '',
  category text not null,
  author text,
  author_en text,
  reading_time int,
  body jsonb not null default '[]'::jsonb,
  body_en jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- figures ----------
create table if not exists public.figures (
  id text primary key,
  name text not null,
  name_en text,
  birth_year int,
  death_year int,
  birth_city text,
  field text not null,
  bio text not null default '',
  bio_en text,
  portrait text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- history_events ----------
create table if not exists public.history_events (
  id text primary key,
  title text not null,
  title_en text,
  event_date text not null default '',
  event_date_en text,
  iso_date date,
  event_type text not null,
  description text not null default '',
  description_en text,
  image text not null default '',
  related_city text,
  sources text[] not null default '{}',
  sources_en text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
drop trigger if exists trg_cities_updated on public.cities;
create trigger trg_cities_updated before update on public.cities
  for each row execute function public.set_updated_at();

drop trigger if exists trg_articles_updated on public.articles;
create trigger trg_articles_updated before update on public.articles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_figures_updated on public.figures;
create trigger trg_figures_updated before update on public.figures
  for each row execute function public.set_updated_at();

drop trigger if exists trg_history_updated on public.history_events;
create trigger trg_history_updated before update on public.history_events
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
-- Public (anon) can READ. Only logged-in (authenticated) admins can write.
alter table public.cities enable row level security;
alter table public.articles enable row level security;
alter table public.figures enable row level security;
alter table public.history_events enable row level security;

do $$
declare t text;
begin
  foreach t in array array['cities','articles','figures','history_events'] loop
    execute format('drop policy if exists %I on public.%I', t || '_read', t);
    execute format('drop policy if exists %I on public.%I', t || '_write', t);

    execute format(
      'create policy %I on public.%I for select using (true)',
      t || '_read', t
    );
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      t || '_write', t
    );
  end loop;
end $$;

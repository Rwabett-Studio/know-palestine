-- ============================================================
-- M1: Add content publish_status + site_settings editable content
-- Run this in Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Add `publish_status` column to all content tables
--    (named publish_status to avoid collision with City.status
--    which already holds the geographic status value)
--    Values: 'published' | 'draft' | 'archived'
--    Default: 'published' so ALL existing rows remain visible.
-- ────────────────────────────────────────────────────────────

alter table articles
  add column if not exists publish_status text not null default 'published'
  check (publish_status in ('published', 'draft', 'archived'));

alter table cities
  add column if not exists publish_status text not null default 'published'
  check (publish_status in ('published', 'draft', 'archived'));

alter table figures
  add column if not exists publish_status text not null default 'published'
  check (publish_status in ('published', 'draft', 'archived'));

alter table history_events
  add column if not exists publish_status text not null default 'published'
  check (publish_status in ('published', 'draft', 'archived'));

-- Indexes for fast public queries (only published content is shown)
create index if not exists articles_publish_status_idx      on articles      (publish_status);
create index if not exists cities_publish_status_idx        on cities        (publish_status);
create index if not exists figures_publish_status_idx       on figures       (publish_status);
create index if not exists history_events_publish_status_idx on history_events (publish_status);


-- ────────────────────────────────────────────────────────────
-- 2. site_settings — editable site-wide content
--    Replaces hardcoded HOME_HERO, INTRO_BLOCK, About content
-- ────────────────────────────────────────────────────────────

create table if not exists site_settings (
  key         text primary key,
  value_ar    text not null default '',
  value_en    text not null default '',
  updated_at  timestamptz not null default now()
);

alter table site_settings enable row level security;

drop policy if exists "site_settings_public_read"  on site_settings;
drop policy if exists "site_settings_admin_write"  on site_settings;

create policy "site_settings_public_read" on site_settings
  for select using (true);

create policy "site_settings_admin_write" on site_settings
  for all using (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- 3. Seed default values (won't override existing keys)
-- ────────────────────────────────────────────────────────────

insert into site_settings (key, value_ar, value_en) values

  ('home_hero_title',
   'فلسطين هي خارطتنا وبلدنا وستبقى حرة ووجهتنا الأولى والأخيرة.',
   'Palestine is our map, our homeland, and will remain free — our first and final destination.'),

  ('home_hero_description',
   'تمتاز فلسطين بعراقتها وتاريخها وعادات الضيافة المميزة فيها. تقع في قلب العالم بين أفريقيا وأوروبا وآسيا. تتميز فلسطين بتعدد اللغات المستخدمة فيها وتعدد الثقافات والمعتقدات.',
   'Palestine is distinguished by its heritage, history, and traditions of hospitality. It lies at the heart of the world between Africa, Europe, and Asia, with a rich diversity of languages, cultures, and beliefs.'),

  ('intro_block_title',
   'ما لا تعرفه عن فلسطين',
   'What you don''t know about Palestine'),

  ('intro_block_paragraph',
   'فلسطين هي المنطقة الواقعة جنوب غرب آسيا، في الجزء الجنوبي من بلاد الشام. وتمتد أراضيها على طول الساحل الشرقي للبحر الأبيض المتوسط.',
   'Palestine is the region located in southwest Asia, in the southern part of the Levant, extending along the eastern Mediterranean coast.'),

  ('intro_block_image',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Dome_of_the_Rock_Temple_Mount.jpg/640px-Dome_of_the_Rock_Temple_Mount.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Dome_of_the_Rock_Temple_Mount.jpg/640px-Dome_of_the_Rock_Temple_Mount.jpg'),

  ('about_tagline',
   'منصة رقمية متخصصة في توثيق فلسطين — مدنها، تاريخها، شخصياتها، وأحداثها — بأسلوب صحفي رصين.',
   'A digital platform dedicated to documenting Palestine — its cities, history, figures, and events — with rigorous journalistic standards.'),

  ('about_intro',
   'منصة رقمية مستقلة لتوثيق فلسطين بأسلوب صحفي رصين.',
   'An independent digital platform documenting Palestine with rigorous journalistic standards.'),

  ('about_mission_title',  'رسالتنا',                 'Our Mission'),

  ('about_mission_body',
   'أن نُبقي الذاكرة الفلسطينية حيّةً ومتاحة، وأن نُقدّم محتوى موثّقاً ومحرَّراً بعناية يخدم الباحثين وأبناء الشتات والقرّاء على حدٍّ سواء.',
   'To keep the Palestinian memory alive and accessible, and to provide carefully edited, documented content that serves researchers, the diaspora, and readers alike.'),

  ('footer_tagline',
   'منصة رقمية متخصصة في توثيق فلسطين.',
   'A digital platform dedicated to documenting Palestine.'),

  ('social_twitter',   '', ''),
  ('social_facebook',  '', ''),
  ('social_instagram', '', ''),
  ('social_youtube',   '', '')

on conflict (key) do nothing;

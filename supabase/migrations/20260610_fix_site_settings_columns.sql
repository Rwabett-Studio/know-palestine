-- ─────────────────────────────────────────────────────────────────────────────
-- Fix: site_settings table may already exist with wrong / missing columns.
-- Run this in Supabase SQL Editor instead of the original M1 migration.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add missing columns (safe – IF NOT EXISTS ignores already-present columns)
alter table site_settings
  add column if not exists value_ar   text not null default '',
  add column if not exists value_en   text not null default '',
  add column if not exists updated_at timestamptz not null default now();

-- 2. Ensure the primary key column is named `key` (rename if it was called something else)
--    If your table already has a column called `key` this is a no-op:
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'site_settings' and column_name = 'key'
  ) then
    -- try common alternative names
    begin alter table site_settings rename column id   to key; exception when others then null; end;
    begin alter table site_settings rename column name to key; exception when others then null; end;
  end if;
end $$;

-- 3. Make sure RLS policies exist
alter table site_settings enable row level security;

drop policy if exists "site_settings_public_read" on site_settings;
drop policy if exists "site_settings_admin_write" on site_settings;

create policy "site_settings_public_read" on site_settings
  for select using (true);

create policy "site_settings_admin_write" on site_settings
  for all using (auth.role() = 'authenticated');

-- 4. Seed default values (won't overwrite anything already saved)
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

  ('about_mission_title',  'رسالتنا',  'Our Mission'),

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

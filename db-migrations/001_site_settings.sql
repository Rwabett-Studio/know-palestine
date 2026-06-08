-- ============================================================
-- Site Settings table
-- CMS-editable key-value store for homepage, footer & about content.
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT        PRIMARY KEY,
  value       JSONB       NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: public can read, authenticated users (admins) can write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "auth_write_settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Newsletter subscriptions table
-- Stores subscriber emails collected from the footer form.
-- ============================================================

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  active       BOOLEAN     NOT NULL DEFAULT true
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public can insert (subscribe)
CREATE POLICY "public_subscribe" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Authenticated admins can read and manage
CREATE POLICY "auth_manage_subscriptions" ON newsletter_subscriptions
  FOR ALL USING (auth.role() = 'authenticated');

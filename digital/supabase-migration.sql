-- Run this once in your Supabase SQL Editor
-- https://supabase.com → your project → SQL Editor → New query

CREATE TABLE IF NOT EXISTS public.users (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email        TEXT        UNIQUE NOT NULL,
  name         TEXT,
  avatar_url   TEXT,
  last_sign_in TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security: users can only read/update their own row
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own row"
  ON public.users FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own row"
  ON public.users FOR UPDATE
  USING (auth.jwt() ->> 'email' = email);

-- Service role (used server-side by NextAuth) can do anything
CREATE POLICY "Service role full access"
  ON public.users FOR ALL
  USING (auth.role() = 'service_role');

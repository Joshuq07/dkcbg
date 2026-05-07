-- ── Sessions ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sessions (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT        NOT NULL,
  password_hash  TEXT        NOT NULL,
  host_email     TEXT        NOT NULL,
  mode           TEXT        DEFAULT 'my' CHECK (mode IN ('my', 'global')),
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ── Session Members ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.session_members (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id   UUID        REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_email   TEXT        NOT NULL,
  display_name TEXT,
  joined_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, user_email)
);

-- ── Grid Rows (fixed, defined by host) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.grid_rows (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  UUID        REFERENCES public.sessions(id) ON DELETE CASCADE,
  row_label   TEXT        NOT NULL,
  row_order   INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Cell Entries (per user, per row) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.cell_entries (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  UUID        REFERENCES public.sessions(id) ON DELETE CASCADE,
  row_id      UUID        REFERENCES public.grid_rows(id) ON DELETE CASCADE,
  user_email  TEXT        NOT NULL,
  value       TEXT,
  icon        TEXT,
  label       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(row_id, user_email)
);

-- ── Disable RLS for now (re-enable later with proper policies) ──
ALTER TABLE public.sessions        DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.grid_rows       DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cell_entries    DISABLE ROW LEVEL SECURITY;

-- ── Enable Realtime on cell_entries and sessions ─────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.cell_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grid_rows;

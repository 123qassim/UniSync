-- Stable institution identifiers for BrainMate profiles.
CREATE TABLE IF NOT EXISTS public.brainmate_institutions (
    id UUID PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.brainmate_institutions (id, slug, name)
VALUES
    ('10000000-0000-4000-8000-000000000001', 'maseno', 'Maseno University'),
    ('10000000-0000-4000-8000-000000000002', 'nairobi', 'University of Nairobi'),
    ('10000000-0000-4000-8000-000000000003', 'strathmore', 'Strathmore University')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name;

ALTER TABLE public.brainmate_institutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read BrainMate institutions"
ON public.brainmate_institutions;

CREATE POLICY "Authenticated users can read BrainMate institutions"
ON public.brainmate_institutions
FOR SELECT
TO authenticated
USING (true);

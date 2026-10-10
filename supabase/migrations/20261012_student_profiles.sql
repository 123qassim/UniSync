-- Persistent UniPath profiles owned by Supabase Auth users.
CREATE TABLE IF NOT EXISTS public.student_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    university_id TEXT NOT NULL DEFAULT 'maseno',
    programme_id TEXT NOT NULL DEFAULT 'bsc-cs',
    current_year INTEGER NOT NULL DEFAULT 1,
    current_semester INTEGER NOT NULL DEFAULT 1,
    grading_scale TEXT NOT NULL DEFAULT 'percentage',
    units JSONB NOT NULL DEFAULT '[]'::jsonb,
    interests TEXT[] NOT NULL DEFAULT '{}',
    skills_to_develop TEXT[] NOT NULL DEFAULT '{}',
    career_goals TEXT,
    consent JSONB NOT NULL DEFAULT '{}'::jsonb,
    saved_roadmap_ids TEXT[] NOT NULL DEFAULT '{}',
    completed_roadmap_steps TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own student profile" ON public.student_profiles;
CREATE POLICY "Users can read own student profile"
ON public.student_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own student profile" ON public.student_profiles;
CREATE POLICY "Users can insert own student profile"
ON public.student_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own student profile" ON public.student_profiles;
CREATE POLICY "Users can update own student profile"
ON public.student_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own student profile" ON public.student_profiles;
CREATE POLICY "Users can delete own student profile"
ON public.student_profiles FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_student_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER set_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_student_profile_updated_at();

-- ==============================================================================
-- BrainMate Flagship Features Schema (Supabase PostgreSQL)
-- 1. Skill Swap Bilateral Proposals
-- 2. Focus Pod Rooms & Shared Sprint Goals
-- 3. Exam Readiness & Syllabus Mastery
-- 4. Peer Academic Endorsements & Karma Ledger
-- ==============================================================================

-- 1. SKILL SWAPS TABLE
CREATE TABLE IF NOT EXISTS public.skill_swap_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    sender_teaches TEXT NOT NULL,
    sender_learns TEXT NOT NULL,
    preferred_slot TEXT NOT NULL,
    custom_note TEXT,
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'declined', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FOCUS POD ACTIVE SESSIONS & KANBAN GOALS
CREATE TABLE IF NOT EXISTS public.focus_pod_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pod_id TEXT NOT NULL DEFAULT 'pod-global',
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.focus_pod_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pod_id TEXT NOT NULL DEFAULT 'pod-global',
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXAM READINESS TOPICS
CREATE TABLE IF NOT EXISTS public.exam_readiness_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    course_code TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    is_mastered BOOLEAN NOT NULL DEFAULT false,
    weight INTEGER NOT NULL DEFAULT 10,
    difficulty TEXT NOT NULL DEFAULT 'Medium',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_code, topic_id)
);

-- 4. PEER ACADEMIC ENDORSEMENTS
CREATE TABLE IF NOT EXISTS public.peer_endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_student_id TEXT NOT NULL,
    from_student_name TEXT NOT NULL,
    to_student_id TEXT NOT NULL,
    course_code TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('algorithm_explainer', 'debugging_champion', 'exam_prep_mvp', 'syntax_whisperer', 'patient_mentor', 'punctual_peer')),
    comment TEXT NOT NULL,
    karma_points INTEGER NOT NULL DEFAULT 35,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDY KARMA LEDGER
CREATE TABLE IF NOT EXISTS public.study_karma_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    action_title TEXT NOT NULL,
    delta_karma INTEGER NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('endorsement_received', 'session_attendance', 'sprint_completion', 'mentoring', 'peer_review')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.skill_swap_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_pod_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_pod_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_readiness_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_karma_ledger ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for authenticated / demo access
DO $$ BEGIN
    CREATE POLICY "Allow read skill swaps" ON public.skill_swap_proposals FOR SELECT USING (true);
    CREATE POLICY "Allow insert skill swaps" ON public.skill_swap_proposals FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow update skill swaps" ON public.skill_swap_proposals FOR UPDATE USING (true);

    CREATE POLICY "Allow read focus goals" ON public.focus_pod_goals FOR SELECT USING (true);
    CREATE POLICY "Allow insert focus goals" ON public.focus_pod_goals FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow update focus goals" ON public.focus_pod_goals FOR UPDATE USING (true);

    CREATE POLICY "Allow read focus notes" ON public.focus_pod_notes FOR SELECT USING (true);
    CREATE POLICY "Allow insert focus notes" ON public.focus_pod_notes FOR INSERT WITH CHECK (true);

    CREATE POLICY "Allow read readiness" ON public.exam_readiness_topics FOR SELECT USING (true);
    CREATE POLICY "Allow all readiness" ON public.exam_readiness_topics FOR ALL USING (true);

    CREATE POLICY "Allow read endorsements" ON public.peer_endorsements FOR SELECT USING (true);
    CREATE POLICY "Allow insert endorsements" ON public.peer_endorsements FOR INSERT WITH CHECK (true);

    CREATE POLICY "Allow read karma ledger" ON public.study_karma_ledger FOR SELECT USING (true);
    CREATE POLICY "Allow insert karma ledger" ON public.study_karma_ledger FOR INSERT WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.study_group_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL,
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
    resource_type TEXT NOT NULL DEFAULT 'document',
    size_label TEXT,
    storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_study_group_resources_group
    ON public.study_group_resources (group_id, created_at DESC);

ALTER TABLE public.study_group_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Group members can view resources" ON public.study_group_resources;
CREATE POLICY "Group members can view resources"
    ON public.study_group_resources FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.study_group_memberships membership
            WHERE membership.group_id = study_group_resources.group_id
              AND membership.user_id = auth.uid()
              AND membership.status = 'active'
        )
    );

DROP POLICY IF EXISTS "Group members can create resources" ON public.study_group_resources;
CREATE POLICY "Group members can create resources"
    ON public.study_group_resources FOR INSERT
    WITH CHECK (
        uploaded_by = auth.uid()
        AND EXISTS (
            SELECT 1
            FROM public.study_group_memberships membership
            WHERE membership.group_id = study_group_resources.group_id
              AND membership.user_id = auth.uid()
              AND membership.status = 'active'
        )
    );

INSERT INTO storage.buckets (id, name, public)
VALUES ('brainmate-resources', 'brainmate-resources', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Group members can download BrainMate resources" ON storage.objects;
CREATE POLICY "Group members can download BrainMate resources"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'brainmate-resources' AND auth.role() = 'authenticated');

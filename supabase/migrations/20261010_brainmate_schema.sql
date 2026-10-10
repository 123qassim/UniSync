-- ==============================================================================
-- UniSync BrainMate: Academic Collaboration & Peer Learning Schema
-- Supabase PostgreSQL Migration (Strict RLS, SECURITY DEFINER Functions)
-- ==============================================================================

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE study_level_enum AS ENUM ('undergraduate', 'postgraduate', 'doctorate', 'diploma');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE study_format_enum AS ENUM ('online', 'in_person', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE profile_visibility_enum AS ENUM ('institution', 'programme', 'connections_only');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE unit_role_enum AS ENUM ('can_help', 'needs_help', 'studying');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE unit_confidence_enum AS ENUM ('high', 'medium', 'low');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE connection_status_enum AS ENUM ('pending', 'accepted', 'declined', 'withdrawn', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE group_role_enum AS ENUM ('owner', 'moderator', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE group_membership_status_enum AS ENUM ('active', 'pending', 'left', 'removed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE group_visibility_enum AS ENUM ('public', 'invite_only');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status_enum AS ENUM ('scheduled', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_rsvp_enum AS ENUM ('going', 'maybe', 'declined');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status_enum AS ENUM ('open', 'reviewed', 'actioned', 'dismissed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_reason_enum AS ENUM ('academic_dishonesty', 'harassment', 'inappropriate_content', 'spam_or_solicitation', 'impersonation', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLES

-- Table: student_learning_profiles
CREATE TABLE IF NOT EXISTS student_learning_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    institution_id UUID NOT NULL,
    programme_id TEXT NOT NULL,
    study_level study_level_enum NOT NULL DEFAULT 'undergraduate',
    preferred_group_size INT NOT NULL DEFAULT 3 CHECK (preferred_group_size BETWEEN 2 AND 10),
    preferred_format study_format_enum NOT NULL DEFAULT 'hybrid',
    mentor_willingness BOOLEAN NOT NULL DEFAULT false,
    collaboration_goals TEXT[] NOT NULL DEFAULT '{}',
    visibility profile_visibility_enum NOT NULL DEFAULT 'institution',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: student_unit_preferences
CREATE TABLE IF NOT EXISTS student_unit_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES student_learning_profiles(id) ON DELETE CASCADE,
    academic_unit_id TEXT NOT NULL,
    role unit_role_enum NOT NULL,
    confidence unit_confidence_enum,
    topics TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_profile_unit_role UNIQUE (profile_id, academic_unit_id, role)
);

-- Table: study_availability
CREATE TABLE IF NOT EXISTS study_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES student_learning_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_time_order CHECK (start_time < end_time)
);

-- Table: user_blocks
CREATE TABLE IF NOT EXISTS user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID NOT NULL,
    blocked_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_not_self_block CHECK (blocker_id <> blocked_id),
    CONSTRAINT unique_blocker_blocked UNIQUE (blocker_id, blocked_id)
);

-- Table: study_connection_requests
CREATE TABLE IF NOT EXISTS study_connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    note TEXT,
    match_reason JSONB NOT NULL DEFAULT '{}'::jsonb,
    status connection_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    responded_at TIMESTAMPTZ,
    CONSTRAINT check_not_self_request CHECK (sender_id <> receiver_id)
);

-- Partial index: only one pending request per sender/receiver pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_request
    ON study_connection_requests (sender_id, receiver_id)
    WHERE status = 'pending';

-- Table: study_connections (canonical pair user_a_id < user_b_id)
CREATE TABLE IF NOT EXISTS study_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID NOT NULL,
    user_b_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_canonical_order CHECK (user_a_id < user_b_id),
    CONSTRAINT unique_study_connection UNIQUE (user_a_id, user_b_id)
);

-- Table: study_groups
CREATE TABLE IF NOT EXISTS study_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    purpose TEXT NOT NULL,
    institution_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    academic_unit_id TEXT NOT NULL,
    format study_format_enum NOT NULL DEFAULT 'hybrid',
    max_members INT NOT NULL DEFAULT 6 CHECK (max_members BETWEEN 2 AND 20),
    visibility group_visibility_enum NOT NULL DEFAULT 'public',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: study_group_memberships
CREATE TABLE IF NOT EXISTS study_group_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role group_role_enum NOT NULL DEFAULT 'member',
    status group_membership_status_enum NOT NULL DEFAULT 'active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_group_user UNIQUE (group_id, user_id)
);

-- Table: study_sessions
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES study_groups(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    academic_unit_id TEXT NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    location TEXT,
    online_url TEXT,
    agenda TEXT NOT NULL,
    status session_status_enum NOT NULL DEFAULT 'scheduled',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_session_dates CHECK (scheduled_start < scheduled_end)
);

-- Table: study_session_participants
CREATE TABLE IF NOT EXISTS study_session_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rsvp session_rsvp_enum NOT NULL DEFAULT 'going',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_session_participant UNIQUE (session_id, user_id)
);

-- Table: user_reports
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL,
    reported_id UUID NOT NULL,
    group_id UUID REFERENCES study_groups(id) ON DELETE SET NULL,
    reason report_reason_enum NOT NULL,
    details TEXT NOT NULL,
    status report_status_enum NOT NULL DEFAULT 'open',
    institution_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_profile_user ON student_learning_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_institution ON student_learning_profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_unit_pref_profile ON student_unit_preferences(profile_id);
CREATE INDEX IF NOT EXISTS idx_unit_pref_unit ON student_unit_preferences(academic_unit_id);
CREATE INDEX IF NOT EXISTS idx_availability_profile ON study_availability(profile_id);
CREATE INDEX IF NOT EXISTS idx_conn_req_sender ON study_connection_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_conn_req_receiver ON study_connection_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_users ON study_connections(user_a_id, user_b_id);
CREATE INDEX IF NOT EXISTS idx_groups_institution ON study_groups(institution_id);
CREATE INDEX IF NOT EXISTS idx_groups_unit ON study_groups(academic_unit_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON study_group_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_group ON study_sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_user ON study_session_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_institution ON user_reports(institution_id);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE student_learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_unit_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Helper function: check if users are blocked
CREATE OR REPLACE FUNCTION are_users_blocked(u1 UUID, u2 UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_blocks
        WHERE (blocker_id = u1 AND blocked_id = u2)
           OR (blocker_id = u2 AND blocked_id = u1)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies: student_learning_profiles
-- Self can read/write own profile
CREATE POLICY "Users can manage own learning profile"
    ON student_learning_profiles
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Other students can read allowed fields of profiles in same institution, unless blocked
CREATE POLICY "Students can read institution peers profiles if permitted"
    ON student_learning_profiles
    FOR SELECT
    USING (
        auth.uid() <> user_id
        AND NOT are_users_blocked(auth.uid(), user_id)
        AND institution_id = (SELECT p.institution_id FROM student_learning_profiles p WHERE p.user_id = auth.uid())
        AND (
            visibility = 'institution'
            OR (visibility = 'programme' AND programme_id = (SELECT p.programme_id FROM student_learning_profiles p WHERE p.user_id = auth.uid()))
            OR (visibility = 'connections_only' AND EXISTS (
                SELECT 1 FROM study_connections
                WHERE (user_a_id = LEAST(auth.uid(), user_id) AND user_b_id = GREATEST(auth.uid(), user_id))
            ))
        )
    );

-- Policies: student_unit_preferences
CREATE POLICY "Users can manage own unit preferences"
    ON student_unit_preferences
    FOR ALL
    USING (profile_id IN (SELECT id FROM student_learning_profiles WHERE user_id = auth.uid()))
    WITH CHECK (profile_id IN (SELECT id FROM student_learning_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Peers can read visible unit preferences"
    ON student_unit_preferences
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_learning_profiles p
            WHERE p.id = student_unit_preferences.profile_id
              AND NOT are_users_blocked(auth.uid(), p.user_id)
              AND p.institution_id = (SELECT p_self.institution_id FROM student_learning_profiles p_self WHERE p_self.user_id = auth.uid())
        )
    );

-- Policies: study_availability
CREATE POLICY "Users can manage own availability"
    ON study_availability
    FOR ALL
    USING (profile_id IN (SELECT id FROM student_learning_profiles WHERE user_id = auth.uid()))
    WITH CHECK (profile_id IN (SELECT id FROM student_learning_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Peers can read availability of institution peers"
    ON study_availability
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_learning_profiles p
            WHERE p.id = study_availability.profile_id
              AND NOT are_users_blocked(auth.uid(), p.user_id)
              AND p.institution_id = (SELECT p_self.institution_id FROM student_learning_profiles p_self WHERE p_self.user_id = auth.uid())
        )
    );

-- Policies: user_blocks
-- Blocker sees their own blocks; blocked user gets empty set, never an error
CREATE POLICY "Users can manage their block list"
    ON user_blocks
    FOR ALL
    USING (blocker_id = auth.uid())
    WITH CHECK (blocker_id = auth.uid());

-- Policies: study_connection_requests
CREATE POLICY "Participants can read their connection requests"
    ON study_connection_requests
    FOR SELECT
    USING ((sender_id = auth.uid() OR receiver_id = auth.uid()) AND NOT are_users_blocked(sender_id, receiver_id));

CREATE POLICY "Senders can create connection requests if not blocked"
    ON study_connection_requests
    FOR INSERT
    WITH CHECK (
        sender_id = auth.uid()
        AND NOT are_users_blocked(sender_id, receiver_id)
    );

CREATE POLICY "Receivers can update request status"
    ON study_connection_requests
    FOR UPDATE
    USING (receiver_id = auth.uid())
    WITH CHECK (receiver_id = auth.uid());

-- Policies: study_connections
CREATE POLICY "Connected users can read connection"
    ON study_connections
    FOR SELECT
    USING (user_a_id = auth.uid() OR user_b_id = auth.uid());

-- Policies: study_groups
CREATE POLICY "Users can view public groups in their institution or groups they belong to"
    ON study_groups
    FOR SELECT
    USING (
        (institution_id = (SELECT institution_id FROM student_learning_profiles WHERE user_id = auth.uid()) AND visibility = 'public')
        OR EXISTS (
            SELECT 1 FROM study_group_memberships m
            WHERE m.group_id = study_groups.id AND m.user_id = auth.uid() AND m.status = 'active'
        )
    );

CREATE POLICY "Owners can manage groups"
    ON study_groups
    FOR ALL
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- Policies: study_group_memberships
CREATE POLICY "Members can view membership lists of their groups or public groups"
    ON study_group_memberships
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM study_groups g
            WHERE g.id = study_group_memberships.group_id
              AND (g.visibility = 'public' OR g.owner_id = auth.uid() OR EXISTS (
                  SELECT 1 FROM study_group_memberships m2 WHERE m2.group_id = g.id AND m2.user_id = auth.uid() AND m2.status = 'active'
              ))
        )
    );

CREATE POLICY "Users can join or update own membership status"
    ON study_group_memberships
    FOR ALL
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM study_groups g WHERE g.id = study_group_memberships.group_id AND g.owner_id = auth.uid()
    ))
    WITH CHECK (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM study_groups g WHERE g.id = study_group_memberships.group_id AND g.owner_id = auth.uid()
    ));

-- Policies: study_sessions
CREATE POLICY "View sessions for my groups or public groups"
    ON study_sessions
    FOR SELECT
    USING (
        created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM study_session_participants p WHERE p.session_id = study_sessions.id AND p.user_id = auth.uid()
        )
        OR (group_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM study_groups g WHERE g.id = study_sessions.group_id AND (g.visibility = 'public' OR EXISTS (
                SELECT 1 FROM study_group_memberships m WHERE m.group_id = g.id AND m.user_id = auth.uid() AND m.status = 'active'
            ))
        ))
    );

CREATE POLICY "Organizers manage their sessions"
    ON study_sessions
    FOR ALL
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- Policies: study_session_participants
CREATE POLICY "Participants can view and update their rsvp"
    ON study_session_participants
    FOR ALL
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM study_sessions s WHERE s.id = study_session_participants.session_id AND s.created_by = auth.uid()))
    WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM study_sessions s WHERE s.id = study_session_participants.session_id AND s.created_by = auth.uid()));

-- Policies: user_reports
CREATE POLICY "Users can create reports"
    ON user_reports
    FOR INSERT
    WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Institution moderators can read reports"
    ON user_reports
    FOR SELECT
    USING (
        institution_id = (SELECT institution_id FROM student_learning_profiles WHERE user_id = auth.uid())
        AND (auth.jwt() ->> 'role' IN ('moderator', 'admin', 'institution_staff'))
    );

-- 5. CANDIDATE MATCHING POSTGRES FUNCTION (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION brainmate_match_candidates(current_uid UUID)
RETURNS TABLE (
    candidate_user_id UUID,
    candidate_profile_id UUID,
    programme_id TEXT,
    study_level study_level_enum,
    preferred_format study_format_enum,
    preferred_group_size INT,
    mentor_willingness BOOLEAN,
    collaboration_goals TEXT[],
    visibility profile_visibility_enum
) SECURITY DEFINER AS $$
DECLARE
    curr_inst UUID;
    curr_prog TEXT;
BEGIN
    -- Verify caller matches authenticated user
    IF auth.uid() IS NOT NULL AND auth.uid() <> current_uid THEN
        RAISE EXCEPTION 'Unauthorized: UID mismatch';
    END IF;

    -- Retrieve current user institution and programme
    SELECT p.institution_id, p.programme_id
    INTO curr_inst, curr_prog
    FROM student_learning_profiles p
    WHERE p.user_id = current_uid;

    IF curr_inst IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        p.user_id,
        p.id,
        p.programme_id,
        p.study_level,
        p.preferred_format,
        p.preferred_group_size,
        p.mentor_willingness,
        p.collaboration_goals,
        p.visibility
    FROM student_learning_profiles p
    WHERE p.user_id <> current_uid
      AND p.institution_id = curr_inst
      AND NOT are_users_blocked(current_uid, p.user_id)
      AND NOT EXISTS (
          SELECT 1 FROM study_connections sc
          WHERE (sc.user_a_id = LEAST(current_uid, p.user_id) AND sc.user_b_id = GREATEST(current_uid, p.user_id))
      )
      AND (
          p.visibility = 'institution'
          OR (p.visibility = 'programme' AND p.programme_id = curr_prog)
      );
END;
$$ LANGUAGE plpgsql;

-- 6. SAFETY TRIGGERS & BUSINESS LOGIC
-- Automatic enforcement when a user is blocked:
-- 1. Auto-remove blocked user from groups owned by blocker
-- 2. Terminate any pending connection requests between them
-- 3. Delete active study_connections between them
CREATE OR REPLACE FUNCTION on_user_block_enforce_boundaries()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-remove blocked user from groups owned by the blocker
    UPDATE study_group_memberships
    SET status = 'removed'
    WHERE user_id = NEW.blocked_id
      AND group_id IN (
          SELECT id FROM study_groups WHERE owner_id = NEW.blocker_id
      );

    -- Terminate/block any pending connection requests in either direction
    UPDATE study_connection_requests
    SET status = 'blocked', responded_at = timezone('utc'::text, now())
    WHERE ((sender_id = NEW.blocker_id AND receiver_id = NEW.blocked_id)
        OR (sender_id = NEW.blocked_id AND receiver_id = NEW.blocker_id))
      AND status = 'pending';

    -- Remove any active mutual study connection
    DELETE FROM study_connections
    WHERE (user_a_id = LEAST(NEW.blocker_id, NEW.blocked_id)
      AND user_b_id = GREATEST(NEW.blocker_id, NEW.blocked_id));

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_user_block_enforcement ON user_blocks;
CREATE TRIGGER trg_user_block_enforcement
AFTER INSERT ON user_blocks
FOR EACH ROW
EXECUTE FUNCTION on_user_block_enforce_boundaries();


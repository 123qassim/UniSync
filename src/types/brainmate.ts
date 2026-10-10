/**
 * UniSync BrainMate: TypeScript Interfaces & Enums
 * 
 * Strict TypeScript type definitions for all 11 BrainMate database tables,
 * PostgreSQL enums, Supabase table contracts, and hydrated domain models.
 * 
 * Tables Covered:
 *  1. student_learning_profiles
 *  2. student_unit_preferences
 *  3. study_availability
 *  4. user_blocks
 *  5. study_connection_requests
 *  6. study_connections
 *  7. study_groups
 *  8. study_group_memberships
 *  9. study_sessions
 * 10. study_session_participants
 * 11. user_reports
 */

// =============================================================================
// 1. ENUMS & ENUM UNION TYPES
// =============================================================================

/**
 * Academic level of the student.
 * Corresponds to Postgres ENUM `study_level_enum`.
 */
export enum StudyLevelEnum {
  UNDERGRADUATE = 'undergraduate',
  POSTGRADUATE = 'postgraduate',
  DOCTORATE = 'doctorate',
  DIPLOMA = 'diploma',
}
export type StudyLevel = 'undergraduate' | 'postgraduate' | 'doctorate' | 'diploma';

/**
 * Mode of study preferred by the student or used by a group/session.
 * Corresponds to Postgres ENUM `study_format_enum`.
 */
export enum StudyFormatEnum {
  ONLINE = 'online',
  IN_PERSON = 'in_person',
  HYBRID = 'hybrid',
}
export type StudyFormat = 'online' | 'in_person' | 'hybrid';

/**
 * Privacy visibility level of the student's learning profile.
 * Corresponds to Postgres ENUM `profile_visibility_enum`.
 */
export enum ProfileVisibilityEnum {
  INSTITUTION = 'institution',
  PROGRAMME = 'programme',
  CONNECTIONS_ONLY = 'connections_only',
}
export type ProfileVisibility = 'institution' | 'programme' | 'connections_only';

/**
 * Role of a student relative to a specific academic unit.
 * Corresponds to Postgres ENUM `unit_role_enum`.
 */
export enum UnitRoleEnum {
  CAN_HELP = 'can_help',
  NEEDS_HELP = 'needs_help',
  STUDYING = 'studying',
}
export type UnitRole = 'can_help' | 'needs_help' | 'studying';

/**
 * Self-reported mastery or confidence in a given academic unit.
 * Corresponds to Postgres ENUM `unit_confidence_enum`.
 */
export enum UnitConfidenceEnum {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
export type UnitConfidence = 'high' | 'medium' | 'low';

/**
 * Status of a peer-to-peer study connection request.
 * Corresponds to Postgres ENUM `connection_status_enum`.
 */
export enum ConnectionStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  WITHDRAWN = 'withdrawn',
  BLOCKED = 'blocked',
}
export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked';

/**
 * Role of a member inside a study group.
 * Corresponds to Postgres ENUM `group_role_enum`.
 */
export enum GroupRoleEnum {
  OWNER = 'owner',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}
export type GroupRole = 'owner' | 'moderator' | 'member';

/**
 * Membership status within a study group.
 * Corresponds to Postgres ENUM `group_membership_status_enum`.
 */
export enum GroupMembershipStatusEnum {
  ACTIVE = 'active',
  PENDING = 'pending',
  LEFT = 'left',
  REMOVED = 'removed',
}
export type GroupMembershipStatus = 'active' | 'pending' | 'left' | 'removed';

/**
 * Discoverability / join policy of a study group.
 * Corresponds to Postgres ENUM `group_visibility_enum`.
 */
export enum GroupVisibilityEnum {
  PUBLIC = 'public',
  INVITE_ONLY = 'invite_only',
}
export type GroupVisibility = 'public' | 'invite_only';

/**
 * Lifecycle status of a study session.
 * Corresponds to Postgres ENUM `session_status_enum`.
 */
export enum SessionStatusEnum {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

/**
 * Participant RSVP response for a study session.
 * Corresponds to Postgres ENUM `session_rsvp_enum`.
 */
export enum SessionRsvpEnum {
  GOING = 'going',
  MAYBE = 'maybe',
  DECLINED = 'declined',
}
export type SessionRsvp = 'going' | 'maybe' | 'declined';

/**
 * Moderation report review lifecycle status.
 * Corresponds to Postgres ENUM `report_status_enum`.
 */
export enum ReportStatusEnum {
  OPEN = 'open',
  REVIEWED = 'reviewed',
  ACTIONED = 'actioned',
  DISMISSED = 'dismissed',
}
export type ReportStatus = 'open' | 'reviewed' | 'actioned' | 'dismissed';

/**
 * Categories of safety and academic code violations.
 * Corresponds to Postgres ENUM `report_reason_enum`.
 */
export enum ReportReasonEnum {
  ACADEMIC_DISHONESTY = 'academic_dishonesty',
  HARASSMENT = 'harassment',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SPAM_OR_SOLICITATION = 'spam_or_solicitation',
  IMPERSONATION = 'impersonation',
  OTHER = 'other',
}
export type ReportReason =
  | 'academic_dishonesty'
  | 'harassment'
  | 'inappropriate_content'
  | 'spam_or_solicitation'
  | 'impersonation'
  | 'other';

// =============================================================================
// 2. DATABASE TABLE ROW INTERFACES (Direct 1:1 Schema Mapping)
// =============================================================================

/**
 * Table: `student_learning_profiles`
 * Central student study profile scoped strictly to an institution.
 */
export interface StudentLearningProfileRow {
  id: string; // UUID Primary Key
  user_id: string; // UUID Foreign Key (Auth User, Unique)
  institution_id: string; // UUID Foreign Key (Institution scope)
  programme_id: string; // Academic Programme ID
  study_level: StudyLevel;
  preferred_group_size: number; // 2 to 10
  preferred_format: StudyFormat;
  mentor_willingness: boolean;
  collaboration_goals: string[];
  visibility: ProfileVisibility;
  created_at: string; // TIMESTAMPTZ ISO string
  updated_at: string; // TIMESTAMPTZ ISO string
}

/**
 * Table: `student_unit_preferences`
 * Specific academic units a student wants to learn or can tutor/help with.
 */
export interface StudentUnitPreferenceRow {
  id: string; // UUID Primary Key
  profile_id: string; // UUID References student_learning_profiles(id)
  academic_unit_id: string; // Academic Unit Identifier (e.g. CSC 211)
  role: UnitRole;
  confidence: UnitConfidence | null;
  topics: string[]; // Specific focus topics within this unit
  created_at: string;
  updated_at: string;
}

/**
 * Table: `study_availability`
 * Weekly recurring availability windows for study pairing.
 */
export interface StudyAvailabilityRow {
  id: string; // UUID Primary Key
  profile_id: string; // UUID References student_learning_profiles(id)
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string; // HH:MM:SS or HH:MM 24-hr format
  end_time: string; // HH:MM:SS or HH:MM 24-hr format (start_time < end_time)
  created_at: string;
  updated_at: string;
}

/**
 * Table: `user_blocks`
 * Bidirectional safety boundaries blocking communication, search, and matching.
 */
export interface UserBlockRow {
  id: string; // UUID Primary Key
  blocker_id: string; // UUID
  blocked_id: string; // UUID (blocker_id <> blocked_id)
  created_at: string;
}

/**
 * Table: `study_connection_requests`
 * Connection requests sent between students with matching reason metadata.
 */
export interface StudyConnectionRequestRow {
  id: string; // UUID Primary Key
  sender_id: string; // UUID
  receiver_id: string; // UUID (sender_id <> receiver_id)
  note: string | null;
  match_reason: Record<string, unknown>; // JSONB metadata
  status: ConnectionStatus;
  created_at: string;
  responded_at: string | null;
}

/**
 * Table: `study_connections`
 * Canonical bidirectional active peer study connections (user_a_id < user_b_id).
 */
export interface StudyConnectionRow {
  id: string; // UUID Primary Key
  user_a_id: string; // UUID (canonical smaller UUID)
  user_b_id: string; // UUID (canonical larger UUID)
  created_at: string;
}

/**
 * Table: `study_groups`
 * Course-specific or topic-specific study circles scoped to an institution.
 */
export interface StudyGroupRow {
  id: string; // UUID Primary Key
  name: string;
  purpose: string;
  institution_id: string; // UUID
  owner_id: string; // UUID
  academic_unit_id: string;
  format: StudyFormat;
  max_members: number; // 2 to 20
  visibility: GroupVisibility;
  created_at: string;
  updated_at: string;
}

/**
 * Table: `study_group_memberships`
 * Role-based membership linking students to study groups.
 */
export interface StudyGroupMembershipRow {
  id: string; // UUID Primary Key
  group_id: string; // UUID References study_groups(id)
  user_id: string; // UUID
  role: GroupRole;
  status: GroupMembershipStatus;
  joined_at: string;
}

/**
 * Table: `study_sessions`
 * Scheduled peer study meetups (can be linked to a study group or standalone).
 */
export interface StudySessionRow {
  id: string; // UUID Primary Key
  group_id: string | null; // UUID References study_groups(id) (optional)
  title: string;
  academic_unit_id: string;
  scheduled_start: string; // TIMESTAMPTZ ISO string
  scheduled_end: string; // TIMESTAMPTZ ISO string
  location: string | null; // Physical room / campus location
  online_url: string | null; // Virtual meeting link (e.g. Google Meet)
  agenda: string;
  status: SessionStatus;
  created_by: string; // UUID
  created_at: string;
  updated_at: string;
}

/**
 * Table: `study_session_participants`
 * Participant RSVPs for a scheduled study session.
 */
export interface StudySessionParticipantRow {
  id: string; // UUID Primary Key
  session_id: string; // UUID References study_sessions(id)
  user_id: string; // UUID
  rsvp: SessionRsvp;
  created_at: string;
  updated_at: string;
}

/**
 * Table: `user_reports`
 * Moderation reports for code of conduct or academic integrity enforcement.
 */
export interface UserReportRow {
  id: string; // UUID Primary Key
  reporter_id: string; // UUID
  reported_id: string; // UUID
  group_id: string | null; // UUID References study_groups(id)
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  institution_id: string; // UUID
  created_at: string;
  reviewed_by: string | null; // UUID
  reviewed_at: string | null;
}

// =============================================================================
// 3. TABLE INSERT & UPDATE PAYLOAD TYPES (For CRUD operations)
// =============================================================================

export type StudentLearningProfileInsert = Omit<StudentLearningProfileRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type StudentLearningProfileUpdate = Partial<Omit<StudentLearningProfileRow, 'id' | 'user_id' | 'institution_id' | 'created_at'>>;

export type StudentUnitPreferenceInsert = Omit<StudentUnitPreferenceRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type StudentUnitPreferenceUpdate = Partial<Omit<StudentUnitPreferenceRow, 'id' | 'profile_id' | 'created_at'>>;

export type StudyAvailabilityInsert = Omit<StudyAvailabilityRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type StudyAvailabilityUpdate = Partial<Omit<StudyAvailabilityRow, 'id' | 'profile_id' | 'created_at'>>;

export type UserBlockInsert = Omit<UserBlockRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
export type UserBlockUpdate = Partial<Omit<UserBlockRow, 'id' | 'created_at'>>;

export type StudyConnectionRequestInsert = Omit<StudyConnectionRequestRow, 'id' | 'created_at' | 'responded_at'> & {
  id?: string;
  created_at?: string;
  responded_at?: string | null;
};
export type StudyConnectionRequestUpdate = Partial<Omit<StudyConnectionRequestRow, 'id' | 'sender_id' | 'receiver_id' | 'created_at'>>;

export type StudyConnectionInsert = Omit<StudyConnectionRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
export type StudyConnectionUpdate = Partial<Omit<StudyConnectionRow, 'id' | 'created_at'>>;

export type StudyGroupInsert = Omit<StudyGroupRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type StudyGroupUpdate = Partial<Omit<StudyGroupRow, 'id' | 'institution_id' | 'owner_id' | 'created_at'>>;

export type StudyGroupMembershipInsert = Omit<StudyGroupMembershipRow, 'id' | 'joined_at'> & {
  id?: string;
  joined_at?: string;
};
export type StudyGroupMembershipUpdate = Partial<Omit<StudyGroupMembershipRow, 'id' | 'group_id' | 'user_id'>>;

export type StudySessionInsert = Omit<StudySessionRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type StudySessionUpdate = Partial<Omit<StudySessionRow, 'id' | 'created_by' | 'created_at'>>;

export type StudySessionParticipantInsert = Omit<StudySessionParticipantRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type StudySessionParticipantUpdate = Partial<Omit<StudySessionParticipantRow, 'id' | 'session_id' | 'user_id' | 'created_at'>>;

export type UserReportInsert = Omit<UserReportRow, 'id' | 'created_at' | 'reviewed_by' | 'reviewed_at'> & {
  id?: string;
  created_at?: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
};
export type UserReportUpdate = Partial<Omit<UserReportRow, 'id' | 'reporter_id' | 'reported_id' | 'institution_id' | 'created_at'>>;

// =============================================================================
// 4. SUPABASE / POSTGRES DATABASE SCHEMA CONTRACT
// =============================================================================

export interface BrainMateDatabaseSchema {
  public: {
    Tables: {
      student_learning_profiles: {
        Row: StudentLearningProfileRow;
        Insert: StudentLearningProfileInsert;
        Update: StudentLearningProfileUpdate;
      };
      student_unit_preferences: {
        Row: StudentUnitPreferenceRow;
        Insert: StudentUnitPreferenceInsert;
        Update: StudentUnitPreferenceUpdate;
      };
      study_availability: {
        Row: StudyAvailabilityRow;
        Insert: StudyAvailabilityInsert;
        Update: StudyAvailabilityUpdate;
      };
      user_blocks: {
        Row: UserBlockRow;
        Insert: UserBlockInsert;
        Update: UserBlockUpdate;
      };
      study_connection_requests: {
        Row: StudyConnectionRequestRow;
        Insert: StudyConnectionRequestInsert;
        Update: StudyConnectionRequestUpdate;
      };
      study_connections: {
        Row: StudyConnectionRow;
        Insert: StudyConnectionInsert;
        Update: StudyConnectionUpdate;
      };
      study_groups: {
        Row: StudyGroupRow;
        Insert: StudyGroupInsert;
        Update: StudyGroupUpdate;
      };
      study_group_memberships: {
        Row: StudyGroupMembershipRow;
        Insert: StudyGroupMembershipInsert;
        Update: StudyGroupMembershipUpdate;
      };
      study_sessions: {
        Row: StudySessionRow;
        Insert: StudySessionInsert;
        Update: StudySessionUpdate;
      };
      study_session_participants: {
        Row: StudySessionParticipantRow;
        Insert: StudySessionParticipantInsert;
        Update: StudySessionParticipantUpdate;
      };
      user_reports: {
        Row: UserReportRow;
        Insert: UserReportInsert;
        Update: UserReportUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_user_blocked: {
        Args: { user_a: string; user_b: string };
        Returns: boolean;
      };
      are_users_connected: {
        Args: { user_a: string; user_b: string };
        Returns: boolean;
      };
      get_current_user_institution_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      brainmate_match_candidates: {
        Args: { current_uid: string };
        Returns: Array<Record<string, unknown>>;
      };
    };
    Enums: {
      study_level_enum: StudyLevel;
      study_format_enum: StudyFormat;
      profile_visibility_enum: ProfileVisibility;
      unit_role_enum: UnitRole;
      unit_confidence_enum: UnitConfidence;
      connection_status_enum: ConnectionStatus;
      group_role_enum: GroupRole;
      group_membership_status_enum: GroupMembershipStatus;
      group_visibility_enum: GroupVisibility;
      session_status_enum: SessionStatus;
      session_rsvp_enum: SessionRsvp;
      report_status_enum: ReportStatus;
      report_reason_enum: ReportReason;
    };
  };
}

// =============================================================================
// 5. HYDRATED DOMAIN & APPLICATION VIEW MODELS
// =============================================================================

/**
 * Embedded preference for an academic unit in domain views.
 */
export interface UnitPreferenceDetail {
  academicUnitId: string;
  unitCode: string;
  unitTitle: string;
  role: UnitRole;
  confidence?: UnitConfidence;
  topics: string[];
}

/**
 * Standard recurring availability window representation.
 */
export interface AvailabilityWindowDetail {
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

/**
 * Hydrated Student Learning Profile populated with relational sub-records.
 */
export interface HydratedStudentLearningProfile extends StudentLearningProfileRow {
  displayName?: string;
  avatarUrl?: string;
  programmeName?: string;
  institutionName?: string;
  verifiedEnrollment?: boolean;
  units: UnitPreferenceDetail[];
  availability: AvailabilityWindowDetail[];
}

/**
 * Member details inside a populated study group.
 */
export interface EnrichedGroupMember {
  userId: string;
  displayName: string;
  role: GroupRole;
  status: GroupMembershipStatus;
  joinedAt: string;
  avatarInitials: string;
  programmeName?: string;
}

/**
 * Hydrated Study Group including member roster and upcoming session info.
 */
export interface HydratedStudyGroup extends StudyGroupRow {
  institutionName?: string;
  ownerName?: string;
  academicUnitCode?: string;
  academicUnitTitle?: string;
  currentMemberCount: number;
  members: EnrichedGroupMember[];
  nextSession?: {
    id: string;
    title: string;
    scheduledStart: string;
    format: StudyFormat;
  };
}

/**
 * Participant with display metadata in a study session.
 */
export interface EnrichedSessionParticipant {
  userId: string;
  displayName: string;
  rsvp: SessionRsvp;
  avatarInitials?: string;
}

/**
 * Hydrated Study Session with participant list and group metadata.
 */
export interface HydratedStudySession extends StudySessionRow {
  groupName?: string;
  academicUnitCode?: string;
  academicUnitTitle?: string;
  createdByName?: string;
  participants: EnrichedSessionParticipant[];
  goingCount: number;
}

/**
 * Rich connection request view item.
 */
export interface HydratedConnectionRequest extends StudyConnectionRequestRow {
  senderName: string;
  senderProgramme: string;
  senderStudyLevel: StudyLevel;
  receiverName?: string;
  matchScore?: number;
  matchReasonSummary?: string;
}

/**
 * Active connection item.
 */
export interface HydratedActiveConnection {
  connectionId: string;
  peerUserId: string;
  peerDisplayName: string;
  peerProgramme: string;
  peerStudyLevel: StudyLevel;
  avatarInitials: string;
  sharedUnitsCount: number;
  establishedAt: string;
  lastActive?: string;
}

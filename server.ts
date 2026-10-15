/**
 * UniSync Full-Stack Express Server
 * Serves UniPath and ZeroQ APIs, Apex AI Assistant, and Vite Dev Middleware.
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getServerSupabase } from './server/supabase.ts';

import {
  UNIVERSITIES,
  DEMO_PROGRAMMES,
  CAREERS,
  DEMO_COMPARISON_COHORTS,
  DEMO_PEER_MATCHES,
  COMMUNITY_RESOURCES,
} from './src/data/mockData.ts';
import { calculateCareerRecommendations } from './src/services/recommendationEngine.ts';
import { compareStudentUnitsWithCohort } from './src/services/academicComparison.ts';
import { askApexAI } from './src/services/geminiService.ts';
import { StudentProfile, StudentConsent, BrainMatePeerMatch } from './src/types/index.ts';

// ZeroQ Initial Seed Data & Types
import {
  DEFAULT_PLACEMENT_RECORD,
  ZEROQ_UNIVERSITIES,
  INITIAL_APPLICATION,
  INITIAL_DOCUMENTS,
  INITIAL_CREDENTIAL,
  CAMPUS_MERCHANTS,
  CAMPUS_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_VOUCHERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './src/data/zeroqMockData.ts';
import {
  KUCCPSPlacementRecord,
  ZeroQApplication,
  ZeroQDocument,
  ZeroQStudentCredential,
  CampusMerchant,
  CampusProduct,
  ZeroQOrder,
  ZeroQCampusVoucher,
  ZeroQAuditLog,
  ZeroQNotification,
} from './src/types/zeroq.ts';

// BrainMate Types, Engine, & Seed Data
import { z } from 'zod';
import {
  StudentLearningProfile,
  findBrainMateMatches,
  scoreCandidate,
} from './src/lib/brainmate/matching.ts';
import {
  DEFAULT_STUDENT_LEARNING_PROFILE,
  SEED_CANDIDATE_PROFILES,
  INITIAL_STUDY_GROUPS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_CONNECTION_REQUESTS,
  INITIAL_ACTIVE_CONNECTIONS,
  INITIAL_USER_REPORTS,
  StudyGroup,
  StudySession,
  ConnectionRequest,
  ActiveConnection,
  UserReport,
  SkillSwapPair,
  INITIAL_SKILL_SWAPS,
  PeerEndorsement,
  KarmaLedgerItem,
  StudentKarmaSummary,
  DEFAULT_STUDENT_KARMA,
  INITIAL_PEER_ENDORSEMENTS,
  INITIAL_KARMA_LEDGER,
  CourseExamInfo,
  INITIAL_COURSES_READINESS,
  INITIAL_PEER_SCHEDULE_DATA,
} from './src/data/brainmateMockData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory demo persistence store for UniPath students
const studentProfiles: Map<string, StudentProfile> = new Map();
const peerConnections: BrainMatePeerMatch[] = [...DEMO_PEER_MATCHES];

// BrainMate In-Memory Stores
let brainmateStudentProfile: StudentLearningProfile = JSON.parse(JSON.stringify(DEFAULT_STUDENT_LEARNING_PROFILE));
let brainmateCandidates: StudentLearningProfile[] = JSON.parse(JSON.stringify(SEED_CANDIDATE_PROFILES));
let brainmateGroups: StudyGroup[] = JSON.parse(JSON.stringify(INITIAL_STUDY_GROUPS));
let brainmateSessions: StudySession[] = JSON.parse(JSON.stringify(INITIAL_STUDY_SESSIONS));
let brainmateRequests: ConnectionRequest[] = JSON.parse(JSON.stringify(INITIAL_CONNECTION_REQUESTS));
let brainmateActiveConnections: ActiveConnection[] = JSON.parse(JSON.stringify(INITIAL_ACTIVE_CONNECTIONS));
let brainmateUserBlocks: Set<string> = new Set();
let brainmateReports: UserReport[] = JSON.parse(JSON.stringify(INITIAL_USER_REPORTS));
let brainmateSkillSwaps: SkillSwapPair[] = JSON.parse(JSON.stringify(INITIAL_SKILL_SWAPS));
let brainmateStudentKarma: StudentKarmaSummary = JSON.parse(JSON.stringify(DEFAULT_STUDENT_KARMA));
let brainmatePeerEndorsements: PeerEndorsement[] = JSON.parse(JSON.stringify(INITIAL_PEER_ENDORSEMENTS));
let brainmateKarmaLedger: KarmaLedgerItem[] = JSON.parse(JSON.stringify(INITIAL_KARMA_LEDGER));
let brainmateCoursesReadiness: CourseExamInfo[] = JSON.parse(JSON.stringify(INITIAL_COURSES_READINESS));
let brainmatePeerSchedules = JSON.parse(JSON.stringify(INITIAL_PEER_SCHEDULE_DATA));
const requestRateTracker: { timestamp: number; recipientId: string }[] = [];

type AuthenticatedRequest = Request & { user: { id: string; email?: string } };

function toStudentProfile(row: Record<string, unknown>): StudentProfile {
  return {
    id: String(row.user_id),
    email: String(row.email || ''),
    displayName: String(row.display_name || 'Student'),
    universityId: String(row.university_id || 'maseno'),
    programmeId: String(row.programme_id || 'bsc-cs'),
    currentYear: Number(row.current_year || 1),
    currentSemester: Number(row.current_semester || 1),
    gradingScale: (row.grading_scale || 'percentage') as StudentProfile['gradingScale'],
    units: (row.units || []) as StudentProfile['units'],
    interests: (row.interests || []) as string[],
    skillsToDevelop: (row.skills_to_develop || []) as string[],
    careerGoals: String(row.career_goals || ''),
    consent: row.consent as StudentConsent,
    savedRoadmapIds: (row.saved_roadmap_ids || []) as string[],
    completedRoadmapSteps: (row.completed_roadmap_steps || []) as string[],
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

async function requireAuth(req: Request, res: Response, next: (error?: unknown) => void) {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const { data, error } = await getServerSupabase().auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Invalid or expired session' });
    (req as AuthenticatedRequest).user = { id: data.user.id, email: data.user.email };
    next();
  } catch (error) {
    next(error);
  }
}

const DEMO_STUDENT: StudentProfile = {
  id: 'demo-student-01',
  email: 'student@example.ac.ke',
  displayName: 'Brian Otieno',
  universityId: 'maseno',
  programmeId: 'bsc-cs',
  currentYear: 1,
  currentSemester: 1,
  gradingScale: 'percentage',
  units: [
    { unitId: 'cs-111', unitCode: 'CSC 111', unitTitle: 'Introduction to Programming in C', academicPeriod: 'Year 1, Sem 1', mark: 74, status: 'completed' },
    { unitId: 'cs-121', unitCode: 'CSC 121', unitTitle: 'Object-Oriented Programming (Java)', academicPeriod: 'Year 1, Sem 2', mark: 68, status: 'completed' },
    { unitId: 'cs-211', unitCode: 'CSC 211', unitTitle: 'Data Structures & Algorithms', academicPeriod: 'Year 2, Sem 1', mark: 72, status: 'completed' },
    { unitId: 'cs-212', unitCode: 'CSC 212', unitTitle: 'Database Systems & SQL Modeling', academicPeriod: 'Year 2, Sem 1', mark: 70, status: 'completed' },
  ],
  interests: ['Software Engineering', 'Cloud Infrastructure', 'Artificial Intelligence'],
  skillsToDevelop: ['TypeScript', 'Docker', 'Distributed Systems'],
  careerGoals: 'Aspiring Software Engineer building digital campus and fintech platforms.',
  consent: {
    allowMarkStorage: true,
    allowBrainMatePeerMatching: true,
    allowPublicProfileVisibility: false,
    lastUpdated: new Date().toISOString(),
  },
  savedRoadmapIds: ['career-software-eng'],
  completedRoadmapSteps: ['step-se-1'],
  createdAt: new Date().toISOString(),
};
studentProfiles.set(DEMO_STUDENT.id, DEMO_STUDENT);

// --- ZEROQ IN-MEMORY MUTABLE STORE ---
let zeroqPlacement: KUCCPSPlacementRecord = { ...DEFAULT_PLACEMENT_RECORD };
let zeroqApplications: ZeroQApplication[] = [{ ...INITIAL_APPLICATION }];
let zeroqDocuments: ZeroQDocument[] = INITIAL_DOCUMENTS.map((d) => ({ ...d }));
let zeroqCredential: ZeroQStudentCredential = { ...INITIAL_CREDENTIAL };
let zeroqMerchants: CampusMerchant[] = CAMPUS_MERCHANTS.map((m) => ({ ...m }));
let zeroqProducts: CampusProduct[] = CAMPUS_PRODUCTS.map((p) => ({ ...p }));
let zeroqOrders: ZeroQOrder[] = INITIAL_ORDERS.map((o) => ({ ...o }));
let zeroqVouchers: ZeroQCampusVoucher[] = INITIAL_VOUCHERS.map((v) => ({ ...v }));
let zeroqAuditLogs: ZeroQAuditLog[] = [...INITIAL_AUDIT_LOGS];
let zeroqNotifications: ZeroQNotification[] = [...INITIAL_NOTIFICATIONS];

function recordAudit(actorRole: string, actorName: string, action: string, target: string, details: string) {
  const log: ZeroQAuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actorRole,
    actorName,
    action,
    target,
    timestamp: new Date().toISOString(),
    details,
  };
  zeroqAuditLogs.unshift(log);
}

// ==========================================
// 1. UNIPATH API ENDPOINTS
// ==========================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    product: 'UniSync (UniPath & ZeroQ)',
    version: '2.0.0-production',
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
    demoModeNotice: 'Demonstration and synthetic datasets clearly identified. No unauthorized PII stored.',
  });
});

app.get('/api/universities', (req: Request, res: Response) => {
  res.json(UNIVERSITIES);
});

app.get('/api/programmes', (req: Request, res: Response) => {
  const { universityId, search } = req.query;
  let results = [...DEMO_PROGRAMMES];
  if (universityId) results = results.filter((p) => p.universityId === String(universityId));
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  }
  res.json(results);
});

app.get('/api/programmes/:id', (req: Request, res: Response) => {
  const prog = DEMO_PROGRAMMES.find((p) => p.id === req.params.id);
  if (!prog) return res.status(404).json({ error: 'Programme not found in catalogue' });
  res.json(prog);
});

app.get('/api/careers', (req: Request, res: Response) => {
  const { category, search, programmeId } = req.query;
  let results = [...CAREERS];
  if (category) results = results.filter((c) => c.category.toLowerCase() === String(category).toLowerCase());
  if (programmeId) results = results.filter((c) => c.relevantProgrammes.includes(String(programmeId)));
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) || c.technicalSkills.some((s) => s.toLowerCase().includes(q))
    );
  }
  res.json(results);
});

app.get('/api/careers/:slug', (req: Request, res: Response) => {
  const career = CAREERS.find((c) => c.slug === req.params.slug || c.id === req.params.slug);
  if (!career) return res.status(404).json({ error: 'Career profile not found' });
  res.json(career);
});

app.post('/api/recommend', (req: Request, res: Response) => {
  try {
    const { programmeId, selectedUnits = [], interests = [], skillsToDevelop = [], careerGoals } = req.body;
    const prog = DEMO_PROGRAMMES.find((p) => p.id === programmeId) || DEMO_PROGRAMMES[0];
    const recommendations = calculateCareerRecommendations({
      programme: prog,
      selectedUnits,
      interests,
      skillsToDevelop,
      careerGoals,
    });
    res.json({
      programme: { id: prog.id, name: prog.name, code: prog.code },
      evaluatedCount: recommendations.length,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process recommendation engine scoring' });
  }
});

app.post('/api/compare', (req: Request, res: Response) => {
  try {
    const { studentUnits = [], gradingScale = 'percentage' } = req.body;
    const comparison = compareStudentUnitsWithCohort(studentUnits, gradingScale);
    res.json(comparison);
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute academic comparisons' });
  }
});

app.post('/api/apex-ai', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const aiResult = await askApexAI({ userPrompt: prompt, context });
    res.json(aiResult);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error while processing assistant request' });
  }
});

// Authenticated persistent profile endpoints
app.get('/api/profile', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const authenticated = req as AuthenticatedRequest;
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', authenticated.user.id)
      .maybeSingle();
    if (error) return next(error);
    if (data) return res.json(toStudentProfile(data));

    const { data: created, error: insertError } = await supabase
      .from('student_profiles')
      .insert({
        user_id: authenticated.user.id,
        email: authenticated.user.email || '',
        display_name: authenticated.user.email?.split('@')[0] || 'Student',
        units: DEMO_STUDENT.units,
        interests: DEMO_STUDENT.interests,
        skills_to_develop: DEMO_STUDENT.skillsToDevelop,
        career_goals: DEMO_STUDENT.careerGoals,
        consent: DEMO_STUDENT.consent,
        saved_roadmap_ids: DEMO_STUDENT.savedRoadmapIds,
        completed_roadmap_steps: DEMO_STUDENT.completedRoadmapSteps,
      })
      .select()
      .single();
    if (insertError) return next(insertError);
    res.status(201).json(toStudentProfile(created));
  } catch (error) {
    next(error);
  }
});

app.put('/api/profile', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const authenticated = req as AuthenticatedRequest;
    const update = {
      display_name: req.body.displayName,
      university_id: req.body.universityId,
      programme_id: req.body.programmeId,
      current_year: req.body.currentYear,
      current_semester: req.body.currentSemester,
      grading_scale: req.body.gradingScale,
      units: req.body.units,
      interests: req.body.interests,
      skills_to_develop: req.body.skillsToDevelop,
      career_goals: req.body.careerGoals,
      consent: req.body.consent,
      saved_roadmap_ids: req.body.savedRoadmapIds,
      completed_roadmap_steps: req.body.completedRoadmapSteps,
    };
    const { data, error } = await getServerSupabase()
      .from('student_profiles')
      .update(update)
      .eq('user_id', authenticated.user.id)
      .select()
      .single();
    if (error) return next(error);
    res.json(toStudentProfile(data));
  } catch (error) {
    next(error);
  }
});

app.post('/api/profile/consent', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const authenticated = req as AuthenticatedRequest;
    const supabase = getServerSupabase();
    const { data: profile, error: readError } = await supabase
      .from('student_profiles')
      .select('consent')
      .eq('user_id', authenticated.user.id)
      .single();
    if (readError) return next(readError);
    const consent = { ...(profile.consent || {}), ...req.body, lastUpdated: new Date().toISOString() };
    const { error } = await supabase.from('student_profiles').update({ consent }).eq('user_id', authenticated.user.id);
    if (error) return next(error);
    res.json({ message: 'Consent updated', consent });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/profile/data', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const authenticated = req as AuthenticatedRequest;
    const supabase = getServerSupabase();
    const { data: profile, error: readError } = await supabase
      .from('student_profiles')
      .select('units')
      .eq('user_id', authenticated.user.id)
      .single();
    if (readError) return next(readError);
    const units = (profile.units || []).map((unit: StudentProfile['units'][number]) => ({ ...unit, mark: undefined }));
    const { error } = await supabase.from('student_profiles').update({ units }).eq('user_id', authenticated.user.id);
    if (error) return next(error);
    res.json({ message: 'Submitted marks wiped.' });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// BRAINMATE PEER LEARNING & MATCHING ENDPOINTS
// ==========================================

// Helper function to calculate profile completeness
function calculateProfileCompleteness(profile: StudentLearningProfile): number {
  let score = 0;
  if (profile.programmeId && profile.studyLevel) score += 20;
  const canHelp = profile.units.filter((u) => u.role === 'can_help');
  if (canHelp.length > 0) score += 20;
  const needsHelp = profile.units.filter((u) => u.role === 'needs_help');
  if (needsHelp.length > 0) score += 20;
  if (profile.availability && profile.availability.length > 0) score += 20;
  if (profile.preferredFormat && profile.collaborationGoals.length > 0) score += 20;
  return Math.min(100, score);
}

async function loadPersistentBrainMateProfile(userId: string): Promise<StudentLearningProfile> {
  const supabase = getServerSupabase();
  const { data: studentProfile, error: studentProfileError } = await supabase
    .from('student_profiles')
    .select('display_name, university_id, programme_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (studentProfileError) throw studentProfileError;
  if (!studentProfile) {
    throw new Error('Complete your UniPath profile before using BrainMate');
  }

  const { data: institution, error: institutionError } = await supabase
    .from('brainmate_institutions')
    .select('id, slug, name')
    .eq('slug', studentProfile.university_id)
    .maybeSingle();

  if (institutionError) throw institutionError;
  if (!institution) {
    throw new Error(`Unsupported BrainMate institution: ${studentProfile.university_id}`);
  }

  let { data: profile, error: profileError } = await supabase
    .from('student_learning_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError) throw profileError;

  if (!profile) {
    const { data: createdProfile, error: createError } = await supabase
      .from('student_learning_profiles')
      .insert({
        user_id: userId,
        institution_id: institution.id,
        programme_id: studentProfile.programme_id,
      })
      .select('*')
      .single();

    if (createError) throw createError;
    profile = createdProfile;
  }

  const [{ data: units, error: unitsError }, { data: availability, error: availabilityError }] =
    await Promise.all([
      supabase
        .from('student_unit_preferences')
        .select('academic_unit_id, role, confidence, topics')
        .eq('profile_id', profile.id)
        .order('created_at'),
      supabase
        .from('study_availability')
        .select('day_of_week, start_time, end_time')
        .eq('profile_id', profile.id)
        .order('day_of_week')
        .order('start_time'),
    ]);

  if (unitsError) throw unitsError;
  if (availabilityError) throw availabilityError;

  return {
    id: profile.id,
    userId,
    displayName: studentProfile.display_name,
    institutionId: institution.slug,
    institutionName: institution.name,
    programmeId: profile.programme_id,
    programmeName: profile.programme_id,
    studyLevel: profile.study_level,
    preferredGroupSize: profile.preferred_group_size,
    preferredFormat: profile.preferred_format,
    mentorWillingness: profile.mentor_willingness,
    collaborationGoals: profile.collaboration_goals || [],
    visibility: profile.visibility,
    units: (units || []).map((unit) => ({
      academicUnitId: unit.academic_unit_id,
      unitCode: unit.academic_unit_id,
      unitTitle: unit.academic_unit_id,
      role: unit.role,
      confidence: unit.confidence || undefined,
      topics: unit.topics || [],
    })),
    availability: (availability || []).map((window) => ({
      dayOfWeek: window.day_of_week,
      startTime: String(window.start_time).slice(0, 5),
      endTime: String(window.end_time).slice(0, 5),
    })),
  };
}

async function loadBrainMateConnectionUser(userId: string) {
  const { data, error } = await getServerSupabase()
    .from('student_profiles')
    .select('user_id, display_name, programme_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function toConnectionRequest(row: Record<string, any>): Promise<ConnectionRequest> {
  const [sender, receiver] = await Promise.all([
    loadBrainMateConnectionUser(row.sender_id),
    loadBrainMateConnectionUser(row.receiver_id),
  ]);
  const reason = row.match_reason || {};
  return {
    id: row.id,
    senderId: row.sender_id,
    senderName: sender?.display_name || 'Student',
    senderProgramme: sender?.programme_id || 'Academic programme',
    senderStudyLevel: 'undergraduate',
    receiverId: row.receiver_id,
    receiverName: receiver?.display_name || 'Student',
    note: row.note || '',
    matchScore: Number(reason.score || 0),
    matchReason: String(reason.explanation || 'Academic compatibility match'),
    status: row.status,
    createdAt: row.created_at,
    respondedAt: row.responded_at || undefined,
  };
}

// 1. Learning Profile
app.get('/api/brainmate/profile', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const profile = await loadPersistentBrainMateProfile(userId);
    res.json({ profile, completeness: calculateProfileCompleteness(profile) });
  } catch (error) {
    next(error);
  }
});

const LearningProfileUpdateSchema = z.object({
  programmeId: z.string().optional(),
  programmeName: z.string().optional(),
  studyLevel: z.enum(['undergraduate', 'postgraduate', 'doctorate', 'diploma']).optional(),
  preferredGroupSize: z.number().int().min(2).max(10).optional(),
  preferredFormat: z.enum(['online', 'in_person', 'hybrid']).optional(),
  mentorWillingness: z.boolean().optional(),
  collaborationGoals: z.array(z.string()).optional(),
  visibility: z.enum(['institution', 'programme', 'connections_only']).optional(),
  units: z
    .array(
      z.object({
        academicUnitId: z.string(),
        unitCode: z.string(),
        unitTitle: z.string(),
        role: z.enum(['can_help', 'needs_help', 'studying']),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        topics: z.array(z.string()),
      })
    )
    .optional(),
  availability: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
});

app.put('/api/brainmate/profile', requireAuth, async (req: Request, res: Response, next) => {
  const parsed = LearningProfileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid profile data', details: parsed.error.issues });
  }

  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const current = await loadPersistentBrainMateProfile(userId);
    const supabase = getServerSupabase();
    const { data: institution, error: institutionError } = await supabase
      .from('brainmate_institutions')
      .select('id')
      .eq('slug', current.institutionId)
      .single();

    if (institutionError) throw institutionError;

    const update = parsed.data;
    const { data: updatedRow, error: updateError } = await supabase
      .from('student_learning_profiles')
      .update({
        programme_id: update.programmeId || current.programmeId,
        institution_id: institution.id,
        study_level: update.studyLevel || current.studyLevel,
        preferred_group_size: update.preferredGroupSize || current.preferredGroupSize,
        preferred_format: update.preferredFormat || current.preferredFormat,
        mentor_willingness: update.mentorWillingness ?? current.mentorWillingness,
        collaboration_goals: update.collaborationGoals || current.collaborationGoals,
        visibility: update.visibility || current.visibility,
      })
      .eq('user_id', userId)
      .select('id')
      .single();

    if (updateError) throw updateError;

    if (update.units) {
      const { error: deleteUnitsError } = await supabase
        .from('student_unit_preferences')
        .delete()
        .eq('profile_id', updatedRow.id);
      if (deleteUnitsError) throw deleteUnitsError;

      if (update.units.length > 0) {
        const { error: insertUnitsError } = await supabase
          .from('student_unit_preferences')
          .insert(
            update.units.map((unit) => ({
              profile_id: updatedRow.id,
              academic_unit_id: unit.academicUnitId,
              role: unit.role,
              confidence: unit.confidence || null,
              topics: unit.topics,
            }))
          );
        if (insertUnitsError) throw insertUnitsError;
      }
    }

    if (update.availability) {
      const { error: deleteAvailabilityError } = await supabase
        .from('study_availability')
        .delete()
        .eq('profile_id', updatedRow.id);
      if (deleteAvailabilityError) throw deleteAvailabilityError;

      if (update.availability.length > 0) {
        const { error: insertAvailabilityError } = await supabase
          .from('study_availability')
          .insert(
            update.availability.map((window) => ({
              profile_id: updatedRow.id,
              day_of_week: window.dayOfWeek,
              start_time: window.startTime,
              end_time: window.endTime,
            }))
          );
        if (insertAvailabilityError) throw insertAvailabilityError;
      }
    }

    const profile = await loadPersistentBrainMateProfile(userId);
    res.json({
      message: 'Learning profile successfully updated',
      profile,
      completeness: calculateProfileCompleteness(profile),
    });
  } catch (error) {
    next(error);
  }
});

// 2. Deterministic & Explainable Match Discovery
app.get('/api/brainmate/matches', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const topN = Math.min(50, Math.max(1, Number(req.query.topN) || 20));
    const allowExisting = req.query.allowExisting === 'true';
    const currentProfile = await loadPersistentBrainMateProfile(userId);
    const supabase = getServerSupabase();
    const { data: institution, error: institutionError } = await supabase
      .from('brainmate_institutions')
      .select('id')
      .eq('slug', currentProfile.institutionId)
      .single();
    if (institutionError) throw institutionError;
    const { data: profileRows, error: profileError } = await supabase
      .from('student_learning_profiles')
      .select('user_id')
      .eq('institution_id', institution.id)
      .neq('user_id', userId);
    if (profileError) throw profileError;

    const candidates = await Promise.all(
      (profileRows || []).map((row) => loadPersistentBrainMateProfile(row.user_id))
    );
    const { data: blocks, error: blocksError } = await supabase
      .from('user_blocks')
      .select('blocker_id, blocked_id')
      .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);
    if (blocksError) throw blocksError;
    const blockedUserIds = (blocks || []).map((block) =>
      block.blocker_id === userId ? block.blocked_id : block.blocker_id
    );
    const { data: connections, error: connectionsError } = await supabase
      .from('study_connections')
      .select('user_a_id, user_b_id')
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);
    if (connectionsError) throw connectionsError;
    const existingConnectionUserIds = (connections || []).map((connection) =>
      connection.user_a_id === userId ? connection.user_b_id : connection.user_a_id
    );
    const matches = findBrainMateMatches(currentProfile, candidates, {
      topN,
      blockedUserIds,
      existingConnectionUserIds,
      allowExistingConnections: allowExisting,
    });
    res.json({
      matches,
      totalEligible: matches.length,
      ethicalDisclaimer:
        'Compatibility is a transparent, deterministic score based strictly on complementary academic units, syllabus topics, and schedule availability. Demographic, financial, and popularity metrics are never utilized.',
    });
  } catch (error) {
    next(error);
  }
});

// 3. Connections Hub (Incoming, Outgoing, Active)
app.get('/api/brainmate/connections', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const supabase = getServerSupabase();
    const { data: requests, error: requestError } = await supabase
      .from('study_connection_requests')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (requestError) throw requestError;
    const visibleRequests = (requests || []).filter((request) => request.status === 'pending');
    const hydratedRequests = await Promise.all(visibleRequests.map(toConnectionRequest));
    const { data: connections, error: connectionError } = await supabase
      .from('study_connections')
      .select('id, user_a_id, user_b_id, created_at')
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);
    if (connectionError) throw connectionError;
    const active = await Promise.all(
      (connections || []).map(async (connection) => {
        const partnerId = connection.user_a_id === userId ? connection.user_b_id : connection.user_a_id;
        const partner = await loadBrainMateConnectionUser(partnerId);
        return {
          id: connection.id,
          userId: partnerId,
          displayName: partner?.display_name || 'Student',
          programmeName: partner?.programme_id || 'Academic programme',
          studyLevel: 'Undergraduate',
          avatarInitials: (partner?.display_name || 'Student')
            .split(' ')
            .map((name: string) => name[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          sharedUnitsCount: 0,
          establishedAt: connection.created_at,
          lastActive: 'Recently',
        };
      })
    );
    const { count: blockedCount, error: blockError } = await supabase
      .from('user_blocks')
      .select('id', { count: 'exact', head: true })
      .eq('blocker_id', userId);
    if (blockError) throw blockError;
    res.json({
      incoming: hydratedRequests.filter((request) => request.receiverId === userId),
      outgoing: hydratedRequests.filter((request) => request.senderId === userId),
      active,
      blockedCount: blockedCount || 0,
    });
  } catch (error) {
    next(error);
  }
});

// 4. Send Connection Request (with strict safety rate limits)
app.post('/api/brainmate/connections/request', requireAuth, async (req: Request, res: Response, next) => {
  const { candidateUserId, note } = req.body;
  if (!candidateUserId) {
    return res.status(400).json({ error: 'candidateUserId is required' });
  }
  try {
    const senderId = (req as AuthenticatedRequest).user.id;
    const supabase = getServerSupabase();
    const [senderProfile, candidateProfile] = await Promise.all([
      loadPersistentBrainMateProfile(senderId),
      loadPersistentBrainMateProfile(candidateUserId),
    ]);
    const { data: block, error: blockError } = await supabase
      .from('user_blocks')
      .select('id')
      .or(`and(blocker_id.eq.${senderId},blocked_id.eq.${candidateUserId}),and(blocker_id.eq.${candidateUserId},blocked_id.eq.${senderId})`)
      .maybeSingle();
    if (blockError) throw blockError;
    if (block) return res.status(403).json({ error: 'Cannot connect with a blocked user' });
    const { count: dailyCount, error: dailyError } = await supabase
      .from('study_connection_requests')
      .select('id', { count: 'exact', head: true })
      .eq('sender_id', senderId)
      .gte('created_at', new Date(Date.now() - 86400000).toISOString());
    if (dailyError) throw dailyError;
    if ((dailyCount || 0) >= 10) {
      return res.status(429).json({ error: 'Rate limit reached: You can send at most 10 connection requests per day.' });
    }
    const { data: existing, error: existingError } = await supabase
      .from('study_connection_requests')
      .select('id, status')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${candidateUserId}),and(sender_id.eq.${candidateUserId},receiver_id.eq.${senderId})`)
      .in('status', ['pending', 'accepted'])
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing?.status === 'accepted') return res.status(400).json({ error: 'You are already connected with this peer' });
    if (existing?.status === 'pending') return res.status(400).json({ error: 'A pending connection request already exists' });
    const matchResult = scoreCandidate(senderProfile, candidateProfile);
    const { data: request, error: insertError } = await supabase
      .from('study_connection_requests')
      .insert({
        sender_id: senderId,
        receiver_id: candidateUserId,
        note: typeof note === 'string' ? note.slice(0, 500) : null,
        match_reason: { score: matchResult.score, explanation: matchResult.explanation },
      })
      .select('*')
      .single();
    if (insertError) throw insertError;
    res.status(201).json({
      message: 'Connection request sent successfully',
      request: await toConnectionRequest(request),
    });
  } catch (error) {
    next(error);
  }
});

// 5. Respond to Connection Request (Accept, Decline, Withdraw)
app.post('/api/brainmate/connections/respond', requireAuth, async (req: Request, res: Response, next) => {
  const { requestId, action } = req.body;
  if (!requestId) return res.status(400).json({ error: 'requestId is required' });
  if (!['accept', 'decline', 'withdraw'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action. Must be accept, decline, or withdraw.' });
  }
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const supabase = getServerSupabase();
    const { data: request, error: requestError } = await supabase
      .from('study_connection_requests')
      .select('*')
      .eq('id', requestId)
      .maybeSingle();
    if (requestError) throw requestError;
    if (!request) return res.status(404).json({ error: 'Connection request not found' });
    const canRespond =
      (action === 'withdraw' && request.sender_id === userId) ||
      (action !== 'withdraw' && request.receiver_id === userId);
    if (!canRespond) return res.status(403).json({ error: 'You cannot change this request' });
    const status = action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'withdrawn';
    const { data: updated, error: updateError } = await supabase
      .from('study_connection_requests')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('id', requestId)
      .eq(request.receiver_id === userId ? 'receiver_id' : 'sender_id', userId)
      .select('*')
      .single();
    if (updateError) throw updateError;
    if (status === 'accepted') {
      const [userA, userB] = [request.sender_id, request.receiver_id].sort();
      const { error: connectionError } = await supabase
        .from('study_connections')
        .upsert({ user_a_id: userA, user_b_id: userB }, { onConflict: 'user_a_id,user_b_id' });
      if (connectionError) throw connectionError;
    }
    res.json({
      message: `Request status updated to ${status}`,
      request: await toConnectionRequest(updated),
    });
  } catch (error) {
    next(error);
  }
});

// 6. Study Groups (Browse, Create, Join, Manage)
app.get('/api/brainmate/groups', (req: Request, res: Response) => {
  const { unit, format, search } = req.query;

  let filtered = brainmateGroups.filter((g) => g.institutionId === brainmateStudentProfile.institutionId);

  if (unit) {
    filtered = filtered.filter(
      (g) => g.academicUnitCode.toLowerCase().includes(String(unit).toLowerCase())
    );
  }

  if (format && format !== 'all') {
    filtered = filtered.filter((g) => g.format === format);
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (g) => g.name.toLowerCase().includes(q) || g.purpose.toLowerCase().includes(q) || g.academicUnitTitle.toLowerCase().includes(q)
    );
  }

  const enriched = filtered.map((g) => ({
    ...g,
    isMember: g.members.some((m) => m.userId === brainmateStudentProfile.userId),
    isOwner: g.ownerId === brainmateStudentProfile.userId,
  }));

  res.json(enriched);
});

app.post('/api/brainmate/groups', (req: Request, res: Response) => {
  const { name, purpose, academicUnitCode, academicUnitTitle, format, maxMembers, visibility } = req.body;

  if (!name || !purpose || !academicUnitCode) {
    return res.status(400).json({ error: 'Name, purpose, and academic unit code are required' });
  }

  const newGroup: StudyGroup = {
    id: `grp-${Date.now()}`,
    name,
    purpose,
    institutionId: brainmateStudentProfile.institutionId,
    institutionName: brainmateStudentProfile.institutionName || 'Maseno University',
    ownerId: brainmateStudentProfile.userId,
    ownerName: brainmateStudentProfile.displayName,
    academicUnitId: `unit-${academicUnitCode.toLowerCase().replace(/\s+/g, '-')}`,
    academicUnitCode,
    academicUnitTitle: academicUnitTitle || academicUnitCode,
    format: format || 'hybrid',
    maxMembers: Math.min(20, Math.max(2, Number(maxMembers) || 5)),
    currentMemberCount: 1,
    visibility: visibility || 'public',
    members: [
      {
        userId: brainmateStudentProfile.userId,
        displayName: brainmateStudentProfile.displayName,
        role: 'owner',
        joinedAt: new Date().toISOString(),
        avatarInitials: 'BO',
      },
    ],
    resources: [],
    createdAt: new Date().toISOString(),
  };

  brainmateGroups.unshift(newGroup);
  res.status(201).json({ message: 'Study group created successfully', group: newGroup });
});

app.get('/api/brainmate/groups/:id', (req: Request, res: Response) => {
  const group = brainmateGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Study group not found' });

  const isMember = group.members.some((m) => m.userId === brainmateStudentProfile.userId);
  const isOwner = group.ownerId === brainmateStudentProfile.userId;

  res.json({ ...group, isMember, isOwner });
});

app.post('/api/brainmate/groups/:id/join', (req: Request, res: Response) => {
  const group = brainmateGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Study group not found' });

  // Check if blocked by owner
  if (brainmateUserBlocks.has(group.ownerId)) {
    return res.status(403).json({ error: 'Cannot join group owned by a blocked user' });
  }

  const isMember = group.members.some((m) => m.userId === brainmateStudentProfile.userId);
  if (isMember) {
    return res.status(400).json({ error: 'You are already a member of this study group' });
  }

  if (group.members.length >= group.maxMembers) {
    return res.status(400).json({ error: 'This study group has reached maximum member capacity' });
  }

  group.members.push({
    userId: brainmateStudentProfile.userId,
    displayName: brainmateStudentProfile.displayName,
    role: 'member',
    joinedAt: new Date().toISOString(),
    avatarInitials: 'BO',
  });
  group.currentMemberCount = group.members.length;

  res.json({ message: 'Successfully joined study group', group });
});

app.post("/api/brainmate/groups/:id/leave", (req: Request, res: Response) => {
  const group = brainmateGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: "Study group not found" });
  const isMember = group.members.some((m) => m.userId === brainmateStudentProfile.userId);
  if (!isMember) {
    return res.status(400).json({ error: "You are not a member of this study group" });
  }
  if (group.ownerId === brainmateStudentProfile.userId) {
    if (group.members.length <= 1) {
      const idx = brainmateGroups.findIndex((g) => g.id === group.id);
      if (idx !== -1) brainmateGroups.splice(idx, 1);
      return res.json({ message: "Study group dissolved", groupDeleted: true });
    } else {
      group.members = group.members.filter((m) => m.userId !== brainmateStudentProfile.userId);
      group.ownerId = group.members[0].userId;
      group.ownerName = group.members[0].displayName;
      group.members[0].role = "owner";
    }
  } else {
    group.members = group.members.filter((m) => m.userId !== brainmateStudentProfile.userId);
  }
  group.currentMemberCount = group.members.length;
  res.json({ message: "Left study group successfully", group });
});

app.post("/api/brainmate/groups/:id/resources", (req: Request, res: Response) => {
  const group = brainmateGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: "Study group not found" });
  const { title, type, size } = req.body;
  if (!title) return res.status(400).json({ error: "Resource title is required" });
  const resource = {
    id: "res-" + Date.now(),
    title,
    type: type || "Study Notes",
    uploadedBy: brainmateStudentProfile.displayName,
    size: size || "1.2 MB",
  };
  group.resources.push(resource);
  res.status(201).json({ message: "Resource shared with study group", resource, group });
});

// 7. Study Sessions (List, Create, RSVP)
app.get('/api/brainmate/sessions', (req: Request, res: Response) => {
  const mySessions = brainmateSessions.map((s) => ({
    ...s,
    myRsvp: s.participants.find((p) => p.userId === brainmateStudentProfile.userId)?.rsvp || 'none',
  }));
  res.json(mySessions);
});

app.post('/api/brainmate/sessions', (req: Request, res: Response) => {
  const { title, groupId, groupName, academicUnitCode, academicUnitTitle, scheduledStart, scheduledEnd, format, location, onlineUrl, agenda } = req.body;

  if (!title || !academicUnitCode || !scheduledStart || !scheduledEnd) {
    return res.status(400).json({ error: 'Title, unit code, start time, and end time are required' });
  }

  const newSession: StudySession = {
    id: `sess-${Date.now()}`,
    groupId: groupId || undefined,
    groupName: groupName || undefined,
    title,
    academicUnitId: `unit-${academicUnitCode.toLowerCase().replace(/\s+/g, '-')}`,
    academicUnitCode,
    academicUnitTitle: academicUnitTitle || academicUnitCode,
    scheduledStart,
    scheduledEnd,
    format: format || 'hybrid',
    location: location || '',
    onlineUrl: onlineUrl || '',
    agenda: agenda || 'Collaborative study and problem review',
    status: 'scheduled',
    createdBy: brainmateStudentProfile.userId,
    createdByName: brainmateStudentProfile.displayName,
    participants: [
      {
        userId: brainmateStudentProfile.userId,
        displayName: brainmateStudentProfile.displayName,
        rsvp: 'going',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  brainmateSessions.unshift(newSession);
  res.status(201).json({ message: 'Study session scheduled', session: newSession });
});

app.post('/api/brainmate/sessions/:id/rsvp', (req: Request, res: Response) => {
  const { rsvp } = req.body;
  const session = brainmateSessions.find((s) => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Study session not found' });

  const existing = session.participants.find((p) => p.userId === brainmateStudentProfile.userId);
  if (existing) {
    existing.rsvp = rsvp;
  } else {
    session.participants.push({
      userId: brainmateStudentProfile.userId,
      displayName: brainmateStudentProfile.displayName,
      rsvp,
    });
  }

  res.json({ message: `RSVP updated to ${rsvp}`, session });
});

// 8. Safety & Moderation (Block, Report, Moderator Queue)
app.post('/api/brainmate/safety/block', (req: Request, res: Response) => {
  const { targetUserId, targetUserName } = req.body;
  if (!targetUserId) return res.status(400).json({ error: 'targetUserId is required' });

  brainmateUserBlocks.add(targetUserId);

  // Remove active connection if any
  brainmateActiveConnections = brainmateActiveConnections.filter((c) => c.userId !== targetUserId);

  // Remove pending requests between blocker and blocked
  brainmateRequests = brainmateRequests.filter(
    (r) =>
      !(r.senderId === targetUserId && r.receiverId === brainmateStudentProfile.userId) &&
      !(r.senderId === brainmateStudentProfile.userId && r.receiverId === targetUserId)
  );

  // Remove blocked user from groups owned by current user
  brainmateGroups.forEach((g) => {
    if (g.ownerId === brainmateStudentProfile.userId) {
      g.members = g.members.filter((m) => m.userId !== targetUserId);
      g.currentMemberCount = g.members.length;
    }
  });

  res.json({
    message: `${targetUserName || 'User'} has been blocked. They will no longer appear in matches or share your study groups.`,
    blockedUserId: targetUserId,
  });
});

app.post('/api/brainmate/safety/report', (req: Request, res: Response) => {
  const { reportedId, reportedName, groupId, groupName, reason, details } = req.body;

  if (!reportedId || !reason || !details) {
    return res.status(400).json({ error: 'Reported user, reason, and details are required' });
  }

  const newReport: UserReport = {
    id: `rep-${Date.now()}`,
    reporterId: brainmateStudentProfile.userId,
    reporterName: brainmateStudentProfile.displayName,
    reportedId,
    reportedName: reportedName || 'Reported Peer',
    groupId,
    groupName,
    reason,
    details,
    status: 'open',
    institutionId: brainmateStudentProfile.institutionId,
    createdAt: new Date().toISOString(),
  };

  brainmateReports.unshift(newReport);

  res.status(201).json({
    message: 'Report submitted to institutional academic moderators for investigation.',
    report: newReport,
  });
});

app.get('/api/brainmate/moderation/reports', (req: Request, res: Response) => {
  // Institution-scoped moderation list
  const reports = brainmateReports.filter((r) => r.institutionId === brainmateStudentProfile.institutionId);
  res.json(reports);
});

// ==========================================
// 9. Flagship 1: Reciprocal "Skill Swap" Matching Endpoints
// ==========================================
app.get('/api/brainmate/skill-swaps', (req: Request, res: Response) => {
  res.json({
    pairs: brainmateSkillSwaps,
    totalSynergyPairs: brainmateSkillSwaps.length,
    description: 'Bilateral reciprocity: pairs where Student A teaches what Student B needs, and Student B teaches what Student A needs.',
  });
});

app.post('/api/brainmate/skill-swaps/propose', (req: Request, res: Response) => {
  const { pairId, customNote, preferredSlot } = req.body;
  const pair = brainmateSkillSwaps.find((p) => p.id === pairId);
  if (!pair) {
    return res.status(404).json({ error: 'Skill swap pair not found' });
  }

  pair.status = 'proposed';

  // Also add to karma activity
  brainmateKarmaLedger.unshift({
    id: `kl-${Date.now()}`,
    title: `Proposed bilateral skill swap sprint with ${pair.candidateName} (${pair.theyTeach.unitCode} ⇄ ${pair.youTeach.unitCode})`,
    category: 'peer_tutoring',
    points: 15,
    timestamp: 'Just now',
    badge: '🤝',
  });
  brainmateStudentKarma.karmaPoints += 15;

  res.json({
    message: `Skill swap proposal sent to ${pair.candidateName}!`,
    pair,
    note: customNote,
    slot: preferredSlot,
  });
});

// ==========================================
// 10. Flagship 2: Live Focus Pod Karma & Sync
// ==========================================
app.post('/api/brainmate/focus-pod/complete-cycle', (req: Request, res: Response) => {
  const { cyclesCompleted, durationMinutes, goalSummary } = req.body;
  const earnedKarma = (Number(cyclesCompleted) || 1) * 10;

  brainmateStudentKarma.karmaPoints += earnedKarma;
  brainmateStudentKarma.hoursCollaborated += Math.round(((Number(durationMinutes) || 25) / 60) * 10) / 10;

  const ledgerEntry: KarmaLedgerItem = {
    id: `kl-${Date.now()}`,
    title: `Completed ${cyclesCompleted || 1} Pomodoro focus pod cycle(s) (${durationMinutes || 25} min)${goalSummary ? `: ${goalSummary}` : ''}`,
    category: 'pomodoro_sprint',
    points: earnedKarma,
    timestamp: 'Just now',
    badge: '🎧',
  };
  brainmateKarmaLedger.unshift(ledgerEntry);

  res.json({
    message: `Focus cycle completed! You earned +${earnedKarma} Karma points.`,
    karmaAwarded: earnedKarma,
    totalKarma: brainmateStudentKarma.karmaPoints,
    ledgerEntry,
  });
});

// ==========================================
// 11. Flagship 3: Free-Time Overlap Heatmap
// ==========================================
app.get('/api/brainmate/overlap/:peerId', (req: Request, res: Response) => {
  const { peerId } = req.params;
  const schedule = brainmatePeerSchedules[peerId] || brainmatePeerSchedules['user-sarah-m'];
  res.json(schedule);
});

// ==========================================
// 12. Flagship 4: Syllabus Burndown & Exam Readiness
// ==========================================
app.get('/api/brainmate/syllabus', (req: Request, res: Response) => {
  res.json(brainmateCoursesReadiness);
});

app.put('/api/brainmate/syllabus/topic', (req: Request, res: Response) => {
  const { unitCode, topicId, status } = req.body;
  if (!unitCode || !topicId || !status) {
    return res.status(400).json({ error: 'unitCode, topicId, and status are required' });
  }

  const course = brainmateCoursesReadiness.find((c) => c.unitCode === unitCode);
  if (!course) return res.status(404).json({ error: 'Course unit not found' });

  const topic = course.topics.find((t) => t.id === topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  topic.myStatus = status;

  // Recalculate course mastery percentage based on weighted exam values
  let totalMasteredWeight = 0;
  course.topics.forEach((t) => {
    if (t.myStatus === 'mastered') totalMasteredWeight += t.examWeightPct;
    else if (t.myStatus === 'practicing') totalMasteredWeight += t.examWeightPct * 0.5;
  });
  course.currentMasteryPct = Math.round(totalMasteredWeight);

  // Karma reward for completing a mastery milestone
  if (status === 'mastered') {
    brainmateStudentKarma.karmaPoints += 10;
    brainmateKarmaLedger.unshift({
      id: `kl-${Date.now()}`,
      title: `Mastered syllabus topic: "${topic.topicName}" (${unitCode})`,
      category: 'notes_shared',
      points: 10,
      timestamp: 'Just now',
      badge: '🎯',
    });
  }

  res.json({
    message: `Mastery status updated to ${status}`,
    course,
    topic,
  });
});

// ==========================================
// 13. Flagship 5: Peer Academic Endorsement & Study Karma Ledger
// ==========================================
app.get('/api/brainmate/karma', (req: Request, res: Response) => {
  res.json({
    summary: brainmateStudentKarma,
    endorsements: brainmatePeerEndorsements,
    ledger: brainmateKarmaLedger,
  });
});

app.post('/api/brainmate/karma/endorse', (req: Request, res: Response) => {
  const { peerId, peerName, badgeCategory, badgeLabel, unitCode, comment } = req.body;
  if (!peerId || !badgeCategory || !badgeLabel || !comment) {
    return res.status(400).json({ error: 'peerId, badgeCategory, badgeLabel, and comment are required' });
  }

  const badgeIcons: Record<string, string> = {
    patient_explainer: '🌟',
    code_debugger: '⚡',
    concise_notes: '📝',
    always_punctual: '⏰',
    proofs_master: '🧠',
    problem_crusher: '🎯',
  };

  const newEndorsement: PeerEndorsement = {
    id: `end-${Date.now()}`,
    peerId,
    peerName: peerName || 'Academic Peer',
    endorserId: brainmateStudentProfile.userId,
    endorserName: brainmateStudentProfile.displayName,
    badgeCategory,
    badgeLabel,
    badgeIcon: badgeIcons[badgeCategory] || '🌟',
    unitCode: unitCode || 'CSC 211',
    comment,
    karmaAwarded: 25,
    createdAt: new Date().toISOString(),
  };

  brainmatePeerEndorsements.unshift(newEndorsement);

  // Also award the endorser positive community karma for giving recognition!
  brainmateStudentKarma.karmaPoints += 15;
  brainmateKarmaLedger.unshift({
    id: `kl-${Date.now()}`,
    title: `Endorsed ${peerName || 'peer'} for "${badgeLabel}" in ${unitCode || 'CSC 211'}`,
    category: 'endorsement_received',
    points: 15,
    timestamp: 'Just now',
    badge: '🌟',
  });

  res.status(201).json({
    message: `Endorsement recorded! ${peerName || 'Peer'} was awarded +25 Karma, and you received +15 Community Karma for your endorsement.`,
    endorsement: newEndorsement,
  });
});

// Legacy backward compatibility endpoint
app.get('/api/brainmate/peers', (req: Request, res: Response) => {
  res.json(peerConnections);
});

app.post('/api/brainmate/connect', (req: Request, res: Response) => {
  const { peerId, action } = req.body;
  const peer = peerConnections.find((p) => p.id === peerId);
  if (!peer) return res.status(404).json({ error: 'Peer match not found' });
  if (action === 'request') peer.connectionStatus = 'Request Sent';
  else if (action === 'accept') peer.connectionStatus = 'Accepted';
  else if (action === 'decline') peer.connectionStatus = 'Declined';
  else if (action === 'block') peer.connectionStatus = 'Blocked';
  res.json({ message: `Status updated`, peer });
});

app.get('/api/community/resources', (req: Request, res: Response) => {
  res.json(COMMUNITY_RESOURCES);
});

// ==========================================
// 2. ZEROQ API ENDPOINTS
// ==========================================

// KUCCPS Placement
app.get('/api/zeroq/placement', (req: Request, res: Response) => {
  res.json(zeroqPlacement);
});

app.post('/api/zeroq/placement/download-letter', (req: Request, res: Response) => {
  zeroqPlacement.letterDownloaded = true;
  recordAudit('Student', 'Brian Otieno', 'DOWNLOAD_PLACEMENT_LETTER', 'KUCCPS Portal', 'Downloaded simulated 2025 placement offer letter');
  res.json({ message: 'Letter downloaded successfully', placement: zeroqPlacement });
});

// Universities Discovery
app.get('/api/zeroq/universities', (req: Request, res: Response) => {
  res.json(ZEROQ_UNIVERSITIES);
});

app.get('/api/zeroq/universities/:id', (req: Request, res: Response) => {
  const uni = ZEROQ_UNIVERSITIES.find((u) => u.id === req.params.id);
  if (!uni) return res.status(404).json({ error: 'University not found' });
  res.json(uni);
});

// Applications Wizard & Admissions Review
app.get('/api/zeroq/applications', (req: Request, res: Response) => {
  res.json(zeroqApplications);
});

app.post('/api/zeroq/applications', (req: Request, res: Response) => {
  const appData = req.body;
  const newApp: ZeroQApplication = {
    id: `ZQ-APP-${Date.now().toString().slice(-4)}`,
    studentId: 'demo-student-01',
    studentName: appData.personalInfo?.fullName || 'Brian Otieno',
    universityId: appData.universityId || 'maseno',
    universityName: 'Maseno University',
    programmeName: appData.programmeName || 'Bachelor of Science in Computer Science',
    programmeCode: appData.programmeCode || '107111',
    status: 'Submitted',
    submissionTimestamp: new Date().toISOString(),
    personalInfo: appData.personalInfo,
    academicInfo: appData.academicInfo,
    timeline: [
      {
        id: `evt-${Date.now()}`,
        status: 'Submitted',
        note: 'Application submitted through ZeroQ wizard.',
        timestamp: new Date().toISOString(),
        actor: 'Applicant',
      },
    ],
    isDemo: true,
  };
  zeroqApplications.unshift(newApp);
  recordAudit('Student', newApp.studentName, 'SUBMIT_APPLICATION', newApp.id, 'Submitted admission application for Maseno University');
  res.status(201).json(newApp);
});

app.put('/api/zeroq/applications/:id/status', (req: Request, res: Response) => {
  const { status, note, reviewerName } = req.body;
  const appItem = zeroqApplications.find((a) => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  appItem.status = status;
  appItem.reviewerComments = note || appItem.reviewerComments;
  appItem.timeline.push({
    id: `evt-${Date.now()}`,
    status,
    note: note || `Application status transitioned to ${status}`,
    timestamp: new Date().toISOString(),
    actor: reviewerName || 'Admissions Desk',
  });

  // If approved, update credential verification condition
  if (status === 'Approved') {
    zeroqCredential.status = 'Demo Verified';
    recordAudit('Admissions Officer', reviewerName || 'Officer', 'APPROVE_APPLICATION', appItem.id, 'Application approved; credential unlocked');
  }

  res.json(appItem);
});

// Documents Management & Review
app.get('/api/zeroq/documents', (req: Request, res: Response) => {
  res.json(zeroqDocuments);
});

app.post('/api/zeroq/documents/upload', (req: Request, res: Response) => {
  const { documentType, fileName } = req.body;
  let doc = zeroqDocuments.find((d) => d.documentType === documentType);
  if (!doc) {
    doc = {
      id: `doc-${Date.now()}`,
      documentType,
      fileName: fileName || `${documentType.toLowerCase().replace(/ /g, '_')}.pdf`,
      fileSize: '512 KB',
      uploadedAt: new Date().toISOString(),
      status: 'Uploaded',
      isMandatory: true,
    };
    zeroqDocuments.push(doc);
  } else {
    doc.fileName = fileName || doc.fileName;
    doc.uploadedAt = new Date().toISOString();
    doc.status = 'Uploaded';
  }
  recordAudit('Student', 'Brian Otieno', 'UPLOAD_DOCUMENT', documentType, `Uploaded demonstration file ${doc.fileName}`);
  res.json(doc);
});

app.put('/api/zeroq/documents/:id/status', (req: Request, res: Response) => {
  const { status, comments, reviewerName } = req.body;
  const doc = zeroqDocuments.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  doc.status = status;
  doc.reviewerComments = comments || doc.reviewerComments;
  recordAudit('Admissions Officer', reviewerName || 'Admissions Desk', 'REVIEW_DOCUMENT', doc.documentType, `Status: ${status}`);
  res.json(doc);
});

// Face Check Simulation
app.post('/api/zeroq/face-check', (req: Request, res: Response) => {
  const { isSimulated = true } = req.body;
  recordAudit('Student', 'Brian Otieno', 'FACE_CHECK_COMPLETED', 'Biometric Mock', 'Completed social-app style face check simulation');
  res.json({
    status: 'Demonstration successful',
    identityMatch: 'Simulated for demonstration',
    universityVerification: 'Pending university approval',
    timestamp: new Date().toISOString(),
  });
});

// Digital Student Credential & Verification
app.get('/api/zeroq/credentials', (req: Request, res: Response) => {
  res.json(zeroqCredential);
});

app.post('/api/zeroq/credentials/verify-status', (req: Request, res: Response) => {
  const { status, actor } = req.body;
  zeroqCredential.status = status;
  recordAudit('Administrator', actor || 'University Admin', 'UPDATE_CREDENTIAL_STATUS', zeroqCredential.studentNumber, `Status set to ${status}`);
  res.json(zeroqCredential);
});

// Marketplace & Merchants
app.get('/api/zeroq/merchants', (req: Request, res: Response) => {
  res.json(zeroqMerchants);
});

app.get('/api/zeroq/products', (req: Request, res: Response) => {
  const { category, search, merchantId } = req.query;
  let results = [...zeroqProducts];
  if (category && category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (merchantId) {
    results = results.filter((p) => p.merchantId === String(merchantId));
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  res.json(results);
});

// Orders & Checkout with Simulated Payments
app.get('/api/zeroq/orders', (req: Request, res: Response) => {
  const { merchantId } = req.query;
  if (merchantId) {
    return res.json(zeroqOrders.filter((o) => o.merchantId === merchantId));
  }
  res.json(zeroqOrders);
});

app.post('/api/zeroq/orders', (req: Request, res: Response) => {
  const { items, paymentMethod, deliveryOption, mpesaPhone } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items' });
  }

  // Server-side price calculation
  let subtotal = 0;
  const orderItems = items.map((item: any) => {
    const prod = zeroqProducts.find((p) => p.id === item.productId);
    const unitPrice = prod ? prod.priceKSh : 500;
    const qty = Math.max(1, item.quantity || 1);
    const totalKSh = unitPrice * qty;
    subtotal += totalKSh;

    // Decrement mock stock
    if (prod && prod.stockQuantity > 0) {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - qty);
    }

    return {
      productId: item.productId,
      productName: prod ? prod.name : 'Campus Item',
      unitPriceKSh: unitPrice,
      quantity: qty,
      totalKSh,
    };
  });

  const fees = deliveryOption === 'Hostel Delivery' ? 100 : 0;
  const total = subtotal + fees;

  const targetMerchant = zeroqMerchants.find((m) => m.id === items[0]?.merchantId) || zeroqMerchants[0];
  const orderId = `ZQ-ORD-${Date.now().toString().slice(-4)}`;
  const voucherId = `ZQ-DEMO-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: ZeroQOrder = {
    orderId,
    studentId: 'demo-student-01',
    studentName: 'Brian Otieno',
    merchantId: targetMerchant.id,
    merchantName: targetMerchant.name,
    items: orderItems,
    subtotalKSh: subtotal,
    feesKSh: fees,
    totalKSh: total,
    status: 'Ready For Collection',
    paymentMethod: paymentMethod || 'Demo M-Pesa',
    paymentReference: paymentMethod === 'Demo M-Pesa' ? `MPESA-DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : `CARD-AUTH-OK`,
    deliveryOption: deliveryOption || 'Campus Collection',
    timestamp: new Date().toISOString(),
    voucherId,
    isDemo: true,
  };

  zeroqOrders.unshift(newOrder);

  // Automatically generate digital voucher for order collection
  const newVoucher: ZeroQCampusVoucher = {
    voucherId,
    orderId,
    studentId: 'demo-student-01',
    studentName: 'Brian Otieno',
    merchantId: targetMerchant.id,
    merchantName: targetMerchant.name,
    itemName: orderItems[0].productName + (orderItems.length > 1 ? ` (+${orderItems.length - 1} more)` : ''),
    valueKSh: total,
    status: 'Active',
    qrCodeData: `https://zeroq.unisync.edu/voucher/${voucherId}`,
    issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    expiryDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    isDemo: true,
  };
  zeroqVouchers.unshift(newVoucher);

  recordAudit('Student', 'Brian Otieno', 'PLACE_CAMPUS_ORDER', orderId, `Simulated payment of KSh ${total} via ${newOrder.paymentMethod}`);
  recordAudit('System', 'Voucher Engine', 'GENERATE_VOUCHER', voucherId, `Collection voucher issued for order ${orderId}`);

  res.status(201).json({ order: newOrder, voucher: newVoucher });
});

// Vouchers & Redemption
app.get('/api/zeroq/vouchers', (req: Request, res: Response) => {
  res.json(zeroqVouchers);
});

app.post('/api/zeroq/vouchers/redeem', (req: Request, res: Response) => {
  const { voucherIdOrCode, merchantId } = req.body;
  if (!voucherIdOrCode) {
    return res.status(400).json({ error: 'Voucher reference or QR code required' });
  }

  // Extract voucher ID from full QR URL if scanned
  const cleanId = voucherIdOrCode.includes('/voucher/')
    ? voucherIdOrCode.split('/voucher/')[1]
    : voucherIdOrCode.trim();

  const voucher = zeroqVouchers.find((v) => v.voucherId.toLowerCase() === cleanId.toLowerCase());

  if (!voucher) {
    return res.status(404).json({ error: `Voucher "${cleanId}" not found in system` });
  }

  if (voucher.status === 'Redeemed') {
    return res.status(400).json({ error: `Voucher "${cleanId}" was already redeemed on ${voucher.redeemedAt}` });
  }

  if (voucher.status === 'Expired') {
    return res.status(400).json({ error: `Voucher "${cleanId}" has expired and cannot be redeemed` });
  }

  // Check merchant match if merchant specified
  if (merchantId && voucher.merchantId !== merchantId) {
    const authorized = zeroqMerchants.find((m) => m.id === voucher.merchantId);
    return res.status(403).json({ error: `This voucher can only be redeemed at ${authorized?.name || 'the authorized merchant'}.` });
  }

  // Redeem voucher
  voucher.status = 'Redeemed';
  voucher.redeemedAt = new Date().toISOString();
  const mName = zeroqMerchants.find((m) => m.id === merchantId)?.name || voucher.merchantName;
  voucher.redeemedByMerchant = mName;

  // Update corresponding order
  const ord = zeroqOrders.find((o) => o.orderId === voucher.orderId);
  if (ord) {
    ord.status = 'Collected';
  }

  recordAudit('Merchant', mName, 'REDEEM_VOUCHER', voucher.voucherId, `Redeemed voucher for KSh ${voucher.valueKSh}`);
  res.json({ message: 'Voucher successfully redeemed!', voucher });
});

// ZeroQ Platform Admin Overview & Reset
app.get('/api/zeroq/admin/metrics', (req: Request, res: Response) => {
  const completedOnboardingCount = zeroqCredential.status === 'Demo Verified' ? 1 : 0;
  res.json({
    registeredDemoStudents: 1,
    submittedApplications: zeroqApplications.length,
    applicationsAwaitingReview: zeroqApplications.filter((a) => a.status === 'Submitted' || a.status === 'Under Review').length,
    completedOnboardingJourneys: completedOnboardingCount,
    activeDemoCredentials: zeroqCredential.status === 'Demo Verified' ? 1 : 0,
    demoMerchants: zeroqMerchants.length,
    demoOrders: zeroqOrders.length,
    activeVouchers: zeroqVouchers.filter((v) => v.status === 'Active').length,
    successfulRedemptions: zeroqVouchers.filter((v) => v.status === 'Redeemed').length,
  });
});

app.get('/api/zeroq/admin/audit-logs', (req: Request, res: Response) => {
  res.json(zeroqAuditLogs);
});

app.post('/api/zeroq/admin/reset', (req: Request, res: Response) => {
  zeroqPlacement = { ...DEFAULT_PLACEMENT_RECORD };
  zeroqApplications = [{ ...INITIAL_APPLICATION }];
  zeroqDocuments = INITIAL_DOCUMENTS.map((d) => ({ ...d }));
  zeroqCredential = { ...INITIAL_CREDENTIAL };
  zeroqOrders = INITIAL_ORDERS.map((o) => ({ ...o }));
  zeroqVouchers = INITIAL_VOUCHERS.map((v) => ({ ...v }));
  zeroqProducts = CAMPUS_PRODUCTS.map((p) => ({ ...p }));
  zeroqAuditLogs = [...INITIAL_AUDIT_LOGS];
  recordAudit('Administrator', 'System Admin', 'RESET_DEMO_DATA', 'All Collections', 'Restored pristine demo state.');
  res.json({ message: 'Demo data successfully reset to initial seed state.' });
});

// Start Full-Stack Server
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  // Vercel serves the built SPA as static output. Its catch-all function imports
  // this app only for /api requests, so it must not register the SPA fallback.
  if (isProduction && !process.env.VERCEL) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`UniSync (UniPath & ZeroQ) server running on http://0.0.0.0:${port}`);
  });
}

export { app };
export default app;

if (!process.env.VERCEL) {
  startServer();
}

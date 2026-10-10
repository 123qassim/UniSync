/**
 * UniSync Full-Stack Express Server
 * Serves UniPath and ZeroQ APIs, Apex AI Assistant, and Vite Dev Middleware.
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

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

// Profile endpoints
app.post('/api/auth/sign-in', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required' });
  let profile = Array.from(studentProfiles.values()).find((p) => p.email.toLowerCase() === email.toLowerCase());
  if (!profile) {
    const newId = `student-${Date.now()}`;
    profile = {
      ...DEMO_STUDENT,
      id: newId,
      email,
      displayName: email.split('@')[0],
    };
    studentProfiles.set(newId, profile);
  }
  res.json({ token: `session-${profile.id}`, profile });
});

app.post('/api/auth/sign-up', (req: Request, res: Response) => {
  const { email, displayName, universityId, programmeId } = req.body;
  const newId = `student-${Date.now()}`;
  const profile: StudentProfile = {
    ...DEMO_STUDENT,
    id: newId,
    email: email || 'student@example.ac.ke',
    displayName: displayName || 'New Student',
    universityId: universityId || 'maseno',
    programmeId: programmeId || 'bsc-cs',
  };
  studentProfiles.set(newId, profile);
  res.status(201).json({ token: `session-${profile.id}`, profile });
});

app.get('/api/profile', (req: Request, res: Response) => {
  const profile = studentProfiles.get('demo-student-01') || DEMO_STUDENT;
  res.json(profile);
});

app.put('/api/profile', (req: Request, res: Response) => {
  const updated = { ...DEMO_STUDENT, ...req.body };
  studentProfiles.set('demo-student-01', updated);
  res.json(updated);
});

app.post('/api/profile/consent', (req: Request, res: Response) => {
  const profile = studentProfiles.get('demo-student-01') || DEMO_STUDENT;
  profile.consent = { ...profile.consent, ...req.body, lastUpdated: new Date().toISOString() };
  res.json({ message: 'Consent updated', consent: profile.consent });
});

app.delete('/api/profile/data', (req: Request, res: Response) => {
  const profile = studentProfiles.get('demo-student-01') || DEMO_STUDENT;
  profile.units = profile.units.map((u) => ({ ...u, mark: undefined }));
  res.json({ message: 'Submitted marks wiped.' });
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

// 1. Learning Profile
app.get('/api/brainmate/profile', (req: Request, res: Response) => {
  const completeness = calculateProfileCompleteness(brainmateStudentProfile);
  res.json({
    profile: brainmateStudentProfile,
    completeness,
  });
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

app.put('/api/brainmate/profile', (req: Request, res: Response) => {
  const parsed = LearningProfileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid profile data', details: parsed.error.issues });
  }

  brainmateStudentProfile = {
    ...brainmateStudentProfile,
    ...parsed.data,
    units: parsed.data.units || brainmateStudentProfile.units,
    availability: parsed.data.availability || brainmateStudentProfile.availability,
    collaborationGoals: parsed.data.collaborationGoals || brainmateStudentProfile.collaborationGoals,
  };

  const completeness = calculateProfileCompleteness(brainmateStudentProfile);
  res.json({
    message: 'Learning profile successfully updated',
    profile: brainmateStudentProfile,
    completeness,
  });
});

// 2. Deterministic & Explainable Match Discovery
app.get('/api/brainmate/matches', (req: Request, res: Response) => {
  const topN = Number(req.query.topN) || 20;
  const allowExisting = req.query.allowExisting === 'true';

  const matches = findBrainMateMatches(brainmateStudentProfile, brainmateCandidates, {
    topN,
    blockedUserIds: Array.from(brainmateUserBlocks),
    existingConnectionUserIds: brainmateActiveConnections.map((c) => c.userId),
    allowExistingConnections: allowExisting,
  });

  res.json({
    matches,
    totalEligible: matches.length,
    ethicalDisclaimer:
      'Compatibility is a transparent, deterministic score based strictly on complementary academic units, syllabus topics, and schedule availability. Demographic, financial, and popularity metrics are never utilized.',
  });
});

// 3. Connections Hub (Incoming, Outgoing, Active)
app.get('/api/brainmate/connections', (req: Request, res: Response) => {
  const incoming = brainmateRequests.filter(
    (r) =>
      r.receiverId === brainmateStudentProfile.userId &&
      r.status === 'pending' &&
      !brainmateUserBlocks.has(r.senderId)
  );

  const outgoing = brainmateRequests.filter(
    (r) =>
      r.senderId === brainmateStudentProfile.userId &&
      r.status === 'pending' &&
      !brainmateUserBlocks.has(r.receiverId)
  );

  const active = brainmateActiveConnections.filter((c) => !brainmateUserBlocks.has(c.userId));

  res.json({
    incoming,
    outgoing,
    active,
    blockedCount: brainmateUserBlocks.size,
  });
});

// 4. Send Connection Request (with strict safety rate limits)
app.post('/api/brainmate/connections/request', (req: Request, res: Response) => {
  const { candidateUserId, note } = req.body;
  if (!candidateUserId) {
    return res.status(400).json({ error: 'candidateUserId is required' });
  }

  // Check blocks
  if (brainmateUserBlocks.has(candidateUserId)) {
    return res.status(403).json({ error: 'Cannot connect with a blocked user' });
  }

  // Rate limits: max 10/day total, max 3/user/week
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const dailyCount = requestRateTracker.filter((r) => r.timestamp > oneDayAgo).length;
  if (dailyCount >= 10) {
    return res.status(429).json({ error: 'Rate limit reached: You can send at most 10 connection requests per day.' });
  }

  const userWeeklyCount = requestRateTracker.filter(
    (r) => r.recipientId === candidateUserId && r.timestamp > oneWeekAgo
  ).length;
  if (userWeeklyCount >= 3) {
    return res.status(429).json({ error: 'Rate limit reached: You can send at most 3 requests per week to the same peer.' });
  }

  // Check if candidate exists
  const candidate = brainmateCandidates.find((c) => c.userId === candidateUserId);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate profile not found' });
  }

  // Check existing active or pending connection
  if (brainmateActiveConnections.some((c) => c.userId === candidateUserId)) {
    return res.status(400).json({ error: 'You are already connected with this peer' });
  }

  const existingPending = brainmateRequests.find(
    (r) =>
      r.senderId === brainmateStudentProfile.userId &&
      r.receiverId === candidateUserId &&
      r.status === 'pending'
  );
  if (existingPending) {
    return res.status(400).json({ error: 'A pending connection request already exists' });
  }

  // Score candidate for snapshot
  const matchResult = scoreCandidate(brainmateStudentProfile, candidate);

  const newRequest: ConnectionRequest = {
    id: `req-${Date.now()}`,
    senderId: brainmateStudentProfile.userId,
    senderName: brainmateStudentProfile.displayName,
    senderProgramme: brainmateStudentProfile.programmeName || 'BSc Computer Science',
    senderStudyLevel: `${brainmateStudentProfile.studyLevel}`,
    receiverId: candidate.userId,
    receiverName: candidate.displayName,
    note: note || '',
    matchScore: matchResult.score,
    matchReason: matchResult.explanation,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  brainmateRequests.unshift(newRequest);
  requestRateTracker.push({ timestamp: now, recipientId: candidateUserId });

  res.status(201).json({
    message: 'Connection request sent successfully',
    request: newRequest,
  });
});

// 5. Respond to Connection Request (Accept, Decline, Withdraw)
app.post('/api/brainmate/connections/respond', (req: Request, res: Response) => {
  const { requestId, action } = req.body;
  const request = brainmateRequests.find((r) => r.id === requestId);

  if (!request) {
    return res.status(404).json({ error: 'Connection request not found' });
  }

  if (action === 'accept') {
    request.status = 'accepted';
    request.respondedAt = new Date().toISOString();

    // Determine partner
    const isReceiver = request.receiverId === brainmateStudentProfile.userId;
    const partnerId = isReceiver ? request.senderId : request.receiverId;
    const partnerName = isReceiver ? request.senderName : request.receiverName;
    const partnerCandidate = brainmateCandidates.find((c) => c.userId === partnerId);

    // Create Active Connection
    if (!brainmateActiveConnections.some((c) => c.userId === partnerId)) {
      brainmateActiveConnections.unshift({
        id: `conn-${Date.now()}`,
        userId: partnerId,
        displayName: partnerName,
        programmeName: partnerCandidate?.programmeName || request.senderProgramme || 'Academic Partner',
        studyLevel: partnerCandidate?.studyLevel || 'Undergraduate',
        avatarInitials: partnerName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        sharedUnitsCount: partnerCandidate
          ? partnerCandidate.units.filter((u) =>
              brainmateStudentProfile.units.some((my) => my.unitCode === u.unitCode)
            ).length
          : 2,
        establishedAt: new Date().toISOString(),
        lastActive: 'Just now',
      });
    }
  } else if (action === 'decline') {
    request.status = 'declined';
    request.respondedAt = new Date().toISOString();
  } else if (action === 'withdraw') {
    request.status = 'withdrawn';
    request.respondedAt = new Date().toISOString();
  } else {
    return res.status(400).json({ error: 'Invalid action. Must be accept, decline, or withdraw.' });
  }

  res.json({
    message: `Request status updated to ${request.status}`,
    request,
    activeConnections: brainmateActiveConnections,
  });
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

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
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

startServer();

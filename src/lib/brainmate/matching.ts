/**
 * UniSync BrainMate: Academic Matching Algorithm (Deterministic + Explainable MVP)
 *
 * Ethically provable: Absolutely zero ranking on demographic, gender, wealth,
 * popularity, follower counts, or disability attributes.
 * Scores are 100% decomposed from academic strengths, study needs, schedule overlap,
 * and pedagogical preferences.
 */

export type StudyLevel = 'undergraduate' | 'postgraduate' | 'doctorate' | 'diploma';
export type StudyFormat = 'online' | 'in_person' | 'hybrid';
export type ProfileVisibility = 'institution' | 'programme' | 'connections_only';
export type UnitRole = 'can_help' | 'needs_help' | 'studying';
export type UnitConfidence = 'high' | 'medium' | 'low';

export interface UnitPreference {
  academicUnitId: string;
  unitCode: string;
  unitTitle: string;
  role: UnitRole;
  confidence?: UnitConfidence;
  topics: string[];
}

export interface AvailabilityWindow {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // '09:00' (24-hour HH:mm)
  endTime: string;   // '11:00'
}

export interface StudentLearningProfile {
  id: string;
  userId: string;
  displayName: string;
  institutionId: string;
  institutionName?: string;
  programmeId: string;
  programmeName?: string;
  studyLevel: StudyLevel;
  preferredGroupSize: number; // e.g. 2 - 6
  preferredFormat: StudyFormat;
  mentorWillingness: boolean;
  collaborationGoals: string[]; // e.g. ['Exam Prep', 'Project Collaboration', 'Code Review', 'Conceptual Mastery']
  visibility: ProfileVisibility;
  units: UnitPreference[];
  availability: AvailabilityWindow[];
  verifiedUnitEnrolment?: boolean;
}

export interface MatchFactor {
  key: string;
  label: string;
  points: number;
  maxPoints: number;
  description: string;
}

export type MatchResult = {
  candidateUserId: string;
  candidateProfile: StudentLearningProfile;
  score: number; // 0-100 rounded
  factors: MatchFactor[];
  explanation: string;
  evidenceLevel: 'verified_unit' | 'self_reported';
};

export interface MatchingOptions {
  now?: Date;
  topN?: number;
  blockedUserIds?: string[];
  existingConnectionUserIds?: string[];
  allowExistingConnections?: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Calculates overlap in minutes between two time windows on the same day.
 */
export function calculateWindowOverlapMinutes(
  w1: AvailabilityWindow,
  w2: AvailabilityWindow
): number {
  if (w1.dayOfWeek !== w2.dayOfWeek) return 0;

  const [h1Start, m1Start] = w1.startTime.split(':').map(Number);
  const [h1End, m1End] = w1.endTime.split(':').map(Number);
  const [h2Start, m2Start] = w2.startTime.split(':').map(Number);
  const [h2End, m2End] = w2.endTime.split(':').map(Number);

  const start1Min = h1Start * 60 + m1Start;
  const end1Min = h1End * 60 + m1End;
  const start2Min = h2Start * 60 + m2Start;
  const end2Min = h2End * 60 + m2End;

  const overlapStart = Math.max(start1Min, start2Min);
  const overlapEnd = Math.min(end1Min, end2Min);

  return Math.max(0, overlapEnd - overlapStart);
}

/**
 * Total overlap across all weekly availability windows.
 */
export function calculateTotalWeeklyOverlapMinutes(
  avail1: AvailabilityWindow[],
  avail2: AvailabilityWindow[]
): { totalMinutes: number; overlappingWindows: { day: string; minutes: number; start: string; end: string }[] } {
  let totalMinutes = 0;
  const overlappingWindows: { day: string; minutes: number; start: string; end: string }[] = [];

  for (const a1 of avail1) {
    for (const a2 of avail2) {
      const overlap = calculateWindowOverlapMinutes(a1, a2);
      if (overlap > 0) {
        totalMinutes += overlap;
        const [h1Start, m1Start] = a1.startTime.split(':').map(Number);
        const [h2Start, m2Start] = a2.startTime.split(':').map(Number);
        const [h1End, m1End] = a1.endTime.split(':').map(Number);
        const [h2End, m2End] = a2.endTime.split(':').map(Number);
        const startMin = Math.max(h1Start * 60 + m1Start, h2Start * 60 + m2Start);
        const endMin = Math.min(h1End * 60 + m1End, h2End * 60 + m2End);
        const startStr = `${String(Math.floor(startMin / 60)).padStart(2, '0')}:${String(startMin % 60).padStart(2, '0')}`;
        const endStr = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
        overlappingWindows.push({
          day: DAY_NAMES[a1.dayOfWeek],
          minutes: overlap,
          start: startStr,
          end: endStr,
        });
      }
    }
  }

  return { totalMinutes, overlappingWindows };
}

/**
 * Format time range for conversational explanation (e.g., 'Tuesday 2-4 PM' or 'Tuesday 14:00-16:00')
 */
function formatTimeRange(start: string, end: string): string {
  const formatHour = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
  };
  return `${formatHour(start)} - ${formatHour(end)}`;
}

/**
 * Calculates deterministic compatibility score and itemized breakdown
 * between the current student and a candidate.
 */
export function scoreCandidate(
  myProfile: StudentLearningProfile,
  candidate: StudentLearningProfile
): MatchResult {
  const factors: MatchFactor[] = [];

  // 1. Complementary Units (Max 35 points)
  // My needs_help matched by candidate's can_help: up to 25 pts
  // Candidate's needs_help matched by my can_help (reciprocal bonus): up to 10 pts
  const myNeeds = myProfile.units.filter((u) => u.role === 'needs_help');
  const myCanHelp = myProfile.units.filter((u) => u.role === 'can_help');
  const candidateCanHelp = candidate.units.filter((u) => u.role === 'can_help');
  const candidateNeeds = candidate.units.filter((u) => u.role === 'needs_help');

  const complementaryToMe = myNeeds.filter((mn) =>
    candidateCanHelp.some((c) => c.academicUnitId === mn.academicUnitId || c.unitCode.toLowerCase() === mn.unitCode.toLowerCase())
  );

  const reciprocalBonusUnits = candidateNeeds.filter((cn) =>
    myCanHelp.some((m) => m.academicUnitId === cn.academicUnitId || m.unitCode.toLowerCase() === cn.unitCode.toLowerCase())
  );

  let unitPoints = 0;
  if (myNeeds.length > 0 && complementaryToMe.length > 0) {
    // 25 points proportional to how many of my needs are satisfied (at least 15 for 1 match)
    const ratio = Math.min(1, complementaryToMe.length / Math.max(1, myNeeds.length));
    unitPoints += Math.round(15 + ratio * 10);
  } else if (complementaryToMe.length > 0) {
    unitPoints += 20;
  }

  // Reciprocal benefit (up to 10 pts)
  if (reciprocalBonusUnits.length > 0) {
    unitPoints += Math.min(10, reciprocalBonusUnits.length * 5);
  }

  // Shared studying units if no complement exists yet
  if (unitPoints === 0) {
    const sharedStudying = myProfile.units.filter((u) =>
      candidate.units.some((c) => c.academicUnitId === u.academicUnitId || c.unitCode.toLowerCase() === u.unitCode.toLowerCase())
    );
    if (sharedStudying.length > 0) {
      unitPoints = Math.min(15, sharedStudying.length * 7);
    }
  }

  unitPoints = Math.min(35, unitPoints);

  const unitDesc = complementaryToMe.length > 0
    ? `${candidate.displayName} can help with ${complementaryToMe.map((u) => u.unitCode).join(', ')}${reciprocalBonusUnits.length > 0 ? ` and you can help them with ${reciprocalBonusUnits.map((u) => u.unitCode).join(', ')}` : ''}.`
    : unitPoints > 0
    ? `You both study common academic units.`
    : `No directly overlapping academic units identified.`;

  factors.push({
    key: 'complementary_units',
    label: 'Complementary Academic Units',
    points: unitPoints,
    maxPoints: 35,
    description: unitDesc,
  });

  // 2. Topic-Level Match (Max 10 points)
  // Shared topics on complementary or studying units
  let matchedTopics: { unitCode: string; topic: string }[] = [];
  for (const myU of myProfile.units) {
    const candU = candidate.units.find(
      (c) => c.academicUnitId === myU.academicUnitId || c.unitCode.toLowerCase() === myU.unitCode.toLowerCase()
    );
    if (candU) {
      for (const t of myU.topics) {
        if (candU.topics.some((ct) => ct.toLowerCase() === t.toLowerCase())) {
          matchedTopics.push({ unitCode: myU.unitCode, topic: t });
        }
      }
    }
  }

  let topicPoints = 0;
  if (matchedTopics.length >= 3) {
    topicPoints = 10;
  } else if (matchedTopics.length === 2) {
    topicPoints = 8;
  } else if (matchedTopics.length === 1) {
    topicPoints = 5;
  }

  const topicDesc = matchedTopics.length > 0
    ? `Shared topic focus in ${matchedTopics.slice(0, 2).map((m) => `${m.topic} (${m.unitCode})`).join(', ')}.`
    : `No shared specific syllabus topics declared.`;

  factors.push({
    key: 'topic_match',
    label: 'Topic-Level Synergy',
    points: topicPoints,
    maxPoints: 10,
    description: topicDesc,
  });

  // 3. Availability Overlap (Max 20 points)
  // >= 60 min overlap = full credit (20 pts); 30-59 min = 12 pts; 1-29 min = 6 pts; 0 min = 0
  const { totalMinutes, overlappingWindows } = calculateTotalWeeklyOverlapMinutes(
    myProfile.availability,
    candidate.availability
  );

  let availPoints = 0;
  if (totalMinutes >= 60) {
    availPoints = 20;
  } else if (totalMinutes >= 30) {
    availPoints = 12;
  } else if (totalMinutes > 0) {
    availPoints = 6;
  }

  const firstWindow = overlappingWindows[0];
  const availDesc = totalMinutes >= 60
    ? `Strong weekly schedule overlap (${totalMinutes} mins), including ${firstWindow ? `${firstWindow.day} ${formatTimeRange(firstWindow.start, firstWindow.end)}` : 'shared windows'}.`
    : totalMinutes > 0
    ? `Partial schedule intersection (${totalMinutes} mins).`
    : `No mutual weekly availability windows identified.`;

  factors.push({
    key: 'availability_overlap',
    label: 'Weekly Availability Overlap',
    points: availPoints,
    maxPoints: 20,
    description: availDesc,
  });

  // 4. Format Compatibility (Max 10 points)
  // Same format = 10 pts; one is hybrid = 8 pts; incompatible (online vs in_person) = 0
  let formatPoints = 0;
  if (myProfile.preferredFormat === candidate.preferredFormat) {
    formatPoints = 10;
  } else if (myProfile.preferredFormat === 'hybrid' || candidate.preferredFormat === 'hybrid') {
    formatPoints = 8;
  } else {
    formatPoints = 0;
  }

  const formatDesc = formatPoints === 10
    ? `Both prefer ${myProfile.preferredFormat.replace('_', '-')} collaboration.`
    : formatPoints === 8
    ? `Format compatible via hybrid preference.`
    : `Different study formats (${myProfile.preferredFormat} vs ${candidate.preferredFormat}).`;

  factors.push({
    key: 'format_compatibility',
    label: 'Study Format Compatibility',
    points: formatPoints,
    maxPoints: 10,
    description: formatDesc,
  });

  // 5. Group Size Alignment (Max 5 points)
  // Same size band (diff <= 1) = 5 pts; diff == 2 = 2 pts; diff > 2 = 0
  const sizeDiff = Math.abs(myProfile.preferredGroupSize - candidate.preferredGroupSize);
  let groupSizePoints = 0;
  if (sizeDiff <= 1) {
    groupSizePoints = 5;
  } else if (sizeDiff === 2) {
    groupSizePoints = 2;
  } else {
    groupSizePoints = 0;
  }

  const groupDesc = groupSizePoints === 5
    ? `Aligned on group size (~${myProfile.preferredGroupSize} members).`
    : `Slight difference in preferred study group size.`;

  factors.push({
    key: 'group_size_alignment',
    label: 'Group Size Alignment',
    points: groupSizePoints,
    maxPoints: 5,
    description: groupDesc,
  });

  // 6. Mentor Willingness (Max 10 points)
  // Candidate willing to mentor when I need help = 10 pts; both willing = 6 pts; otherwise 0
  let mentorPoints = 0;
  if (candidate.mentorWillingness && myNeeds.length > 0) {
    mentorPoints = 10;
  } else if (candidate.mentorWillingness && myProfile.mentorWillingness) {
    mentorPoints = 6;
  } else if (candidate.mentorWillingness) {
    mentorPoints = 4;
  }

  const mentorDesc = mentorPoints === 10
    ? `${candidate.displayName} is willing to mentor in areas where you requested peer support.`
    : candidate.mentorWillingness
    ? `Candidate has indicated willingness to act as a study mentor.`
    : `Peer collaboration mode (no mentor preference).`;

  factors.push({
    key: 'mentor_willingness',
    label: 'Peer Mentorship Synergy',
    points: mentorPoints,
    maxPoints: 10,
    description: mentorDesc,
  });

  // 7. Shared Collaboration Goals (Max 10 points)
  // Tag overlap: up to 10 points (3 pts each up to 10)
  const sharedGoals = myProfile.collaborationGoals.filter((g) =>
    candidate.collaborationGoals.some((cg) => cg.toLowerCase() === g.toLowerCase())
  );
  const goalPoints = Math.min(10, sharedGoals.length * 4);

  const goalDesc = sharedGoals.length > 0
    ? `Shared study goals: ${sharedGoals.slice(0, 3).join(', ')}.`
    : `Distinct study goals.`;

  factors.push({
    key: 'collaboration_goals',
    label: 'Shared Collaboration Goals',
    points: goalPoints,
    maxPoints: 10,
    description: goalDesc,
  });

  // Total score (sum 0-100)
  const totalScore = Math.min(
    100,
    Math.round(factors.reduce((sum, f) => sum + f.points, 0))
  );

  // Generate explainable natural language synthesis from top 2-3 factors
  // Sort factors by contribution percentage (points / maxPoints) descending
  const sortedFactors = [...factors].sort((a, b) => b.points / b.maxPoints - a.points / a.maxPoints);
  const explanation = generateMatchExplanation(myProfile, candidate, sortedFactors, complementaryToMe, reciprocalBonusUnits, matchedTopics, firstWindow);

  const evidenceLevel = (candidate.verifiedUnitEnrolment && myProfile.verifiedUnitEnrolment)
    ? 'verified_unit'
    : 'self_reported';

  return {
    candidateUserId: candidate.userId,
    candidateProfile: candidate,
    score: totalScore,
    factors,
    explanation,
    evidenceLevel,
  };
}

/**
 * Composes a human-readable, transparent explanation from top factors.
 * Example:
 * "You both study Introduction to Programming. Brian selected C++ as a topic he can help with, which matches your request. You also overlap Tuesday 2-4 PM and both prefer in-person groups."
 */
export function generateMatchExplanation(
  myProfile: StudentLearningProfile,
  candidate: StudentLearningProfile,
  topFactors: MatchFactor[],
  complementaryUnits: UnitPreference[],
  reciprocalUnits: UnitPreference[],
  matchedTopics: { unitCode: string; topic: string }[],
  overlapWindow?: { day: string; minutes: number; start: string; end: string }
): string {
  const sentences: string[] = [];

  // Sentence 1: Unit & topic complementarity
  if (complementaryUnits.length > 0) {
    const compUnit = complementaryUnits[0];
    const candUnit = candidate.units.find((u) => u.academicUnitId === compUnit.academicUnitId || u.unitCode.toLowerCase() === compUnit.unitCode.toLowerCase());
    const topicMatch = matchedTopics.find((m) => m.unitCode === compUnit.unitCode);

    if (topicMatch) {
      sentences.push(
        `You both study ${compUnit.unitTitle || compUnit.unitCode}. ${candidate.displayName} selected ${topicMatch.topic} as a topic they can help with, which matches your request.`
      );
    } else {
      sentences.push(
        `${candidate.displayName} can help with ${compUnit.unitTitle || compUnit.unitCode}, which is currently on your learning wishlist.`
      );
    }

    if (reciprocalUnits.length > 0) {
      sentences.push(
        `In turn, your strength in ${reciprocalUnits[0].unitCode} complements their learning goals.`
      );
    }
  } else {
    // Shared programme or studying unit
    const sharedUnit = myProfile.units.find((u) =>
      candidate.units.some((c) => c.academicUnitId === u.academicUnitId || c.unitCode.toLowerCase() === u.unitCode.toLowerCase())
    );
    if (sharedUnit) {
      sentences.push(
        `You both share active coursework in ${sharedUnit.unitTitle || sharedUnit.unitCode}.`
      );
    } else if (candidate.programmeName && myProfile.programmeName && candidate.programmeName === myProfile.programmeName) {
      sentences.push(
        `You are both pursuing ${candidate.programmeName}.`
      );
    }
  }

  // Sentence 2: Availability intersection
  if (overlapWindow && overlapWindow.minutes >= 30) {
    const timeFormatted = formatTimeRange(overlapWindow.start, overlapWindow.end);
    sentences.push(
      `You also overlap on ${overlapWindow.day} (${timeFormatted}).`
    );
  }

  // Sentence 3: Format or mentor synergy
  if (candidate.mentorWillingness && myProfile.units.some((u) => u.role === 'needs_help')) {
    sentences.push(
      `${candidate.displayName} is willing to mentor peers in collaborative study sessions.`
    );
  } else if (myProfile.preferredFormat === candidate.preferredFormat) {
    const formatName = myProfile.preferredFormat.replace('_', '-');
    sentences.push(
      `You both prefer ${formatName} collaboration in groups of ~${myProfile.preferredGroupSize}.`
    );
  } else if (myProfile.collaborationGoals.length > 0 && candidate.collaborationGoals.length > 0) {
    const sharedGoal = myProfile.collaborationGoals.find((g) =>
      candidate.collaborationGoals.some((cg) => cg.toLowerCase() === g.toLowerCase())
    );
    if (sharedGoal) {
      sentences.push(
        `You share common collaboration goals around ${sharedGoal.toLowerCase()}.`
      );
    }
  }

  if (sentences.length === 0) {
    return `Academic compatibility based on mutual institution membership and study preferences.`;
  }

  return sentences.join(' ');
}

/**
 * Filter and rank candidates against a student learning profile.
 * - Excludes candidates from differing institutions.
 * - Excludes blocked candidate IDs.
 * - Excludes existing connection candidate IDs (unless allowExistingConnections = true).
 * - Excludes self.
 * - Respects candidate visibility settings.
 * - Sorts deterministically by score DESC, then tie-breaking by candidateUserId.
 * - Returns top N.
 */
export function findBrainMateMatches(
  myProfile: StudentLearningProfile,
  allCandidates: StudentLearningProfile[],
  options: MatchingOptions = {}
): MatchResult[] {
  const {
    topN = 20,
    blockedUserIds = [],
    existingConnectionUserIds = [],
    allowExistingConnections = false,
  } = options;

  const blockedSet = new Set(blockedUserIds);
  const connectionSet = new Set(existingConnectionUserIds);

  const eligibleCandidates = allCandidates.filter((cand) => {
    // 1. Not self
    if (cand.userId === myProfile.userId) return false;

    // 2. Cross-institution exclusion: MUST belong to same institution
    if (cand.institutionId !== myProfile.institutionId) return false;

    // 3. Block exclusion: blocked users never appear
    if (blockedSet.has(cand.userId)) return false;

    // 4. Existing connections exclusion (unless requested)
    if (!allowExistingConnections && connectionSet.has(cand.userId)) return false;

    // 5. Visibility check
    if (cand.visibility === 'connections_only') {
      if (!connectionSet.has(cand.userId)) return false;
    } else if (cand.visibility === 'programme') {
      if (cand.programmeId !== myProfile.programmeId) return false;
    }

    return true;
  });

  const scored: MatchResult[] = eligibleCandidates.map((cand) => scoreCandidate(myProfile, cand));

  // Deterministic sorting: score DESC, tie-break by candidateUserId ASC
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.candidateUserId.localeCompare(b.candidateUserId);
  });

  return scored.slice(0, topN);
}

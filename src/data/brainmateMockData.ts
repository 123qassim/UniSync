/**
 * UniSync BrainMate Mock Seed Data
 * Structured peer learning candidates, study groups, sessions, and connections.
 */

import { StudentLearningProfile } from '../lib/brainmate/matching.ts';

export interface StudyGroup {
  id: string;
  name: string;
  purpose: string;
  institutionId: string;
  institutionName: string;
  ownerId: string;
  ownerName: string;
  academicUnitId: string;
  academicUnitCode: string;
  academicUnitTitle: string;
  format: 'online' | 'in_person' | 'hybrid';
  maxMembers: number;
  currentMemberCount: number;
  visibility: 'public' | 'invite_only';
  members: {
    userId: string;
    displayName: string;
    role: 'owner' | 'moderator' | 'member';
    joinedAt: string;
    avatarInitials: string;
  }[];
  nextSession?: {
    id: string;
    title: string;
    scheduledStart: string;
    format: string;
  };
  resources: {
    id: string;
    title: string;
    type: string;
    uploadedBy: string;
    size: string;
    url?: string;
  }[];
  createdAt: string;
}

export interface StudySession {
  id: string;
  groupId?: string;
  groupName?: string;
  title: string;
  academicUnitId: string;
  academicUnitCode: string;
  academicUnitTitle: string;
  scheduledStart: string;
  scheduledEnd: string;
  format: 'online' | 'in_person' | 'hybrid';
  location?: string;
  onlineUrl?: string;
  agenda: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdBy: string;
  createdByName: string;
  participants: {
    userId: string;
    displayName: string;
    rsvp: 'going' | 'maybe' | 'declined';
  }[];
  createdAt: string;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderProgramme: string;
  senderStudyLevel: string;
  receiverId: string;
  receiverName: string;
  note?: string;
  matchScore: number;
  matchReason: string;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked';
  createdAt: string;
  respondedAt?: string;
}

export interface ActiveConnection {
  id: string;
  userId: string;
  displayName: string;
  programmeName: string;
  studyLevel: string;
  avatarInitials: string;
  sharedUnitsCount: number;
  establishedAt: string;
  lastActive: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedId: string;
  reportedName: string;
  groupId?: string;
  groupName?: string;
  reason: 'academic_dishonesty' | 'harassment' | 'inappropriate_content' | 'spam_or_solicitation' | 'impersonation' | 'other';
  details: string;
  status: 'open' | 'reviewed' | 'actioned' | 'dismissed';
  institutionId: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Current student default profile (Brian Otieno)
export const DEFAULT_STUDENT_LEARNING_PROFILE: StudentLearningProfile = {
  id: 'p-brian-01',
  userId: 'demo-student-01',
  displayName: 'Brian Otieno',
  institutionId: 'maseno',
  institutionName: 'Maseno University',
  programmeId: 'bsc-cs',
  programmeName: 'BSc Computer Science',
  studyLevel: 'undergraduate',
  preferredGroupSize: 4,
  preferredFormat: 'hybrid',
  mentorWillingness: true,
  collaborationGoals: ['Exam Prep', 'Project Collaboration', 'Code Review', 'Conceptual Mastery'],
  visibility: 'institution',
  units: [
    {
      academicUnitId: 'cs-211',
      unitCode: 'CSC 211',
      unitTitle: 'Data Structures & Algorithms',
      role: 'needs_help',
      topics: ['Dynamic Programming', 'Graph Algorithms', 'Red-Black Trees'],
    },
    {
      academicUnitId: 'cs-212',
      unitCode: 'CSC 212',
      unitTitle: 'Database Systems & SQL Modeling',
      role: 'can_help',
      confidence: 'high',
      topics: ['PostgreSQL', 'Query Optimization', 'Relational Schemas', 'Indexing'],
    },
    {
      academicUnitId: 'cs-111',
      unitCode: 'CSC 111',
      unitTitle: 'Introduction to Programming in C',
      role: 'can_help',
      confidence: 'high',
      topics: ['Pointers', 'Memory Allocation', 'Data Types'],
    },
    {
      academicUnitId: 'mat-120',
      unitCode: 'MAT 120',
      unitTitle: 'Discrete Mathematics',
      role: 'needs_help',
      topics: ['Graph Theory', 'Combinatorics', 'Recurrence Relations'],
    },
    {
      academicUnitId: 'cs-121',
      unitCode: 'CSC 121',
      unitTitle: 'Object-Oriented Programming (Java)',
      role: 'studying',
      confidence: 'medium',
      topics: ['Generics', 'Design Patterns'],
    },
  ],
  availability: [
    { dayOfWeek: 1, startTime: '15:00', endTime: '18:00' }, // Monday 3-6 PM
    { dayOfWeek: 2, startTime: '14:00', endTime: '17:00' }, // Tuesday 2-5 PM
    { dayOfWeek: 4, startTime: '10:00', endTime: '13:00' }, // Thursday 10-1 PM
    { dayOfWeek: 5, startTime: '14:00', endTime: '18:00' }, // Friday 2-6 PM
  ],
  verifiedUnitEnrolment: true,
};

// Seed candidate peers in the same institution (Maseno University) and other programmes
export const SEED_CANDIDATE_PROFILES: StudentLearningProfile[] = [
  {
    id: 'p-sarah-01',
    userId: 'user-sarah-m',
    displayName: 'Sarah Muthoni',
    institutionId: 'maseno',
    institutionName: 'Maseno University',
    programmeId: 'bsc-cs',
    programmeName: 'BSc Computer Science',
    studyLevel: 'undergraduate',
    preferredGroupSize: 4,
    preferredFormat: 'hybrid',
    mentorWillingness: true,
    collaborationGoals: ['Exam Prep', 'Project Collaboration', 'Code Review'],
    visibility: 'institution',
    units: [
      {
        academicUnitId: 'cs-211',
        unitCode: 'CSC 211',
        unitTitle: 'Data Structures & Algorithms',
        role: 'can_help',
        confidence: 'high',
        topics: ['Dynamic Programming', 'Graph Algorithms', 'Trees'],
      },
      {
        academicUnitId: 'cs-212',
        unitCode: 'CSC 212',
        unitTitle: 'Database Systems & SQL Modeling',
        role: 'needs_help',
        topics: ['PostgreSQL', 'Query Optimization'],
      },
      {
        academicUnitId: 'mat-120',
        unitCode: 'MAT 120',
        unitTitle: 'Discrete Mathematics',
        role: 'can_help',
        confidence: 'high',
        topics: ['Graph Theory', 'Combinatorics'],
      },
    ],
    availability: [
      { dayOfWeek: 2, startTime: '14:00', endTime: '17:00' }, // Tuesday 2-5 PM (overlaps!)
      { dayOfWeek: 4, startTime: '11:00', endTime: '13:00' }, // Thursday 11-1 PM (overlaps!)
    ],
    verifiedUnitEnrolment: true,
  },
  {
    id: 'p-kevin-02',
    userId: 'user-kevin-k',
    displayName: 'Kevin Kiprono',
    institutionId: 'maseno',
    institutionName: 'Maseno University',
    programmeId: 'bsc-cs',
    programmeName: 'BSc Computer Science',
    studyLevel: 'undergraduate',
    preferredGroupSize: 3,
    preferredFormat: 'in_person',
    mentorWillingness: false,
    collaborationGoals: ['Exam Prep', 'Conceptual Mastery'],
    visibility: 'institution',
    units: [
      {
        academicUnitId: 'cs-211',
        unitCode: 'CSC 211',
        unitTitle: 'Data Structures & Algorithms',
        role: 'can_help',
        confidence: 'high',
        topics: ['Dynamic Programming', 'Red-Black Trees'],
      },
      {
        academicUnitId: 'cs-111',
        unitCode: 'CSC 111',
        unitTitle: 'Introduction to Programming in C',
        role: 'needs_help',
        topics: ['Pointers', 'Memory Allocation'],
      },
    ],
    availability: [
      { dayOfWeek: 1, startTime: '15:00', endTime: '18:00' }, // Monday 3-6 PM (overlaps!)
      { dayOfWeek: 3, startTime: '09:00', endTime: '12:00' },
    ],
    verifiedUnitEnrolment: true,
  },
  {
    id: 'p-aisha-03',
    userId: 'user-aisha-o',
    displayName: 'Aisha Omar',
    institutionId: 'maseno',
    institutionName: 'Maseno University',
    programmeId: 'bsc-applied-stat',
    programmeName: 'BSc Applied Statistics with Computing',
    studyLevel: 'undergraduate',
    preferredGroupSize: 4,
    preferredFormat: 'hybrid',
    mentorWillingness: true,
    collaborationGoals: ['Exam Prep', 'Conceptual Mastery', 'Project Collaboration'],
    visibility: 'institution',
    units: [
      {
        academicUnitId: 'mat-120',
        unitCode: 'MAT 120',
        unitTitle: 'Discrete Mathematics',
        role: 'can_help',
        confidence: 'high',
        topics: ['Recurrence Relations', 'Combinatorics', 'Probability'],
      },
      {
        academicUnitId: 'cs-212',
        unitCode: 'CSC 212',
        unitTitle: 'Database Systems & SQL Modeling',
        role: 'needs_help',
        topics: ['Relational Schemas', 'SQL Optimization'],
      },
    ],
    availability: [
      { dayOfWeek: 2, startTime: '13:00', endTime: '16:00' }, // Tuesday overlaps 14-16
      { dayOfWeek: 5, startTime: '14:00', endTime: '17:00' }, // Friday overlaps 14-17
    ],
    verifiedUnitEnrolment: true,
  },
  {
    id: 'p-david-04',
    userId: 'user-david-w',
    displayName: 'David Wanjala',
    institutionId: 'maseno',
    institutionName: 'Maseno University',
    programmeId: 'bsc-cs',
    programmeName: 'BSc Computer Science',
    studyLevel: 'undergraduate',
    preferredGroupSize: 5,
    preferredFormat: 'online',
    mentorWillingness: false,
    collaborationGoals: ['Code Review', 'Project Collaboration'],
    visibility: 'programme',
    units: [
      {
        academicUnitId: 'cs-121',
        unitCode: 'CSC 121',
        unitTitle: 'Object-Oriented Programming (Java)',
        role: 'can_help',
        confidence: 'high',
        topics: ['Design Patterns', 'Generics', 'Spring Boot'],
      },
      {
        academicUnitId: 'mat-120',
        unitCode: 'MAT 120',
        unitTitle: 'Discrete Mathematics',
        role: 'needs_help',
        topics: ['Graph Theory'],
      },
    ],
    availability: [
      { dayOfWeek: 4, startTime: '10:00', endTime: '12:00' }, // Thursday overlaps 10-12
    ],
    verifiedUnitEnrolment: false,
  },
  {
    id: 'p-mercy-05',
    userId: 'user-mercy-c',
    displayName: 'Mercy Chebet',
    institutionId: 'maseno',
    institutionName: 'Maseno University',
    programmeId: 'bsc-it',
    programmeName: 'BSc Information Technology',
    studyLevel: 'undergraduate',
    preferredGroupSize: 4,
    preferredFormat: 'hybrid',
    mentorWillingness: false,
    collaborationGoals: ['Exam Prep', 'Project Collaboration'],
    visibility: 'institution',
    units: [
      {
        academicUnitId: 'cs-212',
        unitCode: 'CSC 212',
        unitTitle: 'Database Systems & SQL Modeling',
        role: 'needs_help',
        topics: ['Indexing', 'PostgreSQL'],
      },
      {
        academicUnitId: 'cs-111',
        unitCode: 'CSC 111',
        unitTitle: 'Introduction to Programming in C',
        role: 'can_help',
        confidence: 'medium',
        topics: ['Pointers'],
      },
    ],
    availability: [
      { dayOfWeek: 5, startTime: '15:00', endTime: '18:00' }, // Friday overlaps 15-18
    ],
    verifiedUnitEnrolment: true,
  },
];

// Seed Study Groups
export const INITIAL_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'grp-algo-masters',
    name: 'Algorithms & Graph Theory Circle',
    purpose: 'Deep dive into complex dynamic programming and graph traversals for mid-semester assessments.',
    institutionId: 'maseno',
    institutionName: 'Maseno University',
    ownerId: 'user-sarah-m',
    ownerName: 'Sarah Muthoni',
    academicUnitId: 'cs-211',
    academicUnitCode: 'CSC 211',
    academicUnitTitle: 'Data Structures & Algorithms',
    format: 'hybrid',
    maxMembers: 5,
    currentMemberCount: 3,
    visibility: 'public',
    members: [
      { userId: 'user-sarah-m', displayName: 'Sarah Muthoni', role: 'owner', joinedAt: '2026-09-15T08:00:00Z', avatarInitials: 'SM' },
      { userId: 'user-kevin-k', displayName: 'Kevin Kiprono', role: 'member', joinedAt: '2026-09-18T10:30:00Z', avatarInitials: 'KK' },
      { userId: 'demo-student-01', displayName: 'Brian Otieno', role: 'member', joinedAt: '2026-09-20T14:00:00Z', avatarInitials: 'BO' },
    ],
    nextSession: {
      id: 'sess-dp-01',
      title: 'Dynamic Programming Patterns: Knapsack & Grid Paths',
      scheduledStart: '2026-10-14T14:00:00Z',
      format: 'hybrid',
    },
    resources: [
      { id: 'res-1', title: 'DP Cheatsheet & State Transitions.pdf', type: 'Study Guide', uploadedBy: 'Sarah Muthoni', size: '1.4 MB' },
      { id: 'res-2', title: 'Graph Traversal LeetCode curated set.md', type: 'Code Examples', uploadedBy: 'Brian Otieno', size: '320 KB' },
    ],
    createdAt: '2026-09-15T08:00:00Z',
  },
  {
    id: 'grp-db-lab',
    name: 'PostgreSQL & Query Optimization Lab',
    purpose: 'Collaborative SQL schema designs, EXPLAIN ANALYZE debugging, and database indexing.',
    institutionId: 'maseno',
    institutionName: 'Maseno University',
    ownerId: 'demo-student-01',
    ownerName: 'Brian Otieno',
    academicUnitId: 'cs-212',
    academicUnitCode: 'CSC 212',
    academicUnitTitle: 'Database Systems & SQL Modeling',
    format: 'hybrid',
    maxMembers: 6,
    currentMemberCount: 4,
    visibility: 'public',
    members: [
      { userId: 'demo-student-01', displayName: 'Brian Otieno', role: 'owner', joinedAt: '2026-09-10T09:00:00Z', avatarInitials: 'BO' },
      { userId: 'user-sarah-m', displayName: 'Sarah Muthoni', role: 'moderator', joinedAt: '2026-09-12T11:00:00Z', avatarInitials: 'SM' },
      { userId: 'user-aisha-o', displayName: 'Aisha Omar', role: 'member', joinedAt: '2026-09-14T15:20:00Z', avatarInitials: 'AO' },
      { userId: 'user-mercy-c', displayName: 'Mercy Chebet', role: 'member', joinedAt: '2026-09-22T16:00:00Z', avatarInitials: 'MC' },
    ],
    nextSession: {
      id: 'sess-sql-02',
      title: 'B-Tree vs Hash Indexing Benchmark Session',
      scheduledStart: '2026-10-15T15:00:00Z',
      format: 'in_person',
    },
    resources: [
      { id: 'res-3', title: 'PostgreSQL Execution Plan Guide.pdf', type: 'Lecture Notes', uploadedBy: 'Brian Otieno', size: '2.1 MB' },
    ],
    createdAt: '2026-09-10T09:00:00Z',
  },
  {
    id: 'grp-discrete-math',
    name: 'Discrete Math & Proof Tactics',
    purpose: 'Cracking induction proofs, recurrence relations, and combinatorial counting.',
    institutionId: 'maseno',
    institutionName: 'Maseno University',
    ownerId: 'user-aisha-o',
    ownerName: 'Aisha Omar',
    academicUnitId: 'mat-120',
    academicUnitCode: 'MAT 120',
    academicUnitTitle: 'Discrete Mathematics',
    format: 'in_person',
    maxMembers: 4,
    currentMemberCount: 2,
    visibility: 'public',
    members: [
      { userId: 'user-aisha-o', displayName: 'Aisha Omar', role: 'owner', joinedAt: '2026-09-18T14:00:00Z', avatarInitials: 'AO' },
      { userId: 'user-david-w', displayName: 'David Wanjala', role: 'member', joinedAt: '2026-09-21T09:30:00Z', avatarInitials: 'DW' },
    ],
    resources: [
      { id: 'res-4', title: 'Mathematical Induction Problem Set & Solutions.pdf', type: 'Study Guide', uploadedBy: 'Aisha Omar', size: '980 KB' },
    ],
    createdAt: '2026-09-18T14:00:00Z',
  },
];

// Seed Study Sessions
export const INITIAL_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'sess-dp-01',
    groupId: 'grp-algo-masters',
    groupName: 'Algorithms & Graph Theory Circle',
    title: 'Dynamic Programming Patterns: Knapsack & Grid Paths',
    academicUnitId: 'cs-211',
    academicUnitCode: 'CSC 211',
    academicUnitTitle: 'Data Structures & Algorithms',
    scheduledStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    scheduledEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    format: 'hybrid',
    location: 'Science Complex Lab 3B',
    onlineUrl: 'https://meet.google.com/xyz-unisync-dp',
    agenda: '1. Tabulation vs Memoization patterns (30 min)\n2. 0/1 Knapsack variations (45 min)\n3. Peer code review & problem walkthrough (45 min)',
    status: 'scheduled',
    createdBy: 'user-sarah-m',
    createdByName: 'Sarah Muthoni',
    participants: [
      { userId: 'user-sarah-m', displayName: 'Sarah Muthoni', rsvp: 'going' },
      { userId: 'demo-student-01', displayName: 'Brian Otieno', rsvp: 'going' },
      { userId: 'user-kevin-k', displayName: 'Kevin Kiprono', rsvp: 'maybe' },
    ],
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'sess-sql-02',
    groupId: 'grp-db-lab',
    groupName: 'PostgreSQL & Query Optimization Lab',
    title: 'B-Tree vs Hash Indexing Benchmark Session',
    academicUnitId: 'cs-212',
    academicUnitCode: 'CSC 212',
    academicUnitTitle: 'Database Systems & SQL Modeling',
    scheduledStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    scheduledEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    format: 'in_person',
    location: 'Siriba Library Discussion Room 4',
    onlineUrl: '',
    agenda: '1. Benchmarking 1,000,000 simulated rows\n2. Index scan vs Bitmap scan comparison\n3. Brian presents query optimization guidelines',
    status: 'scheduled',
    createdBy: 'demo-student-01',
    createdByName: 'Brian Otieno',
    participants: [
      { userId: 'demo-student-01', displayName: 'Brian Otieno', rsvp: 'going' },
      { userId: 'user-sarah-m', displayName: 'Sarah Muthoni', rsvp: 'going' },
      { userId: 'user-aisha-o', displayName: 'Aisha Omar', rsvp: 'going' },
      { userId: 'user-mercy-c', displayName: 'Mercy Chebet', rsvp: 'maybe' },
    ],
    createdAt: '2026-10-02T12:00:00Z',
  },
  {
    id: 'sess-c-pointers',
    title: 'C Pointers & Memory Management Peer Clinic',
    academicUnitId: 'cs-111',
    academicUnitCode: 'CSC 111',
    academicUnitTitle: 'Introduction to Programming in C',
    scheduledStart: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    format: 'online',
    location: '',
    onlineUrl: 'https://meet.google.com/c-pointers-clinic',
    agenda: '1. Double pointers and dynamic arrays in C\n2. Debugging segmentation faults with Valgrind\n3. Hands-on exercises and pair programming',
    status: 'scheduled',
    createdBy: 'demo-student-01',
    createdByName: 'Brian Otieno',
    participants: [
      { userId: 'demo-student-01', displayName: 'Brian Otieno', rsvp: 'going' },
      { userId: 'user-kevin-k', displayName: 'Kevin Kiprono', rsvp: 'going' },
    ],
    createdAt: '2026-10-04T15:00:00Z',
  },
];

// Seed Connection Requests
export const INITIAL_CONNECTION_REQUESTS: ConnectionRequest[] = [
  {
    id: 'req-01',
    senderId: 'user-sarah-m',
    senderName: 'Sarah Muthoni',
    senderProgramme: 'BSc Computer Science',
    senderStudyLevel: 'Year 2, Undergraduate',
    receiverId: 'demo-student-01',
    receiverName: 'Brian Otieno',
    note: 'Hi Brian! Saw your strength in SQL Optimization and Database Systems. Would love to pair up for our CSC 211 algorithms problem sets in exchange for database query tuning!',
    matchScore: 93,
    matchReason: 'Sarah can help with CSC 211 and MAT 120; Brian can help with CSC 212. Overlapping schedule on Tuesdays 2-5 PM.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'req-02',
    senderId: 'demo-student-01',
    senderName: 'Brian Otieno',
    senderProgramme: 'BSc Computer Science',
    senderStudyLevel: 'Year 2, Undergraduate',
    receiverId: 'user-aisha-o',
    receiverName: 'Aisha Omar',
    note: 'Hi Aisha, would love to collaborate on MAT 120 Discrete Mathematics proof techniques and share SQL indexing tips.',
    matchScore: 84,
    matchReason: 'Aisha can help with Discrete Mathematics; Brian can help with SQL schemas.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Active Connections
export const INITIAL_ACTIVE_CONNECTIONS: ActiveConnection[] = [
  {
    id: 'conn-01',
    userId: 'user-kevin-k',
    displayName: 'Kevin Kiprono',
    programmeName: 'BSc Computer Science',
    studyLevel: 'Year 2',
    avatarInitials: 'KK',
    sharedUnitsCount: 2,
    establishedAt: '2026-09-25T11:00:00Z',
    lastActive: '2 hours ago',
  },
];

// Reports for institutional moderators
export const INITIAL_USER_REPORTS: UserReport[] = [
  {
    id: 'rep-01',
    reporterId: 'demo-student-01',
    reporterName: 'Brian Otieno',
    reportedId: 'user-spammer-99',
    reportedName: 'Unknown Account',
    reason: 'spam_or_solicitation',
    details: 'User posted commercial essay writing service links in the public study group comments.',
    status: 'open',
    institutionId: 'maseno',
    createdAt: '2026-10-06T09:12:00Z',
  },
];

// ==========================================
// 1. Reciprocal "Skill Swap" Matching Types & Seed
// ==========================================
export interface SkillSwapPair {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateProgramme: string;
  avatarInitials: string;
  synergyScore: number; // 0-100
  reciprocityRatio: string; // e.g. "1:1 Bilateral Exchange"
  youTeach: {
    unitCode: string;
    unitTitle: string;
    topics: string[];
    confidence: 'high' | 'medium';
  };
  theyTeach: {
    unitCode: string;
    unitTitle: string;
    topics: string[];
    confidence: 'high' | 'medium';
  };
  weeklyOverlapHours: number;
  balanceTier: 'Perfect Equilibrium' | 'High Complementarity' | 'Specialized Exchange';
  recommendedSprint?: string;
  status: 'ready' | 'proposed' | 'accepted';
}

export const INITIAL_SKILL_SWAPS: SkillSwapPair[] = [
  {
    id: 'swap-01',
    candidateId: 'user-sarah-m',
    candidateName: 'Sarah Muthoni',
    candidateProgramme: 'BSc Computer Science (Year 2)',
    avatarInitials: 'SM',
    synergyScore: 98,
    reciprocityRatio: '1:1 Bilateral Exchange',
    youTeach: {
      unitCode: 'CSC 212',
      unitTitle: 'Database Systems & SQL Modeling',
      topics: ['PostgreSQL Indexing', 'Schema Normalization', 'Query Execution Plans'],
      confidence: 'high',
    },
    theyTeach: {
      unitCode: 'CSC 211',
      unitTitle: 'Data Structures & Algorithms',
      topics: ['Dynamic Programming', 'Graph Shortest Paths (Dijkstra)', 'Red-Black Trees'],
      confidence: 'high',
    },
    weeklyOverlapHours: 5.0,
    balanceTier: 'Perfect Equilibrium',
    status: 'ready',
  },
  {
    id: 'swap-02',
    candidateId: 'user-aisha-o',
    candidateName: 'Aisha Omar',
    candidateProgramme: 'BSc Mathematics & CS (Year 2)',
    avatarInitials: 'AO',
    synergyScore: 92,
    reciprocityRatio: 'Mutual Reinforcement',
    youTeach: {
      unitCode: 'CSC 111',
      unitTitle: 'Introduction to Programming in C',
      topics: ['Pointers & Dynamic Memory', 'Structs & Bit Manipulation'],
      confidence: 'high',
    },
    theyTeach: {
      unitCode: 'MAT 120',
      unitTitle: 'Discrete Mathematics',
      topics: ['Graph Theory & Coloring', 'Combinatorics & Pigeonhole Principle', 'Recurrence Relations'],
      confidence: 'high',
    },
    weeklyOverlapHours: 4.5,
    balanceTier: 'High Complementarity',
    status: 'ready',
  },
  {
    id: 'swap-03',
    candidateId: 'user-dennis-w',
    candidateName: 'Dennis Wanjala',
    candidateProgramme: 'BSc Software Engineering (Year 3)',
    avatarInitials: 'DW',
    synergyScore: 89,
    reciprocityRatio: 'Peer Mentorship & Review',
    youTeach: {
      unitCode: 'CSC 212',
      unitTitle: 'Database Systems & SQL Modeling',
      topics: ['Relational Schemas', 'Transaction Isolation Levels'],
      confidence: 'high',
    },
    theyTeach: {
      unitCode: 'CSC 121',
      unitTitle: 'Object-Oriented Programming (Java)',
      topics: ['Design Patterns (Factory, Observer)', 'Generics & Reflection'],
      confidence: 'high',
    },
    weeklyOverlapHours: 3.0,
    balanceTier: 'Specialized Exchange',
    status: 'proposed',
  },
];

// ==========================================
// 2. Peer Academic Endorsement & Study Karma Ledger
// ==========================================
export interface PeerEndorsement {
  id: string;
  peerId: string;
  peerName: string;
  endorserId: string;
  endorserName: string;
  badgeCategory: 'patient_explainer' | 'code_debugger' | 'concise_notes' | 'always_punctual' | 'proofs_master' | 'problem_crusher';
  badgeLabel: string;
  badgeIcon: string;
  unitCode: string;
  comment: string;
  karmaAwarded: number;
  createdAt: string;
}

export interface KarmaLedgerItem {
  id: string;
  title: string;
  category: 'session_hosted' | 'endorsement_received' | 'pomodoro_sprint' | 'notes_shared' | 'peer_tutoring';
  points: number;
  timestamp: string;
  badge?: string;
}

export interface StudentKarmaSummary {
  userId: string;
  karmaPoints: number;
  tier: 'Bronze Contributor' | 'Silver Collaborator' | 'Gold Scholar' | 'Diamond Mentor';
  attendanceRate: number; // e.g. 98%
  sessionsCompleted: number;
  hoursCollaborated: number;
  endorsementsCount: number;
  topEndorsements: { category: string; label: string; count: number; icon: string }[];
}

export const DEFAULT_STUDENT_KARMA: StudentKarmaSummary = {
  userId: 'demo-student-01',
  karmaPoints: 880,
  tier: 'Gold Scholar',
  attendanceRate: 98,
  sessionsCompleted: 24,
  hoursCollaborated: 46,
  endorsementsCount: 19,
  topEndorsements: [
    { category: 'patient_explainer', label: 'Patient Explainer', count: 7, icon: '🌟' },
    { category: 'code_debugger', label: 'Code Debugger', count: 5, icon: '⚡' },
    { category: 'concise_notes', label: 'Concise Notes', count: 4, icon: '📝' },
    { category: 'always_punctual', label: 'Always Punctual', count: 3, icon: '⏰' },
  ],
};

export const INITIAL_PEER_ENDORSEMENTS: PeerEndorsement[] = [
  {
    id: 'end-01',
    peerId: 'demo-student-01',
    peerName: 'Brian Otieno',
    endorserId: 'user-sarah-m',
    endorserName: 'Sarah Muthoni',
    badgeCategory: 'patient_explainer',
    badgeLabel: 'Patient Explainer',
    badgeIcon: '🌟',
    unitCode: 'CSC 212',
    comment: 'Brian walked through SQL B-Tree indexes and query plans step-by-step. He made the whole concept click in 20 minutes!',
    karmaAwarded: 25,
    createdAt: '2026-10-08T16:30:00Z',
  },
  {
    id: 'end-02',
    peerId: 'demo-student-01',
    peerName: 'Brian Otieno',
    endorserId: 'user-kevin-k',
    endorserName: 'Kevin Kiprono',
    badgeCategory: 'code_debugger',
    badgeLabel: 'Code Debugger',
    badgeIcon: '⚡',
    unitCode: 'CSC 111',
    comment: 'Spotted a subtle memory leak and segmentation fault in our circular linked list C assignment right away.',
    karmaAwarded: 25,
    createdAt: '2026-10-07T14:15:00Z',
  },
  {
    id: 'end-03',
    peerId: 'demo-student-01',
    peerName: 'Brian Otieno',
    endorserId: 'user-aisha-o',
    endorserName: 'Aisha Omar',
    badgeCategory: 'always_punctual',
    badgeLabel: 'Always Punctual',
    badgeIcon: '⏰',
    unitCode: 'MAT 120',
    comment: 'Arrived at the library pod right at 2:00 PM with cleanly formatted past-paper practice questions ready.',
    karmaAwarded: 25,
    createdAt: '2026-10-05T17:00:00Z',
  },
];

export const INITIAL_KARMA_LEDGER: KarmaLedgerItem[] = [
  {
    id: 'kl-01',
    title: 'Received "Patient Explainer" endorsement from Sarah Muthoni',
    category: 'endorsement_received',
    points: 25,
    timestamp: 'Yesterday at 4:30 PM',
    badge: '🌟',
  },
  {
    id: 'kl-02',
    title: 'Completed 4-Cycle Focus Pod sprint (100 min deep work on Graph Algorithms)',
    category: 'pomodoro_sprint',
    points: 30,
    timestamp: 'Oct 08, 2026',
    badge: '🎧',
  },
  {
    id: 'kl-03',
    title: 'Hosted and facilitated CSC 212 Database Query Optimization workshop',
    category: 'session_hosted',
    points: 50,
    timestamp: 'Oct 07, 2026',
    badge: '🚀',
  },
  {
    id: 'kl-04',
    title: 'Shared verified CSC 111 Pointer Arithmetic Cheat-Sheet with study group',
    category: 'notes_shared',
    points: 20,
    timestamp: 'Oct 06, 2026',
    badge: '📝',
  },
  {
    id: 'kl-05',
    title: 'Received "Code Debugger" endorsement from Kevin Kiprono',
    category: 'endorsement_received',
    points: 25,
    timestamp: 'Oct 05, 2026',
    badge: '⚡',
  },
];

// ==========================================
// 3. Syllabus Burndown & Exam Readiness Tracker
// ==========================================
export interface SyllabusTopic {
  id: string;
  unitCode: string;
  moduleName: string;
  topicName: string;
  examWeightPct: number; // e.g. 20%
  difficulty: 'hard' | 'medium' | 'foundational';
  myStatus: 'needs_work' | 'practicing' | 'mastered';
  cohortAvgPct: number;
  keyConcepts: string[];
}

export interface CourseExamInfo {
  unitCode: string;
  unitTitle: string;
  examDate: string; // ISO string
  venue: string;
  totalCredits: number;
  currentMasteryPct: number;
  cohortMasteryPct: number;
  topics: SyllabusTopic[];
}

export const INITIAL_COURSES_READINESS: CourseExamInfo[] = [
  {
    unitCode: 'CSC 211',
    unitTitle: 'Data Structures & Algorithms',
    examDate: '2026-11-24T09:00:00Z',
    venue: 'Lecture Theatre 3 (Science Complex)',
    totalCredits: 4,
    currentMasteryPct: 62,
    cohortMasteryPct: 58,
    topics: [
      {
        id: 'top-211-1',
        unitCode: 'CSC 211',
        moduleName: 'Module 1: Advanced Trees',
        topicName: 'Red-Black Trees & AVL Self-Balancing Rotations',
        examWeightPct: 20,
        difficulty: 'hard',
        myStatus: 'needs_work',
        cohortAvgPct: 45,
        keyConcepts: ['Color Invariance', 'Left/Right Rotations', 'O(log n) Deletion Proofs'],
      },
      {
        id: 'top-211-2',
        unitCode: 'CSC 211',
        moduleName: 'Module 2: Graph Theory Algorithms',
        topicName: 'Dijkstra, Bellman-Ford & A* Shortest Paths',
        examWeightPct: 25,
        difficulty: 'medium',
        myStatus: 'practicing',
        cohortAvgPct: 64,
        keyConcepts: ['Priority Queue Relaxation', 'Negative Weight Cycles', 'Heuristic Admissibility'],
      },
      {
        id: 'top-211-3',
        unitCode: 'CSC 211',
        moduleName: 'Module 3: Dynamic Programming',
        topicName: 'Memoization, Tabulation & Knapsack Variants',
        examWeightPct: 30,
        difficulty: 'hard',
        myStatus: 'needs_work',
        cohortAvgPct: 48,
        keyConcepts: ['Optimal Substructure', 'Overlapping Subproblems', 'State Space Reduction'],
      },
      {
        id: 'top-211-4',
        unitCode: 'CSC 211',
        moduleName: 'Module 4: Hashing & Disjoint Sets',
        topicName: 'Hash Table Collision Strategies & Union-Find',
        examWeightPct: 15,
        difficulty: 'foundational',
        myStatus: 'mastered',
        cohortAvgPct: 78,
        keyConcepts: ['Linear Probing vs Chaining', 'Path Compression', 'Rank Union'],
      },
      {
        id: 'top-211-5',
        unitCode: 'CSC 211',
        moduleName: 'Module 5: Asymptotic Complexity',
        topicName: 'Master Theorem & Recurrence Solving',
        examWeightPct: 10,
        difficulty: 'foundational',
        myStatus: 'mastered',
        cohortAvgPct: 82,
        keyConcepts: ['Big-O / Omega / Theta', 'Divide & Conquer Recurrences', 'Recursion Tree'],
      },
    ],
  },
  {
    unitCode: 'MAT 120',
    unitTitle: 'Discrete Mathematics',
    examDate: '2026-11-28T14:00:00Z',
    venue: 'Mathematics Lab 102',
    totalCredits: 3,
    currentMasteryPct: 54,
    cohortMasteryPct: 51,
    topics: [
      {
        id: 'top-120-1',
        unitCode: 'MAT 120',
        moduleName: 'Module 1: Combinatorics',
        topicName: 'Generating Functions & Recurrence Relations',
        examWeightPct: 25,
        difficulty: 'hard',
        myStatus: 'needs_work',
        cohortAvgPct: 40,
        keyConcepts: ['Characteristic Equations', 'Formal Power Series', 'Homogeneous Solutions'],
      },
      {
        id: 'top-120-2',
        unitCode: 'MAT 120',
        moduleName: 'Module 2: Graph Theory',
        topicName: 'Planar Graphs, Euler Tours & Graph Colorings',
        examWeightPct: 25,
        difficulty: 'medium',
        myStatus: 'practicing',
        cohortAvgPct: 58,
        keyConcepts: ['Euler Formula (V - E + F = 2)', 'Chromatic Number', 'Handshaking Lemma'],
      },
      {
        id: 'top-120-3',
        unitCode: 'MAT 120',
        moduleName: 'Module 3: Number Theory & Cryptography',
        topicName: 'Modular Arithmetic & RSA Public Key Cipher',
        examWeightPct: 20,
        difficulty: 'medium',
        myStatus: 'practicing',
        cohortAvgPct: 62,
        keyConcepts: ['Extended Euclidean Algorithm', "Fermat's Little Theorem", 'Totient Function'],
      },
      {
        id: 'top-120-4',
        unitCode: 'MAT 120',
        moduleName: 'Module 4: Propositional & Predicate Logic',
        topicName: 'Formal Proofs & Mathematical Induction',
        examWeightPct: 30,
        difficulty: 'foundational',
        myStatus: 'mastered',
        cohortAvgPct: 75,
        keyConcepts: ['Direct vs Contradiction Proofs', 'Strong Induction', 'Quantifier Negation'],
      },
    ],
  },
  {
    unitCode: 'CSC 212',
    unitTitle: 'Database Systems & SQL Modeling',
    examDate: '2026-12-02T09:00:00Z',
    venue: 'Computing Complex Lab 4',
    totalCredits: 4,
    currentMasteryPct: 88,
    cohortMasteryPct: 63,
    topics: [
      {
        id: 'top-212-1',
        unitCode: 'CSC 212',
        moduleName: 'Module 1: Relational Normalization',
        topicName: '1NF through BCNF & 4NF Functional Dependencies',
        examWeightPct: 30,
        difficulty: 'medium',
        myStatus: 'mastered',
        cohortAvgPct: 59,
        keyConcepts: ['Lossless Decomposition', 'Dependency Preservation', 'Armstrong Axioms'],
      },
      {
        id: 'top-212-2',
        unitCode: 'CSC 212',
        moduleName: 'Module 2: Query Optimization & Indexing',
        topicName: 'B+ Tree Index Structures & Cost-Based Explain Plans',
        examWeightPct: 30,
        difficulty: 'hard',
        myStatus: 'mastered',
        cohortAvgPct: 52,
        keyConcepts: ['Clustered vs Secondary Indexes', 'Sequential vs Index Scans', 'Join Algorithms (Hash, Nested)'],
      },
      {
        id: 'top-212-3',
        unitCode: 'CSC 212',
        moduleName: 'Module 3: Concurrency Control',
        topicName: 'Two-Phase Locking (2PL) & Serializable Isolation',
        examWeightPct: 25,
        difficulty: 'hard',
        myStatus: 'practicing',
        cohortAvgPct: 55,
        keyConcepts: ['ACID Guarantees', 'Deadlock Detection (Wait-For Graphs)', 'MVCC Snapshots'],
      },
      {
        id: 'top-212-4',
        unitCode: 'CSC 212',
        moduleName: 'Module 4: SQL DDL & DML',
        topicName: 'Complex Aggregations, Window Functions & CTEs',
        examWeightPct: 15,
        difficulty: 'foundational',
        myStatus: 'mastered',
        cohortAvgPct: 84,
        keyConcepts: ['OVER (PARTITION BY)', 'Recursive Common Table Expressions', 'HAVING vs WHERE'],
      },
    ],
  },
];

// ==========================================
// 4. Free-Time Overlap Heatmap Models & Seed
// ==========================================
export interface PeerScheduleSlot {
  dayOfWeek: number; // 1 = Mon, ..., 7 = Sun (or 0 = Sun)
  hour: number; // 8 to 19 (e.g. 8 for 08:00 - 09:00)
  status: 'mutual_free' | 'user_busy' | 'peer_busy' | 'both_busy';
  energyLevel: 'peak' | 'moderate' | 'chill';
  label?: string;
}

export interface PeerScheduleComparison {
  peerId: string;
  peerName: string;
  peerProgramme: string;
  peerAvatar: string;
  totalMutualFreeHours: number;
  topSlots: {
    dayName: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    recommendedTag: string;
    academicContext: string;
  }[];
}

export const INITIAL_PEER_SCHEDULE_DATA: Record<string, PeerScheduleComparison> = {
  'user-sarah-m': {
    peerId: 'user-sarah-m',
    peerName: 'Sarah Muthoni',
    peerProgramme: 'BSc Computer Science (Year 2)',
    peerAvatar: 'SM',
    totalMutualFreeHours: 6.5,
    topSlots: [
      {
        dayName: 'Tuesday',
        dayOfWeek: 2,
        startTime: '14:00',
        endTime: '16:30',
        durationMinutes: 150,
        recommendedTag: '⚡ Prime Mutual Focus',
        academicContext: 'Both free right after CSC 211 Lecture - ideal for DP problem walkthroughs',
      },
      {
        dayName: 'Thursday',
        dayOfWeek: 4,
        startTime: '11:00',
        endTime: '13:00',
        durationMinutes: 120,
        recommendedTag: '🎯 Midweek Deep Sprint',
        academicContext: 'Quiet morning library block before Database lab',
      },
      {
        dayName: 'Friday',
        dayOfWeek: 5,
        startTime: '14:30',
        endTime: '17:00',
        durationMinutes: 150,
        recommendedTag: '☕ Weekend Warmup Session',
        academicContext: 'Open campus courtyard block for code review and past papers',
      },
    ],
  },
  'user-kevin-k': {
    peerId: 'user-kevin-k',
    peerName: 'Kevin Kiprono',
    peerProgramme: 'BSc Computer Science (Year 2)',
    peerAvatar: 'KK',
    totalMutualFreeHours: 4.0,
    topSlots: [
      {
        dayName: 'Monday',
        dayOfWeek: 1,
        startTime: '15:00',
        endTime: '17:30',
        durationMinutes: 150,
        recommendedTag: '⚡ Week Starter Lab',
        academicContext: 'Shared free block after C Programming practicals',
      },
      {
        dayName: 'Friday',
        dayOfWeek: 5,
        startTime: '15:00',
        endTime: '16:30',
        durationMinutes: 90,
        recommendedTag: '💡 Debugging & Review',
        academicContext: 'Pair-programming slot for weekly lab assignments',
      },
    ],
  },
  'user-aisha-o': {
    peerId: 'user-aisha-o',
    peerName: 'Aisha Omar',
    peerProgramme: 'BSc Mathematics & CS (Year 2)',
    peerAvatar: 'AO',
    totalMutualFreeHours: 5.0,
    topSlots: [
      {
        dayName: 'Tuesday',
        dayOfWeek: 2,
        startTime: '15:00',
        endTime: '17:00',
        durationMinutes: 120,
        recommendedTag: '🧠 Discrete Math Proof Lab',
        academicContext: 'Great mutual energy window for Graph Theory theorem proofs',
      },
      {
        dayName: 'Thursday',
        dayOfWeek: 4,
        startTime: '10:00',
        endTime: '12:00',
        durationMinutes: 120,
        recommendedTag: '📝 Past Papers Drill',
        academicContext: 'Clear morning block for practice problem sets',
      },
    ],
  },
};

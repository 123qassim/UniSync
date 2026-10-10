/**
 * UniPath Domain Models & Types
 * UniSync Ecosystem: Academic Discovery, Career Roadmaps, and Student Guidance
 */

export type UserRole = 'visitor' | 'student' | 'admin';

export interface University {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  isDemo: boolean;
  status: 'active' | 'partner';
  faculties: Faculty[];
}

export interface Faculty {
  id: string;
  universityId: string;
  name: string;
  programmes: Programme[];
}

export interface Programme {
  id: string;
  universityId: string;
  facultyId: string;
  name: string;
  code: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Diploma';
  durationYears: number;
  description: string;
  isDemo: boolean;
  academicYears: AcademicYear[];
  targetIndustries: string[];
}

export interface AcademicYear {
  yearNumber: number;
  yearLabel: string; // e.g. "Year 1"
  semesters: Semester[];
}

export interface Semester {
  semesterNumber: number;
  semesterLabel: string; // e.g. "Semester 1"
  units: Unit[];
}

export interface Unit {
  id: string;
  programmeId: string;
  unitCode: string;
  title: string;
  description: string;
  yearNumber: number;
  semesterNumber: number;
  credits: number;
  coreSkills: string[];
  isDemo: boolean;
}

export type GradingScaleType = 'percentage' | 'gpa4' | 'letter';

export interface GradingScale {
  id: GradingScaleType;
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  passThreshold: number;
  gradeBands: {
    grade: string;
    label: string;
    min: number;
    max: number;
  }[];
}

export interface StudentUnitEntry {
  unitId: string;
  unitCode: string;
  unitTitle: string;
  academicPeriod: string; // e.g. "Year 2, Sem 1"
  mark?: number; // Optional! Can be blank
  status: 'in-progress' | 'completed' | 'planned';
  notes?: string;
}

export interface Career {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  responsibilities: string[];
  workEnvironments: string[];
  entryRoles: string[];
  advancementRoles: string[];
  relevantProgrammes: string[]; // Programme IDs
  relevantUnitCodes: string[]; // Unit codes
  technicalSkills: string[];
  transferableSkills: string[];
  recommendedCertifications: {
    name: string;
    provider: string;
    isMandatory: boolean;
    note?: string;
  }[];
  portfolioProjects: PortfolioProject[];
  roadmapSteps: CareerRoadmapStep[];
  postgraduateOptions: string[];
  regulatedProfessionNote?: string;
  dataLimitationNotice: string;
  isDemo: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  skillsExercised: string[];
  deliverables: string[];
  estimatedWeeks: number;
}

export interface CareerRoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  phase: 'Foundation (Year 1-2)' | 'Specialization (Year 3)' | 'Industry Readiness (Year 4+)' | 'Post-Grad / Early Career';
  recommendedResources: {
    title: string;
    type: 'Documentation' | 'Interactive Tutorial' | 'Community' | 'Course' | 'Open Source';
    url: string;
  }[];
  practicalActions: string[];
}

export interface CareerRecommendation {
  career: Career;
  exploratoryMatchScore: number; // 0-100 score, labeled as exploratory
  scoreBreakdown: {
    degreeRelevance: number; // Max 35
    unitRelevance: number; // Max 25
    interestAlignment: number; // Max 25
    academicEvidence: number; // Max 15 (or 0 if marks omitted, with weights re-distributed)
  };
  whyRecommended: string[];
  alignedUnitsFound: string[];
  skillsAlreadySupported: string[];
  skillsToDevelop: string[];
  nextMilestones: string[];
  marksIncluded: boolean;
}

export interface AcademicComparisonCohort {
  cohortId: string;
  cohortLabel: string;
  unitCode: string;
  unitTitle: string;
  isDemo: boolean;
  sampleSize: number;
  meanMark: number;
  medianMark: number;
  highestMark: number;
  lowestMark: number;
  distribution: {
    band: string;
    percentage: number;
  }[];
  commonRevisionAreas: string[];
}

export interface UnitComparisonResult {
  unitCode: string;
  unitTitle: string;
  studentMark: number | null;
  cohortAverage: number;
  difference: number | null; // Student - Cohort
  gradingScale: GradingScaleType;
  interpretation: string;
  revisionSuggestions: string[];
}

export interface StudentConsent {
  allowMarkStorage: boolean;
  allowBrainMatePeerMatching: boolean;
  allowPublicProfileVisibility: boolean;
  lastUpdated: string;
}

export interface StudentProfile {
  id: string;
  email: string;
  displayName: string;
  universityId: string;
  programmeId: string;
  currentYear: number;
  currentSemester: number;
  gradingScale: GradingScaleType;
  units: StudentUnitEntry[];
  interests: string[];
  skillsToDevelop: string[];
  careerGoals: string;
  consent: StudentConsent;
  savedRoadmapIds: string[];
  completedRoadmapSteps: string[]; // step IDs
  createdAt: string;
}

export interface BrainMatePeerMatch {
  id: string;
  peerDisplayName: string; // Fictional demo name e.g. "David K."
  universityName: string;
  programmeName: string;
  sharedUnits: string[];
  learningStrengths: string[];
  learningChallenges: string[];
  studyPreferences: string;
  matchReason: string;
  connectionStatus: 'Not Connected' | 'Request Sent' | 'Request Received' | 'Accepted' | 'Declined' | 'Blocked';
  isDemo: boolean;
}

export interface CommunityResource {
  id: string;
  title: string;
  type: 'Past Exam Solutions' | 'Lecture Notes' | 'Study Guide' | 'Project Sandbox' | 'Discussion Hub';
  unitCode: string;
  unitTitle: string;
  programmeName: string;
  authorLabel: string;
  verifiedStatus: 'Synthetic Demo' | 'Student Contributed' | 'Department Approved';
  downloadsCount: number;
  description: string;
}

export interface ApexAIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isDemoFallback?: boolean;
}

// BrainMate Types & Schema
export * from './brainmate';

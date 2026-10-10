import { z } from 'zod';
import type {
  StudyLevel,
  StudyFormat,
  ProfileVisibility,
  UnitRole,
  UnitConfidence,
} from '../../types/brainmate';

/**
 * 1. Unit Preference Schema
 */
export const unitPreferenceSchema = z.object({
  academicUnitId: z.string().min(1, 'Academic unit ID is required'),
  unitCode: z.string().min(1, 'Unit code is required'),
  unitTitle: z.string().min(1, 'Unit title is required'),
  role: z.enum(['can_help', 'needs_help', 'studying'] as const, {
    message: 'Role must be can_help, needs_help, or studying',
  }),
  confidence: z.enum(['high', 'medium', 'low'] as const).optional(),
  topics: z.array(z.string().min(1)).default([]),
});

export type UnitPreferenceFormData = z.infer<typeof unitPreferenceSchema>;

/**
 * 2. Weekly Availability Window Schema
 */
export const availabilityWindowSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6, 'Day must be between 0 (Sun) and 6 (Sat)'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must be HH:MM format'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'End time must be HH:MM format'),
});

export type AvailabilityWindowFormData = z.infer<typeof availabilityWindowSchema>;

/**
 * 3. Complete Learning Profile Form Schema (All 7 Sections)
 */
export const learningProfileFormSchema = z.object({
  // Section 1: Academic Identity
  institutionId: z.string().min(1, 'Institution is required'),
  institutionName: z.string().min(1, 'Institution name is required'),
  programmeId: z.string().min(1, 'Programme selection is required'),
  programmeName: z.string().min(1, 'Programme title is required'),
  studyLevel: z.enum(['undergraduate', 'postgraduate', 'doctorate', 'diploma'] as const, {
    message: 'Valid study level is required',
  }),
  verifiedUnitEnrolment: z.boolean().default(true),

  // Section 2 & 3: Academic Unit Strengths & Learning Needs
  units: z
    .array(unitPreferenceSchema)
    .min(1, 'Please specify at least one academic unit to facilitate matching'),

  // Section 4: Weekly Availability Grid
  availability: z
    .array(availabilityWindowSchema)
    .min(1, 'Select at least one active availability window for peer sessions'),

  // Section 5: Preferences & Goals
  preferredGroupSize: z
    .number()
    .int()
    .min(2, 'Group size must be at least 2')
    .max(8, 'Group size max is 8 for optimal peer engagement')
    .default(4),
  preferredFormat: z.enum(['online', 'in_person', 'hybrid'] as const, {
    message: 'Valid study format is required',
  }),
  mentorWillingness: z.boolean().default(true),
  collaborationGoals: z
    .array(z.string())
    .min(1, 'Choose at least one collaboration goal'),

  // Section 6: Visibility & Privacy
  visibility: z.enum(['institution', 'programme', 'connections_only'] as const, {
    message: 'Visibility scope is required',
  }),

  // Meta / optional notes
  bioNote: z.string().max(280, 'Bio note must be 280 characters or fewer').optional(),
});

export type LearningProfileFormValues = z.infer<typeof learningProfileFormSchema>;

/**
 * Standard Catalog Data for Selectors
 */
export const AVAILABLE_PROGRAMMES = [
  { id: 'bsc-cs', name: 'BSc Computer Science', department: 'School of Computing' },
  { id: 'bsc-it', name: 'BSc Information Technology', department: 'School of Computing' },
  { id: 'bsc-applied-stat', name: 'BSc Applied Statistics with Computing', department: 'School of Mathematics' },
  { id: 'beng-eee', name: 'BEng Electrical & Electronic Engineering', department: 'School of Engineering' },
  { id: 'ba-econ', name: 'BA Economics & Finance', department: 'School of Business' },
  { id: 'bmed-surg', name: 'Bachelor of Medicine & Surgery (MBChB)', department: 'School of Medicine' },
];

export const CATALOG_UNITS = [
  { academicUnitId: 'cs-111', unitCode: 'CSC 111', unitTitle: 'Introduction to Programming in C', department: 'Computer Science', defaultTopics: ['Pointers', 'Memory Management', 'Data Types'] },
  { academicUnitId: 'cs-112', unitCode: 'CSC 112', unitTitle: 'Discrete Mathematics for Computing', department: 'Computer Science', defaultTopics: ['Set Theory', 'Combinatorics', 'Proof By Induction'] },
  { academicUnitId: 'cs-121', unitCode: 'CSC 121', unitTitle: 'Object-Oriented Programming (Java)', department: 'Computer Science', defaultTopics: ['Generics', 'Polymorphism', 'Design Patterns'] },
  { academicUnitId: 'cs-211', unitCode: 'CSC 211', unitTitle: 'Data Structures & Algorithms', department: 'Computer Science', defaultTopics: ['Dynamic Programming', 'Graph Algorithms', 'Trees & Heaps'] },
  { academicUnitId: 'cs-212', unitCode: 'CSC 212', unitTitle: 'Database Systems & SQL Modeling', department: 'Computer Science', defaultTopics: ['PostgreSQL', 'Normalization 3NF', 'Indexing', 'Transactions'] },
  { academicUnitId: 'cs-221', unitCode: 'CSC 221', unitTitle: 'Operating Systems & Concurrency', department: 'Computer Science', defaultTopics: ['Processes & Threads', 'Semaphores', 'Deadlocks'] },
  { academicUnitId: 'cs-311', unitCode: 'CSC 311', unitTitle: 'Computer Networks & Distributed Systems', department: 'Computer Science', defaultTopics: ['TCP/IP Stack', 'Routing Algorithms', 'Sockets'] },
  { academicUnitId: 'mat-120', unitCode: 'MAT 120', unitTitle: 'Calculus & Analytic Geometry', department: 'Mathematics', defaultTopics: ['Derivatives', 'Integration', 'Limits'] },
  { academicUnitId: 'mat-210', unitCode: 'MAT 210', unitTitle: 'Linear Algebra for Computing', department: 'Mathematics', defaultTopics: ['Matrix Decomposition', 'Eigenvalues', 'Vector Spaces'] },
  { academicUnitId: 'sta-205', unitCode: 'STA 205', unitTitle: 'Probability & Inferential Statistics', department: 'Statistics', defaultTopics: ['Bayesian Inference', 'Hypothesis Testing', 'Distributions'] },
];

export const DAYS_OF_WEEK = [
  { dayIndex: 0, label: 'Sunday', short: 'Sun' },
  { dayIndex: 1, label: 'Monday', short: 'Mon' },
  { dayIndex: 2, label: 'Tuesday', short: 'Tue' },
  { dayIndex: 3, label: 'Wednesday', short: 'Wed' },
  { dayIndex: 4, label: 'Thursday', short: 'Thu' },
  { dayIndex: 5, label: 'Friday', short: 'Fri' },
  { dayIndex: 6, label: 'Saturday', short: 'Sat' },
];

export const TIME_SLOTS = [
  { label: '08:00 - 10:00', start: '08:00', end: '10:00' },
  { label: '10:00 - 12:00', start: '10:00', end: '12:00' },
  { label: '12:00 - 14:00', start: '12:00', end: '14:00' },
  { label: '14:00 - 16:00', start: '14:00', end: '16:00' },
  { label: '16:00 - 18:00', start: '16:00', end: '18:00' },
  { label: '18:00 - 20:00', start: '18:00', end: '20:00' },
];

export const COLLABORATION_GOAL_OPTIONS = [
  'Exam Prep',
  'Project Collaboration',
  'Conceptual Mastery',
  'Code Review',
  'Homework & Problem Sets',
  'Accountability Partner',
  'Research & Paper Discussions',
  'Competitive Coding Practice',
];

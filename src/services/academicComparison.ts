/**
 * UniPath Academic Comparison Service
 *
 * Provides non-judgmental side-by-side academic analysis against synthetic cohorts.
 * Adheres strictly to the ethical comparison guidelines:
 * - Difference formula: studentMark - cohortMark
 * - Blank/missing marks are ignored, never treated as 0
 * - Explains limitations: differences across lecturers, cohorts, and assessment formats
 */

import {
  StudentUnitEntry,
  AcademicComparisonCohort,
  UnitComparisonResult,
  GradingScaleType,
} from '../types';
import { DEMO_COMPARISON_COHORTS, GRADING_SCALES } from '../data/mockData';

export interface ComparisonAnalysis {
  results: UnitComparisonResult[];
  overallSummary: {
    unitsEvaluated: number;
    averageStudentMark: number | null;
    averageCohortMark: number;
    overallDifference: number | null;
    relativeStandingNote: string;
  };
  limitationsNotice: string;
}

export function compareStudentUnitsWithCohort(
  studentUnits: StudentUnitEntry[],
  gradingScale: GradingScaleType = 'percentage',
  cohorts: AcademicComparisonCohort[] = DEMO_COMPARISON_COHORTS
): ComparisonAnalysis {
  const scale = GRADING_SCALES[gradingScale] || GRADING_SCALES.percentage;
  const results: UnitComparisonResult[] = [];

  let totalStudent = 0;
  let totalStudentCount = 0;
  let totalCohort = 0;
  let totalCohortCount = 0;

  for (const sUnit of studentUnits) {
    const matchingCohort = cohorts.find(
      (c) => c.unitCode.trim().toUpperCase() === sUnit.unitCode.trim().toUpperCase()
    );

    const hasMark = typeof sUnit.mark === 'number' && !isNaN(sUnit.mark);
    const studentMark = hasMark ? (sUnit.mark as number) : null;
    const cohortAverage = matchingCohort ? matchingCohort.meanMark : 62.0;

    // Difference formula mandated in spec: difference = Student A mark - Student B (cohort) mark
    const difference = studentMark !== null ? Math.round((studentMark - cohortAverage) * 10) / 10 : null;

    if (studentMark !== null) {
      totalStudent += studentMark;
      totalStudentCount++;
      totalCohort += cohortAverage;
      totalCohortCount++;
    }

    let interpretation = '';
    const revisionSuggestions: string[] = matchingCohort?.commonRevisionAreas || [
      'Core conceptual definitions and foundational problem sets',
      'Past examination paper review and time-budgeted practice'
    ];

    if (studentMark === null) {
      interpretation = 'Mark not entered. Unit is included for curriculum planning and revision scoping.';
    } else if (difference !== null && difference >= 5) {
      interpretation = `Strong performance (${difference > 0 ? '+' : ''}${difference}% above cohort baseline). Demonstrated mastery of key unit concepts.`;
    } else if (difference !== null && difference >= -5) {
      interpretation = `Consistent with typical cohort outcomes (${difference >= 0 ? '+' : ''}${difference}% relative to average). Solid grasp of foundational materials.`;
    } else {
      interpretation = `Growth opportunity (${difference}% relative to cohort). Focus on the highlighted revision topics to reinforce core principles.`;
    }

    results.push({
      unitCode: sUnit.unitCode,
      unitTitle: sUnit.unitTitle,
      studentMark,
      cohortAverage,
      difference,
      gradingScale,
      interpretation,
      revisionSuggestions,
    });
  }

  const avgStudent = totalStudentCount > 0 ? Math.round((totalStudent / totalStudentCount) * 10) / 10 : null;
  const avgCohort = totalCohortCount > 0 ? Math.round((totalCohort / totalCohortCount) * 10) / 10 : 62.0;
  const overallDiff = avgStudent !== null ? Math.round((avgStudent - avgCohort) * 10) / 10 : null;

  let standingNote = 'No marks provided. All analysis is oriented toward learning goals and unit roadmaps.';
  if (avgStudent !== null && overallDiff !== null) {
    if (overallDiff >= 5) {
      standingNote = `Your voluntary entries average ${avgStudent}%, tracking comfortably above typical cohort reference points (+${overallDiff}%).`;
    } else if (overallDiff >= -5) {
      standingNote = `Your voluntary entries average ${avgStudent}%, aligning closely with expected cohort distribution patterns.`;
    } else {
      standingNote = `Your voluntary entries average ${avgStudent}%. Focused review on complex topics will help strengthen overall concept retention.`;
    }
  }

  return {
    results,
    overallSummary: {
      unitsEvaluated: results.length,
      averageStudentMark: avgStudent,
      averageCohortMark: avgCohort,
      overallDifference: overallDiff,
      relativeStandingNote: standingNote,
    },
    limitationsNotice:
      'Academic cohorts vary significantly across semesters, lecturers, exam weightings, and grading rubrics. Cohort comparisons are synthetic benchmarks intended for self-guided reflection, never official ranking.',
  };
}

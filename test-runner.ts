/**
 * UniPath Automated Test Suite
 * Exercises Recommendation Engine, Academic Comparisons, and Ethical Scoring Rules
 */

import { calculateCareerRecommendations } from './src/services/recommendationEngine.ts';
import { compareStudentUnitsWithCohort } from './src/services/academicComparison.ts';
import { DEMO_PROGRAMMES, CAREERS, DEMO_COMPARISON_COHORTS } from './src/data/mockData.ts';
import { runBrainMateTests } from './src/lib/brainmate/__tests__/matching.test.ts';

function runTests() {
  console.log('🧪 Starting UniPath Automated Test Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      process.exitCode = 1;
    }
  }

  const prog = DEMO_PROGRAMMES[0]; // BSc Computer Science

  // Test 1: Deterministic scoring with zero marks (Missing data handling)
  const recsWithoutMarks = calculateCareerRecommendations({
    programme: prog,
    selectedUnits: [
      { unitId: 'cs-211', unitCode: 'CSC 211', unitTitle: 'Data Structures & Algorithms', academicPeriod: 'Year 2, Sem 1', status: 'completed' },
      { unitId: 'cs-212', unitCode: 'CSC 212', unitTitle: 'Database Systems & SQL Modeling', academicPeriod: 'Year 2, Sem 1', status: 'completed' },
    ],
    interests: ['Software Engineering'],
    skillsToDevelop: ['TypeScript', 'Docker'],
  });

  assert(recsWithoutMarks.length > 0, 'Recommendation engine returns careers when marks are omitted');
  assert(recsWithoutMarks[0].career.slug === 'software-engineer', 'Software Engineer is top recommendation for CS student with SE interests');
  assert(recsWithoutMarks[0].scoreBreakdown.academicEvidence === 0, 'Academic evidence score is 0 when marks are omitted');
  assert(recsWithoutMarks[0].marksIncluded === false, 'Marks included flag is false when marks omitted');

  // Test 2: Scoring with voluntary marks included
  const recsWithMarks = calculateCareerRecommendations({
    programme: prog,
    selectedUnits: [
      { unitId: 'cs-211', unitCode: 'CSC 211', unitTitle: 'Data Structures & Algorithms', academicPeriod: 'Year 2, Sem 1', mark: 75, status: 'completed' },
      { unitId: 'cs-212', unitCode: 'CSC 212', unitTitle: 'Database Systems & SQL Modeling', academicPeriod: 'Year 2, Sem 1', mark: 70, status: 'completed' },
    ],
    interests: ['Software Engineering'],
    skillsToDevelop: ['TypeScript', 'Docker'],
  });

  assert(recsWithMarks[0].marksIncluded === true, 'Marks included flag is true when marks provided');
  assert(recsWithMarks[0].scoreBreakdown.academicEvidence > 0, 'Academic evidence score is > 0 when marks provided');

  // Test 3: Low mark does not permanently disqualify student
  const recsLowMark = calculateCareerRecommendations({
    programme: prog,
    selectedUnits: [
      { unitId: 'cs-211', unitCode: 'CSC 211', unitTitle: 'Data Structures & Algorithms', academicPeriod: 'Year 2, Sem 1', mark: 35, status: 'completed' },
    ],
    interests: ['Software Engineering'],
    skillsToDevelop: ['TypeScript'],
  });

  assert(recsLowMark[0].exploratoryMatchScore >= 15, 'Student with low mark still receives valid exploratory score >= 15');
  assert(recsLowMark[0].career.slug === 'software-engineer', 'Student with low mark is not disqualified from top relevant career');

  // Test 4: Academic Comparison difference formula: Student A mark - Cohort Average
  const compResult = compareStudentUnitsWithCohort([
    { unitId: 'cs-211', unitCode: 'CSC 211', unitTitle: 'Data Structures & Algorithms', academicPeriod: 'Year 2, Sem 1', mark: 74, status: 'completed' },
  ], 'percentage', DEMO_COMPARISON_COHORTS);

  const csc211Comp = compResult.results.find((r) => r.unitCode === 'CSC 211');
  assert(!!csc211Comp, 'Comparison finds matching cohort for CSC 211');
  if (csc211Comp) {
    const expectedDiff = Math.round((74 - csc211Comp.cohortAverage) * 10) / 10;
    assert(csc211Comp.difference === expectedDiff, `Difference formula verified: ${csc211Comp.difference} === ${expectedDiff}`);
  }

  // Test 5: Missing marks in comparison are not treated as 0
  const compMissing = compareStudentUnitsWithCohort([
    { unitId: 'cs-211', unitCode: 'CSC 211', unitTitle: 'Data Structures & Algorithms', academicPeriod: 'Year 2, Sem 1', status: 'completed' },
  ], 'percentage', DEMO_COMPARISON_COHORTS);

  const missingUnit = compMissing.results.find((r) => r.unitCode === 'CSC 211');
  assert(missingUnit?.studentMark === null, 'Missing mark remains null');
  assert(missingUnit?.difference === null, 'Difference is null for missing mark, not calculated against 0');
  assert(compMissing.overallSummary.averageStudentMark === null, 'Overall student average remains null rather than 0');

  // Run BrainMate 8-dimension matching test suite
  runBrainMateTests(assert);

  console.log(`\nOverall Results: ${passed}/${total} tests passed.\n`);
}

runTests();

/**
 * BrainMate Matching Algorithm Test Suite
 * Validates 8 core requirements:
 * 1. Perfect complement
 * 2. No overlap
 * 3. Block exclusion
 * 4. Cross-institution exclusion
 * 5. Tie-breaking
 * 6. Availability edge cases
 * 7. Mentor-willingness bonus
 * 8. Explanation text generation
 */

import {
  StudentLearningProfile,
  findBrainMateMatches,
  scoreCandidate,
  calculateWindowOverlapMinutes,
} from '../matching.ts';

export function runBrainMateTests(assert: (condition: boolean, testName: string) => void) {
  console.log('\n🧠 Starting BrainMate Matching Algorithm Test Suite...\n');

  const myBaseProfile: StudentLearningProfile = {
    id: 'p-me',
    userId: 'user-me',
    displayName: 'Brian Otieno',
    institutionId: 'inst-uon',
    institutionName: 'University of Nairobi',
    programmeId: 'prog-cs',
    programmeName: 'BSc Computer Science',
    studyLevel: 'undergraduate',
    preferredGroupSize: 3,
    preferredFormat: 'in_person',
    mentorWillingness: false,
    collaborationGoals: ['Exam Prep', 'Project Collaboration'],
    visibility: 'institution',
    units: [
      {
        academicUnitId: 'u-algo',
        unitCode: 'CSC 211',
        unitTitle: 'Data Structures & Algorithms',
        role: 'needs_help',
        topics: ['Dynamic Programming', 'Graph Theory'],
      },
      {
        academicUnitId: 'u-db',
        unitCode: 'CSC 212',
        unitTitle: 'Database Systems',
        role: 'can_help',
        confidence: 'high',
        topics: ['SQL Optimization', 'Indexing'],
      },
    ],
    availability: [
      { dayOfWeek: 2, startTime: '14:00', endTime: '16:00' }, // Tuesday 2-4 PM (120 mins)
      { dayOfWeek: 4, startTime: '10:00', endTime: '12:00' }, // Thursday 10-12 PM
    ],
    verifiedUnitEnrolment: true,
  };

  // Test 1: Perfect complement (High score > 85, mutual can_help / needs_help, matching topics, availability, format)
  const perfectPartner: StudentLearningProfile = {
    id: 'p-sarah',
    userId: 'user-sarah',
    displayName: 'Sarah Muthoni',
    institutionId: 'inst-uon',
    institutionName: 'University of Nairobi',
    programmeId: 'prog-cs',
    programmeName: 'BSc Computer Science',
    studyLevel: 'undergraduate',
    preferredGroupSize: 3,
    preferredFormat: 'in_person',
    mentorWillingness: true,
    collaborationGoals: ['Exam Prep', 'Project Collaboration'],
    visibility: 'institution',
    units: [
      {
        academicUnitId: 'u-algo',
        unitCode: 'CSC 211',
        unitTitle: 'Data Structures & Algorithms',
        role: 'can_help',
        confidence: 'high',
        topics: ['Dynamic Programming', 'Graph Theory'],
      },
      {
        academicUnitId: 'u-db',
        unitCode: 'CSC 212',
        unitTitle: 'Database Systems',
        role: 'needs_help',
        topics: ['SQL Optimization'],
      },
    ],
    availability: [
      { dayOfWeek: 2, startTime: '14:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '12:00' },
    ],
    verifiedUnitEnrolment: true,
  };

  const perfectMatch = scoreCandidate(myBaseProfile, perfectPartner);
  assert(
    perfectMatch.score >= 85,
    `Test 1 (Perfect complement): Score should be >= 85 (got ${perfectMatch.score})`
  );
  assert(
    perfectMatch.evidenceLevel === 'verified_unit',
    `Test 1: Evidence level is 'verified_unit' when both profiles are verified`
  );

  // Test 2: No overlap (Disjoint units, disjoint availability, incompatible formats yield low/zero score)
  const disjointPartner: StudentLearningProfile = {
    id: 'p-kevin',
    userId: 'user-kevin',
    displayName: 'Kevin Omondi',
    institutionId: 'inst-uon',
    programmeId: 'prog-arts',
    studyLevel: 'undergraduate',
    preferredGroupSize: 8,
    preferredFormat: 'online',
    mentorWillingness: false,
    collaborationGoals: ['Casual Review'],
    visibility: 'institution',
    units: [
      {
        academicUnitId: 'u-lit',
        unitCode: 'LIT 101',
        unitTitle: 'African Literature',
        role: 'studying',
        topics: ['Poetry'],
      },
    ],
    availability: [
      { dayOfWeek: 0, startTime: '06:00', endTime: '07:00' }, // Sunday morning only
    ],
  };

  const noOverlapMatch = scoreCandidate(myBaseProfile, disjointPartner);
  assert(
    noOverlapMatch.score <= 10,
    `Test 2 (No overlap): Disjoint candidates yield score <= 10 (got ${noOverlapMatch.score})`
  );

  // Test 3: Block exclusion (Blocked candidates never appear in match list)
  const matchesWithBlock = findBrainMateMatches(
    myBaseProfile,
    [perfectPartner, disjointPartner],
    { blockedUserIds: ['user-sarah'] }
  );
  const containsSarah = matchesWithBlock.some((m) => m.candidateUserId === 'user-sarah');
  assert(
    !containsSarah,
    `Test 3 (Block exclusion): Blocked candidate 'user-sarah' must not appear in match results`
  );

  // Test 4: Cross-institution exclusion (Candidate from different institution excluded)
  const kuCandidate: StudentLearningProfile = {
    ...perfectPartner,
    userId: 'user-ku',
    institutionId: 'inst-ku', // Kenyatta University instead of UoN
  };
  const crossInstMatches = findBrainMateMatches(myBaseProfile, [kuCandidate]);
  assert(
    crossInstMatches.length === 0,
    `Test 4 (Cross-institution exclusion): Candidate from 'inst-ku' excluded from 'inst-uon' student`
  );

  // Test 5: Deterministic tie-breaking (Equal scores sorted deterministically by candidateUserId ASC)
  const twinA: StudentLearningProfile = {
    ...disjointPartner,
    userId: 'user-zebra',
    displayName: 'Zebra Candidate',
  };
  const twinB: StudentLearningProfile = {
    ...disjointPartner,
    userId: 'user-alpha',
    displayName: 'Alpha Candidate',
  };
  const tieMatches = findBrainMateMatches(myBaseProfile, [twinA, twinB]);
  assert(
    tieMatches.length === 2 && tieMatches[0].candidateUserId === 'user-alpha',
    `Test 5 (Tie-breaking): Identical score candidates are sorted by candidateUserId ('user-alpha' before 'user-zebra')`
  );

  // Test 6: Availability edge cases (Window overlap calculation and >=60 min threshold)
  const overlapExact60 = calculateWindowOverlapMinutes(
    { dayOfWeek: 1, startTime: '09:00', endTime: '10:00' },
    { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' }
  );
  assert(overlapExact60 === 60, `Test 6 (Availability edge cases): 09:00-10:00 vs 09:00-11:00 overlaps 60 mins`);

  const disjointDays = calculateWindowOverlapMinutes(
    { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
    { dayOfWeek: 2, startTime: '09:00', endTime: '11:00' }
  );
  assert(disjointDays === 0, `Test 6: Different days yield 0 overlap`);

  const disjointHoursSameDay = calculateWindowOverlapMinutes(
    { dayOfWeek: 1, startTime: '09:00', endTime: '10:00' },
    { dayOfWeek: 1, startTime: '10:30', endTime: '12:00' }
  );
  assert(disjointHoursSameDay === 0, `Test 6: Non-overlapping hours on same day yield 0 overlap`);

  // Test 7: Mentor-willingness bonus
  const nonMentorPartner: StudentLearningProfile = {
    ...perfectPartner,
    userId: 'user-nonmentor',
    mentorWillingness: false,
  };
  const mentorScore = scoreCandidate(myBaseProfile, perfectPartner);
  const nonMentorScore = scoreCandidate(myBaseProfile, nonMentorPartner);
  assert(
    mentorScore.score > nonMentorScore.score,
    `Test 7 (Mentor-willingness bonus): Mentor willingness grants higher score when user needs help (${mentorScore.score} > ${nonMentorScore.score})`
  );

  // Test 8: Explanation text generation
  assert(
    typeof perfectMatch.explanation === 'string' && perfectMatch.explanation.length > 20,
    `Test 8 (Explanation text generation): Explanation is non-empty string (${perfectMatch.explanation})`
  );
  assert(
    perfectMatch.explanation.includes('CSC 211') || perfectMatch.explanation.includes('Data Structures'),
    `Test 8: Explanation mentions the primary matched academic unit`
  );
  assert(
    perfectMatch.factors.length === 7,
    `Test 8: Itemized factors decomposition contains all 7 defined dimensions`
  );
}

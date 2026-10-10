/**
 * UniPath Career Recommendation Engine
 *
 * Implements deterministic, transparent, and non-judgmental career matching
 * based on degree relevance, completed units, declared interests, and optional marks.
 */

import { Career, CareerRecommendation, StudentUnitEntry, Programme } from '../types/index.ts';
import { CAREERS } from '../data/mockData.ts';

export interface RecommendationInputs {
  programme: Programme;
  selectedUnits: StudentUnitEntry[];
  interests: string[];
  skillsToDevelop: string[];
  careerGoals?: string;
  academicYear?: number;
}

export function calculateCareerRecommendations(
  inputs: RecommendationInputs,
  careerCatalogue: Career[] = CAREERS
): CareerRecommendation[] {
  const { programme, selectedUnits, interests, skillsToDevelop } = inputs;

  // Filter or count marks voluntarily entered
  const unitsWithMarks = selectedUnits.filter(
    (u) => typeof u.mark === 'number' && !isNaN(u.mark)
  );
  const marksProvided = unitsWithMarks.length > 0;

  // Weights configuration
  // Total: 100 points
  // When marks are provided: Degree (35) + Units (25) + Interests (25) + Academic Marks (15) = 100
  // When marks are omitted: Degree (45) + Units (30) + Interests (25) = 100
  const maxDegreeScore = marksProvided ? 35 : 45;
  const maxUnitScore = marksProvided ? 25 : 30;
  const maxInterestScore = 25;
  const maxAcademicEvidenceScore = marksProvided ? 15 : 0;

  const results: CareerRecommendation[] = careerCatalogue.map((career) => {
    // 1. Degree Programme Relevance
    const isDirectProgramme = career.relevantProgrammes.includes(programme.id);
    let degreeRelevance = isDirectProgramme ? maxDegreeScore : 0;

    // Check shared target industries
    if (!isDirectProgramme) {
      const sharesIndustry = programme.targetIndustries.some((ind) =>
        career.workEnvironments.some((env) => env.toLowerCase().includes(ind.toLowerCase())) ||
        career.category.toLowerCase().includes(ind.toLowerCase())
      );
      if (sharesIndustry) {
        degreeRelevance = Math.round(maxDegreeScore * 0.65);
      } else {
        degreeRelevance = Math.round(maxDegreeScore * 0.3);
      }
    }

    // 2. Unit Relevance & Completed Academic Preparation
    const completedUnitCodes = selectedUnits.map((u) => u.unitCode.trim().toUpperCase());
    const matchedUnitCodes = career.relevantUnitCodes.filter((code) =>
      completedUnitCodes.includes(code.toUpperCase())
    );

    let unitRelevanceRatio = 0;
    if (career.relevantUnitCodes.length > 0) {
      unitRelevanceRatio = Math.min(
        1.0,
        matchedUnitCodes.length / Math.min(3, career.relevantUnitCodes.length)
      );
    }
    const unitRelevance = Math.round(unitRelevanceRatio * maxUnitScore);

    // 3. Declared Interests & Desired Skills Alignment
    const lowerInterests = (interests || []).map((i) => i.toLowerCase());
    const lowerSkillsToDev = (skillsToDevelop || []).map((s) => s.toLowerCase());

    let interestMatches = 0;
    for (const interest of lowerInterests) {
      const inTitle = career.title.toLowerCase().includes(interest);
      const inCategory = career.category.toLowerCase().includes(interest);
      const inSummary = career.summary.toLowerCase().includes(interest);
      const inTech = career.technicalSkills.some((s) => s.toLowerCase().includes(interest));
      if (inTitle || inCategory || inSummary || inTech) {
        interestMatches++;
      }
    }

    for (const skill of lowerSkillsToDev) {
      const inTech = career.technicalSkills.some((s) => s.toLowerCase().includes(skill));
      const inTransferable = career.transferableSkills.some((s) => s.toLowerCase().includes(skill));
      if (inTech || inTransferable) {
        interestMatches++;
      }
    }

    const interestRatio = Math.min(1.0, (interestMatches * 0.35) + 0.1);
    const interestAlignment = Math.round(interestRatio * maxInterestScore);

    // 4. Academic Evidence (Optional Marks)
    // Non-judgmental: We look at marks in relevant units if supplied.
    // Low marks DO NOT permanently disqualify students.
    let academicEvidence = 0;
    if (marksProvided) {
      const relevantMarks = unitsWithMarks.filter((u) =>
        career.relevantUnitCodes.includes(u.unitCode.toUpperCase())
      );

      const targetPool = relevantMarks.length > 0 ? relevantMarks : unitsWithMarks;
      const avg = targetPool.reduce((sum, u) => sum + (u.mark || 0), 0) / targetPool.length;

      // Normalization assuming standard scale: 70+ gets max 15, 60-69 gets 12, 50-59 gets 10, 40-49 gets 7, below 40 gets 4.
      if (avg >= 70) {
        academicEvidence = maxAcademicEvidenceScore;
      } else if (avg >= 60) {
        academicEvidence = Math.round(maxAcademicEvidenceScore * 0.85);
      } else if (avg >= 50) {
        academicEvidence = Math.round(maxAcademicEvidenceScore * 0.70);
      } else if (avg >= 40) {
        academicEvidence = Math.round(maxAcademicEvidenceScore * 0.50);
      } else {
        academicEvidence = Math.round(maxAcademicEvidenceScore * 0.30); // Still receives positive exploration credit!
      }
    }

    // Total Exploratory Match Score (0 - 100)
    const rawTotal = degreeRelevance + unitRelevance + interestAlignment + academicEvidence;
    const exploratoryMatchScore = Math.min(100, Math.max(15, rawTotal));

    // Construct Transparent Explanations
    const whyRecommended: string[] = [];
    if (isDirectProgramme) {
      whyRecommended.push(
        `Directly aligns with your degree curriculum in ${programme.name}.`
      );
    } else {
      whyRecommended.push(
        `Provides an interdisciplinary path connecting ${programme.name} to ${career.category}.`
      );
    }

    if (matchedUnitCodes.length > 0) {
      whyRecommended.push(
        `Found ${matchedUnitCodes.length} aligned completed or current units: ${matchedUnitCodes.join(', ')}.`
      );
    } else {
      whyRecommended.push(
        `Builds on foundational academic competencies from your degree path.`
      );
    }

    if (interestMatches > 0) {
      whyRecommended.push(
        `Strongly reflects your declared interest in ${interests.slice(0, 2).join(' and ')}.`
      );
    }

    if (marksProvided) {
      whyRecommended.push(
        `Exploratory score incorporates your voluntary mark entries without imposing restrictive minimums.`
      );
    } else {
      whyRecommended.push(
        `Recommendation generated purely from programme scope and personal career interests without requiring marks.`
      );
    }

    // Determine skills supported vs still needed
    const skillsAlreadySupported: string[] = [];
    const skillsToDevelopList: string[] = [];

    career.technicalSkills.forEach((skill, index) => {
      if (index < 3 && matchedUnitCodes.length > 0) {
        skillsAlreadySupported.push(skill);
      } else {
        skillsToDevelopList.push(skill);
      }
    });

    const nextMilestones = (career.roadmapSteps || []).slice(0, 2).map((step) => step.title);

    return {
      career,
      exploratoryMatchScore,
      scoreBreakdown: {
        degreeRelevance,
        unitRelevance,
        interestAlignment,
        academicEvidence,
      },
      whyRecommended,
      alignedUnitsFound: matchedUnitCodes,
      skillsAlreadySupported,
      skillsToDevelop: skillsToDevelopList,
      nextMilestones,
      marksIncluded: marksProvided,
    };
  });

  // Sort by highest exploratory score first
  return results.sort((a, b) => b.exploratoryMatchScore - a.exploratoryMatchScore);
}

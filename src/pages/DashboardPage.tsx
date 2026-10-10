import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Award,
  Zap,
} from 'lucide-react';
import { CareerRecommendation, Programme, StudentUnitEntry } from '../types';
import { DemoDataBadge } from '../components/DemoDataBadge';

interface DashboardPageProps {
  programme: Programme;
  selectedUnits: StudentUnitEntry[];
  recommendations: CareerRecommendation[];
  onNavigate: (route: string) => void;
  onOpenCareer: (slug: string) => void;
  onOpenRoadmap: (slug: string) => void;
  onOpenApexAI: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  programme,
  selectedUnits,
  recommendations,
  onNavigate,
  onOpenCareer,
  onOpenRoadmap,
  onOpenApexAI,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);

  const categories = [
    'all',
    ...Array.from(new Set(recommendations.map((r) => r.career.category))),
  ];

  const filteredRecommendations = recommendations.filter((r) => {
    if (selectedCategory !== 'all' && r.career.category !== selectedCategory) {
      return false;
    }
    return r.exploratoryMatchScore >= minScore;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner / Course Context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Active Exploration Context
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {programme.code}
            </span>
            <DemoDataBadge label="Curriculum Analysis" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {programme.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Evaluated against {selectedUnits.length} syllabus units and {recommendations.length} professional career frameworks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/explore')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Adjust Units or Interests
          </button>
          <button
            onClick={onOpenApexAI}
            className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Discuss With Apex AI
          </button>
        </div>
      </div>

      {/* Exploratory Score Methodology Disclosure */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>About Exploratory Match Scores</span>
        </div>
        <p className="leading-relaxed">
          Scores reflect calculated curriculum alignment, declared career interests, and voluntary marks. 
          <strong className="text-slate-900"> This score is not a probability of career success or an evaluation of student aptitude.</strong> 
          Every path is open to development, portfolio building, and targeted specialization.
        </p>
      </div>

      {/* Filter and sorting toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Domains' : cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredRecommendations.length} matching career pathways
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-6">
        {filteredRecommendations.map((rec) => {
          const { career, exploratoryMatchScore, scoreBreakdown, whyRecommended, skillsAlreadySupported, skillsToDevelop, nextMilestones } = rec;

          return (
            <div
              key={career.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all space-y-6"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      {career.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      {career.entryRoles[0]}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {career.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
                    {career.summary}
                  </p>
                </div>

                {/* Score Widget */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:text-right shrink-0 min-w-36">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Exploratory Match
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">
                    {exploratoryMatchScore}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Curriculum Fit
                  </div>
                </div>
              </div>

              {/* Score Breakdown Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/60 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Degree Fit</div>
                  <div className="font-bold text-slate-900 font-mono mt-0.5">
                    {scoreBreakdown.degreeRelevance} / 35 pts
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Unit Relevance</div>
                  <div className="font-bold text-slate-900 font-mono mt-0.5">
                    {scoreBreakdown.unitRelevance} / 25 pts
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Interests & Goals</div>
                  <div className="font-bold text-slate-900 font-mono mt-0.5">
                    {scoreBreakdown.interestAlignment} / 25 pts
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Mark Evidence</div>
                  <div className="font-bold text-slate-900 font-mono mt-0.5">
                    {scoreBreakdown.academicEvidence > 0 ? `${scoreBreakdown.academicEvidence} / 15 pts` : 'Omitted (Neutral)'}
                  </div>
                </div>
              </div>

              {/* Rationale & Units Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-slate-500">
                    Why This Was Recommended
                  </h4>
                  <ul className="space-y-1.5">
                    {whyRecommended.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>

                  {career.regulatedProfessionNote && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 mt-2">
                      <strong>Regulatory Board Note:</strong> {career.regulatedProfessionNote}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-slate-500">
                    Skills Ready vs. Next To Develop
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[11px] font-semibold text-emerald-700 mb-1">
                        Supported by Current Coursework:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsAlreadySupported.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-xs font-medium border border-emerald-200/50">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-600 mb-1">
                        High Priority Next Skills:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsToDevelop.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-medium text-slate-700">Next Practical Step:</span>
                  <span className="italic">{nextMilestones[0] || 'Build foundational projects'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenCareer(career.slug)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Career Profile
                  </button>
                  <button
                    onClick={() => onOpenRoadmap(career.slug)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Career Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

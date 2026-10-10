import React, { useState } from 'react';
import {
  Compass,
  ArrowLeft,
  CheckSquare,
  Square,
  ExternalLink,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { Career, CareerRoadmapStep } from '../types';
import { DemoDataBadge } from '../components/DemoDataBadge';

interface RoadmapPageProps {
  career: Career;
  completedStepIds: string[];
  onToggleStep: (stepId: string) => void;
  onBack: () => void;
  onOpenApexAI: () => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  career,
  completedStepIds,
  onToggleStep,
  onBack,
  onOpenApexAI,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('All');

  const phases = [
    'All',
    'Foundation (Year 1-2)',
    'Specialization (Year 3)',
    'Industry Readiness (Year 4+)',
  ];

  const filteredSteps = career.roadmapSteps.filter((s) => {
    if (selectedPhase === 'All') return true;
    return s.phase === selectedPhase;
  });

  const totalSteps = career.roadmapSteps.length;
  const completedCount = career.roadmapSteps.filter((s) =>
    completedStepIds.includes(s.id)
  ).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button and page label */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Profile</span>
        </button>
        <DemoDataBadge label="Milestone Framework" />
      </div>

      {/* Header card with progress tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Step-by-Step Practical Preparation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {career.title} Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Track your milestones throughout your degree. Check off items as you complete them to gauge readiness.
            </p>
          </div>

          <button
            onClick={onOpenApexAI}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Customize With Apex AI</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Overall Milestone Progress</span>
            <span className="font-mono font-bold text-indigo-600">
              {completedCount} of {totalSteps} Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {phases.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPhase(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedPhase === p
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Steps list */}
      <div className="space-y-6">
        {filteredSteps.map((step) => {
          const isCompleted = completedStepIds.includes(step.id);

          return (
            <div
              key={step.id}
              className={`bg-white rounded-2xl border p-6 sm:p-7 shadow-xs transition-all space-y-4 ${
                isCompleted
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => onToggleStep(step.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                    aria-label={`Mark step ${step.stepNumber} complete`}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Square className="w-6 h-6 text-slate-400" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Step 0{step.stepNumber}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {step.phase}
                      </span>
                    </div>

                    <h3 className={`text-lg font-bold ${
                      isCompleted ? 'text-emerald-950 line-through opacity-85' : 'text-slate-900'
                    }`}>
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Practical Actions */}
              <div className="pl-9 space-y-3 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5 text-slate-400" />
                  <span>Actionable Practical Tasks</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {step.practicalActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Resources with verified links */}
              {step.recommendedResources.length > 0 && (
                <div className="pl-9 pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Curated Open Resources</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {step.recommendedResources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/60 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="w-3 h-3 text-indigo-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

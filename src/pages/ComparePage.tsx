import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle,
  HelpCircle,
  Plus,
  Trash2,
  Sparkles,
  Users
} from 'lucide-react';
import { StudentUnitEntry, GradingScaleType } from '../types';
import { compareStudentUnitsWithCohort } from '../services/academicComparison';
import { DEMO_COMPARISON_COHORTS, GRADING_SCALES } from '../data/mockData';
import { DemoDataBadge } from '../components/DemoDataBadge';

interface ComparePageProps {
  initialUnits: StudentUnitEntry[];
  onNavigate: (route: string) => void;
  onOpenApexAI: () => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  initialUnits,
  onNavigate,
  onOpenApexAI,
}) => {
  const [units, setUnits] = useState<StudentUnitEntry[]>(
    initialUnits.length > 0
      ? initialUnits
      : [
          {
            unitId: 'cs-211',
            unitCode: 'CSC 211',
            unitTitle: 'Data Structures & Algorithms',
            academicPeriod: 'Year 2, Sem 1',
            mark: 72,
            status: 'completed',
          },
          {
            unitId: 'cs-212',
            unitCode: 'CSC 212',
            unitTitle: 'Database Systems & SQL Modeling',
            academicPeriod: 'Year 2, Sem 1',
            mark: 68,
            status: 'completed',
          },
        ]
  );

  const [gradingScale, setGradingScale] = useState<GradingScaleType>('percentage');

  const comparison = useMemo(() => {
    return compareStudentUnitsWithCohort(units, gradingScale, DEMO_COMPARISON_COHORTS);
  }, [units, gradingScale]);

  const updateMark = (unitCode: string, newMarkStr: string) => {
    if (newMarkStr === '') {
      setUnits((prev) =>
        prev.map((u) => (u.unitCode === unitCode ? { ...u, mark: undefined } : u))
      );
      return;
    }
    const val = parseFloat(newMarkStr);
    if (!isNaN(val)) {
      setUnits((prev) =>
        prev.map((u) => (u.unitCode === unitCode ? { ...u, mark: val } : u))
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Academic Insights & Cohort Context
          </span>
          <DemoDataBadge label="Synthetic Benchmarks" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Performance Reflections & Revision Guidance
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Compare voluntary self-reported unit marks with synthetic cohort averages to identify conceptual strengths and high-value revision opportunities—without public ranking, shaming, or exposure.
        </p>
      </div>

      {/* Ethical Comparison Principles Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Ethical Academic Context & Limitations</span>
        </div>
        <p className="leading-relaxed">
          {comparison.limitationsNotice}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-200">
          <div>• Missing marks are ignored, never evaluated as zero</div>
          <div>• Formula: <code className="bg-slate-200 px-1 rounded font-mono text-slate-800">difference = Student Mark − Cohort Average</code></div>
          <div>• No public leaderboards or student shaming</div>
        </div>
      </div>

      {/* Summary Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Your Reported Average
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {comparison.overallSummary.averageStudentMark !== null
              ? `${comparison.overallSummary.averageStudentMark}%`
              : 'Omitted'}
          </div>
          <span className="text-[11px] text-slate-400">
            Across {comparison.overallSummary.unitsEvaluated} entered units
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Synthetic Cohort Average
          </span>
          <div className="text-3xl font-extrabold text-slate-600 font-mono">
            {comparison.overallSummary.averageCohortMark}%
          </div>
          <span className="text-[11px] text-slate-400">
            Representative course baseline
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Relative Variance
          </span>
          <div className={`text-3xl font-extrabold font-mono ${
            comparison.overallSummary.overallDifference === null
              ? 'text-slate-400'
              : comparison.overallSummary.overallDifference >= 0
              ? 'text-emerald-600'
              : 'text-amber-600'
          }`}>
            {comparison.overallSummary.overallDifference !== null
              ? `${comparison.overallSummary.overallDifference > 0 ? '+' : ''}${comparison.overallSummary.overallDifference}%`
              : 'N/A'}
          </div>
          <span className="text-[11px] text-slate-400">
            Calculated difference
          </span>
        </div>
      </div>

      {/* Unit by Unit Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Unit-by-Unit Side-by-Side Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit values in-line to observe changes in revision topics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenApexAI}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Discuss Revision Plan</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {comparison.results.map((res) => (
            <div
              key={res.unitCode}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-700">
                      {res.unitCode}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-medium">Core Academic Unit</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {res.unitTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <label className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Your Mark
                    </label>
                    <input
                      type="number"
                      placeholder="Blank"
                      value={res.studentMark ?? ''}
                      onChange={(e) => updateMark(res.unitCode, e.target.value)}
                      className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 text-right font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Cohort Avg
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 block py-1">
                      {res.cohortAverage}%
                    </span>
                  </div>

                  <div className="text-right min-w-16">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      Difference
                    </span>
                    <span className={`text-xs font-mono font-bold block py-1 ${
                      res.difference === null
                        ? 'text-slate-400'
                        : res.difference >= 0
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}>
                      {res.difference !== null
                        ? `${res.difference > 0 ? '+' : ''}${res.difference}%`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interpretation note */}
              <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Interpretation: </span>
                {res.interpretation}
              </div>

              {/* Revision suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Suggested High-Value Revision Topics:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {res.revisionSuggestions.map((topic, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Link to BrainMate */}
      <div className="bg-linear-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>BrainMate Module Integration</span>
          </div>
          <h3 className="text-xl font-bold">
            Looking for Study Partners to Revise These Units?
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl leading-relaxed">
            BrainMate matches you with fellow university students enrolled in the same units for collaborative problem-solving and mutual accountability.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/community')}
          className="px-5 py-3 bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs sm:text-sm rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>Find Study Partners in BrainMate</span>
          <ArrowRight className="w-4 h-4 text-purple-900" />
        </button>
      </div>
    </div>
  );
};

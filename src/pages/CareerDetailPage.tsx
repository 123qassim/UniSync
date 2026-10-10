import React from 'react';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  ExternalLink,
  Award,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { Career } from '../types';
import { DemoDataBadge } from '../components/DemoDataBadge';

interface CareerDetailPageProps {
  career: Career;
  onBack: () => void;
  onOpenRoadmap: (slug: string) => void;
  onOpenApexAI: () => void;
}

export const CareerDetailPage: React.FC<CareerDetailPageProps> = ({
  career,
  onBack,
  onOpenRoadmap,
  onOpenApexAI,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button and badges */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Directory</span>
        </button>
        <DemoDataBadge label="Verified Syllabus Mapping" />
      </div>

      {/* Main Title Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              {career.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {career.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {career.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenRoadmap(career.slug)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>View Actionable Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenApexAI}
              className="p-3 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
              title="Discuss with Apex AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Regulated profession notice if applicable */}
        {career.regulatedProfessionNote && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3 mt-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Regulated Professional Practice Note: </span>
              {career.regulatedProfessionNote}
            </div>
          </div>
        )}
      </div>

      {/* Everyday Language & Typical Work Environment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Typical Responsibilities</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {career.responsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Work Environments & Progression</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Typical Workplaces
              </div>
              <div className="flex flex-wrap gap-1.5">
                {career.workEnvironments.map((env, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                    {env}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Entry-Level Titles
              </div>
              <p className="text-slate-700">{career.entryRoles.join(' · ')}</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Senior Advancement Roles
              </div>
              <p className="text-slate-700">{career.advancementRoles.join(' · ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Required Technical & Transferable Skills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          Core Competency Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              Technical & Domain Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.technicalSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-800 rounded-lg text-xs font-medium border border-indigo-200/50"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Transferable & Communication Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.transferableSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Graded Portfolio Project Ideas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            <span>Graded Portfolio Projects</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Practical demonstrations you can complete during university to prove real-world proficiency to employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {career.portfolioProjects.map((p) => (
            <div
              key={p.id}
              className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                    {p.level} Milestone
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ~{p.estimatedWeeks} weeks
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.summary}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200/60">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Key Deliverables
                </div>
                <ul className="text-xs text-slate-700 space-y-1">
                  {p.deliverables.map((deliv, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications and Postgraduate Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Relevant Certifications</span>
          </h2>
          <div className="space-y-3">
            {career.recommendedCertifications.map((cert, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{cert.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    cert.isMandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {cert.isMandatory ? 'Mandatory' : 'Optional / Value-Add'}
                  </span>
                </div>
                <div className="text-slate-500">{cert.provider}</div>
                {cert.note && <div className="text-slate-600 italic text-[11px]">{cert.note}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Postgraduate Opportunities</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {career.postgraduateOptions.map((opt, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>{opt}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
            Postgraduate study is valuable for research, specialized engineering, and academic leadership.
          </div>
        </div>
      </div>

      {/* Data Limitation Notice */}
      <div className="bg-slate-100 rounded-xl p-4 text-[11px] text-slate-600 space-y-1">
        <span className="font-bold text-slate-800">Transparency Notice on Compensation & Hiring:</span>
        <p>{career.dataLimitationNotice}</p>
      </div>
    </div>
  );
};

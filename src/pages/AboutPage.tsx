import React from 'react';
import { Compass, Shield, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { DemoDataBadge } from '../components/DemoDataBadge';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            About UniPath & UniSync
          </span>
          <DemoDataBadge label="Transparent Disclosure" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Translating Degree Studies Into Career Reality
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          UniPath is the career and academic discovery engine of the UniSync ecosystem. We believe that university students deserve clear visibility into where their coursework leads—without arbitrary paywalls or privacy infringements.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Core Operating Principles
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold mb-0.5">Explore Without Signing Up</strong>
              Any visitor can search programmes, explore careers, inspect unit mappings, and generate exploratory roadmaps without being forced to create an account or provide personal information.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold mb-0.5">Voluntary Academic Marks, Zero Shame</strong>
              Academic marks are completely optional. UniPath never infers student intelligence, aptitude, or employability from grades alone. A low mark will never permanently disqualify you from any career pathway.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold mb-0.5">Transparent Recommendation Scoring</strong>
              Our recommendation engine uses published, testable rules balancing degree curriculum fit (35-45%), unit relevance (25-30%), personal career interests (25%), and voluntary marks (0-15%). Match percentages are strictly labeled as exploratory scores, not guarantees of success.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Synthetic Demonstration Data Disclosure
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          To protect real student privacy and ensure complete demonstrability prior to institutional registry integration, all universities (such as Maseno University, UoN, and Strathmore) and sample student profiles in this release use synthetic data.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          UniPath does not pretend that an authorized live connection exists to official national examinations or university registrar databases without explicit proof.
        </p>
      </div>
    </div>
  );
};

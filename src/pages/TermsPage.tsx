import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Legal Terms
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Purpose of UniPath</h2>
          <p>
            UniPath provides educational discovery, syllabus unit mapping, and career exploration roadmaps. All recommendation scores and projections are intended as exploratory tools for student planning and self-reflection, not professional employment guarantees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Professional Licensure & Regulation</h2>
          <p>
            Certain professions (including Nursing, Engineering, Medicine, and Law) require mandatory registration, examinations, and licensing from governmental or professional boards. Students are advised to verify statutory requirements directly with authorized councils.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Demonstration Datasets</h2>
          <p>
            Unless explicitly certified by an official university integration, curriculum units, exam pass percentiles, and demo cohort benchmarks represent illustrative synthetic records designed for testing and planning.
          </p>
        </section>
      </div>
    </div>
  );
};

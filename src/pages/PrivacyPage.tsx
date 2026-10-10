import React from 'react';
import { Lock, Shield, Eye, Trash2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Privacy Policy
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Data Privacy & Retention Notice
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Effective Date: Academic Year 2026/2027 · Production Compliance
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Data Minimization & Anonymous Exploration</h2>
          <p>
            UniPath allows any student to explore careers, syllabus units, and recommendation algorithms without creating an account or providing personally identifiable information (PII). When browsing anonymously, your unit selections remain in temporary browser memory.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Voluntary Academic Marks</h2>
          <p>
            Submitting unit marks is entirely optional. We never require official transcripts. If you choose to enter marks, they are used solely to calibrate exploratory career advice and highlight revision topics. Marks are never published publicly, sold, or shared without explicit consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. BrainMate Peer Matching Privacy Boundary</h2>
          <p>
            When using the BrainMate integration for study partners, only consented academic fields (e.g., shared unit codes and study preferences) are visible to suggested peers. Email addresses, phone numbers, and exact grades are never disclosed by default. Contact exchange requires mutual acceptance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Right to Revoke & Delete</h2>
          <p>
            You have the right to revoke sharing permissions or wipe all voluntarily submitted student records at any time via your Profile Settings. Data deletion is instantaneous and irreversible.
          </p>
        </section>
      </div>
    </div>
  );
};

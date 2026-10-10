import React, { useState } from 'react';
import {
  GraduationCap,
  ExternalLink,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { KUCCPSPlacementRecord } from '../../types/zeroq';

interface ZeroQPlacementModuleProps {
  placement: KUCCPSPlacementRecord;
  onDownloadLetter: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ZeroQPlacementModule: React.FC<ZeroQPlacementModuleProps> = ({
  placement,
  onDownloadLetter,
  onNavigateTab,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeMode, setActiveMode] = useState<'demo' | 'official'>('demo');

  const handleDownload = () => {
    onDownloadLetter();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & KUCCPS Authority Disclaimer */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-950 px-2 py-0.5 rounded border border-violet-800">
            Admissions Placement Record
          </span>
          <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
            DEMO SIMULATION
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Placement Results
        </h1>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          The Kenya Universities and Colleges Central Placement Service (KUCCPS) is the official government statutory body that determines degree placement allocations. ZeroQ is a digital onboarding and student discovery platform, not the authority that decides placements.
        </p>
      </div>

      {/* Mode Selector Tabs (Mode A: Demo vs Mode B: Official) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveMode('demo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeMode === 'demo'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Mode A: Demonstration Mode (Brian Otieno)
        </button>
        <button
          onClick={() => setActiveMode('official')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeMode === 'official'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Mode B: Official KUCCPS Portal Access
        </button>
      </div>

      {/* MODE A: Demonstration Mode Result Card */}
      {activeMode === 'demo' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-violet-600 to-teal-400 text-white flex items-center justify-center font-bold text-xl shadow-md">
                MSU
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide">
                  Placement Verified (DEMO)
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {placement.institutionName}
                </h2>
                <p className="text-xs text-slate-500">Institution Code: {placement.institutionCode}</p>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                KCSE Index: {placement.kcseIndexNumber}
              </span>
            </div>
          </div>

          {/* Allocation Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                  Placed Programme
                </span>
                <div className="font-extrabold text-slate-900 text-base">
                  {placement.programmeName}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Programme Code: {placement.programmeCode}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                  Candidate Information
                </span>
                <div className="text-slate-800 font-bold">{placement.studentName}</div>
                <div className="text-slate-500 text-xs">Examination Year: {placement.examinationYear} (KCSE)</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                  Placement Category
                </span>
                <div className="font-bold text-slate-900">
                  {placement.placementCategory} (Government Sponsored / GSSP)
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                  Verification Note
                </span>
                <div className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  {placement.resultVerification}. All records generated for educational technology evaluation.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={handleDownload}
              className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Placement Letter (PDF)</span>
            </button>

            <button
              onClick={() => onNavigateTab('university')}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Maseno University Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Simulated KUCCPS Offer Letter generated and marked as downloaded in onboarding state!</span>
            </div>
          )}
        </div>
      )}

      {/* MODE B: Official KUCCPS Website Access */}
      {activeMode === 'official' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Access the Official KUCCPS Student Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              To inspect your official legal placement results or download your stamped KUCCPS admission offer letter, click the official link below. ZeroQ does not harvest or proxy external credentials.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-slate-900 block">
                https://students.kuccps.net
              </span>
              <span className="text-[11px] text-slate-500">
                Official Kenya Universities and Colleges Central Placement Service Web Application
              </span>
            </div>

            <a
              href="https://students.kuccps.net"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <span>View Official KUCCPS Results</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Return to ZeroQ onboarding prompt */}
          <div className="p-5 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 font-bold text-teal-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Return-to-ZeroQ Onboarding Continuity</span>
            </div>
            <p className="text-xs text-teal-800 leading-relaxed">
              Once you have retrieved your official placement letter from KUCCPS, you can upload it into ZeroQ to fast-track your university admissions verification and unlock your Digital Student QR ID.
            </p>
            <button
              onClick={() => onNavigateTab('documents')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Placement Document to ZeroQ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

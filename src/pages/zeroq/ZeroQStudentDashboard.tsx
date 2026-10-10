import React from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  QrCode,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  FileCheck,
  Camera,
  AlertCircle,
  Building2,
  Ticket
} from 'lucide-react';
import {
  KUCCPSPlacementRecord,
  ZeroQApplication,
  ZeroQDocument,
  ZeroQStudentCredential,
  ZeroQCampusVoucher,
  ZeroQOrder,
} from '../../types/zeroq';
import { ZeroQLogo } from '../../components/BrandLogos';
import { CircularGauge } from '../../components/GlassUI';

interface ZeroQStudentDashboardProps {
  placement: KUCCPSPlacementRecord;
  application: ZeroQApplication;
  documents: ZeroQDocument[];
  credential: ZeroQStudentCredential;
  vouchers: ZeroQCampusVoucher[];
  orders: ZeroQOrder[];
  onNavigateTab: (tab: string) => void;
  onOpenApexAI: () => void;
}

export const ZeroQStudentDashboard: React.FC<ZeroQStudentDashboardProps> = ({
  placement,
  application,
  documents,
  credential,
  vouchers,
  orders,
  onNavigateTab,
  onOpenApexAI,
}) => {
  // Calculate dynamic 11-step checklist completion
  const uploadedDocsCount = documents.filter((d) => d.status === 'Uploaded' || d.status === 'Accepted').length;
  const approvedDocsCount = documents.filter((d) => d.status === 'Accepted').length;
  const isAppSubmitted = application.status !== 'Draft';
  const isAppApproved = application.status === 'Approved';
  const isCredentialVerified = credential.status === 'Demo Verified';

  const onboardingSteps = [
    { id: 1, label: 'Student account provisioned', completed: true },
    { id: 2, label: 'KUCCPS placement details matched', completed: true },
    { id: 3, label: 'University & degree programme selected', completed: true },
    { id: 4, label: 'Application submitted to admissions', completed: isAppSubmitted },
    { id: 5, label: 'Required documents uploaded (5 of 5)', completed: uploadedDocsCount >= 5 },
    { id: 6, label: 'Documents reviewed by registrar', completed: approvedDocsCount >= 4 },
    { id: 7, label: 'Admission decision confirmed', completed: isAppApproved },
    { id: 8, label: 'Student declaration completed', completed: true },
    { id: 9, label: 'Face-check demonstration completed', completed: true },
    { id: 10, label: 'University identity verification approved', completed: isCredentialVerified },
    { id: 11, label: 'Digital Student QR Identity active', completed: isCredentialVerified },
  ];

  const completedStepsCount = onboardingSteps.filter((s) => s.completed).length;
  const completionPercentage = Math.round((completedStepsCount / onboardingSteps.length) * 100);

  const activeVouchers = vouchers.filter((v) => v.status === 'Active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Status Hero */}
      <div className="bg-linear-to-r from-slate-950 via-slate-900 to-orange-950 text-white rounded-3xl p-6 sm:p-8 border border-orange-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 z-10">
          <ZeroQLogo size={52} />
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-500/40">
                ZeroQ Onboarding Engine
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300">
                Student Ref: <strong className="font-mono text-white">DEMO-MS-2026-0042</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {placement.studentName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Placed at <strong className="text-white">{placement.institutionName}</strong> for{' '}
              <strong className="text-orange-300">{placement.programmeName}</strong>. 
              Track your paperless admission verification, biometric face-check, and manage your digital campus card.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
          <button
            onClick={() => onNavigateTab('digital-id')}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Open ZeroQ Digital ID</span>
          </button>
          <button
            onClick={onOpenApexAI}
            className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-white/15 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Ask Apex AI</span>
          </button>
        </div>
      </div>

      {/* Dynamic 11-Step Onboarding Engine Card with Circular Dial */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CircularGauge
              value={completionPercentage}
              label="Onboarded"
              sublabel={`${completedStepsCount}/11 STEPS`}
              color="orange"
              size={82}
              strokeWidth={7}
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-orange-600" />
                <span>Onboarding Completion Engine</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Calculated dynamically from verified database records. Complete all steps to activate your official semester digital smart card.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
              {completedStepsCount} of 11 Completed ({completionPercentage}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-orange-500 via-amber-400 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* 11 Steps Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {onboardingSteps.map((step) => (
            <div
              key={step.id}
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                step.completed
                  ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950 font-medium'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  step.completed ? 'text-emerald-600' : 'text-slate-300'
                }`}
              />
              <span className="truncate">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Placement Status */}
        <div
          onClick={() => onNavigateTab('placement')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>KUCCPS Result</span>
            <GraduationCap className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 truncate">
            {placement.placementStatus}
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-1">
            {placement.institutionName}
          </p>
          <span className="text-xs text-violet-600 font-semibold flex items-center gap-1 pt-1">
            <span>View placement details</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Application Status */}
        <div
          onClick={() => onNavigateTab('application')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Admissions Status</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{application.status}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[11px] text-slate-500">
            Ref: {application.id}
          </p>
          <span className="text-xs text-teal-600 font-semibold flex items-center gap-1 pt-1">
            <span>Inspect timeline</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Digital ID QR Status */}
        <div
          onClick={() => onNavigateTab('digital-id')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Digital Student ID</span>
            <QrCode className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {credential.status}
          </div>
          <p className="text-[11px] text-slate-500">
            No.: {credential.studentNumber}
          </p>
          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 pt-1">
            <span>View student card</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Vouchers & Shopping Balance */}
        <div
          onClick={() => onNavigateTab('vouchers')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Vouchers</span>
            <Ticket className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {activeVouchers.length} Active Pass{activeVouchers.length !== 1 ? 'es' : ''}
          </div>
          <p className="text-[11px] text-slate-500">
            Ready for campus merchant scan
          </p>
          <span className="text-xs text-amber-700 font-semibold flex items-center gap-1 pt-1">
            <span>Open voucher QR</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Orientation Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campus Shopping & Marketplace Spotlight */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-violet-600" />
                <span>ZeroQ Campus Marketplace</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-order stationery, lab coats, calculators, and cafeteria vouchers.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1"
            >
              <span>Explore 20+ Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Top Recommended Equipment
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  Casio fx-991EX Scientific Calculator
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Required for Computer Science Calculus & Discrete Math units.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                <span className="font-bold text-sm text-slate-900 font-mono">KSh 1,200</span>
                <button
                  onClick={() => onNavigateTab('marketplace')}
                  className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                >
                  Order
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Student Essentials
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  Semester Stationery Starter Bundle
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Pens, highlighters, folders, and notebook pack at Maseno Hub.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                <span className="font-bold text-sm text-slate-900 font-mono">KSh 500</span>
                <button
                  onClick={() => onNavigateTab('marketplace')}
                  className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Reporting Dates & Campus Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Key Reporting Milestones</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-violet-700 uppercase">
                Reporting Day
              </span>
              <div className="font-bold text-slate-900">Monday, 1st September 2026</div>
              <p className="text-slate-500 text-[11px]">
                In-person reporting at Siriba Campus, Maseno University.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase">
                Orientation Week
              </span>
              <div className="font-bold text-slate-900">1st – 5th September 2026</div>
              <p className="text-slate-500 text-[11px]">
                Faculty briefing, campus tour, and library registration.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase">
                Lectures Begin
              </span>
              <div className="font-bold text-slate-900">Monday, 8th September 2026</div>
              <p className="text-slate-500 text-[11px]">
                First semester coursework commences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

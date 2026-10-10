import React, { useState } from 'react';
import {
  Settings,
  Users,
  FileCheck,
  QrCode,
  Store,
  ShoppingBag,
  Ticket,
  CheckCircle,
  RotateCcw,
  Activity,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { ZeroQAuditLog } from '../../types/zeroq';

interface ZeroQAdminDashboardProps {
  metrics: {
    registeredDemoStudents: number;
    submittedApplications: number;
    applicationsAwaitingReview: number;
    completedOnboardingJourneys: number;
    activeDemoCredentials: number;
    demoMerchants: number;
    demoOrders: number;
    activeVouchers: number;
    successfulRedemptions: number;
  };
  auditLogs: ZeroQAuditLog[];
  onResetDemoData: () => void;
}

export const ZeroQAdminDashboard: React.FC<ZeroQAdminDashboardProps> = ({
  metrics,
  auditLogs,
  onResetDemoData,
}) => {
  const [resetFeedback, setResetFeedback] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleConfirmReset = () => {
    setShowConfirmReset(false);
    onResetDemoData();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-violet-400 bg-violet-950 px-2.5 py-0.5 rounded uppercase tracking-wider border border-violet-800">
              System Console
            </span>
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
              ZEROQ PLATFORM ADMIN
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            ZeroQ Administration & Audit Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Platform health, credential issuance telemetry, audit log tracking, and demo reset controls.
          </p>
        </div>

        {showConfirmReset ? (
          <div className="bg-rose-50 border border-rose-300 p-3 rounded-2xl flex items-center gap-3">
            <div className="text-xs font-medium text-rose-900">
              Reset all ZeroQ demo data to initial pristine seed state?
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data to Seed State</span>
          </button>
        )}
      </div>

      {resetFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>All ZeroQ demo collections reset successfully to original seeded state.</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-violet-600" />
            <span>Students Seeded</span>
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {metrics.registeredDemoStudents}
          </div>
          <span className="text-[10px] text-slate-400">Brian Otieno (KCSE 2025)</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Submitted Applications</span>
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {metrics.submittedApplications}
          </div>
          <span className="text-[10px] text-slate-400">{metrics.applicationsAwaitingReview} pending review</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>Active QR Credentials</span>
          </span>
          <div className="text-2xl font-extrabold text-indigo-600 font-mono">
            {metrics.activeDemoCredentials}
          </div>
          <span className="text-[10px] text-slate-400">Verified student cards</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span>Partner Merchants</span>
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {metrics.demoMerchants}
          </div>
          <span className="text-[10px] text-slate-400">Campus stores active</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-violet-600" />
            <span>Total Orders</span>
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {metrics.demoOrders}
          </div>
          <span className="text-[10px] text-slate-400">M-Pesa simulated checkouts</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Vouchers</span>
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {metrics.activeVouchers}
          </div>
          <span className="text-[10px] text-slate-400">Unredeemed passes</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Redeemed Vouchers</span>
          </span>
          <div className="text-2xl font-extrabold text-teal-700 font-mono">
            {metrics.successfulRedemptions}
          </div>
          <span className="text-[10px] text-slate-400">Fulfilled collections</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            <span>Onboarded Students</span>
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {metrics.completedOnboardingJourneys}
          </div>
          <span className="text-[10px] text-slate-400">100% journey completion</span>
        </div>
      </div>

      {/* Audit Log Trail */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-600" />
          <span>Real-Time Audit Event Trail ({auditLogs.length} Records)</span>
        </h2>
        <p className="text-xs text-slate-500">
          Records every administrative decision, student upload, simulated payment, and voucher scan atomically.
        </p>

        <div className="divide-y divide-slate-100 text-xs overflow-x-auto">
          {auditLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-violet-700">{log.action}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-800 font-semibold">{log.actorRole} ({log.actorName})</span>
                </div>
                <div className="text-slate-600">{log.details}</div>
                <div className="text-[11px] font-mono text-slate-400">Target: {log.target}</div>
              </div>

              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Download,
  Share2,
  Sparkles,
  Eye,
  X,
  Smartphone
} from 'lucide-react';
import { ZeroQStudentCredential } from '../../types/zeroq';
import { generateQRCodeDataUrl } from '../../utils/qrGenerator';
import { ZeroQLogo } from '../../components/BrandLogos';

interface ZeroQDigitalStudentIDProps {
  credential: ZeroQStudentCredential;
  onNavigateTab: (tab: string) => void;
  onOpenApexAI: () => void;
}

export const ZeroQDigitalStudentID: React.FC<ZeroQDigitalStudentIDProps> = ({
  credential,
  onNavigateTab,
  onOpenApexAI,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

  useEffect(() => {
    generateQRCodeDataUrl(credential.qrPayload, { width: 280, margin: 1 }).then(
      (url) => setQrDataUrl(url)
    );
  }, [credential.qrPayload]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded uppercase tracking-wider border border-teal-500/30">
          Smart Student Identity
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ZeroQ Digital Student Credential
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          One universal QR pass for library borrowing, examination halls, cafeteria vouchers, and campus merchant discounts.
        </p>
      </div>

      {/* Visually Impressive Digital Student Card */}
      <div className="max-w-md mx-auto">
        <div className="bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-2xl text-white space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top Strip: Logos & Institution */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <ZeroQLogo size={32} />
              <div>
                <span className="font-black text-sm tracking-tight text-white block">ZeroQ Smart Pass</span>
                <span className="text-[10px] text-orange-400 font-semibold uppercase">Official Student Credential</span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {credential.status}
            </span>
          </div>

          {/* Student Info & Portrait */}
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-teal-400/60 bg-slate-800 shrink-0 shadow-md">
              <img
                src={credential.photoUrl}
                alt={credential.studentName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">
                {credential.studentName}
              </h2>
              <div className="text-xs font-semibold text-teal-300 truncate">
                {credential.universityName}
              </div>
              <div className="text-xs text-slate-300 truncate">
                {credential.programmeName}
              </div>
              <div className="pt-1">
                <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800/90 px-2.5 py-0.5 rounded border border-slate-700">
                  {credential.studentNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Scannable Real QR Code Container */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-slate-900 shadow-inner relative z-10">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Student Identity QR Code"
                className="w-48 h-48 object-contain rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}
            <span className="text-[10px] font-mono text-slate-500 mt-2 font-medium">
              ENC: {credential.credentialId}
            </span>
          </div>

          {/* Card Footer: Issuing details & demonstration label */}
          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1 text-center relative z-10">
            <div className="flex items-center justify-between text-slate-400">
              <span>Issued: {credential.issueDate}</span>
              <span>Valid Thru: {credential.expiryDate}</span>
            </div>
            <div className="text-amber-300 font-bold tracking-wider pt-1 uppercase">
              DEMONSTRATION CREDENTIAL — NOT AN OFFICIAL UNIVERSITY ID
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setShowVerificationModal(true)}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Eye className="w-4 h-4 text-teal-400" />
          <span>Simulate Scanner Verification</span>
        </button>

        <button
          onClick={() => onNavigateTab('marketplace')}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>Use ID For Campus Discounts</span>
        </button>
      </div>

      {/* Modal: Simulated Institutional Verification View */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  ZeroQ Verified Credential Inspection
                </h3>
              </div>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Simulated gate / library scanner outcome when scanning Brian's QR Code.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Credential Status:</span>
                <span className="font-bold text-emerald-700">ACTIVE & VERIFIED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{credential.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Institution:</span>
                <span className="font-bold text-slate-900">{credential.universityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Programme:</span>
                <span className="font-bold text-slate-900">{credential.programmeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registration Number:</span>
                <span className="font-mono font-bold text-slate-900">{credential.studentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Validity:</span>
                <span className="font-mono text-slate-800">{credential.issueDate} – {credential.expiryDate}</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-[11px] text-teal-900 space-y-1">
              <strong>Privacy Protection Guarantee:</strong>
              <p>
                Private grades, National ID numbers, and contact details are not embedded in the public QR payload.
              </p>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close Verification Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

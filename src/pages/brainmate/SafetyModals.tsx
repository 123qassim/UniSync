/**
 * BrainMate Safety & Moderation Dialogs
 * Transparent, peer-safe community tools: Block, Report, and Institutional Moderation Queue.
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Ban,
  Flag,
  X,
  CheckCircle,
  AlertTriangle,
  UserX,
  Lock,
  Eye,
  Check,
} from 'lucide-react';
import { UserReport } from '../../data/brainmateMockData.ts';

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: { id: string; name: string } | null;
  onConfirmBlock: (userId: string, userName: string) => Promise<void>;
}

export const BlockModal: React.FC<BlockModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onConfirmBlock,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleBlock = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmBlock(targetUser.id, targetUser.name);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Block {targetUser.name}?</h3>
              <p className="text-xs text-slate-400">Peer safety & mutual boundary enforcement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <p className="font-medium text-slate-200">What happens when you block this peer:</p>
          <ul className="space-y-1.5 list-disc list-inside text-slate-400">
            <li>They will immediately stop appearing in your Discover feed.</li>
            <li>You will stop appearing in their search and candidate rankings.</li>
            <li>All active or pending connection requests are revoked.</li>
            <li>They will be removed from any study groups you host.</li>
            <li>No notification is sent to them disclosing that you blocked them.</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleBlock}
            className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors shadow-lg shadow-rose-900/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Blocking...' : 'Confirm Block'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: { id: string; name: string } | null;
  groupContext?: { id: string; name: string };
  onSubmitReport: (data: {
    reportedId: string;
    reportedName: string;
    groupId?: string;
    groupName?: string;
    reason: 'academic_dishonesty' | 'harassment' | 'inappropriate_content' | 'spam_or_solicitation' | 'impersonation' | 'other';
    details: string;
  }) => Promise<void>;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  groupContext,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<'academic_dishonesty' | 'harassment' | 'inappropriate_content' | 'spam_or_solicitation' | 'impersonation' | 'other'>('academic_dishonesty');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitReport({
        reportedId: targetUser.id,
        reportedName: targetUser.name,
        groupId: groupContext?.id,
        groupName: groupContext?.name,
        reason,
        details,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onClose();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Submit Academic Safety Report</h3>
              <p className="text-xs text-slate-400">Reporting: <span className="text-teal-300 font-medium">{targetUser.name}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-emerald-200">Report Submitted</h4>
            <p className="text-xs text-emerald-300/80">
              Thank you for keeping UniSync academic spaces safe. Institutional moderation staff has received this ticket.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Primary Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
              >
                <option value="academic_dishonesty">Academic Dishonesty / Plagiarism Solicitation</option>
                <option value="harassment">Harassment or Unwanted Communication</option>
                <option value="inappropriate_content">Inappropriate or Offensive Study Material</option>
                <option value="spam_or_solicitation">Spam, Essay Services or Commercial Solicitation</option>
                <option value="impersonation">Identity Impersonation / Fake University Credentials</option>
                <option value="other">Other Violation of Academic Code of Conduct</option>
              </select>
            </div>

            {groupContext && (
              <div className="px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                Context: Study Group <span className="text-slate-200 font-medium">"{groupContext.name}"</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Detailed Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what occurred with specific academic context, dates, or chat excerpts..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Reports are audited under institutional privacy standards.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !details.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors shadow-lg shadow-amber-900/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface ModerationQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: UserReport[];
}

export const ModerationQueueModal: React.FC<ModerationQueueModalProps> = ({
  isOpen,
  onClose,
  reports,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl text-white max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Institutional Moderation Queue</h3>
              <p className="text-xs text-slate-400">Scoped to Maseno University academic oversight staff</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 pr-1 grow">
          {reports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No open reports in the institutional queue.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-rose-400 uppercase tracking-wider text-[10px]">
                      {rep.reason.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">Reported: <strong className="text-slate-200">{rep.reportedName}</strong></span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    {rep.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  "{rep.details}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Filed by: {rep.reporterName}</span>
                  <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            Close Queue
          </button>
        </div>
      </div>
    </div>
  );
};

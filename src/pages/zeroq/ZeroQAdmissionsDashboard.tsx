import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  Eye,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ZeroQApplication, ZeroQDocument, ApplicationStatus, DocumentReviewStatus } from '../../types/zeroq';

interface ZeroQAdmissionsDashboardProps {
  applications: ZeroQApplication[];
  documents: ZeroQDocument[];
  onUpdateAppStatus: (appId: string, status: ApplicationStatus, note: string) => void;
  onUpdateDocStatus: (docId: string, status: DocumentReviewStatus, comments: string) => void;
}

export const ZeroQAdmissionsDashboard: React.FC<ZeroQAdmissionsDashboardProps> = ({
  applications,
  documents,
  onUpdateAppStatus,
  onUpdateDocStatus,
}) => {
  const [selectedApp, setSelectedApp] = useState<ZeroQApplication>(applications[0]);
  const [decisionNote, setDecisionNote] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleDecision = (status: ApplicationStatus) => {
    const note = decisionNote.trim() || `Admissions decision: ${status}`;
    onUpdateAppStatus(selectedApp.id, status, note);
    setFeedbackMsg(`Application ${selectedApp.id} updated to "${status}".`);
    setDecisionNote('');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleDocReview = (docId: string, status: DocumentReviewStatus) => {
    onUpdateDocStatus(docId, status, `Reviewed by Admissions Officer on ${new Date().toLocaleDateString()}`);
    setFeedbackMsg(`Document status updated to "${status}".`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-violet-400 bg-violet-950 px-2.5 py-0.5 rounded uppercase tracking-wider border border-violet-800">
            Admissions Desk
          </span>
          <span className="text-xs text-slate-500 font-medium">Registrar (Academic & Student Affairs)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          University Admissions Review Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review prospective candidate submissions, verify documents, and issue official admission decisions for Digital Student ID provisioning.
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Applications ({applications.length})
          </h2>

          <div className="space-y-3">
            {applications.map((app) => {
              const isSelected = selectedApp.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/40 ring-2 ring-violet-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-violet-700">{app.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{app.studentName}</h3>
                    <p className="text-xs text-slate-500">{app.programmeName}</p>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Submitted: {new Date(app.submissionTimestamp || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Application Details & Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Candidate Dossier</span>
                <h2 className="text-xl font-bold text-slate-900">{selectedApp.studentName}</h2>
                <p className="text-xs text-slate-500">KCSE Index: {selectedApp.academicInfo.indexNumber}</p>
              </div>

              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                selectedApp.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}>
                Current: {selectedApp.status}
              </span>
            </div>

            {/* Academic & Bio-data Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <div>Email: <strong>{selectedApp.personalInfo.email}</strong></div>
              <div>Phone: <strong>{selectedApp.personalInfo.phone}</strong></div>
              <div>Mean Grade: <strong>{selectedApp.academicInfo.meanGrade}</strong></div>
              <div>School: <strong>{selectedApp.academicInfo.schoolAttended}</strong></div>
            </div>

            {/* Documents Verification Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Submitted Documents Verification ({documents.length})
              </h3>

              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{doc.documentType}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{doc.fileName}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        doc.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {doc.status}
                      </span>

                      <button
                        onClick={() => handleDocReview(doc.id, 'Accepted')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDocReview(doc.id, 'Resubmission Required')}
                        className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[11px] font-semibold border border-rose-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Admission Decision Controls */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Record Official Admission Decision
              </h3>

              <input
                type="text"
                placeholder="Optional reviewer notes e.g. Validated against official KNEC 2025 records..."
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-violet-500"
              />

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleDecision('Approved')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Issue Admission</span>
                </button>

                <button
                  onClick={() => handleDecision('More Information Required')}
                  className="px-4 py-2.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 font-bold text-xs rounded-xl transition-colors"
                >
                  Request Resubmission
                </button>

                <button
                  onClick={() => handleDecision('Rejected')}
                  className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 font-bold text-xs rounded-xl transition-colors"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

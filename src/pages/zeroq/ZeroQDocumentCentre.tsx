import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  RefreshCw,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { ZeroQDocument } from '../../types/zeroq';

interface ZeroQDocumentCentreProps {
  documents: ZeroQDocument[];
  onUploadDocument: (docType: ZeroQDocument['documentType'], fileName: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ZeroQDocumentCentre: React.FC<ZeroQDocumentCentreProps> = ({
  documents,
  onUploadDocument,
  onNavigateTab,
}) => {
  const [selectedDocToUpload, setSelectedDocToUpload] = useState<ZeroQDocument['documentType'] | null>(null);
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocToUpload) return;

    const name = simulatedFileName.trim() || `${selectedDocToUpload.toLowerCase().replace(/ /g, '_')}_brian_otieno.pdf`;
    onUploadDocument(selectedDocToUpload, name);
    setUploadFeedback(`Document "${name}" uploaded successfully for registrar review.`);
    setSelectedDocToUpload(null);
    setSimulatedFileName('');
    setTimeout(() => setUploadFeedback(null), 4000);
  };

  const getStatusBadge = (status: ZeroQDocument['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Verified & Accepted
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-lg">
            <Clock className="w-3 h-3 text-teal-600" />
            Under Review
          </span>
        );
      case 'Resubmission Required':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Resubmission Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
            Uploaded
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-violet-400 bg-violet-950 px-2 py-0.5 rounded uppercase tracking-wider">
            Verification Vault
          </span>
          <span className="text-xs text-slate-500 font-medium">Maseno University Admissions</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Admissions Document Centre
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Upload and track the verification status of mandatory government admission records. In demo mode, synthetic dummy files are accepted and reviewed in real time.
        </p>
      </div>

      {uploadFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* Documents Table / Card List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-violet-600" />
              <span>Mandatory Checklist Items ({documents.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Required by the Registrar of Academic Affairs for Digital Student Card issuance.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-violet-600 shrink-0" />
                  <span className="font-bold text-slate-900 text-sm">{doc.documentType}</span>
                  {getStatusBadge(doc.status)}
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pl-7">
                  <span className="font-mono text-slate-700">{doc.fileName || 'Pending upload'}</span>
                  <span>·</span>
                  <span>{doc.fileSize || 'Standard PDF'}</span>
                  <span>·</span>
                  <span>Uploaded {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</span>
                </div>

                {doc.reviewerComments && (
                  <div className="pl-7 text-xs text-slate-600 italic">
                    <strong className="text-slate-800 not-italic">Admissions Comment: </strong>
                    {doc.reviewerComments}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto pl-7 sm:pl-0">
                <button
                  type="button"
                  onClick={() => setSelectedDocToUpload(doc.documentType)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{doc.fileName ? 'Replace File' : 'Upload'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Upload Modal */}
      {selectedDocToUpload && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div>
              <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wide">
                Simulated File Upload
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Upload {selectedDocToUpload}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ZeroQ supports PDF, JPG, and PNG files up to 5MB.
              </p>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  File Name / Attachment Description
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${selectedDocToUpload.toLowerCase().replace(/ /g, '_')}_scanned.pdf`}
                  value={simulatedFileName}
                  onChange={(e) => setSimulatedFileName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-1">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Simulated File Attachment Ready
                </span>
                <span className="text-[10px] text-slate-500">
                  Demo file size: ~480 KB (SHA-256 Authenticated)
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocToUpload(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

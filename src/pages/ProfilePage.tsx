import React, { useState } from 'react';
import {
  User,
  Shield,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  Lock,
  LogOut,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { StudentProfile, StudentConsent } from '../types';
import { apiFetch } from '../lib/apiClient.ts';
import { DemoDataBadge } from '../components/DemoDataBadge';

interface ProfilePageProps {
  currentUser: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onSignOut: () => void;
  onNavigate: (route: string) => void;
  onOpenApexAI: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onUpdateProfile,
  onSignOut,
  onNavigate,
  onOpenApexAI,
}) => {
  const [consent, setConsent] = useState<StudentConsent>(currentUser.consent);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [careerGoals, setCareerGoals] = useState(currentUser.careerGoals || '');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleSaveConsent = async () => {
    try {
      const response = await apiFetch('/api/profile/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consent),
      });

      if (response.ok) {
        onUpdateProfile({ consent, displayName, careerGoals });
        setFeedbackMsg('Your profile and privacy consent preferences have been updated.');
        setTimeout(() => setFeedbackMsg(null), 4000);
      }
    } catch (err) {
      onUpdateProfile({ consent, displayName, careerGoals });
      setFeedbackMsg('Updated locally for current session.');
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteVoluntaryData = async () => {
    setShowDeleteConfirm(false);
    try {
      await apiFetch('/api/profile/data', { method: 'DELETE' });
      onUpdateProfile({
        units: currentUser.units.map((u) => ({ ...u, mark: undefined })),
        interests: [],
        skillsToDevelop: [],
        careerGoals: '',
        consent: {
          allowMarkStorage: false,
          allowBrainMatePeerMatching: false,
          allowPublicProfileVisibility: false,
          lastUpdated: new Date().toISOString(),
        },
      });
      setFeedbackMsg('All voluntarily supplied marks and preferences have been wiped.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Student Account
            </span>
            <DemoDataBadge label="Isolated Profile Store" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Profile & Privacy Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your personal academic records, explicit data-sharing consents, and account controls.
          </p>
        </div>

        <button
          onClick={onSignOut}
          className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Profile Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Student Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1 text-xs">
            Personal Career Ambitions & Notes
          </label>
          <textarea
            rows={2}
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Explicit Consent Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Explicit Consent Permissions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            UniPath complies with student privacy principles: you have granular control over how your voluntary records are used.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={consent.allowMarkStorage}
              onChange={(e) =>
                setConsent((prev) => ({ ...prev, allowMarkStorage: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-900">
                Allow Persistent Storage of Voluntary Academic Marks
              </span>
              <p className="text-slate-500 leading-relaxed">
                When disabled, unit marks exist only in your browser's temporary session and are never saved to the server database.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={consent.allowBrainMatePeerMatching}
              onChange={(e) =>
                setConsent((prev) => ({ ...prev, allowBrainMatePeerMatching: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-900">
                Enable BrainMate Peer Study-Partner Recommendations
              </span>
              <p className="text-slate-500 leading-relaxed">
                Allows BrainMate to match you with peers studying identical syllabus units. Contact details remain completely private until you mutually accept.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={consent.allowPublicProfileVisibility}
              onChange={(e) =>
                setConsent((prev) => ({ ...prev, allowPublicProfileVisibility: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-900">
                Public Directory Visibility
              </span>
              <p className="text-slate-500 leading-relaxed">
                Allows your display name to appear in the course study hub directory for your enrolled degree.
              </p>
            </div>
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveConsent}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences & Consent</span>
          </button>
        </div>
      </div>

      {/* Voluntary Data Deletion / Revocation */}
      <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-base font-bold text-rose-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Right to be Forgotten & Voluntary Data Revocation</span>
          </h2>
          <p className="text-xs text-rose-800/80 mt-1 leading-relaxed">
            You can revoke consent and permanently wipe all self-reported marks and personal preferences from the system.
          </p>
        </div>

        {showDeleteConfirm ? (
          <div className="bg-white p-4 rounded-xl border border-rose-300 space-y-3">
            <p className="text-xs font-semibold text-rose-950">
              Are you sure? This will permanently wipe all self-reported marks and reset career preferences.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteVoluntaryData}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                Yes, Confirm Wipe
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Wipe All Submitted Marks & Preferences
          </button>
        )}
      </div>
    </div>
  );
};

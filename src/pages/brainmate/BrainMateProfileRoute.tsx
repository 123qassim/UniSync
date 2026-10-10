/**
 * BrainMate Profile Route Entry Point
 * Accessible at `/app/brainmate/profile`
 * 
 * Embeds the multi-step React Hook Form and Zod-based learning profile editor component,
 * fetching current student learning profile state and persisting changes to `/api/brainmate/profile`.
 */

import React, { useState, useEffect } from 'react';
import { LearningProfileEditor } from './LearningProfileEditor.tsx';
import type { StudentLearningProfile } from '../../lib/brainmate/matching.ts';
import { DEFAULT_STUDENT_LEARNING_PROFILE } from '../../data/brainmateMockData.ts';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export interface BrainMateProfileRouteProps {
  onNavigateBack?: () => void;
  onOpenApexAI?: (prompt?: string) => void;
}

export const BrainMateProfileRoute: React.FC<BrainMateProfileRouteProps> = ({
  onNavigateBack,
  onOpenApexAI,
}) => {
  const [profile, setProfile] = useState<StudentLearningProfile>(DEFAULT_STUDENT_LEARNING_PROFILE);
  const [completeness, setCompleteness] = useState<number>(85);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/brainmate/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setCompleteness(data.completeness);
      }
    } catch {
      // Fallback to initial mock profile
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (updated: Partial<StudentLearningProfile>) => {
    try {
      const res = await fetch('/api/brainmate/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setCompleteness(data.completeness);
        setNotification({
          message: 'Learning profile published! Recalculating peer compatibility...',
          type: 'success',
        });
        setTimeout(() => setNotification(null), 3500);
      } else {
        setNotification({
          message: 'Failed to update profile. Please verify required fields.',
          type: 'error',
        });
      }
    } catch {
      setProfile((prev) => ({ ...prev, ...updated }));
      setNotification({
        message: 'Profile saved (local offline mode).',
        type: 'success',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
        <span className="text-sm">Loading your BrainMate learning profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb / Top Bar */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateBack || (() => window.history.back())}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to BrainMate Hub
          </button>
          <span className="text-xs text-slate-600">/app/brainmate/profile</span>
        </div>

        {onOpenApexAI && (
          <button
            type="button"
            onClick={() => onOpenApexAI('Can you review my study profile strengths and recommend optimal peer study habits?')}
            className="flex items-center gap-2 text-xs font-medium text-teal-300 hover:text-teal-200 transition-colors px-3 py-1.5 rounded-lg bg-teal-950/40 border border-teal-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Ask Apex AI to Audit Profile
          </button>
        )}
      </div>

      {notification && (
        <div className="max-w-6xl mx-auto mb-6 p-4 rounded-xl border text-xs flex items-center gap-2.5 transition-all bg-emerald-950/40 border-emerald-500/30 text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Embedded Multi-step Form */}
      <LearningProfileEditor
        initialProfile={profile}
        completeness={completeness}
        onSaveProfile={handleSaveProfile}
        onCancel={onNavigateBack || (() => window.history.back())}
      />
    </div>
  );
};

export default BrainMateProfileRoute;

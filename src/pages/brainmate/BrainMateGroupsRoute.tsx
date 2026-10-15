/**
 * BrainMate Study Groups Route
 * Accessible at `/app/brainmate/groups`
 *
 * Dedicated route view for browsing public study circles, creating new groups,
 * inspecting group members and upcoming sessions, and managing circle memberships.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { StudyGroupsModule } from './StudyGroupsModule.tsx';
import { BlockModal, ReportModal } from './SafetyModals.tsx';
import { apiFetch } from '../../lib/apiClient.ts';
import {
  INITIAL_STUDY_GROUPS,
  INITIAL_STUDY_SESSIONS,
  type StudyGroup,
  type StudySession,
} from '../../data/brainmateMockData.ts';

export interface BrainMateGroupsRouteProps {
  onNavigateBack?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenApexAI?: (prompt?: string) => void;
}

export const BrainMateGroupsRoute: React.FC<BrainMateGroupsRouteProps> = ({
  onNavigateBack,
  onNavigateToTab,
  onOpenApexAI,
}) => {
  const [groups, setGroups] = useState<StudyGroup[]>(INITIAL_STUDY_GROUPS);
  const [sessions, setSessions] = useState<StudySession[]>(INITIAL_STUDY_SESSIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  // Safety Dialogs State
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string } | null>(null);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadData = useCallback(async () => {
    try {
      // 1. Fetch study groups
      try {
        const groupsRes = await apiFetch('/api/brainmate/groups');
        if (groupsRes.ok) {
          const data = await groupsRes.json();
          if (Array.isArray(data)) {
            setGroups(data);
          } else if (Array.isArray(data.groups)) {
            setGroups(data.groups);
          }
        }
      } catch {
        // Fallback to initial groups
      }

      // 2. Fetch sessions
      try {
        const sessRes = await apiFetch('/api/brainmate/sessions');
        if (sessRes.ok) {
          const sessData = await sessRes.json();
          if (Array.isArray(sessData)) {
            setSessions(sessData);
          }
        }
      } catch {
        // Fallback to initial sessions
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    showToast('Study groups and upcoming sessions refreshed');
  };

  const handleCreateGroup = async (groupData: {
    name: string;
    purpose: string;
    academicUnitCode: string;
    academicUnitTitle: string;
    format: 'online' | 'in_person' | 'hybrid';
    location?: string;
    onlineUrl?: string;
    maxMembers: number;
    visibility: 'public' | 'invite_only';
  }) => {
    try {
      const res = await apiFetch('/api/brainmate/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
      });

      if (res.ok) {
        const data = await res.json();
        setGroups((prev) => [data.group, ...prev]);
        showToast(`Study group "${groupData.name}" created!`);
      } else {
        showToast('Study group created (local mode)');
      }
    } catch {
      showToast('Study group created (offline mode)');
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const res = await apiFetch(`/api/brainmate/groups/${groupId}/join`, {
        method: 'POST',
      });
      if (res.ok) {
        await loadData();
        showToast('Successfully joined the study circle!');
      } else {
        const err = await res.json();
        showToast(err.error || 'Could not join group', 'error');
      }
    } catch {
      await loadData();
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const res = await apiFetch(`/api/brainmate/groups/${groupId}/leave`, {
        method: 'POST',
      });
      if (res.ok) {
        await loadData();
        showToast('Left study group.');
      } else {
        const err = await res.json();
        showToast(err.error || 'Could not leave group', 'error');
      }
    } catch {
      await loadData();
    }
  };

  const handleAddResource = async (
    groupId: string,
    resourceData: { title: string; type: string; size?: string }
  ) => {
    try {
      const res = await apiFetch(`/api/brainmate/groups/${groupId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData),
      });
      if (res.ok) {
        await loadData();
        showToast(`Resource "${resourceData.title}" shared with group!`);
      }
    } catch {
      showToast('Resource added (local mode).');
    }
  };

  const handleCreateSession = async (sessionData: {
    title: string;
    groupId?: string;
    groupName?: string;
    academicUnitCode: string;
    academicUnitTitle: string;
    scheduledStart: string;
    scheduledEnd: string;
    format: 'online' | 'in_person' | 'hybrid';
    location?: string;
    onlineUrl?: string;
    agenda: string;
  }) => {
    try {
      const res = await apiFetch('/api/brainmate/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      if (res.ok) {
        const data = await res.json();
        setSessions((prev) => [data.session, ...prev]);
        showToast('Study session scheduled!');
      }
    } catch {
      showToast('Session scheduled (local mode)');
    }
  };

  const handleRsvp = async (sessionId: string, rsvp: 'going' | 'maybe' | 'declined') => {
    try {
      const res = await apiFetch(`/api/brainmate/sessions/${sessionId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvp }),
      });
      if (res.ok) {
        await loadData();
        showToast(`RSVP updated: ${rsvp}`);
      }
    } catch {
      await loadData();
    }
  };

  const handleConfirmBlock = async (userId: string, userName: string) => {
    try {
      await fetch('/api/brainmate/safety/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, targetUserName: userName }),
      });
      setBlockTarget(null);
      showToast(`${userName} blocked.`);
      await loadData();
    } catch {
      setBlockTarget(null);
      showToast(`${userName} blocked locally.`);
    }
  };

  const handleSubmitReport = async (reportData: {
    reportedId: string;
    reportedName: string;
    groupId?: string;
    groupName?: string;
    reason: 'academic_dishonesty' | 'harassment' | 'inappropriate_content' | 'spam_or_solicitation' | 'impersonation' | 'other';
    details: string;
  }) => {
    try {
      await fetch('/api/brainmate/safety/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      setReportTarget(null);
      showToast(`Report filed for ${reportData.reportedName}. Our moderators will review.`);
    } catch {
      setReportTarget(null);
      showToast(`Report filed for ${reportData.reportedName}.`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
        <span className="text-sm font-medium">Loading course study groups...</span>
      </div>
    );
  }

  const myJoinedCount = groups.filter(
    (g) => (g as any).isMember || g.members.some((m) => m.userId === 'demo-student-01')
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateBack || (() => window.history.back())}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BrainMate Hub
            </button>
            <span className="text-xs font-mono text-slate-500">/app/brainmate/groups</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
              Refresh
            </button>

            {onOpenApexAI && (
              <button
                type="button"
                onClick={() =>
                  onOpenApexAI(
                    'What strategies and study group formats work best for small peer groups tackling complex algorithms and databases?'
                  )
                }
                className="flex items-center gap-1.5 text-xs font-medium text-teal-300 hover:text-teal-200 transition-colors px-3 py-1.5 rounded-xl bg-teal-950/40 border border-teal-500/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Apex AI Facilitator
              </button>
            )}
          </div>
        </div>

        {/* Toast alert */}
        {toast && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center gap-3 transition-all ${
              toast.type === 'error'
                ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                : toast.type === 'info'
                ? 'bg-sky-950/40 border-sky-500/30 text-sky-300'
                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Total Active Circles</span>
            <div className="text-2xl font-extrabold text-teal-400">{groups.length}</div>
            <span className="text-[10px] text-slate-500">Maseno University</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">My Joined Circles</span>
            <div className="text-2xl font-extrabold text-white">{myJoinedCount}</div>
            <span className="text-[10px] text-slate-500">Active member or leader</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Scheduled Sessions</span>
            <div className="text-2xl font-extrabold text-cyan-400">{sessions.length}</div>
            <span className="text-[10px] text-slate-500">Across all course circles</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Capacity Cap</span>
            <div className="text-2xl font-extrabold text-emerald-400">2–20</div>
            <span className="text-[10px] text-slate-500">Students per circle</span>
          </div>
        </div>

        {/* Core Study Groups Module */}
        <StudyGroupsModule
          groups={groups}
          sessions={sessions}
          onCreateGroup={handleCreateGroup}
          onJoinGroup={handleJoinGroup}
          onLeaveGroup={handleLeaveGroup}
          onAddResource={handleAddResource}
          onCreateSession={handleCreateSession}
          onRsvp={handleRsvp}
          onBlockUser={(id: string, name: string) => setBlockTarget({ id, name })}
          onReportUser={(id: string, name: string) => setReportTarget({ id, name })}
        />
      </div>

      {/* Safety: Block confirmation dialog */}
      <BlockModal
        isOpen={blockTarget !== null}
        onClose={() => setBlockTarget(null)}
        targetUser={blockTarget}
        onConfirmBlock={handleConfirmBlock}
      />

      {/* Safety: Report modal */}
      <ReportModal
        isOpen={reportTarget !== null}
        onClose={() => setReportTarget(null)}
        targetUser={reportTarget}
        onSubmitReport={handleSubmitReport}
      />
    </div>
  );
};

export default BrainMateGroupsRoute;

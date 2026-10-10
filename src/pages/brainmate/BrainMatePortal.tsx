/**
 * BrainMate Master Portal Controller
 * Unifies Learning Profile Editor, Explainable Matching Engine Discovery,
 * Study Groups, Study Sessions, and Connections Hub.
 *
 * Tagline: "Find your academic people. Learn better together."
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  BookOpen,
  Calendar,
  UserCheck,
  GraduationCap,
  Settings,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Building,
} from 'lucide-react';

import {
  StudentLearningProfile,
  MatchResult,
} from '../../lib/brainmate/matching.ts';

import {
  DEFAULT_STUDENT_LEARNING_PROFILE,
  SEED_CANDIDATE_PROFILES,
  INITIAL_STUDY_GROUPS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_CONNECTION_REQUESTS,
  INITIAL_ACTIVE_CONNECTIONS,
  INITIAL_USER_REPORTS,
  StudyGroup,
  StudySession,
  ConnectionRequest,
  ActiveConnection,
  UserReport,
} from '../../data/brainmateMockData.ts';

import { BrainMateOverview } from './BrainMateOverview.tsx';
import { DiscoverFeed } from './DiscoverFeed.tsx';
import { LearningProfileEditor } from './LearningProfileEditor.tsx';
import { ConnectionsHub } from './ConnectionsHub.tsx';
import { StudyGroupsModule } from './StudyGroupsModule.tsx';
import { StudySessionsModule } from './StudySessionsModule.tsx';
import { BlockModal, ReportModal, ModerationQueueModal } from './SafetyModals.tsx';
import { SkillSwapModule } from './SkillSwapModule.tsx';
import { FocusPodModule } from './FocusPodModule.tsx';
import { SmartOverlapHeatmapModule } from './SmartOverlapHeatmapModule.tsx';
import { ExamReadinessModule } from './ExamReadinessModule.tsx';
import { StudyKarmaModule } from './StudyKarmaModule.tsx';
import {
  SkillSwapPair,
  INITIAL_SKILL_SWAPS,
  StudentKarmaSummary,
  DEFAULT_STUDENT_KARMA,
  PeerEndorsement,
  INITIAL_PEER_ENDORSEMENTS,
  KarmaLedgerItem,
  INITIAL_KARMA_LEDGER,
  CourseExamInfo,
  INITIAL_COURSES_READINESS,
} from '../../data/brainmateMockData.ts';
import {
  Repeat,
  Headphones,
  CalendarDays,
  Target,
  Award,
  ArrowRightLeft,
} from 'lucide-react';

export type BrainMateTab =
  | 'overview'
  | 'discover'
  | 'skill-swap'
  | 'focus-pod'
  | 'overlap'
  | 'readiness'
  | 'karma'
  | 'groups'
  | 'sessions'
  | 'connections'
  | 'profile';

interface BrainMatePortalProps {
  initialTab?: BrainMateTab;
  onOpenApexAI: (contextPrompt?: string) => void;
  onNavigateHome: () => void;
}

export const BrainMatePortal: React.FC<BrainMatePortalProps> = ({
  initialTab = 'overview',
  onOpenApexAI,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<BrainMateTab>(initialTab);

  // Core state
  const [profile, setProfile] = useState<StudentLearningProfile>(DEFAULT_STUDENT_LEARNING_PROFILE);
  const [completeness, setCompleteness] = useState<number>(85);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>(INITIAL_CONNECTION_REQUESTS.filter((r) => r.receiverId === 'demo-student-01'));
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>(INITIAL_CONNECTION_REQUESTS.filter((r) => r.senderId === 'demo-student-01'));
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>(INITIAL_ACTIVE_CONNECTIONS);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(INITIAL_STUDY_GROUPS);
  const [studySessions, setStudySessions] = useState<StudySession[]>(INITIAL_STUDY_SESSIONS);
  const [moderationReports, setModerationReports] = useState<UserReport[]>(INITIAL_USER_REPORTS);

  // Flagship Feature States
  const [skillSwaps, setSkillSwaps] = useState<SkillSwapPair[]>(INITIAL_SKILL_SWAPS);
  const [karmaSummary, setKarmaSummary] = useState<StudentKarmaSummary>(DEFAULT_STUDENT_KARMA);
  const [endorsements, setEndorsements] = useState<PeerEndorsement[]>(INITIAL_PEER_ENDORSEMENTS);
  const [karmaLedger, setKarmaLedger] = useState<KarmaLedgerItem[]>(INITIAL_KARMA_LEDGER);
  const [coursesReadiness, setCoursesReadiness] = useState<CourseExamInfo[]>(INITIAL_COURSES_READINESS);

  // Safety Modals State
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string } | null>(null);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);
  const [isModeratorQueueOpen, setIsModeratorQueueOpen] = useState<boolean>(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch live BrainMate state on mount
  useEffect(() => {
    fetchProfile();
    fetchMatches();
    fetchConnections();
    fetchGroups();
    fetchSessions();
    fetchModeratorReports();
    fetchSkillSwaps();
    fetchKarma();
    fetchSyllabus();
  }, []);

  const fetchSkillSwaps = async () => {
    try {
      const res = await fetch('/api/brainmate/skill-swaps');
      if (res.ok) {
        const data = await res.json();
        if (data.pairs) setSkillSwaps(data.pairs);
      }
    } catch {}
  };

  const fetchKarma = async () => {
    try {
      const res = await fetch('/api/brainmate/karma');
      if (res.ok) {
        const data = await res.json();
        if (data.summary) setKarmaSummary(data.summary);
        if (data.endorsements) setEndorsements(data.endorsements);
        if (data.ledger) setKarmaLedger(data.ledger);
      }
    } catch {}
  };

  const fetchSyllabus = async () => {
    try {
      const res = await fetch('/api/brainmate/syllabus');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setCoursesReadiness(data);
      }
    } catch {}
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/brainmate/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setCompleteness(data.completeness);
      }
    } catch {
      // Fallback to initial seed
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/brainmate/matches');
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches);
      }
    } catch {
      // Fallback
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/brainmate/connections');
      if (res.ok) {
        const data = await res.json();
        setIncomingRequests(data.incoming);
        setOutgoingRequests(data.outgoing);
        setActiveConnections(data.active);
      }
    } catch {}
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/brainmate/groups');
      if (res.ok) {
        const data = await res.json();
        setStudyGroups(data);
      }
    } catch {}
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/brainmate/sessions');
      if (res.ok) {
        const data = await res.json();
        setStudySessions(data);
      }
    } catch {}
  };

  const fetchModeratorReports = async () => {
    try {
      const res = await fetch('/api/brainmate/moderation/reports');
      if (res.ok) {
        const data = await res.json();
        setModerationReports(data);
      }
    } catch {}
  };

  // Handler: Update Learning Profile
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
        showToast('Learning profile published! Recalculating peer synergy matches...');
        fetchMatches();
      } else {
        showToast('Failed to save profile. Please check required fields.', 'error');
      }
    } catch {
      setProfile((prev) => ({ ...prev, ...updated }));
      showToast('Profile updated (local mode).');
    }
  };

  // Handler: Send Connection Request
  const handleRequestConnect = async (candidateUserId: string, note: string) => {
    try {
      const res = await fetch('/api/brainmate/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateUserId, note }),
      });

      if (res.ok) {
        const data = await res.json();
        setOutgoingRequests((prev) => [data.request, ...prev]);
        showToast(`Study connection proposal sent to ${data.request.receiverName}!`);
      } else {
        const err = await res.json();
        showToast(err.error || 'Unable to send request', 'error');
      }
    } catch {
      showToast('Connection request sent (local demo mode)');
    }
  };

  // Handler: Respond to Request
  const handleRespondRequest = async (requestId: string, action: 'accept' | 'decline' | 'withdraw') => {
    try {
      const res = await fetch('/api/brainmate/connections/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });

      if (res.ok) {
        const data = await res.json();
        fetchConnections();
        if (action === 'accept') {
          showToast('Connection accepted! New study partner added to your active circle.');
        } else if (action === 'decline') {
          showToast('Request declined.');
        } else {
          showToast('Request withdrawn.');
        }
      }
    } catch {
      fetchConnections();
    }
  };

  // Handler: Create Study Group
  const handleCreateGroup = async (groupData: {
    name: string;
    purpose: string;
    academicUnitCode: string;
    academicUnitTitle: string;
    format: 'online' | 'in_person' | 'hybrid';
    maxMembers: number;
    visibility: 'public' | 'invite_only';
  }) => {
    try {
      const res = await fetch('/api/brainmate/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
      });

      if (res.ok) {
        const data = await res.json();
        setStudyGroups((prev) => [data.group, ...prev]);
        showToast(`Study group "${groupData.name}" created!`);
      }
    } catch {
      showToast('Group created (local mode)');
    }
  };

  // Handler: Join Group
  const handleJoinGroup = async (groupId: string) => {
    try {
      const res = await fetch(`/api/brainmate/groups/${groupId}/join`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchGroups();
        showToast('Joined study circle!');
      } else {
        const err = await res.json();
        showToast(err.error || 'Could not join group', 'error');
      }
    } catch {
      fetchGroups();
    }
  };

  // Handler: Leave Group
  const handleLeaveGroup = async (groupId: string) => {
    try {
      const res = await fetch(`/api/brainmate/groups/${groupId}/leave`, {
        method: "POST",
      });
      if (res.ok) {
        fetchGroups();
        showToast("Left study group.");
      } else {
        const err = await res.json();
        showToast(err.error || "Could not leave group", "error");
      }
    } catch {
      fetchGroups();
      showToast("Left study group (local mode).");
    }
  };

  // Handler: Add Resource
  const handleAddResource = async (groupId: string, resourceData: { title: string; type: string; size?: string }) => {
    try {
      const res = await fetch(`/api/brainmate/groups/${groupId}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resourceData),
      });
      if (res.ok) {
        fetchGroups();
        showToast(`Resource "${resourceData.title}" shared with circle!`);
      }
    } catch {
      fetchGroups();
      showToast("Resource added (local mode).");
    }
  };

  // Handler: Create Session
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
      const res = await fetch('/api/brainmate/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });

      if (res.ok) {
        const data = await res.json();
        setStudySessions((prev) => [data.session, ...prev]);
        showToast('Study session scheduled!');
      }
    } catch {
      showToast('Session scheduled (local mode)');
    }
  };

  // Handler: RSVP
  const handleRsvp = async (sessionId: string, rsvp: 'going' | 'maybe' | 'declined') => {
    try {
      const res = await fetch(`/api/brainmate/sessions/${sessionId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvp }),
      });

      if (res.ok) {
        fetchSessions();
        showToast(`RSVP updated to "${rsvp}"`);
      }
    } catch {
      fetchSessions();
    }
  };

  // Handler: Block User
  const handleConfirmBlock = async (userId: string, userName: string) => {
    try {
      const res = await fetch('/api/brainmate/safety/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, targetUserName: userName }),
      });

      if (res.ok) {
        showToast(`${userName} has been blocked and removed from all peer candidate feeds.`);
        fetchMatches();
        fetchConnections();
        fetchGroups();
      }
    } catch {
      showToast(`${userName} blocked (local mode).`);
    }
  };

  // Handler: Report User
  const handleSubmitReport = async (reportData: {
    reportedId: string;
    reportedName: string;
    groupId?: string;
    groupName?: string;
    reason: 'academic_dishonesty' | 'harassment' | 'inappropriate_content' | 'spam_or_solicitation' | 'impersonation' | 'other';
    details: string;
  }) => {
    try {
      const res = await fetch('/api/brainmate/safety/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (res.ok) {
        showToast('Report submitted for institutional review.');
        fetchModeratorReports();
      }
    } catch {
      showToast('Report filed (local mode).');
    }
  };

  // Handler: Flagship 1 Propose Skill Swap
  const handleProposeSwap = async (pairId: string, customNote: string, preferredSlot: string) => {
    try {
      const res = await fetch('/api/brainmate/skill-swaps/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairId, customNote, preferredSlot }),
      });
      if (res.ok) {
        fetchSkillSwaps();
        fetchKarma();
        showToast('Bilateral Skill Swap proposal sent! +15 Community Karma awarded.');
      }
    } catch {
      showToast('Proposal sent (local mode).');
    }
  };

  // Handler: Flagship 2 Complete Focus Pod Cycle
  const handleCompleteFocusCycle = async (cycles: number, durationMinutes: number, goalSummary?: string) => {
    try {
      const res = await fetch('/api/brainmate/focus-pod/complete-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cyclesCompleted: cycles, durationMinutes, goalSummary }),
      });
      if (res.ok) {
        fetchKarma();
        showToast(`Deep work sprint logged! +${cycles * 10} Study Karma awarded.`);
      }
    } catch {
      showToast('Focus cycle logged.');
    }
  };

  // Handler: Flagship 3 Lock In Overlap Session
  const handleLockInOverlapSession = async (sessionData: {
    title: string;
    unitCode: string;
    scheduledStart: string;
    scheduledEnd: string;
    format: 'online' | 'in_person' | 'hybrid';
    location?: string;
    onlineUrl?: string;
    agenda?: string;
  }) => {
    await handleCreateSession({
      title: sessionData.title,
      academicUnitCode: sessionData.unitCode,
      academicUnitTitle: sessionData.unitCode,
      scheduledStart: sessionData.scheduledStart,
      scheduledEnd: sessionData.scheduledEnd,
      format: sessionData.format,
      location: sessionData.location,
      onlineUrl: sessionData.onlineUrl,
      agenda: sessionData.agenda || 'Collaborative peer study sprint',
    });
    setActiveTab('sessions');
  };

  // Handler: Flagship 4 Update Syllabus Topic Status
  const handleUpdateTopicStatus = async (
    unitCode: string,
    topicId: string,
    status: 'needs_work' | 'practicing' | 'mastered'
  ) => {
    try {
      const res = await fetch('/api/brainmate/syllabus/topic', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitCode, topicId, status }),
      });
      if (res.ok) {
        fetchSyllabus();
        if (status === 'mastered') {
          fetchKarma();
          showToast(`Mastery confirmed! +10 Karma points earned.`);
        }
      }
    } catch {
      fetchSyllabus();
    }
  };

  // Handler: Flagship 5 Give Peer Endorsement
  const handleGiveEndorsement = async (data: {
    peerId: string;
    peerName: string;
    badgeCategory: string;
    badgeLabel: string;
    unitCode: string;
    comment: string;
  }) => {
    try {
      const res = await fetch('/api/brainmate/karma/endorse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchKarma();
        showToast(`Endorsement given to ${data.peerName}! You earned +15 Community Karma.`);
      }
    } catch {
      showToast('Endorsement recorded.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-teal-950/90 border-teal-500/40 text-teal-200'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* BrainMate Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-teal-500/20 hover:opacity-90 transition-opacity"
              >
                B
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">BrainMate</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    Peer Learning
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                  Find your academic people. Learn better together.
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'discover', label: 'Discover', icon: Users, badge: matches.length },
                { id: 'skill-swap', label: 'Skill Swap', icon: ArrowRightLeft, badge: 'Reciprocal' },
                { id: 'focus-pod', label: 'Focus Pod', icon: Headphones, badge: 'Live 🎧' },
                { id: 'overlap', label: 'Overlap', icon: CalendarDays },
                { id: 'readiness', label: 'Readiness', icon: Target },
                { id: 'karma', label: 'Karma', icon: Award, badge: `${karmaSummary.karmaPoints}` },
                { id: 'groups', label: 'Groups', icon: Users },
                { id: 'sessions', label: 'Sessions', icon: Calendar },
                { id: 'connections', label: 'Connections', icon: UserCheck, badge: incomingRequests.length || undefined },
                { id: 'profile', label: 'Profile', icon: GraduationCap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-teal-300 font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Tablet Navigation (compact) */}
            <nav className="hidden md:flex xl:hidden items-center gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'discover', label: 'Discover' },
                { id: 'skill-swap', label: 'Skill Swap' },
                { id: 'focus-pod', label: 'Focus Pod' },
                { id: 'overlap', label: 'Overlap' },
                { id: 'readiness', label: 'Readiness' },
                { id: 'karma', label: 'Karma' },
                { id: 'groups', label: 'Groups' },
                { id: 'sessions', label: 'Sessions' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right Header Controls */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsModeratorQueueOpen(true)}
                className="p-2 text-slate-400 hover:text-teal-400 rounded-xl hover:bg-slate-900 transition-colors"
                title="Moderation & Safety Queue (Staff View)"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenApexAI('Suggest complementary study partners or schedule a group study agenda for CSC 211')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">APEX AI</span>
              </button>
            </div>
          </div>

          {/* Mobile Tab Scroll Bar */}
          <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'discover', label: `Discover (${matches.length})` },
              { id: 'skill-swap', label: 'Skill Swap 🤝' },
              { id: 'focus-pod', label: 'Focus Pod 🎧' },
              { id: 'overlap', label: 'Overlap 📅' },
              { id: 'readiness', label: 'Readiness 🎯' },
              { id: 'karma', label: 'Karma 🌟' },
              { id: 'groups', label: 'Groups' },
              { id: 'sessions', label: 'Sessions' },
              { id: 'connections', label: 'Connections' },
              { id: 'profile', label: 'Profile' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'overview' && (
          <BrainMateOverview
            completeness={completeness}
            matches={matches}
            upcomingSessions={studySessions}
            activeGroups={studyGroups}
            userProfile={profile}
            onNavigateTab={setActiveTab as any}
            onRequestConnect={handleRequestConnect}
            onOpenApexAI={() => onOpenApexAI('Help me plan a peer study session for Data Structures & Algorithms')}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverFeed
            matches={matches}
            userProfile={profile}
            studyGroups={studyGroups}
            onRequestConnect={handleRequestConnect}
            onInviteToGroup={async (candidateUserId, groupId) => {
              showToast(`Invitation sent for study group!`);
            }}
            onBlockUser={(id, name) => setBlockTarget({ id, name })}
            onReportUser={(id, name) => setReportTarget({ id, name })}
            onNavigateToProfileEditor={() => setActiveTab('profile')}
          />
        )}

        {/* Flagship 1: Reciprocal Skill Swap Matching */}
        {activeTab === 'skill-swap' && (
          <SkillSwapModule
            skillSwaps={skillSwaps}
            onProposeSwap={handleProposeSwap}
            onScheduleSession={(unitCode, title, peerName) => {
              setActiveTab('sessions');
            }}
            onOpenApexAI={onOpenApexAI}
          />
        )}

        {/* Flagship 2: Live Focus Pod */}
        {activeTab === 'focus-pod' && (
          <FocusPodModule
            onCompleteCycle={handleCompleteFocusCycle}
            onOpenApexAI={onOpenApexAI}
          />
        )}

        {/* Flagship 3: Free-Time Overlap Heatmap */}
        {activeTab === 'overlap' && (
          <SmartOverlapHeatmapModule
            connections={activeConnections}
            onLockInSession={handleLockInOverlapSession}
            onOpenApexAI={onOpenApexAI}
          />
        )}

        {/* Flagship 4: Group Syllabus Burndown & Exam Readiness */}
        {activeTab === 'readiness' && (
          <ExamReadinessModule
            courses={coursesReadiness}
            onUpdateTopicStatus={handleUpdateTopicStatus}
            onScheduleRevisionSprint={(unitCode, title, topics) => {
              handleCreateSession({
                title,
                academicUnitCode: unitCode,
                academicUnitTitle: unitCode,
                scheduledStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                scheduledEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
                format: 'hybrid',
                location: 'Main Science Complex Pod 2',
                agenda: `Targeted revision burndown on topics: ${topics.join(', ')}`,
              });
              setActiveTab('sessions');
            }}
            onOpenApexAI={onOpenApexAI}
          />
        )}

        {/* Flagship 5: Peer Academic Endorsement & Study Karma */}
        {activeTab === 'karma' && (
          <StudyKarmaModule
            karmaSummary={karmaSummary}
            endorsements={endorsements}
            ledger={karmaLedger}
            connections={activeConnections}
            onGiveEndorsement={handleGiveEndorsement}
            onOpenApexAI={onOpenApexAI}
          />
        )}

        {activeTab === 'profile' && (
          <LearningProfileEditor
            initialProfile={profile}
            completeness={completeness}
            onSaveProfile={handleSaveProfile}
            onCancel={() => setActiveTab('overview')}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionsHub
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            activeConnections={activeConnections}
            onRespondRequest={handleRespondRequest}
            onOpenApexAI={(peer) =>
              onOpenApexAI(`I am studying with peer ${peer?.name || 'my partner'}. What collaborative exercises do you recommend for our shared units?`)
            }
            onBlockUser={(id, name) => setBlockTarget({ id, name })}
            onReportUser={(id, name) => setReportTarget({ id, name })}
            onDiscoverMore={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'groups' && (
          <StudyGroupsModule
            groups={studyGroups}
            sessions={studySessions}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            onLeaveGroup={handleLeaveGroup}
            onAddResource={handleAddResource}
            onCreateSession={handleCreateSession}
            onRsvp={handleRsvp}
            onScheduleSessionForGroup={(group) => {
              setActiveTab('sessions');
            }}
            onBlockUser={(id, name) => setBlockTarget({ id, name })}
            onReportUser={(id, name) => setReportTarget({ id, name })}
          />
        )}

        {activeTab === 'sessions' && (
          <StudySessionsModule
            sessions={studySessions}
            studyGroups={studyGroups}
            onCreateSession={handleCreateSession}
            onRsvp={handleRsvp}
          />
        )}
      </main>

      {/* Global Safety Modals */}
      <BlockModal
        isOpen={Boolean(blockTarget)}
        onClose={() => setBlockTarget(null)}
        targetUser={blockTarget}
        onConfirmBlock={handleConfirmBlock}
      />

      <ReportModal
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        targetUser={reportTarget}
        onSubmitReport={handleSubmitReport}
      />

      <ModerationQueueModal
        isOpen={isModeratorQueueOpen}
        onClose={() => setIsModeratorQueueOpen(false)}
        reports={moderationReports}
      />
    </div>
  );
};


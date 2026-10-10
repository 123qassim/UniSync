/**
 * BrainMate Match Discovery Feed
 * Dynamic layout: Large glass hero card for #1 top match + compact grid for remaining peers.
 * Transparent factor decomposition, compatibility rings with disclaimers, and interactive action modals.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Bookmark,
  X,
  MessageSquare,
  ShieldCheck,
  Info,
  Layers,
  ArrowRight,
  MoreVertical,
  Flag,
  UserX,
  Send,
  Building,
} from 'lucide-react';
import { MatchResult, StudentLearningProfile } from '../../lib/brainmate/matching.ts';
import { StudyGroup } from '../../data/brainmateMockData.ts';

interface DiscoverFeedProps {
  matches: MatchResult[];
  userProfile: StudentLearningProfile;
  studyGroups: StudyGroup[];
  onRequestConnect: (candidateUserId: string, note: string) => Promise<void>;
  onInviteToGroup: (candidateUserId: string, groupId: string) => Promise<void>;
  onBlockUser: (candidateUserId: string, candidateName: string) => void;
  onReportUser: (candidateUserId: string, candidateName: string) => void;
  onNavigateToProfileEditor: () => void;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({
  matches,
  userProfile,
  studyGroups,
  onRequestConnect,
  onInviteToGroup,
  onBlockUser,
  onReportUser,
  onNavigateToProfileEditor,
}) => {
  // Filters
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<'all' | 'reciprocal_swap' | 'can_help_me' | 'i_can_help'>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);

  // Expanded explanations state
  const [expandedFactorCardIds, setExpandedFactorCardIds] = useState<Set<string>>(new Set());

  // Saved / Dismissed matches local state
  const [savedUserIds, setSavedUserIds] = useState<Set<string>>(new Set());
  const [dismissedUserIds, setDismissedUserIds] = useState<Set<string>>(new Set());

  // Modals state
  const [activeProfileCandidate, setActiveProfileCandidate] = useState<StudentLearningProfile | null>(null);
  const [connectCandidate, setConnectCandidate] = useState<{ id: string; name: string; match: MatchResult } | null>(null);
  const [connectNote, setConnectNote] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const [inviteCandidate, setInviteCandidate] = useState<{ id: string; name: string } | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const toggleFactorExpand = (userId: string) => {
    setExpandedFactorCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleSaveCandidate = (userId: string) => {
    setSavedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const dismissCandidate = (userId: string) => {
    setDismissedUserIds((prev) => new Set(prev).add(userId));
  };

  // Filter candidates
  const filteredMatches = matches.filter((m) => {
    if (dismissedUserIds.has(m.candidateUserId)) return false;
    if (m.score < minScore) return false;

    if (selectedUnit !== 'all') {
      const hasUnit = m.candidateProfile.units.some(
        (u) => u.unitCode.toLowerCase() === selectedUnit.toLowerCase()
      );
      if (!hasUnit) return false;
    }

    if (selectedRole === 'reciprocal_swap') {
      const helpsMe = m.candidateProfile.units.some(
        (u) =>
          u.role === 'can_help' &&
          userProfile.units.some((my) => my.role === 'needs_help' && my.unitCode === u.unitCode)
      );
      const iHelpThem = m.candidateProfile.units.some(
        (u) =>
          u.role === 'needs_help' &&
          userProfile.units.some((my) => my.role === 'can_help' && my.unitCode === u.unitCode)
      );
      if (!helpsMe || !iHelpThem) return false;
    } else if (selectedRole === 'can_help_me') {
      const helpsMe = m.candidateProfile.units.some(
        (u) =>
          u.role === 'can_help' &&
          userProfile.units.some((my) => my.role === 'needs_help' && my.unitCode === u.unitCode)
      );
      if (!helpsMe) return false;
    } else if (selectedRole === 'i_can_help') {
      const iHelpThem = m.candidateProfile.units.some(
        (u) =>
          u.role === 'needs_help' &&
          userProfile.units.some((my) => my.role === 'can_help' && my.unitCode === u.unitCode)
      );
      if (!iHelpThem) return false;
    }

    if (selectedFormat !== 'all') {
      if (m.candidateProfile.preferredFormat !== selectedFormat) return false;
    }

    if (selectedDay !== 'all') {
      const dayNum = Number(selectedDay);
      const hasDay = m.candidateProfile.availability.some((a) => a.dayOfWeek === dayNum);
      if (!hasDay) return false;
    }

    return true;
  });

  const topMatch = filteredMatches[0];
  const remainingMatches = filteredMatches.slice(1);

  // Handle Send Connection Request Modal
  const handleConfirmConnect = async () => {
    if (!connectCandidate) return;
    setIsSendingRequest(true);
    try {
      await onRequestConnect(connectCandidate.id, connectNote);
      setConnectCandidate(null);
      setConnectNote('');
    } finally {
      setIsSendingRequest(false);
    }
  };

  // Handle Send Group Invite
  const handleConfirmInvite = async () => {
    if (!inviteCandidate || !selectedGroupId) return;
    setIsSendingInvite(true);
    try {
      await onInviteToGroup(inviteCandidate.id, selectedGroupId);
      setInviteCandidate(null);
      setSelectedGroupId('');
    } finally {
      setIsSendingInvite(false);
    }
  };

  // Helper for unique units across matches for dropdown
  const allUnitCodes = Array.from(
    new Set(matches.flatMap((m) => m.candidateProfile.units.map((u) => u.unitCode)))
  );

  return (
    <div className="space-y-8">
      {/* Header and Filter Controls */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Academic Peer Matches
              <span className="text-xs font-normal text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                {filteredMatches.length} candidates in Maseno University
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic, explainable compatibility matching based strictly on complementary units, topics, and weekly study windows.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Provably zero demographic or social ranking</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">Academic Unit</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">All Course Units</option>
              {allUnitCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">Role Complement</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">All Roles</option>
              <option value="reciprocal_swap">🤝 Reciprocal Skill Swap (1:1 Barter)</option>
              <option value="can_help_me">Can Help Me (My Wishlist)</option>
              <option value="i_can_help">I Can Help Them</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">Study Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">All Formats</option>
              <option value="hybrid">Hybrid</option>
              <option value="in_person">In-Person</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">Availability Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">Any Day</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="0">Sunday</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">
              Min Score: <span className="text-teal-400 font-bold">{minScore}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={90}
              step={10}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-teal-400 mt-1"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredMatches.length === 0 && (
        <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No peer matches found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try loosening your filters or declare more units in your learning profile to expand potential study partners.
          </p>
          <button
            onClick={onNavigateToProfileEditor}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/20"
          >
            Update Learning Profile
          </button>
        </div>
      )}

      {/* Top #1 Featured Hero Match (Large Glass Card) */}
      {topMatch && (
        <div className="relative group overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-teal-950/30 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full">
                  ★ Top Compatible Study Partner
                </span>
                {topMatch.evidenceLevel === 'verified_unit' && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Enrolment
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  {topMatch.candidateProfile.displayName}
                  {topMatch.candidateProfile.mentorWillingness && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Peer Mentor
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {topMatch.candidateProfile.programmeName} · {topMatch.candidateProfile.studyLevel}
                </p>
              </div>

              {/* Units Tags with Distinct Meaningful Colors */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {topMatch.candidateProfile.units.map((u) => {
                  const helpsMe = u.role === 'can_help';
                  const needsMyHelp = u.role === 'needs_help';

                  return (
                    <span
                      key={u.unitCode}
                      className={`text-xs px-3 py-1 rounded-lg border font-medium ${
                        helpsMe
                          ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                          : needsMyHelp
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title={helpsMe ? 'Can help you' : needsMyHelp ? 'Looking for peer help' : 'Currently studying'}
                    >
                      {helpsMe && '✓ Can Help: '}
                      {needsMyHelp && '★ Needs: '}
                      {u.unitCode} {u.topics.length > 0 ? `(${u.topics.slice(0, 2).join(', ')})` : ''}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Score Ring with Tooltip Disclaimer */}
            <div className="flex flex-col items-center shrink-0 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl relative group/ring">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-teal-400"
                    strokeDasharray={`${topMatch.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-white">{topMatch.score}</span>
                  <span className="text-[10px] text-slate-400 block -mt-1">%</span>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-teal-400 mt-2">Compatibility</span>

              {/* Tooltip disclaimer */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/ring:block w-64 p-3 bg-slate-900 border border-slate-700 text-[11px] text-slate-300 rounded-xl shadow-xl z-20 text-center">
                Compatibility is a transparent score based on the factors shown — not a scientific assessment.
              </div>
            </div>
          </div>

          {/* "Why This Match" Transparent Panel */}
          <div className="p-4 bg-slate-950/60 rounded-xl border-l-4 border-l-teal-500 border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider text-[11px]">
                Why this match
              </span>
              <button
                type="button"
                onClick={() => toggleFactorExpand(topMatch.candidateUserId)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {expandedFactorCardIds.has(topMatch.candidateUserId) ? (
                  <>Hide point breakdown <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>View factor breakdown <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{topMatch.explanation}"
            </p>

            {/* Expandable Breakdown Bars */}
            {expandedFactorCardIds.has(topMatch.candidateUserId) && (
              <div className="pt-4 mt-2 border-t border-slate-800 space-y-2.5">
                {topMatch.factors.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{f.label}</span>
                      <span className="text-teal-400 font-bold">{f.points} / {f.maxPoints} pts</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${(f.points / f.maxPoints) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConnectCandidate({ id: topMatch.candidateUserId, name: topMatch.candidateProfile.displayName, match: topMatch })}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/20"
              >
                <UserPlus className="w-4 h-4" />
                Request to Connect
              </button>

              <button
                type="button"
                onClick={() => setInviteCandidate({ id: topMatch.candidateUserId, name: topMatch.candidateProfile.displayName })}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-colors"
              >
                <Users className="w-4 h-4" />
                Invite to Group
              </button>

              <button
                type="button"
                onClick={() => setActiveProfileCandidate(topMatch.candidateProfile)}
                className="px-4 py-2.5 text-xs text-slate-300 hover:text-white transition-colors"
              >
                View Full Profile
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaveCandidate(topMatch.candidateUserId)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  savedUserIds.has(topMatch.candidateUserId)
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Save match"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => dismissCandidate(topMatch.candidateUserId)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Dismiss match"
              >
                <X className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onBlockUser(topMatch.candidateUserId, topMatch.candidateProfile.displayName)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Safety: Block user"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remaining Matches Compact Grid */}
      {remainingMatches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Other Academic Matches</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {remainingMatches.map((m) => {
              const isSaved = savedUserIds.has(m.candidateUserId);
              const isExpanded = expandedFactorCardIds.has(m.candidateUserId);

              return (
                <div
                  key={m.candidateUserId}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          {m.candidateProfile.displayName}
                          {m.candidateProfile.mentorWillingness && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                              Mentor
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {m.candidateProfile.programmeName} · {m.candidateProfile.studyLevel}
                        </p>
                      </div>

                      {/* Small Score Pill */}
                      <div
                        className="px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-extrabold text-xs"
                        title="Compatibility score"
                      >
                        {m.score}%
                      </div>
                    </div>

                    {/* Shared Units */}
                    <div className="flex flex-wrap gap-1.5">
                      {m.candidateProfile.units.map((u) => {
                        const helpsMe = u.role === 'can_help';
                        const needsMyHelp = u.role === 'needs_help';
                        return (
                          <span
                            key={u.unitCode}
                            className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
                              helpsMe
                                ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                                : needsMyHelp
                                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            {u.unitCode}
                          </span>
                        );
                      })}
                    </div>

                    {/* "Why this match" compact preview */}
                    <div className="p-3 bg-slate-950/70 rounded-xl border-l-2 border-l-teal-400 border-slate-800/80 space-y-1.5">
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        "{m.explanation}"
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleFactorExpand(m.candidateUserId)}
                        className="text-[11px] text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                      >
                        {isExpanded ? 'Hide breakdown' : 'Why this match (details)'}
                      </button>

                      {isExpanded && (
                        <div className="pt-2 mt-1 border-t border-slate-800 space-y-1.5">
                          {m.factors.map((f) => (
                            <div key={f.key} className="flex justify-between text-[10px] text-slate-400">
                              <span>{f.label}</span>
                              <span className="text-teal-300 font-semibold">{f.points}/{f.maxPoints} pts</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setConnectCandidate({ id: m.candidateUserId, name: m.candidateProfile.displayName, match: m })}
                      className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-400 border border-teal-500/30 rounded-xl text-xs font-bold transition-all"
                    >
                      Connect
                    </button>

                    <div className="flex items-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => setActiveProfileCandidate(m.candidateProfile)}
                        className="p-1.5 hover:text-white rounded-lg transition-colors text-xs"
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaveCandidate(m.candidateUserId)}
                        className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-teal-400' : 'hover:text-white'}`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onBlockUser(m.candidateUserId, m.candidateProfile.displayName)}
                        className="p-1.5 hover:text-rose-400 rounded-lg transition-colors"
                        title="Block"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Request to Connect */}
      {connectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Propose Academic Study Connection</h3>
                <p className="text-xs text-slate-400 mt-0.5">Connecting with: <span className="text-teal-300 font-bold">{connectCandidate.name}</span></p>
              </div>
              <button
                onClick={() => setConnectCandidate(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Match Snapshot */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-teal-400 text-[10px] uppercase tracking-wider">
                Algorithm Compatibility Snapshot ({connectCandidate.match.score}%)
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                "{connectCandidate.match.explanation}"
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Personalized Academic Note (Optional)
              </label>
              <textarea
                rows={3}
                value={connectNote}
                onChange={(e) => setConnectNote(e.target.value)}
                placeholder="Hi! Would love to compare notes on dynamic programming and prepare for the upcoming assessment..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-500 block">
                Rate-limited to 10 requests/day to prevent unsolicited mass spam.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConnectCandidate(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSendingRequest}
                onClick={handleConfirmConnect}
                className="px-5 py-2 text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50"
              >
                {isSendingRequest ? 'Sending Request...' : 'Send Study Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Invite to Group */}
      {inviteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Invite to Study Group</h3>
                <p className="text-xs text-slate-400 mt-0.5">Inviting: <span className="text-teal-300 font-bold">{inviteCandidate.name}</span></p>
              </div>
              <button
                onClick={() => setInviteCandidate(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Choose Group</label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
              >
                <option value="">Select a study group...</option>
                {studyGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.academicUnitCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInviteCandidate(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedGroupId || isSendingInvite}
                onClick={handleConfirmInvite}
                className="px-5 py-2 text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSendingInvite ? 'Inviting...' : 'Send Group Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Full Profile View */}
      {activeProfileCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{activeProfileCandidate.displayName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeProfileCandidate.programmeName} · {activeProfileCandidate.studyLevel}
                </p>
                <span className="text-[11px] text-teal-400 mt-1 inline-block">
                  {activeProfileCandidate.institutionName || 'Maseno University'}
                </span>
              </div>
              <button
                onClick={() => setActiveProfileCandidate(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Units they can help with */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider text-[10px]">
                Strengths / Can Help With
              </span>
              <div className="space-y-2">
                {activeProfileCandidate.units.filter((u) => u.role === 'can_help').map((u) => (
                  <div key={u.unitCode} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-200 font-semibold">
                      <span>{u.unitCode} - {u.unitTitle}</span>
                      <span className="text-teal-400 text-[10px]">{u.confidence} confidence</span>
                    </div>
                    {u.topics.length > 0 && (
                      <p className="text-[11px] text-slate-400">Topics: {u.topics.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Units they need help with */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider text-[10px]">
                Learning Goals / Needs Help With
              </span>
              <div className="space-y-2">
                {activeProfileCandidate.units.filter((u) => u.role === 'needs_help').map((u) => (
                  <div key={u.unitCode} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-200 font-semibold">
                      {u.unitCode} - {u.unitTitle}
                    </div>
                    {u.topics.length > 0 && (
                      <p className="text-[11px] text-slate-400">Topics: {u.topics.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">
                Study Format & Preferences
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Preferred Format: <strong className="text-white">{activeProfileCandidate.preferredFormat}</strong></div>
                <div>Group Size: <strong className="text-white">{activeProfileCandidate.preferredGroupSize} members</strong></div>
                <div>Peer Mentor: <strong className="text-white">{activeProfileCandidate.mentorWillingness ? 'Yes' : 'No'}</strong></div>
                <div>Goals: <strong className="text-white">{activeProfileCandidate.collaborationGoals.join(', ')}</strong></div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onReportUser(activeProfileCandidate.userId, activeProfileCandidate.displayName)}
                className="px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
              >
                Report User
              </button>
              <button
                type="button"
                onClick={() => setActiveProfileCandidate(null)}
                className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

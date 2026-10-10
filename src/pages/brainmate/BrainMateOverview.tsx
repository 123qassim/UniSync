/**
 * BrainMate Overview Hub
 * Welcoming academic peer collaboration overview: profile completeness ring,
 * top 3 matches cards, upcoming study sessions, and quick study actions.
 */

import React from 'react';
import {
  Users,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  HelpCircle,
  TrendingUp,
  Repeat,
  Headphones,
  CalendarDays,
  Target,
  Award,
  ArrowRightLeft,
  Zap,
} from 'lucide-react';
import { MatchResult, StudentLearningProfile } from '../../lib/brainmate/matching.ts';
import { StudySession, StudyGroup } from '../../data/brainmateMockData.ts';

interface BrainMateOverviewProps {
  completeness: number;
  matches: MatchResult[];
  upcomingSessions: StudySession[];
  activeGroups: StudyGroup[];
  userProfile: StudentLearningProfile;
  onNavigateTab: (tab: any) => void;
  onRequestConnect: (candidateUserId: string, note: string) => Promise<void>;
  onOpenApexAI: () => void;
}

export const BrainMateOverview: React.FC<BrainMateOverviewProps> = ({
  completeness,
  matches,
  upcomingSessions,
  activeGroups,
  userProfile,
  onNavigateTab,
  onRequestConnect,
  onOpenApexAI,
}) => {
  const top3Matches = matches.slice(0, 3);
  const next2Sessions = upcomingSessions.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs text-teal-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            UniSync BrainMate · Peer Learning & Academic Pairing
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find your academic people. Learn better together.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            BrainMate pairs students by complementary strengths and syllabus needs. No popularity contests or dating mechanics — pure, explainable academic synergy.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('discover')}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/20"
            >
              Explore Peer Matches
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('skill-swap')}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-indigo-600/20"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Skill Swap Engine
            </button>

            <button
              onClick={() => onNavigateTab('focus-pod')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold rounded-xl text-xs transition-colors border border-slate-700"
            >
              <Headphones className="w-3.5 h-3.5 text-teal-400" />
              Join Live Focus Pod
            </button>
          </div>
        </div>
      </div>

      {/* Flagship Superpowers Banner */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Flagship Academic Superpowers
            </h2>
          </div>
          <span className="text-xs text-slate-400">Exclusive to UniSync BrainMate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Skill Swap */}
          <button
            onClick={() => onNavigateTab('skill-swap')}
            className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 hover:border-indigo-500 rounded-2xl text-left transition-all hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                Reciprocal Skill Swap
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Teach what you know, learn what you need in 1:1 barter sprints.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-bold text-indigo-400 flex items-center justify-between">
              <span>98% Synergy Match</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 2. Focus Pod */}
          <button
            onClick={() => onNavigateTab('focus-pod')}
            className="p-4 bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30 hover:border-teal-500 rounded-2xl text-left transition-all hover:shadow-xl hover:shadow-teal-500/10 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <Headphones className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                Live Focus Pod
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Synchronized Pomodoro, Web Audio soundscapes, & live pod cheers.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-bold text-teal-400 flex items-center justify-between">
              <span>3 Peers Studying</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 3. Overlap Heatmap */}
          <button
            onClick={() => onNavigateTab('overlap')}
            className="p-4 bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-500 rounded-2xl text-left transition-all hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                Timetable Overlap
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Clash detector: 7-day heatmap & 1-click study slot booking.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-bold text-emerald-400 flex items-center justify-between">
              <span>6.5h Mutual Free</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 4. Exam Readiness */}
          <button
            onClick={() => onNavigateTab('readiness')}
            className="p-4 bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-500/30 hover:border-rose-500 rounded-2xl text-left transition-all hover:shadow-xl hover:shadow-rose-500/10 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                Exam Burndown
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Weighted syllabus radar, gap analyzer, and exam countdowns.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-bold text-rose-400 flex items-center justify-between">
              <span>45 Days to Exam</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 5. Study Karma */}
          <button
            onClick={() => onNavigateTab('karma')}
            className="p-4 bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-500 rounded-2xl text-left transition-all hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Study Karma & Badges
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Micro-credentials for punctuality, note sharing, and patient mentoring.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-bold text-amber-400 flex items-center justify-between">
              <span>880 Karma · Gold</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Profile Completeness + Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Profile Completeness Ring */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Profile Completeness</h3>
            <p className="text-xs text-slate-400">
              Complete your learning profile to sharpen deterministic matching accuracy.
            </p>
          </div>

          <div className="flex items-center gap-5 my-2">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-400"
                  strokeDasharray={`${completeness}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-white">{completeness}%</span>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div>Units I Can Help With: <strong className="text-teal-300">{userProfile.units.filter((u) => u.role === 'can_help').length}</strong></div>
              <div>Units I Need Help: <strong className="text-cyan-300">{userProfile.units.filter((u) => u.role === 'needs_help').length}</strong></div>
              <div>Weekly Windows: <strong className="text-slate-200">{userProfile.availability.length}</strong></div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-white font-medium rounded-xl text-xs transition-colors"
          >
            Edit Profile & Availability Grid
          </button>
        </div>

        {/* Card 2: Quick Stats & Institution Scope */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Academic Trust & Safety</h3>
            <p className="text-xs text-slate-400">
              Verified campus isolation. You only collaborate within your university.
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Institution:</span>
              <span className="font-semibold text-white">Maseno University</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Programme:</span>
              <span className="font-semibold text-white">BSc Computer Science</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Algorithm Transparency:</span>
              <span className="text-teal-400 font-semibold">100% Decomposable</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero ranking on non-academic or demographic traits.</span>
          </div>
        </div>

        {/* Card 3: Quick Study Actions */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Quick Actions</h3>
            <p className="text-xs text-slate-400">
              Jump directly to collaboration tools.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigateTab('discover')}
              className="p-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition-colors space-y-1"
            >
              <Users className="w-4 h-4 text-teal-400" />
              <div className="font-semibold text-white text-xs">Discover Peers</div>
              <p className="text-[10px] text-slate-400">Review top matches</p>
            </button>

            <button
              onClick={() => onNavigateTab('groups')}
              className="p-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition-colors space-y-1"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <div className="font-semibold text-white text-xs">Study Circles</div>
              <p className="text-[10px] text-slate-400">{activeGroups.length} active circles</p>
            </button>

            <button
              onClick={() => onNavigateTab('sessions')}
              className="p-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition-colors space-y-1"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <div className="font-semibold text-white text-xs">Plan Session</div>
              <p className="text-[10px] text-slate-400">Schedule meetings</p>
            </button>

            <button
              onClick={() => onNavigateTab('connections')}
              className="p-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 text-left transition-colors space-y-1"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <div className="font-semibold text-white text-xs">Connections</div>
              <p className="text-[10px] text-slate-400">Manage partners</p>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 text-center block">
            Rate limit: Max 10 connection invites / 24 hours
          </span>
        </div>
      </div>

      {/* Top 3 Matches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Top 3 Academic Matches for You</h2>
            <p className="text-xs text-slate-400">
              Curated by the deterministic matching algorithm for complementary strengths in your syllabus.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('discover')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors"
          >
            See All Candidates <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {top3Matches.map((m) => (
            <div
              key={m.candidateUserId}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      {m.candidateProfile.displayName}
                      {m.candidateProfile.mentorWillingness && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                          Mentor
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">{m.candidateProfile.programmeName}</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-extrabold text-xs">
                    {m.score}%
                  </div>
                </div>

                {/* Units */}
                <div className="flex flex-wrap gap-1.5">
                  {m.candidateProfile.units.slice(0, 3).map((u) => {
                    const helpsMe = u.role === 'can_help';
                    return (
                      <span
                        key={u.unitCode}
                        className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
                          helpsMe
                            ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {u.unitCode}
                      </span>
                    );
                  })}
                </div>

                {/* Transparent explanation */}
                <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 line-clamp-3 leading-relaxed">
                  "{m.explanation}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onRequestConnect(m.candidateUserId, '')}
                  className="px-3.5 py-1.5 bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-400 border border-teal-500/30 rounded-xl text-xs font-bold transition-all"
                >
                  Connect
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('discover')}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Upcoming Collaborative Sessions</h2>
            <p className="text-xs text-slate-400">
              Joint review clinics scheduled with your peers.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('sessions')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors"
          >
            View Calendar <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {next2Sessions.map((sess) => {
            const startDate = new Date(sess.scheduledStart);
            return (
              <div
                key={sess.id}
                className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {sess.academicUnitCode}
                    </span>
                    <span className="text-xs text-slate-400">
                      {startDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{sess.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{sess.agenda}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Host: {sess.createdByName}</span>
                  <button
                    onClick={() => onNavigateTab('sessions')}
                    className="text-teal-400 hover:underline font-medium"
                  >
                    RSVP & Link
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

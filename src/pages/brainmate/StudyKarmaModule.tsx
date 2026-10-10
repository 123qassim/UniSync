/**
 * BrainMate Flagship 5: Peer Academic Endorsement & Study Karma Ledger
 * Micro-credentials, social proof of academic reliability (attendance, punctuality),
 * peer commendations with personalized testimonials, and full chronological karma activity ledger.
 */
import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  Plus,
  Send,
  MessageSquare,
  Users,
  TrendingUp,
  Star,
  Zap,
  BookOpen,
  X,
} from 'lucide-react';
import {
  StudentKarmaSummary,
  PeerEndorsement,
  KarmaLedgerItem,
  ActiveConnection,
} from '../../data/brainmateMockData.ts';

interface StudyKarmaModuleProps {
  karmaSummary: StudentKarmaSummary;
  endorsements: PeerEndorsement[];
  ledger: KarmaLedgerItem[];
  connections: ActiveConnection[];
  onGiveEndorsement: (data: {
    peerId: string;
    peerName: string;
    badgeCategory: string;
    badgeLabel: string;
    unitCode: string;
    comment: string;
  }) => Promise<void>;
  onOpenApexAI: (prompt: string) => void;
}

const BADGE_OPTIONS = [
  { category: 'patient_explainer', label: 'Patient Explainer', icon: '🌟', desc: 'Breaks down complex proofs & algorithms with clarity' },
  { category: 'code_debugger', label: 'Code Debugger', icon: '⚡', desc: 'Expert pair programmer who spots syntax and logic errors' },
  { category: 'concise_notes', label: 'Concise Notes', icon: '📝', desc: 'Prepares structured cheat-sheets and review summaries' },
  { category: 'always_punctual', label: 'Always Punctual', icon: '⏰', desc: 'Always arrives on time and fully prepared for study sessions' },
  { category: 'proofs_master', label: 'Proofs Master', icon: '🧠', desc: 'Mastery over formal mathematical induction and theorems' },
  { category: 'problem_crusher', label: 'Problem Crusher', icon: '🎯', desc: 'Tackles challenging past-paper exercises with tenacity' },
];

export const StudyKarmaModule: React.FC<StudyKarmaModuleProps> = ({
  karmaSummary,
  endorsements,
  ledger,
  connections,
  onGiveEndorsement,
  onOpenApexAI,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPeerId, setSelectedPeerId] = useState<string>('user-sarah-m');
  const [selectedBadge, setSelectedBadge] = useState<string>('patient_explainer');
  const [unitCode, setUnitCode] = useState<string>('CSC 211');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleOpenModal = (peerId?: string) => {
    if (peerId) setSelectedPeerId(peerId);
    setComment('');
    setIsModalOpen(true);
  };

  const handleSubmitEndorsement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const badgeMeta = BADGE_OPTIONS.find((b) => b.category === selectedBadge) || BADGE_OPTIONS[0];
    const peerName =
      selectedPeerId === 'user-sarah-m'
        ? 'Sarah Muthoni'
        : selectedPeerId === 'user-kevin-k'
        ? 'Kevin Kiprono'
        : 'Aisha Omar';

    setIsSubmitting(true);
    try {
      await onGiveEndorsement({
        peerId: selectedPeerId,
        peerName,
        badgeCategory: badgeMeta.category,
        badgeLabel: badgeMeta.label,
        unitCode,
        comment: comment.trim(),
      });
      setSuccessToast(`Endorsement given to ${peerName}! You earned +15 Community Karma.`);
      setIsModalOpen(false);
      setTimeout(() => setSuccessToast(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Feedback */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 px-5 py-3.5 rounded-2xl shadow-2xl animate-fade-in text-sm backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 font-semibold tracking-wide">
              <Award className="w-3.5 h-3.5" />
              Flagship Trust Innovation · Academic Social Proof & Study Karma
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Peer Academic Endorsement & Study Karma
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Earn transparent micro-credentials through verified peer collaboration. Celebrate punctuality,
              clear explanations, and reliable study habits that help everyone succeed together.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" /> Endorse a Peer (+15 Karma)
          </button>
        </div>
      </div>

      {/* Karma Stats Ring & Reliability Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Karma Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Study Karma</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {karmaSummary.tier}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{karmaSummary.karmaPoints}</span>
            <span className="text-xs text-amber-400 font-semibold">Points</span>
          </div>
          <p className="text-[11px] text-slate-400">Earned through punctuality & peer ratings</p>
        </div>

        {/* Reliability Attendance Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Reliability Index</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">{karmaSummary.attendanceRate}%</span>
            <span className="text-xs text-slate-400">Attendance</span>
          </div>
          <p className="text-[11px] text-slate-400">24 of 24 scheduled sessions attended</p>
        </div>

        {/* Sessions Completed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Completed Sprints</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{karmaSummary.sessionsCompleted}</span>
            <span className="text-xs text-teal-400 font-semibold">Sessions</span>
          </div>
          <p className="text-[11px] text-slate-400">{karmaSummary.hoursCollaborated} hours of peer learning</p>
        </div>

        {/* Endorsements Count */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Peer Badges</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{karmaSummary.endorsementsCount}</span>
            <span className="text-xs text-purple-400 font-semibold">Received</span>
          </div>
          <p className="text-[11px] text-slate-400">From 11 unique classmates</p>
        </div>
      </div>

      {/* Endorsements Badges Grid & Recent Testimonials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Micro-Credentials Badges (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Your Academic Micro-Badges
            </h3>
            <span className="text-xs text-slate-400">Verified by peers</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {BADGE_OPTIONS.map((badge) => {
              const count =
                karmaSummary.topEndorsements.find((t) => t.category === badge.category)?.count || 2;
              return (
                <div
                  key={badge.category}
                  className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-xs font-black font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      ×{count}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{badge.label}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Peer Testimonials & Comments (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" /> Recent Peer Endorsements & Feedback
            </h3>
            <span className="text-xs text-slate-400">Visible on your academic profile</span>
          </div>

          <div className="space-y-3">
            {endorsements.map((endorsement) => (
              <div
                key={endorsement.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{endorsement.badgeIcon}</span>
                    <div>
                      <span className="text-xs font-bold text-white">{endorsement.badgeLabel}</span>
                      <span className="text-[11px] text-slate-400 ml-2">in {endorsement.unitCode}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    +{endorsement.karmaAwarded} Karma
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{endorsement.comment}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Endorsed by <strong>{endorsement.endorserName}</strong></span>
                  <span>{new Date(endorsement.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chronological Study Karma Activity Ledger */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Study Karma Activity Ledger</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Immutable Academic Contributions</span>
        </div>

        <div className="space-y-2.5">
          {ledger.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.badge || '⭐'}</span>
                <div>
                  <p className="font-semibold text-slate-200">{item.title}</p>
                  <p className="text-[11px] text-slate-500">{item.timestamp}</p>
                </div>
              </div>

              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shrink-0">
                +{item.points} Karma
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Give Endorsement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Give Academic Endorsement</h3>
                <p className="text-xs text-amber-400">Recognize a peer's collaborative contribution (+15 Karma for you!)</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEndorsement} className="space-y-4 text-xs">
              {/* Select Peer */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Select Peer</label>
                <select
                  value={selectedPeerId}
                  onChange={(e) => setSelectedPeerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="user-sarah-m">Sarah Muthoni (BSc Computer Science)</option>
                  <option value="user-kevin-k">Kevin Kiprono (BSc Computer Science)</option>
                  <option value="user-aisha-o">Aisha Omar (BSc Mathematics & CS)</option>
                </select>
              </div>

              {/* Badge Selection */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Choose Micro-Badge</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {BADGE_OPTIONS.map((badge) => (
                    <button
                      type="button"
                      key={badge.category}
                      onClick={() => setSelectedBadge(badge.category)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        selectedBadge === badge.category
                          ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{badge.icon}</span>
                      <span className="text-[11px]">{badge.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Unit */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Associated Course Unit</label>
                <select
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="CSC 211">CSC 211: Data Structures & Algorithms</option>
                  <option value="CSC 212">CSC 212: Database Systems & SQL Modeling</option>
                  <option value="MAT 120">MAT 120: Discrete Mathematics</option>
                </select>
              </div>

              {/* Commendation Comment */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Personal Commendation (Why they deserve this badge)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Sarah helped me understand dynamic programming memoization with clean code examples..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Recording...' : 'Award Badge & +25 Karma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

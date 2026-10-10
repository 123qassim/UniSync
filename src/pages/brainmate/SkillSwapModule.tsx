/**
 * BrainMate Flagship 1: Reciprocal "Skill Swap" Matching Engine
 * Bilateral synergy matching: pairs students who have complementary strengths and weaknesses.
 * Student A teaches what Student B needs, and Student B teaches what Student A needs.
 */
import React, { useState } from 'react';
import {
  Repeat,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  Send,
  Filter,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Zap,
  HelpCircle,
  X,
  MessageSquare,
} from 'lucide-react';
import { SkillSwapPair } from '../../data/brainmateMockData.ts';

interface SkillSwapModuleProps {
  skillSwaps: SkillSwapPair[];
  onProposeSwap: (pairId: string, customNote: string, preferredSlot: string) => Promise<void>;
  onScheduleSession: (unitCode: string, title: string, peerName: string) => void;
  onOpenApexAI: (prompt: string) => void;
}

export const SkillSwapModule: React.FC<SkillSwapModuleProps> = ({
  skillSwaps,
  onProposeSwap,
  onScheduleSession,
  onOpenApexAI,
}) => {
  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [selectedPair, setSelectedPair] = useState<SkillSwapPair | null>(null);
  const [proposalNote, setProposalNote] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredSwaps = skillSwaps.filter((pair) => {
    if (filterUnit === 'all') return true;
    return (
      pair.youTeach.unitCode.toLowerCase().includes(filterUnit.toLowerCase()) ||
      pair.theyTeach.unitCode.toLowerCase().includes(filterUnit.toLowerCase())
    );
  });

  const handleOpenProposal = (pair: SkillSwapPair) => {
    setSelectedPair(pair);
    setProposalNote(
      `Hey ${pair.candidateName.split(' ')[0]}! I'd love to swap skills: I'll help you with ${pair.youTeach.unitCode} (${pair.youTeach.topics[0]}), and you can guide me through ${pair.theyTeach.unitCode} (${pair.theyTeach.topics[0]}). Let's schedule a 90m session!`
    );
    setSelectedSlot(pair.recommendedSprint || 'Tuesday 14:00 - 15:30 (Library Study Pod)');
  };

  const handleSendProposal = async () => {
    if (!selectedPair) return;
    setIsSubmitting(true);
    try {
      await onProposeSwap(selectedPair.id, proposalNote, selectedSlot);
      setSuccessToast(`Bilateral Skill Swap proposal sent to ${selectedPair.candidateName}! +15 Karma points earned.`);
      setSelectedPair(null);
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
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 font-semibold tracking-wide">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Flagship Match Innovation · Bilateral Reciprocity Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reciprocal Skill Swap Matching
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Standard apps only match people who struggle with the exact same thing. BrainMate pairs you with students who
            have <span className="text-indigo-300 font-semibold">complementary strengths</span>: teach what you excel at,
            and learn what you find challenging in a balanced 1:1 barter.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Zero-money academic barter</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bilateral Synergy Scoring (0-100%)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>100% Academic Merit Algorithm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filter by Enrolled Unit:</span>
          {['all', 'CSC 211', 'CSC 212', 'MAT 120', 'CSC 121'].map((unit) => (
            <button
              key={unit}
              onClick={() => setFilterUnit(unit)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterUnit === unit
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {unit === 'all' ? 'All Units' : unit}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filteredSwaps.length}</span> high-reciprocity match pairs
        </div>
      </div>

      {/* Reciprocal Pairs Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSwaps.map((pair) => (
          <div
            key={pair.id}
            className="group relative bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
          >
            <div>
              {/* Header: Peer info & Synergy Badge */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-600 text-white font-bold flex items-center justify-center text-base shadow-md">
                    {pair.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {pair.candidateName}
                    </h3>
                    <p className="text-xs text-slate-400">{pair.candidateProgramme}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {pair.balanceTier}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {pair.weeklyOverlapHours}h mutual free time
                      </span>
                    </div>
                  </div>
                </div>

                {/* Circular Synergy Gauge */}
                <div className="flex flex-col items-center">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-slate-800"
                        fill="transparent"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-indigo-400"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 24}
                        strokeDashoffset={2 * Math.PI * 24 * (1 - pair.synergyScore / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-black text-white">{pair.synergyScore}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 mt-1">Synergy</span>
                </div>
              </div>

              {/* Bilateral Trade Visualizer */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3 mb-5">
                <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-slate-800/60">
                  <span className="text-teal-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    You Teach ({pair.youTeach.unitCode})
                  </span>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-indigo-400 flex items-center gap-1.5">
                    They Teach ({pair.theyTeach.unitCode})
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Left: You Teach */}
                  <div className="space-y-1.5">
                    <p className="font-medium text-slate-200">{pair.youTeach.unitTitle}</p>
                    <div className="flex flex-wrap gap-1">
                      {pair.youTeach.topics.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded-md border border-teal-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: They Teach */}
                  <div className="space-y-1.5">
                    <p className="font-medium text-slate-200">{pair.theyTeach.unitTitle}</p>
                    <div className="flex flex-wrap gap-1">
                      {pair.theyTeach.topics.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/60">
              <span className="text-[11px] text-slate-400">
                {pair.status === 'proposed' ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Proposal pending peer review
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Available for bilateral sprint
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onOpenApexAI(
                      `Generate a 90-minute bilateral study sprint agenda for me and ${pair.candidateName}. I will teach ${pair.youTeach.unitCode} (${pair.youTeach.topics.join(', ')}), and they will teach ${pair.theyTeach.unitCode} (${pair.theyTeach.topics.join(', ')}). How should we split the time?`
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                  title="Ask APEX AI for sprint agenda"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Agenda
                </button>

                <button
                  onClick={() => handleOpenProposal(pair)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {pair.status === 'proposed' ? 'Update Proposal' : 'Propose Swap'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Propose Swap Modal */}
      {selectedPair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedPair.avatarInitials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Propose Skill Swap Sprint</h3>
                  <p className="text-xs text-indigo-300">With {selectedPair.candidateName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPair(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bilateral Summary */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>You Teach:</span>
                <span className="text-teal-300 font-bold">{selectedPair.youTeach.unitCode} ({selectedPair.youTeach.topics[0]})</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>They Teach:</span>
                <span className="text-indigo-300 font-bold">{selectedPair.theyTeach.unitCode} ({selectedPair.theyTeach.topics[0]})</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                <span>Bilateral Synergy:</span>
                <span className="text-amber-400 font-bold">{selectedPair.synergyScore}% Balanced Reciprocity</span>
              </div>
            </div>

            {/* Preferred Time Slot */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Select Mutual Free Slot:
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Tuesday 14:00 - 15:30 (Library Study Pod)">Tuesday 14:00 - 15:30 (Library Study Pod) · 90 min</option>
                <option value="Thursday 11:00 - 12:30 (Science Cafe)">Thursday 11:00 - 12:30 (Science Cafe) · 90 min</option>
                <option value="Friday 15:00 - 16:30 (Online Google Meet)">Friday 15:00 - 16:30 (Online Google Meet) · 90 min</option>
              </select>
            </div>

            {/* Custom Note */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Barter Terms & Proposal Message:
              </label>
              <textarea
                value={proposalNote}
                onChange={(e) => setProposalNote(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                placeholder="Describe how you'd like to structure the swap session..."
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPair(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSendProposal}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Bilateral Proposal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

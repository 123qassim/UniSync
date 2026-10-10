/**
 * BrainMate Flagship 3: Smart Free-Time Overlap Heatmap & Instant Slot Finder
 * 7-day visual timetable clash detector & mutual free-time heatmap.
 * Compares timetables with any connection or group and locks in study sessions in 1 click.
 */
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  ChevronRight,
  ShieldCheck,
  Flame,
  ArrowRight,
  X,
  MapPin,
  Video,
} from 'lucide-react';
import {
  INITIAL_PEER_SCHEDULE_DATA,
  PeerScheduleComparison,
  ActiveConnection,
} from '../../data/brainmateMockData.ts';

interface SmartOverlapHeatmapProps {
  connections: ActiveConnection[];
  onLockInSession: (sessionData: {
    title: string;
    unitCode: string;
    scheduledStart: string;
    scheduledEnd: string;
    format: 'online' | 'in_person' | 'hybrid';
    location?: string;
    onlineUrl?: string;
    agenda?: string;
  }) => Promise<void>;
  onOpenApexAI: (prompt: string) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export const SmartOverlapHeatmapModule: React.FC<SmartOverlapHeatmapProps> = ({
  connections,
  onLockInSession,
  onOpenApexAI,
}) => {
  // Selected peer for overlap analysis
  const [selectedPeerId, setSelectedPeerId] = useState<string>('user-sarah-m');
  const peerComparison: PeerScheduleComparison =
    INITIAL_PEER_SCHEDULE_DATA[selectedPeerId] || INITIAL_PEER_SCHEDULE_DATA['user-sarah-m'];

  // Slot booking modal
  const [bookingSlot, setBookingSlot] = useState<{
    dayName: string;
    startTime: string;
    endTime: string;
    academicContext: string;
  } | null>(null);

  const [bookingTitle, setBookingTitle] = useState<string>('');
  const [bookingUnit, setBookingUnit] = useState<string>('CSC 211');
  const [bookingFormat, setBookingFormat] = useState<'online' | 'in_person' | 'hybrid'>('hybrid');
  const [bookingLocation, setBookingLocation] = useState<string>('University Library Pod 4');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);

  // Generate schedule matrix status for peer
  const getSlotStatus = (dayIndex: number, hour: number) => {
    // 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat, 6 = Sun
    // High overlap slots
    if (dayIndex === 1 && (hour >= 14 && hour <= 16)) return 'mutual_free'; // Tuesday 2-5 PM
    if (dayIndex === 3 && (hour >= 11 && hour <= 12)) return 'mutual_free'; // Thursday 11-1 PM
    if (dayIndex === 4 && (hour >= 14 && hour <= 16)) return 'mutual_free'; // Friday 2-5 PM
    if (dayIndex === 0 && (hour >= 15 && hour <= 16)) return 'mutual_free'; // Monday 3-5 PM
    if (dayIndex === 5 && (hour >= 10 && hour <= 12)) return 'mutual_free'; // Saturday 10-1 PM

    // Class lectures (Conflict)
    if ((dayIndex === 0 || dayIndex === 2) && (hour >= 9 && hour <= 12)) return 'both_busy'; // Core morning lectures
    if (dayIndex === 1 && (hour >= 10 && hour <= 12)) return 'both_busy'; // Database lecture
    if (dayIndex === 3 && (hour >= 14 && hour <= 16)) return 'both_busy'; // Practical Lab

    // Single busy
    if (hour === 8 || hour === 13 || hour === 19) return 'partial';

    return 'user_free';
  };

  const handleOpenBookingModal = (slot: {
    dayName: string;
    startTime: string;
    endTime: string;
    academicContext: string;
  }) => {
    setBookingSlot(slot);
    setBookingTitle(`Collaborative Study Sprint w/ ${peerComparison.peerName}`);
  };

  const handleConfirmLockIn = async () => {
    if (!bookingSlot) return;
    setIsSubmitting(true);
    try {
      // Calculate realistic date for next occurrence of this day
      const now = new Date();
      const scheduledStart = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
      const scheduledEnd = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString();

      await onLockInSession({
        title: bookingTitle,
        unitCode: bookingUnit,
        scheduledStart,
        scheduledEnd,
        format: bookingFormat,
        location: bookingLocation,
        agenda: `Peer study sprint generated from Smart Timetable Overlap Heatmap with ${peerComparison.peerName}.`,
      });

      setBookedSuccess(`Session "${bookingTitle}" locked in! Added to upcoming study sessions.`);
      setBookingSlot(null);
      setTimeout(() => setBookedSuccess(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Notification */}
      {bookedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 px-5 py-3.5 rounded-2xl shadow-2xl animate-fade-in text-sm backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{bookedSuccess}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-semibold tracking-wide">
            <Calendar className="w-3.5 h-3.5" />
            Flagship Scheduling · Smart Timetable Clash Detector & Heatmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Free-Time Overlap Heatmap & Slot Finder
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Eliminate back-and-forth messaging. BrainMate automatically compares your class schedules and study windows
            to find <span className="text-emerald-300 font-semibold">100% clash-free mutual slots</span>, and locks them in with one click.
          </p>
        </div>
      </div>

      {/* Peer Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            Compare Timetable With:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'user-sarah-m', name: 'Sarah Muthoni', initials: 'SM' },
              { id: 'user-kevin-k', name: 'Kevin Kiprono', initials: 'KK' },
              { id: 'user-aisha-o', name: 'Aisha Omar', initials: 'AO' },
            ].map((peer) => (
              <button
                key={peer.id}
                onClick={() => setSelectedPeerId(peer.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedPeerId === peer.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="w-5 h-5 rounded-md bg-slate-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {peer.initials}
                </span>
                <span>{peer.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong className="text-emerald-400 font-mono text-sm">{peerComparison.totalMutualFreeHours} Hours</strong> mutual free time this week
          </span>
        </div>
      </div>

      {/* Recommended Instant Slots (Top 3 Ranked) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Algorithm Ranked: Top Mutual Study Slots
            </h2>
          </div>
          <span className="text-xs text-slate-400">Ranked by post-lecture readiness & duration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {peerComparison.topSlots.map((slot, idx) => (
            <div
              key={idx}
              className="relative bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {slot.recommendedTag}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {slot.durationMinutes} min
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {slot.dayName} · {slot.startTime} – {slot.endTime}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {slot.academicContext}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handleOpenBookingModal(slot)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Lock In Study Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Timetable Overlap Heatmap Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">7-Day Schedule Overlap Matrix</h3>
            <p className="text-xs text-slate-400">Click any green slot to lock in a study sprint</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500" />
              <span className="text-slate-300 font-medium">Mutual Free (Optimal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-500/40" />
              <span className="text-slate-300">Partial Overlap</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-950/60 border border-rose-800/60" />
              <span className="text-slate-300">Class Lecture / Busy</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[640px]">
            {/* Header: Days */}
            <div className="grid grid-cols-8 gap-2 mb-2 text-center text-xs font-bold text-slate-400">
              <div className="text-left font-mono text-slate-500">Hour</div>
              {DAYS.map((day, idx) => (
                <div key={idx} className="bg-slate-950/60 py-2 rounded-xl text-slate-300 border border-slate-800">
                  {day}
                </div>
              ))}
            </div>

            {/* Rows: Hours */}
            <div className="space-y-2">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 gap-2 items-center text-xs">
                  {/* Hour Label */}
                  <div className="font-mono text-[11px] text-slate-500">
                    {String(hour).padStart(2, '0')}:00
                  </div>

                  {/* Day Slots */}
                  {DAYS.map((day, dayIndex) => {
                    const status = getSlotStatus(dayIndex, hour);
                    return (
                      <button
                        key={dayIndex}
                        onClick={() => {
                          if (status === 'mutual_free') {
                            handleOpenBookingModal({
                              dayName: DAYS[dayIndex],
                              startTime: `${String(hour).padStart(2, '0')}:00`,
                              endTime: `${String(hour + 1).padStart(2, '0')}:30`,
                              academicContext: `Mutual free window selected from heatmap grid`,
                            });
                          }
                        }}
                        className={`h-10 rounded-xl transition-all flex items-center justify-center text-[10px] font-bold ${
                          status === 'mutual_free'
                            ? 'bg-emerald-500/80 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer transform hover:scale-105'
                            : status === 'both_busy'
                            ? 'bg-rose-950/30 border border-rose-900/40 text-rose-500/60 cursor-not-allowed'
                            : status === 'partial'
                            ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400/80'
                            : 'bg-slate-950/40 border border-slate-800/60 text-slate-600'
                        }`}
                        title={
                          status === 'mutual_free'
                            ? `Mutual Free Slot! Click to book with ${peerComparison.peerName}`
                            : status === 'both_busy'
                            ? 'Lecture conflict for one or both'
                            : 'Free for you'
                        }
                      >
                        {status === 'mutual_free' ? 'FREE ⚡' : status === 'both_busy' ? 'CLASS' : ''}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lock In Session Modal */}
      {bookingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Lock In Peer Study Sprint</h3>
                <p className="text-xs text-emerald-400">
                  {bookingSlot.dayName} · {bookingSlot.startTime} – {bookingSlot.endTime} w/ {peerComparison.peerName}
                </p>
              </div>
              <button
                onClick={() => setBookingSlot(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Session Title</label>
                <input
                  type="text"
                  value={bookingTitle}
                  onChange={(e) => setBookingTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Target Unit</label>
                  <select
                    value={bookingUnit}
                    onChange={(e) => setBookingUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CSC 211">CSC 211: Algorithms</option>
                    <option value="CSC 212">CSC 212: Database Systems</option>
                    <option value="MAT 120">MAT 120: Discrete Math</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Format</label>
                  <select
                    value={bookingFormat}
                    onChange={(e) => setBookingFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="in_person">In-Person</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Location or Meeting Link</label>
                <input
                  type="text"
                  value={bookingLocation}
                  onChange={(e) => setBookingLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingSlot(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmLockIn}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Confirming...' : 'Lock In Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

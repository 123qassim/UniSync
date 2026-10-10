/**
 * BrainMate Study Sessions Module
 * Lightweight month calendar and agenda list views, session creation modal with
 * plain-text meeting link copying, RSVP controls, and transparent provider disclosures.
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Plus,
  Users,
  Check,
  X,
  Copy,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { StudySession, StudyGroup } from '../../data/brainmateMockData.ts';

interface StudySessionsModuleProps {
  sessions: StudySession[];
  studyGroups: StudyGroup[];
  onCreateSession: (data: {
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
  }) => Promise<void>;
  onRsvp: (sessionId: string, rsvp: 'going' | 'maybe' | 'declined') => Promise<void>;
}

export const StudySessionsModule: React.FC<StudySessionsModuleProps> = ({
  sessions,
  studyGroups,
  onCreateSession,
  onRsvp,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedUrlSessionId, setCopiedUrlSessionId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [unitCode, setUnitCode] = useState('CSC 211');
  const [format, setFormat] = useState<'online' | 'in_person' | 'hybrid'>('hybrid');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [location, setLocation] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Month navigation for lightweight calendar
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleCopyUrl = (sessionId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlSessionId(sessionId);
    setTimeout(() => setCopiedUrlSessionId(null), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    const startIso = new Date(`${startDate}T${startTime}:00`).toISOString();
    const endIso = new Date(`${startDate}T${endTime}:00`).toISOString();

    const selectedGroup = studyGroups.find((g) => g.id === selectedGroupId);

    setIsSubmitting(true);
    try {
      await onCreateSession({
        title,
        groupId: selectedGroupId || undefined,
        groupName: selectedGroup?.name,
        academicUnitCode: unitCode,
        academicUnitTitle: unitCode,
        scheduledStart: startIso,
        scheduledEnd: endIso,
        format,
        location,
        onlineUrl,
        agenda,
      });
      setIsCreateOpen(false);
      setTitle('');
      setAgenda('');
      setLocation('');
      setOnlineUrl('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  return (
    <div className="space-y-6">
      {/* Top Banner and View Controls */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Collaborative Study Sessions
              <span className="text-xs font-normal text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                {sessions.length} Scheduled Sessions
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Plan and join focused study sessions with your connections and study groups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-teal-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                List View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-teal-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Month Grid
              </button>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Plan Session
            </button>
          </div>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {sessions.map((sess) => {
            const startDateObj = new Date(sess.scheduledStart);
            const endDateObj = new Date(sess.scheduledEnd);
            const myParticipant = sess.participants.find((p) => p.userId === 'demo-student-01');
            const myRsvp = myParticipant?.rsvp || 'none';

            return (
              <div
                key={sess.id}
                className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        {sess.academicUnitCode}
                      </span>
                      {sess.groupName && (
                        <span className="text-xs text-slate-400">· {sess.groupName}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">{sess.title}</h3>
                    <p className="text-xs text-slate-400">Organized by {sess.createdByName}</p>
                  </div>

                  <div className="text-right text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="font-semibold text-teal-300">
                      {startDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {startDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {endDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Agenda */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-line">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block mb-1">
                    Session Agenda
                  </span>
                  {sess.agenda}
                </div>

                {/* Format & Location or Video URL */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  {sess.location && (
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <span>{sess.location}</span>
                    </div>
                  )}

                  {sess.onlineUrl && (
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-mono text-[11px] text-slate-300 truncate max-w-xs">{sess.onlineUrl}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(sess.id, sess.onlineUrl!)}
                        className="p-1 hover:text-teal-400 text-slate-400 transition-colors"
                        title="Copy meeting URL"
                      >
                        {copiedUrlSessionId === sess.id ? (
                          <Check className="w-3.5 h-3.5 text-teal-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Explicit Disclaimer for online links */}
                {sess.onlineUrl && (
                  <p className="text-[11px] text-slate-500 italic">
                    Note: You'll join through the link your group shared. UniSync does not auto-host audio/video rooms without external provider credentials.
                  </p>
                )}

                {/* RSVP Controls and Participant Count */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {sess.participants.filter((p) => p.rsvp === 'going').length} going ·{' '}
                      {sess.participants.filter((p) => p.rsvp === 'maybe').length} maybe
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 mr-1">Your RSVP:</span>
                    <button
                      type="button"
                      onClick={() => onRsvp(sess.id, 'going')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        myRsvp === 'going'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      Going
                    </button>
                    <button
                      type="button"
                      onClick={() => onRsvp(sess.id, 'maybe')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        myRsvp === 'maybe'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      Maybe
                    </button>
                    <button
                      type="button"
                      onClick={() => onRsvp(sess.id, 'declined')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        myRsvp === 'declined'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      Can't make it
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MONTH GRID VIEW */}
      {viewMode === 'calendar' && (
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">{monthName}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="p-2 font-semibold text-slate-500">
                {d}
              </div>
            ))}

            {calendarDays.map((d, index) => {
              if (!d) {
                return <div key={`empty-${index}`} className="p-4 bg-slate-950/20 rounded-xl" />;
              }

              const dString = d.toISOString().split('T')[0];
              const daySessions = sessions.filter((s) => s.scheduledStart.startsWith(dString));

              return (
                <div
                  key={dString}
                  className="p-2 min-h-24 bg-slate-950/80 border border-slate-800/80 rounded-xl text-left flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold text-slate-400">{d.getDate()}</span>
                  <div className="space-y-1 mt-1">
                    {daySessions.map((s) => (
                      <div
                        key={s.id}
                        className="px-1.5 py-0.5 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded text-[10px] font-semibold truncate"
                        title={s.title}
                      >
                        {s.academicUnitCode}: {s.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Plan Session */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Plan Collaborative Study Session</h3>
                <p className="text-xs text-slate-400 mt-0.5">Invite connections or schedule for an existing group</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dynamic Programming Peer Walkthrough"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Academic Unit</label>
                  <select
                    value={unitCode}
                    onChange={(e) => setUnitCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="CSC 211">CSC 211 - Data Structures</option>
                    <option value="CSC 212">CSC 212 - Database Systems</option>
                    <option value="CSC 111">CSC 111 - C Programming</option>
                    <option value="MAT 120">MAT 120 - Discrete Math</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Associated Group (Optional)</label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="">Independent Session</option>
                    {studyGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Physical Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Complex Lab 3B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Meeting URL (Google Meet / Zoom)</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={onlineUrl}
                    onChange={(e) => setOnlineUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Agenda & Study Plan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline key questions, exercises, or code samples to review..."
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

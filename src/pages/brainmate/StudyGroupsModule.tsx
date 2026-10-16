/**
 * BrainMate Study Groups Management Module
 *
 * Full-featured study group management view:
 * 1. Browse Public & Active Groups with search, unit filter, format filter, membership filter & sorting
 * 2. Create New Group modal with unit selection, purpose/scope, capacity caps (2-20), format & meeting links
 * 3. Group Detail view with member roster, group-specific upcoming study sessions with RSVP controls,
 *    shared academic resources, and integrated session scheduling.
 */
import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  Shield,
  X,
  Check,
  FileText,
  Lock,
  Globe,
  Download,
  Trash2,
  UserPlus,
  ArrowRight,
  Filter,
  Search,
  MapPin,
  Video,
  Copy,
  CheckCircle2,
  AlertCircle,
  Share2,
  LogOut,
  ChevronRight,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Bookmark,
} from 'lucide-react';
import { StudyGroup, StudySession } from '../../data/brainmateMockData.ts';

export interface StudyGroupsModuleProps {
  groups: StudyGroup[];
  sessions?: StudySession[];
  onCreateGroup: (data: {
    name: string;
    purpose: string;
    academicUnitCode: string;
    academicUnitTitle: string;
    format: 'online' | 'in_person' | 'hybrid';
    location?: string;
    onlineUrl?: string;
    maxMembers: number;
    visibility: 'public' | 'invite_only';
  }) => Promise<void>;
  onJoinGroup: (groupId: string) => Promise<void>;
  onLeaveGroup?: (groupId: string) => Promise<void>;
  onAddResource?: (groupId: string, data: { title: string; type: string; size?: string }) => Promise<void>;
  onScheduleSessionForGroup?: (group: StudyGroup) => void;
  onCreateSession?: (data: {
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
  onRsvp?: (sessionId: string, rsvp: 'going' | 'maybe' | 'declined') => Promise<void>;
  onBlockUser?: (userId: string, userName: string) => void;
  onReportUser?: (userId: string, userName: string) => void;
  currentUserId?: string;
}

export const SAMPLE_UNITS = [
  { code: 'CSC 211', title: 'Data Structures & Algorithms' },
  { code: 'CSC 212', title: 'Database Systems & SQL Modeling' },
  { code: 'CSC 111', title: 'Introduction to Programming in C' },
  { code: 'CSC 121', title: 'Object-Oriented Programming (Java)' },
  { code: 'CSC 311', title: 'Operating Systems & Concurrency' },
  { code: 'MAT 120', title: 'Discrete Mathematics' },
  { code: 'MAT 210', title: 'Linear Algebra for Computing' },
  { code: 'STA 201', title: 'Probability & Statistics for CS' },
];

export const StudyGroupsModule: React.FC<StudyGroupsModuleProps> = ({
  groups,
  sessions = [],
  onCreateGroup,
  onJoinGroup,
  onLeaveGroup,
  onAddResource,
  onScheduleSessionForGroup,
  onCreateSession,
  onRsvp,
  onBlockUser,
  onReportUser,
  currentUserId = 'demo-student-01',
}) => {
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [membershipFilter, setMembershipFilter] = useState<'all' | 'my_groups' | 'open_spots'>('all');
  const [sortBy, setSortBy] = useState<'sessions_first' | 'members_count' | 'name'>('sessions_first');

  // Active Modals & Views
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeGroupDetail, setActiveGroupDetail] = useState<StudyGroup | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'members' | 'sessions' | 'resources'>('overview');

  // Schedule Session Modal for a specific group
  const [isScheduleSessionOpen, setIsScheduleSessionOpen] = useState(false);
  const [sessionForGroup, setSessionForGroup] = useState<StudyGroup | null>(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState('14:00');
  const [sessionEndTime, setSessionEndTime] = useState('16:00');
  const [sessionFormat, setSessionFormat] = useState<'online' | 'in_person' | 'hybrid'>('hybrid');
  const [sessionLocation, setSessionLocation] = useState('');
  const [sessionOnlineUrl, setSessionOnlineUrl] = useState('');
  const [sessionAgenda, setSessionAgenda] = useState('');
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);

  // Add Resource Modal
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('Study Notes');
  const [resourceSize, setResourceSize] = useState('1.2 MB');
  const [isSubmittingResource, setIsSubmittingResource] = useState(false);

  // Create Group Form State
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [unitCode, setUnitCode] = useState('CSC 211');
  const [customUnitTitle, setCustomUnitTitle] = useState('');
  const [format, setFormat] = useState<'online' | 'in_person' | 'hybrid'>('hybrid');
  const [locationStr, setLocationStr] = useState('Siriba Library Discussion Room 3');
  const [onlineUrlStr, setOnlineUrlStr] = useState('https://meet.google.com/study-group');
  const [maxMembers, setMaxMembers] = useState(6);
  const [visibility, setVisibility] = useState<'public' | 'invite_only'>('public');
  const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);

  // Interaction feedback states
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    triggerToast('Meeting link copied to clipboard!');
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Filter & Sort Logic
  const filteredGroups = useMemo(() => {
    return groups
      .filter((g) => {
        // Unit Filter
        if (selectedUnit !== 'all' && g.academicUnitCode !== selectedUnit) return false;

        // Format Filter
        if (selectedFormat !== 'all' && g.format !== selectedFormat) return false;

        // Membership Filter
        const isMember = (g as any).isMember || g.members.some((m) => m.userId === currentUserId);
        if (membershipFilter === 'my_groups' && !isMember) return false;
        if (membershipFilter === 'open_spots' && g.currentMemberCount >= g.maxMembers) return false;

        // Keyword Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = g.name.toLowerCase().includes(q);
          const matchPurpose = g.purpose.toLowerCase().includes(q);
          const matchUnit = g.academicUnitCode.toLowerCase().includes(q);
          const matchTitle = g.academicUnitTitle.toLowerCase().includes(q);
          const matchOwner = g.ownerName.toLowerCase().includes(q);
          if (!matchName && !matchPurpose && !matchUnit && !matchTitle && !matchOwner) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'sessions_first') {
          const hasSessionA = a.nextSession ? 1 : 0;
          const hasSessionB = b.nextSession ? 1 : 0;
          if (hasSessionA !== hasSessionB) return hasSessionB - hasSessionA;
          return b.currentMemberCount - a.currentMemberCount;
        }
        if (sortBy === 'members_count') {
          return b.currentMemberCount - a.currentMemberCount;
        }
        return a.name.localeCompare(b.name);
      });
  }, [groups, selectedUnit, selectedFormat, membershipFilter, searchQuery, sortBy, currentUserId]);

  // Unique units in existing groups for filter pills
  const availableUnitCodes = useMemo(() => {
    const set = new Set<string>();
    groups.forEach((g) => set.add(g.academicUnitCode));
    SAMPLE_UNITS.forEach((u) => set.add(u.code));
    return Array.from(set);
  }, [groups]);

  // Helper to get sessions specifically for a study group
  const getGroupSessions = (groupId: string, unitCode: string) => {
    return sessions.filter(
      (s) => s.groupId === groupId || (s.academicUnitCode === unitCode && s.groupName?.includes(groupId))
    );
  };

  // Form Submissions
  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !purpose.trim()) return;

    const unitObj = SAMPLE_UNITS.find((u) => u.code === unitCode);
    const unitTitle = unitObj ? unitObj.title : customUnitTitle || unitCode;

    setIsSubmittingGroup(true);
    try {
      await onCreateGroup({
        name: name.trim(),
        purpose: purpose.trim(),
        academicUnitCode: unitCode,
        academicUnitTitle: unitTitle,
        format,
        location: format !== 'online' ? locationStr : undefined,
        onlineUrl: format !== 'in_person' ? onlineUrlStr : undefined,
        maxMembers: Math.min(20, Math.max(2, maxMembers)),
        visibility,
      });
      setIsCreateOpen(false);
      setName('');
      setPurpose('');
      triggerToast(`Study Circle "${name}" created successfully!`);
    } finally {
      setIsSubmittingGroup(false);
    }
  };

  const handleJoin = async (groupId: string) => {
    setJoiningGroupId(groupId);
    try {
      await onJoinGroup(groupId);
      triggerToast('Joined study circle! You now have access to group sessions.');
    } finally {
      setJoiningGroupId(null);
    }
  };

  const handleLeave = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to leave this study group?')) return;
    setLeavingGroupId(groupId);
    try {
      if (onLeaveGroup) {
        await onLeaveGroup(groupId);
      } else {
        const res = await fetch(`/api/brainmate/groups/${groupId}/leave`, { method: 'POST' });
        if (res.ok) {
          triggerToast('Left study group.');
        }
      }
      if (activeGroupDetail?.id === groupId) {
        setActiveGroupDetail(null);
      }
    } finally {
      setLeavingGroupId(null);
    }
  };

  const handleOpenScheduleSession = (group: StudyGroup) => {
    setSessionForGroup(group);
    setSessionTitle(`${group.academicUnitCode} Problem Review & Discussion`);
    // Default to 2 days from now at 14:00
    const d = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    setSessionDate(d.toISOString().split('T')[0]);
    setSessionFormat(group.format);
    setSessionLocation('Siriba Campus Discussion Room');
    setSessionOnlineUrl('https://meet.google.com/study-' + group.id.slice(0, 8));
    setSessionAgenda('1. Homework problem walk-through\n2. Key exam concepts clarification\n3. Q&A and peer code review');
    setIsScheduleSessionOpen(true);
  };

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForGroup || !sessionTitle.trim() || !sessionDate) return;

    setIsSubmittingSession(true);
    try {
      const scheduledStart = new Date(`${sessionDate}T${sessionStartTime}:00`).toISOString();
      const scheduledEnd = new Date(`${sessionDate}T${sessionEndTime}:00`).toISOString();

      const sessionPayload = {
        title: sessionTitle.trim(),
        groupId: sessionForGroup.id,
        groupName: sessionForGroup.name,
        academicUnitCode: sessionForGroup.academicUnitCode,
        academicUnitTitle: sessionForGroup.academicUnitTitle,
        scheduledStart,
        scheduledEnd,
        format: sessionFormat,
        location: sessionFormat !== 'online' ? sessionLocation : undefined,
        onlineUrl: sessionFormat !== 'in_person' ? sessionOnlineUrl : undefined,
        agenda: sessionAgenda,
      };

      if (onCreateSession) {
        await onCreateSession(sessionPayload);
      } else if (onScheduleSessionForGroup) {
        onScheduleSessionForGroup(sessionForGroup);
      } else {
        await fetch('/api/brainmate/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionPayload),
        });
      }

      setIsScheduleSessionOpen(false);
      triggerToast('Study session scheduled for ' + sessionForGroup.name + '!');
    } finally {
      setIsSubmittingSession(false);
    }
  };

  const handleAddResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroupDetail || !resourceTitle.trim()) return;

    setIsSubmittingResource(true);
    try {
      if (onAddResource) {
        await onAddResource(activeGroupDetail.id, {
          title: resourceTitle.trim(),
          type: resourceType,
          size: resourceSize,
        });
      } else {
        await fetch(`/api/brainmate/groups/${activeGroupDetail.id}/resources`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: resourceTitle.trim(),
            type: resourceType,
            size: resourceSize,
          }),
        });
      }
      setIsAddResourceOpen(false);
      setResourceTitle('');
      triggerToast('Shared resource added to group!');
    } finally {
      setIsSubmittingResource(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-teal-500/40 bg-slate-900/95 text-teal-300 text-xs shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Action Controls */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Course Study Groups
              </h2>
              <span className="text-xs font-medium text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                {filteredGroups.length} Active Circles
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Browse public academic study circles at Maseno University. Groups are strictly capped between 2 to 20 peers to guarantee active participation, mutual accountability, and focused discussion.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/20"
            >
              <Plus className="w-4 h-4" />
              Create Study Group
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80">
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">
              Search by Topic, Unit, or Host
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. Dynamic Programming, CSC 211, SQL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Academic Unit Dropdown */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">
              Academic Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">All Course Units</option>
              {availableUnitCodes.map((code) => {
                const info = SAMPLE_UNITS.find((u) => u.code === code);
                return (
                  <option key={code} value={code}>
                    {code} {info ? `- ${info.title}` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Format Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">
              Meeting Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">All Formats</option>
              <option value="hybrid">Hybrid</option>
              <option value="in_person">In-Person Only</option>
              <option value="online">Online Only</option>
            </select>
          </div>

          {/* Membership Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">
              Membership
            </label>
            <select
              value={membershipFilter}
              onChange={(e) => setMembershipFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">All Groups</option>
              <option value="my_groups">My Circles (Joined)</option>
              <option value="open_spots">Open Spots Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No study circles found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchQuery || selectedUnit !== 'all' || selectedFormat !== 'all' || membershipFilter !== 'all'
              ? 'No groups match your current filter criteria. Try clearing some filters or create a new group for your course unit.'
              : 'Be the first to start a peer study group for your academic unit at Maseno University!'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {(searchQuery || selectedUnit !== 'all' || selectedFormat !== 'all' || membershipFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedUnit('all');
                  setSelectedFormat('all');
                  setMembershipFilter('all');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/20"
            >
              Create Study Group
            </button>
          </div>
        </div>
      )}

      {/* Study Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group) => {
          const isMember = (group as any).isMember || group.members.some((m) => m.userId === currentUserId);
          const isOwner = (group as any).isOwner || group.ownerId === currentUserId;
          const isFull = group.currentMemberCount >= group.maxMembers;
          const groupSessions = getGroupSessions(group.id, group.academicUnitCode);
          const nextSession = group.nextSession || groupSessions[0];

          return (
            <div
              key={group.id}
              className={`bg-slate-900/80 border rounded-2xl p-5 space-y-4 transition-all shadow-md flex flex-col justify-between ${
                isMember
                  ? 'border-teal-500/30 hover:border-teal-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header: Unit Code and Capacity Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-md inline-block">
                      {group.academicUnitCode}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2 hidden sm:inline">
                      {group.academicUnitTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isFull
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {group.currentMemberCount}/{group.maxMembers} members
                    </span>
                  </div>
                </div>

                {/* Group Title & Purpose */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {group.purpose}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-300">
                      {group.format === 'online' ? (
                        <Video className="w-3.5 h-3.5 text-sky-400" />
                      ) : group.format === 'in_person' ? (
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-teal-400" />
                      )}
                      <span className="capitalize">{group.format.replace('_', '-')}</span>
                    </span>

                    <span className="text-slate-400">
                      Lead: <strong className="text-slate-200 font-medium">{group.ownerName}</strong>
                    </span>
                  </div>

                  {/* Upcoming Study Session Box */}
                  {nextSession ? (
                    <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-teal-300 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-teal-400">
                          <Calendar className="w-3 h-3" /> Upcoming Meetup
                        </span>
                        <span className="text-slate-400">
                          {new Date(nextSession.scheduledStart).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 truncate">
                        {nextSession.title}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/60 text-[10px] text-slate-500 italic flex items-center justify-between">
                      <span>No active session scheduled yet</span>
                      {isMember && (
                        <button
                          type="button"
                          onClick={() => handleOpenScheduleSession(group)}
                          className="text-teal-400 hover:text-teal-300 font-semibold"
                        >
                          + Schedule
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveGroupDetail(group);
                    setActiveDetailTab('overview');
                  }}
                  className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white font-medium transition-colors flex items-center gap-1"
                >
                  View Details
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>

                <div className="flex items-center gap-2">
                  {isMember ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        {isOwner ? 'Leader' : 'Member'}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isFull || joiningGroupId === group.id}
                      onClick={() => handleJoin(group.id)}
                      className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all disabled:opacity-40 shadow-sm"
                    >
                      {isFull ? 'Full Circle' : joiningGroupId === group.id ? 'Joining...' : 'Join Group'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MODAL: Create New Study Group
         ========================================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Create New Course Study Group</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Maseno University peer-to-peer collaborative academic circle
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              {/* Group Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Circle Name <span className="text-teal-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Programming & Graph Theory Masters"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Course Unit Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Academic Course Unit <span className="text-teal-400">*</span>
                </label>
                <select
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                >
                  {SAMPLE_UNITS.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.code} - {u.title}
                    </option>
                  ))}
                  <option value="CUSTOM">Other / Custom Course Unit</option>
                </select>
                {unitCode === 'CUSTOM' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter unit code and title (e.g. CSC 325 - Distributed Systems)"
                    value={customUnitTitle}
                    onChange={(e) => setCustomUnitTitle(e.target.value)}
                    className="w-full mt-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                )}
              </div>

              {/* Purpose & Scope */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Study Scope & Purpose <span className="text-teal-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline syllabus topics, target exam preparation (e.g. CAT 1 & 2), and collaborative problem sets to work through..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Format & Capacity Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="hybrid">Hybrid (Lab + Meet)</option>
                    <option value="in_person">In-Person Only</option>
                    <option value="online">Online Video Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Max Capacity (2–20 students)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Meeting Venue or URL */}
              {format !== 'online' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Campus Meeting Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Complex Lab 3B or Siriba Discussion Pod"
                    value={locationStr}
                    onChange={(e) => setLocationStr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              )}

              {format !== 'in_person' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Virtual Meeting URL</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xyz-unisync-dp"
                    value={onlineUrlStr}
                    onChange={(e) => setOnlineUrlStr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              )}

              {/* Visibility */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Group Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      visibility === 'public'
                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Public Maseno Circle
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Discoverable by all verified enrolled peers
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility('invite_only')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      visibility === 'invite_only'
                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Invite Only
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Only peers invited by members can join
                    </span>
                  </button>
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingGroup}
                  className="px-5 py-2 text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {isSubmittingGroup ? 'Creating Circle...' : 'Create Study Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: Comprehensive Group Details View (Members + Sessions + Resources)
         ========================================================================= */}
      {activeGroupDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-7 space-y-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
            {/* Header with Group Title & Badges */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-md">
                    {activeGroupDetail.academicUnitCode} · {activeGroupDetail.academicUnitTitle}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-md">
                    {activeGroupDetail.format.replace('_', '-')}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    {activeGroupDetail.institutionName || 'Maseno University'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {activeGroupDetail.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {activeGroupDetail.purpose}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGroupDetail(null)}
                className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {[
                { id: 'overview', label: 'Overview & Venue' },
                { id: 'members', label: `Members (${activeGroupDetail.members.length}/${activeGroupDetail.maxMembers})` },
                {
                  id: 'sessions',
                  label: `Study Sessions (${getGroupSessions(activeGroupDetail.id, activeGroupDetail.academicUnitCode).length})`,
                },
                { id: 'resources', label: `Resources (${activeGroupDetail.resources.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDetailTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeDetailTab === tab.id
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Overview & Venue */}
            {activeDetailTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Lead Organizer
                    </span>
                    <span className="text-sm font-bold text-white">{activeGroupDetail.ownerName}</span>
                    <span className="text-xs text-slate-500 block">Created {new Date(activeGroupDetail.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Member Capacity
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-teal-400">
                        {activeGroupDetail.members.length} / {activeGroupDetail.maxMembers} Students
                      </span>
                      {activeGroupDetail.members.length >= activeGroupDetail.maxMembers && (
                        <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md">
                          Full Circle
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block">Cap enforced for optimal discussion</span>
                  </div>
                </div>

                {/* Meeting Location / Virtual Links */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                    Campus Meeting Venue & Virtual Room
                  </span>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Physical Venue: <strong>Siriba Campus Study Room 3B / Science Lab</strong></span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="font-mono text-xs text-slate-200">
                          https://meet.google.com/study-{activeGroupDetail.id.slice(0, 8)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `https://meet.google.com/study-${activeGroupDetail.id.slice(0, 8)}`,
                            'meet-link'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedLink === 'meet-link' ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Group Members */}
            {activeDetailTab === 'members' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Active Study Partners ({activeGroupDetail.members.length})
                  </span>
                  <span className="text-xs text-slate-500">
                    {activeGroupDetail.maxMembers - activeGroupDetail.members.length} seats available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeGroupDetail.members.map((m) => {
                    const isSelf = m.userId === currentUserId;
                    return (
                      <div
                        key={m.userId}
                        className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 flex items-center justify-center font-bold text-xs">
                            {m.avatarInitials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-100">
                              <span>{m.displayName}</span>
                              {isSelf && (
                                <span className="text-[10px] text-teal-400 font-normal">(You)</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500">
                              Joined {new Date(m.joinedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              m.role === 'owner'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : m.role === 'moderator'
                                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {m.role}
                          </span>

                          {!isSelf && onReportUser && (
                            <button
                              type="button"
                              onClick={() => onReportUser(m.userId, m.displayName)}
                              className="text-slate-500 hover:text-rose-400 p-1 text-[10px] transition-colors"
                              title="Report peer"
                            >
                              Report
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Upcoming Study Sessions */}
            {activeDetailTab === 'sessions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Group Study Sessions
                    </h4>
                    <p className="text-xs text-slate-400">
                      Coordinated group study meetups for {activeGroupDetail.academicUnitCode}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenScheduleSession(activeGroupDetail)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Schedule New Session
                  </button>
                </div>

                {(() => {
                  const groupSessions = getGroupSessions(activeGroupDetail.id, activeGroupDetail.academicUnitCode);

                  if (groupSessions.length === 0) {
                    return (
                      <div className="p-8 text-center bg-slate-950 rounded-2xl border border-dashed border-slate-800 space-y-3">
                        <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs text-slate-300 font-semibold">
                          No study sessions currently scheduled for this group.
                        </p>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                          Propose a meetup to prepare for upcoming tests, review problem sets, or compare syllabus notes.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenScheduleSession(activeGroupDetail)}
                          className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-400 border border-teal-500/30 rounded-xl text-xs font-bold transition-all"
                        >
                          + Propose Group Session
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {groupSessions.map((sess) => {
                        const goingCount = sess.participants.filter((p) => p.rsvp === 'going').length;
                        const myRsvp = sess.participants.find((p) => p.userId === currentUserId)?.rsvp || (sess as any).myRsvp;

                        return (
                          <div
                            key={sess.id}
                            className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                  {sess.title}
                                  <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                                    {sess.format}
                                  </span>
                                </h5>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                  <span className="flex items-center gap-1 text-slate-300">
                                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                                    {new Date(sess.scheduledStart).toLocaleDateString(undefined, {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })}{' '}
                                    ·{' '}
                                    {new Date(sess.scheduledStart).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    {' – '}
                                    {new Date(sess.scheduledEnd).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  {sess.location && (
                                    <span className="flex items-center gap-1 text-slate-400 truncate">
                                      <MapPin className="w-3 h-3 text-amber-400" />
                                      {sess.location}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* RSVP Controls */}
                              <div className="flex items-center gap-1.5 self-start sm:self-center">
                                <span className="text-[11px] text-slate-400 mr-1.5 font-medium">
                                  {goingCount} attending
                                </span>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (onRsvp) {
                                      await onRsvp(sess.id, 'going');
                                    } else {
                                      await fetch(`/api/brainmate/sessions/${sess.id}/rsvp`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ rsvp: 'going' }),
                                      });
                                    }
                                    triggerToast('RSVP: Going to session!');
                                  }}
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    myRsvp === 'going'
                                      ? 'bg-teal-500 text-slate-950 font-bold'
                                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                                  }`}
                                >
                                  Going
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (onRsvp) {
                                      await onRsvp(sess.id, 'maybe');
                                    } else {
                                      await fetch(`/api/brainmate/sessions/${sess.id}/rsvp`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ rsvp: 'maybe' }),
                                      });
                                    }
                                    triggerToast('RSVP: Marked as Maybe');
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    myRsvp === 'maybe'
                                      ? 'bg-amber-500 text-slate-950 font-bold'
                                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                  }`}
                                >
                                  Maybe
                                </button>
                              </div>
                            </div>

                            {/* Agenda */}
                            {sess.agenda && (
                              <div className="p-2.5 bg-slate-900/60 rounded-xl text-xs text-slate-300 whitespace-pre-line border border-slate-800/80">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                                  Session Agenda:
                                </span>
                                {sess.agenda}
                              </div>
                            )}

                            {sess.onlineUrl && (
                              <div className="flex items-center justify-between text-xs pt-1">
                                <span className="text-slate-400 font-mono text-[11px] truncate">
                                  {sess.onlineUrl}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(sess.onlineUrl!, sess.id)}
                                  className="text-teal-400 hover:text-teal-300 text-xs font-medium flex items-center gap-1"
                                >
                                  <Copy className="w-3 h-3" />
                                  {copiedLink === sess.id ? 'Copied' : 'Copy Link'}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 4: Shared Resources */}
            {activeDetailTab === 'resources' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Shared Academic Resources</h4>
                    <p className="text-xs text-slate-400">Notes, formula sheets, code exercises, and past papers</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddResourceOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Share Material
                  </button>
                </div>

                {activeGroupDetail.resources.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-6 text-center bg-slate-950 rounded-2xl border border-slate-800">
                    No materials shared yet. Members can upload notes, cheatsheets, and summaries here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activeGroupDetail.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 text-slate-200">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-300 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold block">{res.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {res.type} · Uploaded by {res.uploadedBy} · {res.size}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => triggerToast(`Opening "${res.title}"...`)}
                          className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Footer Actions */}
            <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(activeGroupDetail as StudyGroup & { isMember?: boolean }).isMember ||
                activeGroupDetail.members.some((m) => m.userId === currentUserId) ? (
                  <button
                    type="button"
                    disabled={leavingGroupId === activeGroupDetail.id}
                    onClick={() => handleLeave(activeGroupDetail.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {leavingGroupId === activeGroupDetail.id ? 'Leaving...' : 'Leave Group'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={
                      activeGroupDetail.members.length >= activeGroupDetail.maxMembers ||
                      joiningGroupId === activeGroupDetail.id
                    }
                    onClick={() => handleJoin(activeGroupDetail.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-40"
                  >
                    <UserPlus className="w-4 h-4" />
                    {activeGroupDetail.members.length >= activeGroupDetail.maxMembers
                      ? 'Group Full'
                      : 'Join Study Circle'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenScheduleSession(activeGroupDetail)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule Session
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGroupDetail(null)}
                  className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: Schedule Session for Specific Group
         ========================================================================= */}
      {isScheduleSessionOpen && sessionForGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Schedule Study Session</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  For: <span className="text-teal-300 font-semibold">{sessionForGroup.name}</span> ({sessionForGroup.academicUnitCode})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleSessionOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Session Topic / Title</label>
                <input
                  type="text"
                  required
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Dynamic Programming Memoization Review"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Start Time</label>
                  <input
                    type="time"
                    required
                    value={sessionStartTime}
                    onChange={(e) => setSessionStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">End Time</label>
                  <input
                    type="time"
                    required
                    value={sessionEndTime}
                    onChange={(e) => setSessionEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Session Format</label>
                <select
                  value={sessionFormat}
                  onChange={(e) => setSessionFormat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                >
                  <option value="hybrid">Hybrid</option>
                  <option value="in_person">In-Person Only</option>
                  <option value="online">Online Video Only</option>
                </select>
              </div>

              {sessionFormat !== 'online' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={sessionLocation}
                    onChange={(e) => setSessionLocation(e.target.value)}
                    placeholder="e.g. Siriba Campus Library Discussion Room 4"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              )}

              {sessionFormat !== 'in_person' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Meeting URL</label>
                  <input
                    type="url"
                    value={sessionOnlineUrl}
                    onChange={(e) => setSessionOnlineUrl(e.target.value)}
                    placeholder="https://meet.google.com/xyz-unisync-dp"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Agenda / Discussion Points</label>
                <textarea
                  rows={3}
                  value={sessionAgenda}
                  onChange={(e) => setSessionAgenda(e.target.value)}
                  placeholder="1. Topic walkthrough\n2. Solve exercises\n3. Q&A"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleSessionOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSession}
                  className="px-5 py-2 text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {isSubmittingSession ? 'Scheduling...' : 'Schedule Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: Share Resource with Group
         ========================================================================= */}
      {isAddResourceOpen && activeGroupDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Share Resource with Group</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adding to {activeGroupDetail.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddResourceOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddResourceSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Document / Material Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Traversals Cheat Sheet & Code Examples"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Resource Type</label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="Study Guide">Study Guide</option>
                    <option value="Code Examples">Code Examples</option>
                    <option value="Lecture Summary">Lecture Summary</option>
                    <option value="Past Paper">Past Paper & Solutions</option>
                    <option value="Cheatsheet">Cheatsheet</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Estimated Size / Link</label>
                  <input
                    type="text"
                    value={resourceSize}
                    onChange={(e) => setResourceSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddResourceOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingResource}
                  className="px-5 py-2 text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {isSubmittingResource ? 'Sharing...' : 'Share Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroupsModule;

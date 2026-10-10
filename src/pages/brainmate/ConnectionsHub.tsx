/**
 * BrainMate Connections Hub
 * Multi-tab interface managing Incoming, Outgoing, and Active Peer Connections.
 * Quick actions with confirmation dialogs, APEX AI Study Buddy linkage, and safety overflow menus.
 */

import React, { useState } from 'react';
import {
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  UserCheck,
  Check,
  X,
  Clock,
  Sparkles,
  MessageSquare,
  MoreVertical,
  UserX,
  Flag,
  BookOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { ConnectionRequest, ActiveConnection } from '../../data/brainmateMockData.ts';

interface ConnectionsHubProps {
  incomingRequests: ConnectionRequest[];
  outgoingRequests: ConnectionRequest[];
  activeConnections: ActiveConnection[];
  onRespondRequest: (requestId: string, action: 'accept' | 'decline' | 'withdraw') => Promise<void>;
  onOpenApexAI: (peerContext?: { name: string; sharedUnits: number }) => void;
  onBlockUser: (userId: string, userName: string) => void;
  onReportUser: (userId: string, userName: string) => void;
  onDiscoverMore: () => void;
}

export const ConnectionsHub: React.FC<ConnectionsHubProps> = ({
  incomingRequests,
  outgoingRequests,
  activeConnections,
  onRespondRequest,
  onOpenApexAI,
  onBlockUser,
  onReportUser,
  onDiscoverMore,
}) => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'active'>('incoming');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  const handleAction = async (requestId: string, action: 'accept' | 'decline' | 'withdraw') => {
    setProcessingId(requestId);
    try {
      await onRespondRequest(requestId, action);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Tabs */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Study Connections Hub
              <span className="text-xs font-normal text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                {activeConnections.length} Active Partners
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Connect 1-on-1 with verified academic peers to review assignments, share notes, and co-study.
            </p>
          </div>

          <button
            onClick={onDiscoverMore}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-teal-500/20 shrink-0"
          >
            + Find New Peers
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'incoming'
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Incoming Requests
            {incomingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-500 text-slate-950 font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outgoing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'outgoing'
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Outgoing Requests
            {outgoingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-bold">
                {outgoingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Active Connections ({activeConnections.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Incoming Requests */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No pending incoming connection requests</h3>
              <p className="text-xs text-slate-400">
                When fellow students discover your strengths in the peer directory, their invitations will appear here.
              </p>
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{req.senderName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {req.matchScore}% Compatibility
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {req.senderProgramme} · {req.senderStudyLevel}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    Received {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {req.note && (
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                    "{req.note}"
                  </div>
                )}

                <div className="text-[11px] text-teal-300 bg-teal-950/20 p-2.5 rounded-xl border border-teal-500/20">
                  <strong>Match rationale:</strong> {req.matchReason}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, 'accept')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept Connection
                    </button>

                    <button
                      type="button"
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, 'decline')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuUserId(activeMenuUserId === req.senderId ? null : req.senderId)}
                      className="p-1.5 text-slate-500 hover:text-white rounded-lg transition-colors"
                      title="More actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuUserId === req.senderId && (
                      <div className="absolute right-0 bottom-full mb-1 w-36 bg-slate-950 border border-slate-800 rounded-xl shadow-xl z-10 p-1 text-xs space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuUserId(null);
                            onBlockUser(req.senderId, req.senderName);
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                        >
                          Block Peer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuUserId(null);
                            onReportUser(req.senderId, req.senderName);
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 rounded-lg transition-colors"
                        >
                          Report User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Outgoing Requests */}
      {activeTab === 'outgoing' && (
        <div className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No active outgoing requests</h3>
              <p className="text-xs text-slate-400">
                You have no pending requests awaiting reply. Browse peer profiles to request study partnerships.
              </p>
            </div>
          ) : (
            outgoingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white">Request to {req.receiverName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Status: <span className="text-amber-400 font-semibold">Awaiting acceptance</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Sent {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {req.note && (
                  <p className="text-xs text-slate-300 italic bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    "{req.note}"
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={processingId === req.id}
                    onClick={() => handleAction(req.id, 'withdraw')}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                  >
                    Withdraw Request
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Active Connections */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeConnections.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-3">
              <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No active study connections yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once you accept or a peer accepts your connection proposal, they will be listed here as verified study buddies.
              </p>
              <button
                onClick={onDiscoverMore}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Discover Peer Matches
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center justify-center font-bold text-sm">
                          {conn.avatarInitials}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{conn.displayName}</h4>
                          <p className="text-xs text-slate-400">
                            {conn.programmeName} · {conn.studyLevel}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuUserId(activeMenuUserId === conn.userId ? null : conn.userId)}
                          className="p-1 text-slate-500 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuUserId === conn.userId && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-slate-950 border border-slate-800 rounded-xl shadow-xl z-10 p-1 text-xs space-y-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuUserId(null);
                                onBlockUser(conn.userId, conn.displayName);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                            >
                              Block Peer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuUserId(null);
                                onReportUser(conn.userId, conn.displayName);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 rounded-lg transition-colors"
                            >
                              Report User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Shared Units: <strong className="text-teal-300">{conn.sharedUnitsCount}</strong></span>
                      <span>·</span>
                      <span>Connected since {new Date(conn.establishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onOpenApexAI({ name: conn.displayName, sharedUnits: conn.sharedUnitsCount })}
                      className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      APEX AI Study Prompt
                    </button>

                    <span className="text-[11px] text-slate-500">
                      Active peer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

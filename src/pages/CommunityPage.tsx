import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Download,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Ban,
  Sparkles,
  Info,
  CheckCircle,
  FileText
} from 'lucide-react';
import { BrainMatePeerMatch, CommunityResource } from '../types';
import { DEMO_PEER_MATCHES, COMMUNITY_RESOURCES } from '../data/mockData';
import { DemoDataBadge } from '../components/DemoDataBadge';
import { BrainMateLogo } from '../components/BrandLogos';

interface CommunityPageProps {
  onOpenApexAI: () => void;
  onNavigate: (route: string) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  onOpenApexAI,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'brainmate'>('resources');
  const [peers, setPeers] = useState<BrainMatePeerMatch[]>(DEMO_PEER_MATCHES);
  const [downloadedResourceIds, setDownloadedResourceIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('All');

  const resourceTypes = ['All', 'Study Guide', 'Lecture Notes'];

  const filteredResources = COMMUNITY_RESOURCES.filter((r) => {
    if (filterType === 'All') return true;
    return r.type === filterType;
  });

  const handleConnectionAction = async (peerId: string, action: 'request' | 'accept' | 'decline' | 'block') => {
    try {
      const response = await fetch('/api/brainmate/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        setPeers((prev) =>
          prev.map((p) => (p.id === peerId ? data.peer : p))
        );
      }
    } catch (err) {
      // Optimistic update
      setPeers((prev) =>
        prev.map((p) => {
          if (p.id !== peerId) return p;
          let nextStatus: BrainMatePeerMatch['connectionStatus'] = p.connectionStatus;
          if (action === 'request') nextStatus = 'Request Sent';
          if (action === 'accept') nextStatus = 'Accepted';
          if (action === 'decline') nextStatus = 'Declined';
          if (action === 'block') nextStatus = 'Blocked';
          return { ...p, connectionStatus: nextStatus };
        })
      );
    }
  };

  const handleDownload = (id: string, title: string) => {
    setDownloadedResourceIds((prev) => [...prev, id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Course Community & Ecosystem Hub
          </span>
          <DemoDataBadge label="Privacy-Preserving Boundary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Public Learning Resources & BrainMate Peers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Access curated course study compendiums and explore peer matching through the UniSync BrainMate integration boundary.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curated Course Resources ({COMMUNITY_RESOURCES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('brainmate')}
          className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'brainmate'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>BrainMate Study-Partner Matching</span>
        </button>
      </div>

      {/* TAB 1: Public Course Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Filter Type:
              </span>
              {resourceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filterType === type
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              Open educational compendiums verified for semester use
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((res) => {
              const isDownloaded = downloadedResourceIds.includes(res.id);

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {res.unitCode}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {res.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{res.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        {res.description}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2">
                      <span>Curated by: {res.authorLabel}</span>
                      <span className="font-mono">{res.downloadsCount + (isDownloaded ? 1 : 0)} views</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <DemoDataBadge label={res.verifiedStatus} />
                    <button
                      type="button"
                      onClick={() => handleDownload(res.id, res.title)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
                        isDownloaded
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isDownloaded ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Saved to Session</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Open Document</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BrainMate Peer Matching Integration */}
      {activeTab === 'brainmate' && (
        <div className="space-y-8">
          {/* Privacy & Boundary Notice */}
          <div className="bg-linear-to-r from-slate-950 via-purple-950 to-slate-950 border border-purple-500/40 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 z-10">
              <BrainMateLogo size={48} />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                    BrainMate Module
                  </span>
                  <span className="text-xs text-purple-300 font-semibold">Peer Study Match Engine</span>
                </div>
                <h3 className="text-lg font-black text-white">Mutual-Consent Study Circles</h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Study matching requires explicit mutual consent. Phone numbers and email addresses are strictly hidden until you both accept. Academic marks are never broadcast.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenApexAI}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto z-10"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Ask Apex AI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                      {peer.peerDisplayName.slice(0, 2)}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      peer.connectionStatus === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : peer.connectionStatus === 'Request Sent'
                        ? 'bg-amber-100 text-amber-800'
                        : peer.connectionStatus === 'Request Received'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {peer.connectionStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{peer.peerDisplayName}</h3>
                    <p className="text-xs text-slate-500">{peer.programmeName} · {peer.universityName}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1.5">
                    <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wide">
                      Matching Rationale:
                    </div>
                    <p className="italic leading-relaxed">{peer.matchReason}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Shared Units:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {peer.sharedUnits.map((u, idx) => (
                        <span key={idx} className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Study Style: </span>
                    {peer.studyPreferences}
                  </div>
                </div>

                {/* Connection Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {peer.connectionStatus === 'Not Connected' && (
                    <button
                      type="button"
                      onClick={() => handleConnectionAction(peer.id, 'request')}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Send Study Request</span>
                    </button>
                  )}

                  {peer.connectionStatus === 'Request Received' && (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleConnectionAction(peer.id, 'accept')}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConnectionAction(peer.id, 'decline')}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {peer.connectionStatus === 'Request Sent' && (
                    <div className="text-xs text-amber-700 font-medium py-1.5 text-center w-full bg-amber-50 rounded-xl">
                      Invitation Pending Approval
                    </div>
                  )}

                  {peer.connectionStatus === 'Accepted' && (
                    <div className="text-xs text-emerald-700 font-semibold py-1.5 text-center w-full bg-emerald-50 rounded-xl flex items-center justify-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Connected Partner</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

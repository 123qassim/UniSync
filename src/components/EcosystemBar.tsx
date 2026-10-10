import React from 'react';
import { Sparkles } from 'lucide-react';
import { UniSyncLogo, UniPathLogo, BrainMateLogo, ZeroQLogo } from './BrandLogos';

interface EcosystemBarProps {
  activeModule: 'unipath' | 'brainmate' | 'zeroq';
  onNavigateModule: (module: 'unipath' | 'brainmate' | 'zeroq') => void;
  onOpenApexAI: () => void;
}

export const EcosystemBar: React.FC<EcosystemBarProps> = ({
  activeModule,
  onNavigateModule,
  onOpenApexAI,
}) => {
  return (
    <div className="bg-slate-950/95 text-slate-300 text-xs border-b border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Master UniSync Emblem with chrome spiral */}
        <div
          onClick={() => onNavigateModule('unipath')}
          className="flex items-center gap-2 cursor-pointer group"
          title="UniSync Master Ecosystem"
        >
          <UniSyncLogo size={24} />
          <span className="font-extrabold text-white tracking-wide uppercase text-[11px] group-hover:text-cyan-300 transition-colors">
            UniSync
          </span>
        </div>

        <span className="text-slate-700 hidden sm:inline">|</span>

        {/* 3 Ecosystem Modules */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* UniPath */}
          <button
            onClick={() => onNavigateModule('unipath')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-2 font-medium ${
              activeModule === 'unipath'
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <UniPathLogo size={18} />
            <span>UniPath</span>
            <span className="text-[10px] text-emerald-400/80 hidden md:inline font-normal">
              (Careers & Degree)
            </span>
          </button>

          {/* BrainMate */}
          <button
            onClick={() => onNavigateModule('brainmate')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-2 font-medium ${
              activeModule === 'brainmate'
                ? 'bg-purple-950/80 text-purple-300 font-bold border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BrainMateLogo size={18} />
            <span>BrainMate</span>
            <span className="text-[10px] text-purple-400/80 hidden md:inline font-normal">
              (Study & Peers)
            </span>
          </button>

          {/* ZeroQ */}
          <button
            onClick={() => onNavigateModule('zeroq')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-2 font-medium ${
              activeModule === 'zeroq'
                ? 'bg-orange-950/80 text-orange-300 font-bold border border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ZeroQLogo size={18} />
            <span>ZeroQ</span>
            <span className="text-[10px] text-orange-400/80 hidden md:inline font-normal">
              (Admissions & ID)
            </span>
          </button>
        </div>
      </div>

      {/* Shared Assistant Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenApexAI}
          className="text-xs text-cyan-300 hover:text-white flex items-center gap-1.5 font-bold transition-all bg-cyan-950/80 hover:bg-cyan-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Apex AI Advisory</span>
        </button>
      </div>
    </div>
  );
};

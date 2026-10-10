import React from 'react';
import { Shield, Lock, FileText, Info } from 'lucide-react';
import { UniSyncLogo, UniPathLogo, BrainMateLogo, ZeroQLogo } from './BrandLogos';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 text-white font-extrabold text-base mb-3">
              <UniPathLogo size={28} />
              <span>UniPath</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              The academic discovery and career guidance component of the UniSync ecosystem. Helping university students translate degree coursework into clear, actionable career roadmaps.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <UniSyncLogo size={22} />
              <span className="text-[11px] font-semibold text-slate-300">Part of the UniSync Ecosystem</span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              UniSync Ecosystem
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors flex items-center gap-2">
                  <UniPathLogo size={16} />
                  <span>UniPath · Career Discovery</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/brainmate')} className="hover:text-white transition-colors flex items-center gap-2 text-teal-300 font-medium">
                  <BrainMateLogo size={16} />
                  <span>BrainMate · Academic Peer Learning</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/zeroq')} className="hover:text-white transition-colors flex items-center gap-2 text-orange-300 font-medium">
                  <ZeroQLogo size={16} />
                  <span>ZeroQ · Paperless Admissions</span>
                </button>
              </li>
              <li className="flex items-center gap-2 text-cyan-400">
                <UniSyncLogo size={16} />
                <span>Apex AI · Shared Advisory</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Core Journeys
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('/explore')} className="hover:text-white transition-colors">
                  Discover My Career Path
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/careers')} className="hover:text-white transition-colors">
                  Browse Career Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/compare')} className="hover:text-white transition-colors">
                  Academic Performance Comparison
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/community')} className="hover:text-white transition-colors">
                  Course Community Resources
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Trust, Consent & Privacy
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Privacy & Data Retention Notice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  Algorithm & Demo Data Disclosure
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} UniSync / UniPath. Prepared as production full-stack release.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Shield className="w-3 h-3 text-emerald-400" />
              Verified Demo Datasets Isolated
            </span>
            <span>·</span>
            <span>Zero PII Without Explicit Consent</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

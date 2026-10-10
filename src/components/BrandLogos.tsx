/**
 * UniSync Ecosystem Brand Logos
 * Accurately scaffolding the visual identity from the master brand assets:
 * - UniSync: 3D chrome/glass cosmic spiral monogram with planetary reflection
 * - UniPath: Emerald & golden squircle with winding pathway ascending to graduation cap
 * - BrainMate: Cosmic ultraviolet squircle with glowing neural network brain
 * - ZeroQ: Dark obsidian squircle with neon coral open ring and speed chevrons
 */

import React from 'react';

interface LogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

/**
 * Master UniSync Ecosystem Emblem
 * Double-spiral liquid chrome icon over cosmic nebula
 */
export const UniSyncLogo: React.FC<LogoProps> = ({ size = 40, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative shrink-0 rounded-2xl p-1 flex items-center justify-center overflow-hidden shadow-xl border border-cyan-500/30"
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #090d16 80%, #030712 100%)',
        }}
      >
        {/* Cosmic nebula background aura */}
        <div className="absolute inset-0 bg-linear-to-b from-cyan-500/20 via-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute w-6 h-6 rounded-full bg-cyan-400/25 blur-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Chrome double spiral vector */}
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
          <defs>
            <linearGradient id="chromeSpiral" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="75%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="innerOrb" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Central cosmic orb */}
          <circle cx="50" cy="50" r="14" fill="url(#innerOrb)" opacity="0.9" />
          <circle cx="47" cy="47" r="4" fill="#ffffff" opacity="0.8" />

          {/* Outer sweeping spiral ribbons forming 'US' */}
          <path
            d="M 28 65 C 20 52 24 32 40 24 C 58 15 78 22 84 40 C 88 52 82 66 70 74 C 58 82 42 80 32 72"
            fill="none"
            stroke="url(#chromeSpiral)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 72 35 C 80 48 76 68 60 76 C 42 85 22 78 16 60 C 12 48 18 34 30 26 C 42 18 58 20 68 28"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="text-base font-extrabold tracking-tight text-white block">
            UniSync
          </span>
          <span className="text-[9px] tracking-widest uppercase font-medium text-cyan-300/80 block">
            BrainMate · ZeroQ · UniPath
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * UniPath Brand Emblem
 * Emerald & golden squircle with winding pathway ascending to graduation cap
 */
export const UniPathLogo: React.FC<LogoProps> = ({ size = 36, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 rounded-2xl p-1 flex items-center justify-center overflow-hidden shadow-lg border border-emerald-500/40"
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          background: 'radial-gradient(circle at 40% 30%, #064e3b 0%, #022c22 75%, #011612 100%)',
        }}
      >
        {/* Soft emerald radiance */}
        <div className="absolute inset-0 bg-radial from-emerald-400/20 via-transparent to-transparent pointer-events-none" />

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]">
          <defs>
            <linearGradient id="emeraldPath" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="80%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Stylized 'U' contour with botanical leaf aura */}
          <path
            d="M 30 25 L 30 62 C 30 76 42 82 50 82 C 58 82 70 76 70 62 L 70 25"
            fill="none"
            stroke="#10b981"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* Ascending winding pathway */}
          <path
            d="M 36 72 Q 44 68 50 58 Q 56 48 48 38 Q 42 30 58 26 Q 64 24 64 24"
            fill="none"
            stroke="url(#emeraldPath)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Stepping pathway dashes */}
          <path
            d="M 38 70 L 44 68 M 46 62 L 52 58 M 52 50 L 46 44 M 46 36 L 54 32 M 56 28 L 62 25"
            fill="none"
            stroke="#fef08a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Mortarboard Graduation Cap at peak */}
          <polygon
            points="65,16 78,21 65,26 52,21"
            fill="url(#goldCap)"
            stroke="#ffffff"
            strokeWidth="0.8"
          />
          <polygon
            points="58,23 58,28 72,28 72,23"
            fill="url(#goldCap)"
            opacity="0.9"
          />
          {/* Tassel */}
          <line x1="74" y1="22" x2="76" y2="30" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="76" cy="30" r="1.5" fill="#fef08a" />

          {/* Firefly particles */}
          <circle cx="26" cy="38" r="1.5" fill="#a7f3d0" opacity="0.8" />
          <circle cx="75" cy="55" r="1.8" fill="#fef08a" opacity="0.9" />
          <circle cx="34" cy="50" r="1.2" fill="#34d399" opacity="0.7" />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="text-base font-extrabold tracking-tight text-white block">
            UniPath
          </span>
          <span className="text-[10px] font-semibold text-emerald-400 block">
            Academic & Career Discovery
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * ZeroQ Brand Emblem
 * Dark obsidian squircle with neon coral open ring and speed chevrons
 */
export const ZeroQLogo: React.FC<LogoProps> = ({ size = 36, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 rounded-2xl p-1 flex items-center justify-center overflow-hidden shadow-lg border border-orange-500/40"
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          background: 'radial-gradient(circle at 45% 40%, #1e1b18 0%, #120e0c 75%, #050403 100%)',
        }}
      >
        {/* Coral warm glow */}
        <div className="absolute inset-0 bg-radial from-orange-500/25 via-transparent to-transparent pointer-events-none" />

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
          <defs>
            <linearGradient id="coralRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="80%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <linearGradient id="chevronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Open 'Q' Circle Arc */}
          <path
            d="M 50 18 A 30 30 0 1 0 74 65"
            fill="none"
            stroke="url(#coralRing)"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Inner accent ring */}
          <path
            d="M 50 24 A 24 24 0 1 0 70 62"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Accelerating Speed Chevrons >>>>> */}
          {/* Chevron 1 */}
          <path
            d="M 55 48 L 62 55 L 55 62"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
          {/* Chevron 2 */}
          <path
            d="M 62 52 L 69 59 L 62 66"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
          {/* Chevron 3 */}
          <path
            d="M 69 56 L 76 63 L 69 70"
            fill="none"
            stroke="url(#chevronGrad)"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tail trailing dots */}
          <circle cx="77" cy="74" r="2.4" fill="#fb923c" />
          <circle cx="82" cy="79" r="1.8" fill="#fdba74" />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="text-base font-extrabold tracking-tight text-white block">
            ZeroQ
          </span>
          <span className="text-[10px] font-semibold text-orange-400 block">
            Admissions & Campus Commerce
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * BrainMate Brand Emblem
 * Cosmic ultraviolet squircle with glowing neural network brain
 */
export const BrainMateLogo: React.FC<LogoProps> = ({ size = 36, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 rounded-2xl p-1 flex items-center justify-center overflow-hidden shadow-lg border border-purple-500/40"
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          background: 'radial-gradient(circle at 50% 35%, #2e1065 0%, #17082e 75%, #090214 100%)',
        }}
      >
        {/* Purple cosmic aura */}
        <div className="absolute inset-0 bg-radial from-purple-500/30 via-transparent to-transparent pointer-events-none" />

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
          <defs>
            <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Brain Contour Glow Outline */}
          <path
            d="M 50 25 C 40 25 32 30 30 38 C 26 40 24 46 25 52 C 24 60 28 66 35 68 C 38 73 44 76 50 76 C 56 76 62 73 65 68 C 72 66 76 60 75 52 C 76 46 74 40 70 38 C 68 30 60 25 50 25 Z"
            fill="none"
            stroke="url(#neuralGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Synaptic Network Lines */}
          <line x1="50" y1="30" x2="40" y2="40" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="50" y1="30" x2="60" y2="40" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="40" y1="40" x2="32" y2="52" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="60" y1="40" x2="68" y2="52" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="40" y1="40" x2="50" y2="48" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="60" y1="40" x2="50" y2="48" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="50" y1="48" x2="42" y2="60" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="50" y1="48" x2="58" y2="60" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="32" y1="52" x2="42" y2="60" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="68" y1="52" x2="58" y2="60" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="42" y1="60" x2="50" y2="70" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="58" y1="60" x2="50" y2="70" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />

          {/* Neural Synapse Nodes (Glowing Points) */}
          <circle cx="50" cy="30" r="3.2" fill="#ffffff" />
          <circle cx="40" cy="40" r="2.8" fill="#f3e8ff" />
          <circle cx="60" cy="40" r="2.8" fill="#f3e8ff" />
          <circle cx="32" cy="52" r="2.5" fill="#e9d5ff" />
          <circle cx="68" cy="52" r="2.5" fill="#e9d5ff" />
          <circle cx="50" cy="48" r="3.4" fill="#ffffff" />
          <circle cx="42" cy="60" r="2.8" fill="#e9d5ff" />
          <circle cx="58" cy="60" r="2.8" fill="#e9d5ff" />
          <circle cx="50" cy="70" r="3" fill="#ffffff" />

          {/* Ambient Particles */}
          <circle cx="28" cy="32" r="1.2" fill="#c084fc" opacity="0.6" />
          <circle cx="72" cy="34" r="1.4" fill="#c084fc" opacity="0.6" />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="text-base font-extrabold tracking-tight text-white block">
            BrainMate
          </span>
          <span className="text-[10px] font-semibold text-purple-400 block">
            Study Partners & Peer Match
          </span>
        </div>
      )}
    </div>
  );
};

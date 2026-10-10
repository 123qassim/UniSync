/**
 * GlassUI Components Library
 * Scaffolds the dark glassmorphic UI/UX aesthetic from reference designs:
 * - Frosted backdrop-blur cards with delicate luminous borders
 * - Neon circular percentage dials (Image 1 Botanical dashboard)
 * - Translucent toggle switches with neon thumbs (Image 2 Cosmic UI)
 * - High-contrast rating pills & feature badges (Images 1, 3 & 4)
 */

import React from 'react';
import { Star } from 'lucide-react';

interface CircularGaugeProps {
  value: number; // 0 to 100
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  color?: 'emerald' | 'cyan' | 'purple' | 'orange' | 'amber';
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  label,
  sublabel,
  size = 96,
  strokeWidth = 7,
  color = 'emerald',
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const colorConfig = {
    emerald: {
      stroke: '#34d399',
      glow: 'rgba(52, 211, 153, 0.4)',
      text: 'text-emerald-400',
    },
    cyan: {
      stroke: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.4)',
      text: 'text-cyan-400',
    },
    purple: {
      stroke: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.4)',
      text: 'text-purple-400',
    },
    orange: {
      stroke: '#fb923c',
      glow: 'rgba(251, 146, 60, 0.4)',
      text: 'text-orange-400',
    },
    amber: {
      stroke: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.4)',
      text: 'text-amber-400',
    },
  }[color];

  return (
    <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Glowing Animated Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${colorConfig.glow})`,
              transition: 'stroke-dashoffset 1s ease-out',
            }}
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-base font-extrabold tracking-tight ${colorConfig.text}`}>
            {value}%
          </span>
        </div>
      </div>

      <span className="text-[11px] font-semibold text-slate-200 mt-2 truncate max-w-[100px]">
        {label}
      </span>
      {sublabel && (
        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
          {sublabel}
        </span>
      )}
    </div>
  );
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'emerald' | 'violet' | 'orange' | 'cyan' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  onClick,
}) => {
  const glowStyles = {
    emerald: 'hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
    violet: 'hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]',
    orange: 'hover:border-orange-500/40 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]',
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(56,189,248,0.15)]',
    none: 'hover:border-white/20',
  }[glow];

  return (
    <div
      onClick={onClick}
      className={`relative bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 ${glowStyles} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Subtle top border highlight */}
      <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

interface GlassToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  color?: 'emerald' | 'teal' | 'orange' | 'purple';
}

export const GlassToggle: React.FC<GlassToggleProps> = ({
  label,
  enabled,
  onChange,
  color = 'emerald',
}) => {
  const colorBg = {
    emerald: 'bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.6)]',
    teal: 'bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]',
    orange: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]',
    purple: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
  }[color];

  return (
    <div
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
    >
      <span className="text-xs font-semibold text-slate-200">{label}</span>
      <div
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          enabled ? 'bg-slate-800 border border-white/20' : 'bg-slate-800/60 border border-white/10'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full transition-transform duration-300 ${
            enabled ? `translate-x-5 ${colorBg}` : 'translate-x-0 bg-slate-500'
          }`}
        />
      </div>
    </div>
  );
};

interface RatingPillProps {
  rating: number | string;
  label?: string;
  badge?: string;
}

export const RatingPill: React.FC<RatingPillProps> = ({ rating, label, badge = 'TOP 5' }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/15 backdrop-blur-md shadow-inner text-xs">
      <span className="font-extrabold text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
        {badge}
      </span>
      <div className="flex items-center gap-1 font-bold text-white">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span>{rating}</span>
      </div>
      {label && <span className="text-slate-400 text-[11px] font-medium">{label}</span>}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code,
  ShieldCheck,
  TrendingUp,
  HeartPulse,
  Briefcase,
  Layers,
  ChevronRight,
  Cpu,
  GraduationCap,
  Star,
  CheckCircle2,
  FileCheck,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import { CAREERS } from '../data/mockData';
import { DemoDataBadge } from '../components/DemoDataBadge';
import { UniSyncLogo, UniPathLogo, BrainMateLogo, ZeroQLogo } from '../components/BrandLogos';
import { CircularGauge, GlassCard, GlassToggle, RatingPill } from '../components/GlassUI';

interface LandingPageProps {
  onNavigate: (route: string) => void;
  onOpenApexAI: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenApexAI,
}) => {
  const featuredCareers = CAREERS.slice(0, 6);

  // Interactive toggle states for the live glassmorphic preview
  const [useVoluntaryMarks, setUseVoluntaryMarks] = useState(true);
  const [enableBrainMate, setEnableBrainMate] = useState(true);
  const [syncZeroQPlacement, setSyncZeroQPlacement] = useState(true);
  const [activeCurriculumYear, setActiveCurriculumYear] = useState<'Year 1' | 'Year 2' | 'Year 3' | 'Year 4'>('Year 2');

  const getCareerIcon = (slug: string) => {
    switch (slug) {
      case 'software-engineer':
        return <Code className="w-5 h-5 text-emerald-400" />;
      case 'data-scientist':
        return <TrendingUp className="w-5 h-5 text-cyan-400" />;
      case 'cybersecurity-analyst':
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'clinical-nurse-specialist':
        return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'financial-analyst':
        return <Briefcase className="w-5 h-5 text-amber-400" />;
      case 'embedded-systems-engineer':
        return <Cpu className="w-5 h-5 text-teal-400" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* =========================================================================
          HERO SECTION: Cosmic & Botanical Frosted Glass Aesthetics (Images 2, 4, 8)
          ========================================================================= */}
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden border-b border-white/10 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-[350px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Brand Pill & Rating Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-lg">
              <UniSyncLogo size={24} />
              <span className="text-xs font-extrabold tracking-wide text-white uppercase">
                UniSync Platform
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <UniPathLogo size={16} /> UniPath Academic Engine
              </span>
            </div>

            <RatingPill rating="4.9 / 5.0" label="from 2,400+ Kenyan University Students" badge="TOP 1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Vision & Call to Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Curriculum-Grounded Career Discovery</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance">
                  Your Degree Is a Beginning.{' '}
                  <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent block sm:inline">
                    Discover Where It Takes You.
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                UniPath translates university syllabus units and self-reported performance into clear, actionable career pathways—with zero mandatory transcripts and transparent match scores.
              </p>

              {/* Floating Feature Tags (Axolotl Style - Image 4) */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Maseno & Kenyan Universities
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Zero-Queue Admissions via ZeroQ
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> BrainMate Study Partnerships
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onNavigate('/explore')}
                  className="w-full sm:w-auto px-7 py-4 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                  <UniPathLogo size={20} />
                  <span>Discover My Career Path</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/zeroq')}
                  className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl border border-white/15 backdrop-blur-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ZeroQLogo size={20} />
                  <span>Launch ZeroQ Admissions</span>
                </button>
              </div>

              {/* Transparency Notice */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  <span>Explore without sign-up</span>
                </div>
                <span className="text-slate-700">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
                  <span>Voluntary marks, zero shame</span>
                </div>
                <span className="text-slate-700">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span>
                  <span>Apex AI grounded advice</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Glassmorphic Telemetry Card (Images 1 & 2) */}
            <div className="lg:col-span-5">
              <GlassCard glow="emerald" className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <UniPathLogo size={32} />
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Career Recommendation Engine</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        BSc Computer Science · Maseno University
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Live Simulator
                  </span>
                </div>

                {/* 4 Circular Percentage Gauges (Botanical Glass Style - Image 1) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <CircularGauge
                    value={94}
                    label="Match Score"
                    sublabel="Software Eng"
                    color="emerald"
                    size={76}
                    strokeWidth={6}
                  />
                  <CircularGauge
                    value={88}
                    label="Course Fit"
                    sublabel="Year 1 & 2 Units"
                    color="cyan"
                    size={76}
                    strokeWidth={6}
                  />
                  <CircularGauge
                    value={82}
                    label="Skill Depth"
                    sublabel="Coding & DB"
                    color="purple"
                    size={76}
                    strokeWidth={6}
                  />
                  <CircularGauge
                    value={91}
                    label="Market Demand"
                    sublabel="Kenya & Remote"
                    color="amber"
                    size={76}
                    strokeWidth={6}
                  />
                </div>

                {/* Toggle Controls (Cosmic Glass Style - Image 2) */}
                <div className="space-y-2 pt-2">
                  <GlassToggle
                    label="Factor Voluntary Academic Marks (74% in Programming)"
                    enabled={useVoluntaryMarks}
                    onChange={setUseVoluntaryMarks}
                    color="emerald"
                  />
                  <GlassToggle
                    label="Connect with BrainMate Peer Study Partners"
                    enabled={enableBrainMate}
                    onChange={setEnableBrainMate}
                    color="purple"
                  />
                  <GlassToggle
                    label="Sync KUCCPS Placement Verification via ZeroQ"
                    enabled={syncZeroQPlacement}
                    onChange={setSyncZeroQPlacement}
                    color="orange"
                  />
                </div>

                {/* Action footer */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Apex AI Verified Model</span>
                  </span>
                  <button
                    onClick={() => onNavigate('/dashboard')}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>View Full Dashboard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          UNISYNC ECOSYSTEM ARCHITECTURE: 3 PILLARS (Images 5, 6, 7, 8)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            <UniSyncLogo size={18} />
            <span>The UniSync Tri-Pillar Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cohesive Modules. Zero Duplicate Work.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            UniSync delivers a unified student journey from initial statutory university placement to lifelong career success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: UniPath */}
          <div className="bg-slate-950 text-white rounded-3xl p-7 border border-emerald-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/60 transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <UniPathLogo size={46} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  Active Module
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">UniPath</h3>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  Academic Discovery & Career Pathways
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  Browse Kenyan degree programs, map syllabus units, receive transparent career recommendations with explainable scores, and build milestone-based roadmaps.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive unit breakdown & difficulty guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Voluntary marks comparison with zero judgment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified external study resource links</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('/explore')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>Launch Course Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <DemoDataBadge label="12 Curated Paths" />
            </div>
          </div>

          {/* Pillar 2: BrainMate */}
          <div className="bg-slate-950 text-white rounded-3xl p-7 border border-purple-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-purple-500/60 transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 blur-2xl rounded-full pointer-events-none" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <BrainMateLogo size={46} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-500/40">
                  Integration Ready
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">BrainMate</h3>
                <p className="text-xs text-purple-400 font-semibold mt-0.5">
                  Peer Study Match & AI Revision
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  Discover peer study partners enrolled in the same units, initiate connection requests with mutual consent, and receive AI-backed study plan guidance.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Mutual-consent peer matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Unit-specific study partner circles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Privacy-first contact and safety filters</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('/community')}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <span>Browse Peer Circles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <DemoDataBadge label="Study Match" />
            </div>
          </div>

          {/* Pillar 3: ZeroQ */}
          <div className="bg-slate-950 text-white rounded-3xl p-7 border border-orange-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-orange-500/60 transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 blur-2xl rounded-full pointer-events-none" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <ZeroQLogo size={46} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950 px-2.5 py-0.5 rounded-full border border-orange-500/40">
                  Full Platform
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">ZeroQ</h3>
                <p className="text-xs text-orange-400 font-semibold mt-0.5">
                  Paperless Admissions & Campus ID
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  End long university queues. Digitize KUCCPS verification, online biometric face-check, dynamic QR student IDs, and campus store vouchers.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>11-step onboarding engine & admissions wizard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Digital student ID card with dynamic QR code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>M-Pesa campus store & merchant redemption POS</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('/zeroq')}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
              >
                <span>Launch ZeroQ Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <DemoDataBadge label="Admissions Hub" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED CAREER PATHWAYS (Grounded in Curricula)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Exploratory Catalogue
              </span>
              <RatingPill rating="4.8 ★" label="Verified Curricula" badge="TOP 5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Career Destinations
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Grounded in Kenyan university curricula and global professional skill matrices.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/careers')}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View all 12 pathways</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCareers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    {getCareerIcon(c.slug)}
                  </div>
                  <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                    {c.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {c.summary}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Key Technical Competencies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.technicalSkills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/careers/${c.slug}`)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                >
                  <span>Detailed Profile & Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <DemoDataBadge label="Curated Path" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION BANNER (Cosmic & Liquid Chrome Glow)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-linear-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <UniPathLogo size={16} />
              <span>Free Academic Discovery</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Ready to explore your university degree options?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Step through our 4-stage course discovery tool. Choose your university, inspect required units, input voluntary marks if you wish, and discover your career roadmap immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => onNavigate('/explore')}
              className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>Start Course Exploration</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={onOpenApexAI}
              className="px-5 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/15 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ask Apex AI</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

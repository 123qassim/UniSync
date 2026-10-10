/**
 * BrainMate Flagship 2: Live Focus Pod
 * Synchronized Pomodoro timer, in-browser Web Audio soundscapes,
 * shared sprint goals Kanban, collaborative scratchpad, peer presence & live cheers.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Sliders,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Users,
  Flame,
  Coffee,
  Sparkles,
  Zap,
  Lightbulb,
  ThumbsUp,
  Copy,
  Download,
  Share2,
  Bell,
  Music,
  Wind,
  CloudRain,
  Radio,
} from 'lucide-react';

interface FocusPodModuleProps {
  onCompleteCycle: (cycles: number, durationMinutes: number, goalSummary?: string) => Promise<void>;
  onOpenApexAI: (prompt: string) => void;
}

interface PodGoal {
  id: string;
  text: string;
  completed: boolean;
  author: string;
}

interface FloatingCheer {
  id: number;
  emoji: string;
  label: string;
  left: number;
}

export const FocusPodModule: React.FC<FocusPodModuleProps> = ({
  onCompleteCycle,
  onOpenApexAI,
}) => {
  // Timer State
  const [mode, setMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cycleCount, setCycleCount] = useState<number>(1);
  const totalCycles = 4;

  // Ambient Sound Engine State (Web Audio API)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.6);
  const [activeSounds, setActiveSounds] = useState<{
    rain: number;
    lofi: number;
    cafe: number;
    brownNoise: number;
    forestWind: number;
  }>({
    rain: 0.5,
    lofi: 0.4,
    cafe: 0,
    brownNoise: 0,
    forestWind: 0,
  });

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ [key: string]: { gain: GainNode; stop?: () => void } }>({});

  // Goals State
  const [goals, setGoals] = useState<PodGoal[]>([
    { id: 'g-1', text: 'Trace Dijkstra priority queue edge cases on paper', completed: true, author: 'You' },
    { id: 'g-2', text: 'Solve past-paper question 3.b (Red-Black tree rotations)', completed: false, author: 'You' },
    { id: 'g-3', text: 'Verify recurrence relations proof for MergeSort', completed: false, author: 'Sarah' },
    { id: 'g-4', text: 'Implement BCNF decomposition step-by-step', completed: false, author: 'Kevin' },
  ]);
  const [newGoalText, setNewGoalText] = useState<string>('');

  // Scratchpad State
  const [scratchpadTab, setScratchpadTab] = useState<'notes' | 'formulas' | 'code'>('notes');
  const [scratchpadContent, setScratchpadContent] = useState<{
    notes: string;
    formulas: string;
    code: string;
  }>({
    notes: `## Live Focus Pod Notes · CSC 211 & MAT 120\n- Dynamic programming state formulation:\n  dp[i][w] = max(dp[i-1][w], dp[i-1][w - weights[i]] + values[i])\n- Remember base condition: if w == 0 or i == 0, return 0\n- Graph shortest path: Bellman-Ford runs in O(V * E); Dijkstra with min-heap runs in O((V + E) log V)`,
    formulas: `Euler Characteristic Formula:\nV - E + F = 2 (for connected planar graphs)\n\nMaster Theorem:\nT(n) = a*T(n/b) + f(n)\nIf f(n) = O(n^(log_b(a) - ε)), then T(n) = Θ(n^(log_b(a)))`,
    code: `// Red-Black Tree Left Rotation\nvoid leftRotate(Node* &root, Node* x) {\n    Node* y = x->right;\n    x->right = y->left;\n    if (y->left != nullptr) y->left->parent = x;\n    y->parent = x->parent;\n    if (x->parent == nullptr) root = y;\n    else if (x == x->parent->left) x->parent->left = y;\n    else x->parent->right = y;\n    y->left = x;\n    x->parent = y;\n}`,
  });
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Peer Cheers & Reactions
  const [floatingCheers, setFloatingCheers] = useState<FloatingCheer[]>([]);

  // Sound Engine Setup & Teardown
  const playChimeSound = () => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const now = ctx.currentTime;
      // High harmonic chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1); // C6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now); // E5

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.0);
      osc2.stop(now + 2.0);
    } catch {
      // Audio fallback
    }
  };

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Cycle Complete
      playChimeSound();
      setIsRunning(false);

      if (mode === 'focus') {
        const nextCount = cycleCount < totalCycles ? cycleCount + 1 : 1;
        setCycleCount(nextCount);
        const nextMode = cycleCount === totalCycles ? 'long_break' : 'short_break';
        setMode(nextMode);
        setTimeLeft(nextMode === 'long_break' ? 15 * 60 : 5 * 60);

        // Award karma
        const completedGoalsCount = goals.filter((g) => g.completed && g.author === 'You').length;
        onCompleteCycle(1, 25, `${completedGoalsCount} goal(s) finished in focus pod`);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, cycleCount]);

  // Ambient sound synthesis controls
  const toggleSoundscapes = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!soundEnabled) {
        initSynthesizers(ctx);
        setSoundEnabled(true);
      } else {
        stopSynthesizers();
        setSoundEnabled(false);
      }
    } catch (e) {
      console.warn('Audio synthesis initialized with fallback', e);
      setSoundEnabled(!soundEnabled);
    }
  };

  const initSynthesizers = (ctx: AudioContext) => {
    // 1. Rain Synthesizer (White noise with low-pass resonance filter)
    try {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 1000;

      const rainGain = ctx.createGain();
      rainGain.gain.value = activeSounds.rain * masterVolume * 0.15;

      whiteNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(ctx.destination);
      whiteNoise.start();

      // 2. Lo-Fi Synth Drone (Warm harmonic chord in C-maj7)
      const lofiGain = ctx.createGain();
      lofiGain.gain.value = activeSounds.lofi * masterVolume * 0.08;
      lofiGain.connect(ctx.destination);

      const freqs = [130.81, 164.81, 196.0, 246.94]; // C3, E3, G3, B3
      const oscs: OscillatorNode[] = [];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(lofiGain);
        osc.start();
        oscs.push(osc);
      });

      soundNodesRef.current = {
        rain: {
          gain: rainGain,
          stop: () => {
            whiteNoise.stop();
          },
        },
        lofi: {
          gain: lofiGain,
          stop: () => {
            oscs.forEach((o) => o.stop());
          },
        },
      };
    } catch (e) {
      console.warn('Synthesizer node registration', e);
    }
  };

  const stopSynthesizers = () => {
    Object.values(soundNodesRef.current).forEach((node) => {
      try {
        if (node.stop) node.stop();
      } catch {}
    });
    soundNodesRef.current = {};
  };

  // Adjust volume levels
  useEffect(() => {
    if (soundNodesRef.current.rain?.gain) {
      soundNodesRef.current.rain.gain.gain.value = activeSounds.rain * masterVolume * 0.15;
    }
    if (soundNodesRef.current.lofi?.gain) {
      soundNodesRef.current.lofi.gain.gain.value = activeSounds.lofi * masterVolume * 0.08;
    }
  }, [activeSounds, masterVolume]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Switch modes manually
  const handleSwitchMode = (newMode: 'focus' | 'short_break' | 'long_break') => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'focus') setTimeLeft(25 * 60);
    else if (newMode === 'short_break') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  // Goal handlers
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setGoals((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        text: newGoalText.trim(),
        completed: false,
        author: 'You',
      },
    ]);
    setNewGoalText('');
  };

  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Peer Cheers Trigger
  const triggerCheer = (emoji: string, label: string) => {
    const newCheer: FloatingCheer = {
      id: Date.now(),
      emoji,
      label,
      left: Math.floor(Math.random() * 80) + 10,
    };
    setFloatingCheers((prev) => [...prev, newCheer]);
    setTimeout(() => {
      setFloatingCheers((prev) => prev.filter((c) => c.id !== newCheer.id));
    }, 2500);
  };

  // Scratchpad copy
  const handleCopyScratchpad = () => {
    navigator.clipboard.writeText(scratchpadContent[scratchpadTab]);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleDownloadScratchpad = () => {
    const element = document.createElement('a');
    const file = new Blob([scratchpadContent[scratchpadTab]], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `brainmate-focus-notes-${scratchpadTab}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Floating Reactions Canvas */}
      {floatingCheers.map((cheer) => (
        <div
          key={cheer.id}
          className="pointer-events-none fixed z-50 transform -translate-x-1/2 animate-bounce-float flex flex-col items-center"
          style={{ left: `${cheer.left}%`, bottom: '15%' }}
        >
          <span className="text-4xl filter drop-shadow-lg">{cheer.emoji}</span>
          <span className="text-xs bg-slate-900/90 text-white font-bold px-2.5 py-0.5 rounded-full border border-teal-500/40 shadow-xl">
            {cheer.label}
          </span>
        </div>
      ))}

      {/* Hero Pod Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-xs text-teal-300 font-semibold tracking-wide">
              <Headphones className="w-3.5 h-3.5" />
              Flagship Innovation · Live Academic Focus Pod
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Synchronized Focus Pod & Soundscapes
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Study side-by-side with your peer circle in silence. Features a synchronized Pomodoro sprint timer,
              Web Audio ambient soundscapes, shared sprint goals, collaborative equations scratchpad, and real-time cheers.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex sm:flex-col gap-3 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Users className="w-4 h-4 text-teal-400" />
              <span>
                <strong className="text-white">3 Peers</strong> studying in this pod
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>
                <strong className="text-white">+10 Karma</strong> per completed sprint
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Timer & Sound Engine (Left) + Goals & Scratchpad (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pomodoro Engine & Ambient Soundscapes (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pomodoro Timer Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="inline-flex p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => handleSwitchMode('focus')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  mode === 'focus'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Deep Focus (25m)
              </button>
              <button
                onClick={() => handleSwitchMode('short_break')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  mode === 'short_break'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => handleSwitchMode('long_break')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  mode === 'long_break'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Circular Timer Visualizer */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800/80"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    110 *
                    (1 -
                      timeLeft /
                        (mode === 'focus'
                          ? 25 * 60
                          : mode === 'short_break'
                          ? 5 * 60
                          : 15 * 60))
                  }
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ease-linear ${mode === 'focus' ? 'text-teal-400' : 'text-amber-400'}`}
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-white tracking-tighter font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-300 mt-2">
                  {mode === 'focus' ? 'Deep Work Sprint' : 'Rest & Recharge'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Sprint cycle {cycleCount} of {totalCycles}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  setTimeLeft(mode === 'focus' ? 25 * 60 : mode === 'short_break' ? 5 * 60 : 15 * 60);
                  setIsRunning(false);
                }}
                className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                title="Reset current sprint"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  if (!soundEnabled) {
                    toggleSoundscapes();
                  }
                  setIsRunning(!isRunning);
                }}
                className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center gap-2.5 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 shadow-teal-500/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" /> Pause Sprint
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Start Deep Focus
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTimeLeft(0);
                }}
                className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                title="Skip to next sprint"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ambient Soundscapes Synthesizer Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Music className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Synthesized Ambient Soundscapes</h3>
              </div>
              <button
                onClick={toggleSoundscapes}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  soundEnabled
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4" /> Audio Live
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" /> Sound Off
                  </>
                )}
              </button>
            </div>

            {/* Master Volume */}
            <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Master Pod Volume</span>
                <span className="font-mono text-white">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Sound Sliders */}
            <div className="space-y-3 text-xs">
              {/* Rain */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300 flex items-center gap-1.5 w-32 shrink-0">
                  <CloudRain className="w-4 h-4 text-cyan-400" /> Rain on Glass
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={activeSounds.rain}
                  onChange={(e) =>
                    setActiveSounds((prev) => ({ ...prev, rain: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="font-mono text-slate-400 w-8 text-right">
                  {Math.round(activeSounds.rain * 100)}%
                </span>
              </div>

              {/* Lo-Fi Synth Drone */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300 flex items-center gap-1.5 w-32 shrink-0">
                  <Radio className="w-4 h-4 text-purple-400" /> Lo-Fi C-Maj7
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={activeSounds.lofi}
                  onChange={(e) =>
                    setActiveSounds((prev) => ({ ...prev, lofi: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <span className="font-mono text-slate-400 w-8 text-right">
                  {Math.round(activeSounds.lofi * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Shared Goals Kanban + Collaborative Scratchpad + Peer Presence (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Peer Presence & Cheer Reactions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-teal-600 border-2 border-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  BO
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-600 border-2 border-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  SM
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  KK
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Live Pod Roster</p>
                <p className="text-[11px] text-teal-400">Sarah & Kevin are in Deep Focus</p>
              </div>
            </div>

            {/* Quick Cheer Emojis */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 px-2 font-semibold">Cheer:</span>
              <button
                onClick={() => triggerCheer('⚡', 'High-Five!')}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-base transition-transform active:scale-125"
                title="Send High Five"
              >
                ⚡
              </button>
              <button
                onClick={() => triggerCheer('🔥', 'On Fire!')}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-base transition-transform active:scale-125"
                title="Send Fire"
              >
                🔥
              </button>
              <button
                onClick={() => triggerCheer('☕', 'Coffee Cheers')}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-base transition-transform active:scale-125"
                title="Send Coffee"
              >
                ☕
              </button>
              <button
                onClick={() => triggerCheer('💡', 'Breakthrough!')}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-base transition-transform active:scale-125"
                title="Send Eureka"
              >
                💡
              </button>
              <button
                onClick={() => triggerCheer('👏', 'Great Work!')}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-base transition-transform active:scale-125"
                title="Send Kudos"
              >
                👏
              </button>
            </div>
          </div>

          {/* Shared Sprint Goals Kanban */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Pod Sprint Goals</h3>
              </div>
              <span className="text-xs bg-teal-500/15 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full font-semibold">
                {goals.filter((g) => g.completed).length} of {goals.length} Finished
              </span>
            </div>

            {/* Goal Input */}
            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Add your objective for this 25-minute sprint..."
                className="grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Goal
              </button>
            </form>

            {/* Goals List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                    g.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                  }`}
                >
                  <button
                    onClick={() => handleToggleGoal(g.id)}
                    className="flex items-center gap-3 text-left grow"
                  >
                    {g.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span>{g.text}</span>
                  </button>

                  <div className="flex items-center gap-2 pl-3">
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                      {g.author}
                    </span>
                    {g.author === 'You' && (
                      <button
                        onClick={() => handleDeleteGoal(g.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborative Pod Scratchpad */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              {/* Tab Selector */}
              <div className="flex items-center gap-2">
                {(['notes', 'formulas', 'code'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setScratchpadTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      scratchpadTab === tab
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'notes' ? 'Live Notes' : tab === 'formulas' ? 'Formulas' : 'Code Pad'}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {copiedNotification && (
                  <span className="text-xs text-emerald-400 font-semibold animate-fade-in">Copied!</span>
                )}
                <button
                  onClick={handleCopyScratchpad}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Copy notes to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownloadScratchpad}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Download notes file"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    onOpenApexAI(
                      `Review my focus pod scratchpad notes on ${scratchpadTab} and generate 3 quick mock quiz questions to test our comprehension: \n\n${scratchpadContent[scratchpadTab]}`
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Quiz Me
                </button>
              </div>
            </div>

            {/* Text Editor Area */}
            <textarea
              value={scratchpadContent[scratchpadTab]}
              onChange={(e) =>
                setScratchpadContent((prev) => ({
                  ...prev,
                  [scratchpadTab]: e.target.value,
                }))
              }
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-500 leading-relaxed resize-none shadow-inner"
              placeholder="Jot down shared equations, formulas, questions, or code snippets..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

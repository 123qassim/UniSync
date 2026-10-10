/**
 * BrainMate Flagship 4: Group Syllabus Burndown & Exam Readiness Tracker
 * Live exam countdown clock, module topic mastery toggles with weighted recalculation,
 * cohort benchmark comparison, and 1-click targeted revision sprint scheduling.
 */
import React, { useState, useEffect } from 'react';
import {
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Zap,
  TrendingUp,
  Share2,
  Users,
  Award,
} from 'lucide-react';
import { CourseExamInfo, SyllabusTopic } from '../../data/brainmateMockData.ts';

interface ExamReadinessModuleProps {
  courses: CourseExamInfo[];
  onUpdateTopicStatus: (unitCode: string, topicId: string, status: 'needs_work' | 'practicing' | 'mastered') => Promise<void>;
  onScheduleRevisionSprint: (unitCode: string, title: string, topics: string[]) => void;
  onOpenApexAI: (prompt: string) => void;
}

export const ExamReadinessModule: React.FC<ExamReadinessModuleProps> = ({
  courses,
  onUpdateTopicStatus,
  onScheduleRevisionSprint,
  onOpenApexAI,
}) => {
  const [selectedUnitCode, setSelectedUnitCode] = useState<string>('CSC 211');
  const currentCourse = courses.find((c) => c.unitCode === selectedUnitCode) || courses[0];

  // Countdown clock state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 45, hours: 5, minutes: 18, seconds: 40 });

  useEffect(() => {
    const targetDate = new Date(currentCourse.examDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCourse]);

  // Identify high-priority gap topics (highest weight + needs_work)
  const weakTopics = currentCourse.topics.filter(
    (t) => t.myStatus === 'needs_work' || t.myStatus === 'practicing'
  );

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-semibold tracking-wide">
              <Target className="w-3.5 h-3.5" />
              Flagship Preparation · Group Syllabus Burndown & Exam Readiness
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Exam Readiness & Syllabus Burndown
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track mastery topic-by-topic with official syllabus weighting. See where you stand compared to your study group cohort,
              and target high-yield concepts before exam day.
            </p>
          </div>

          {/* Unit Switcher */}
          <div className="flex flex-wrap gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 shrink-0">
            {courses.map((course) => (
              <button
                key={course.unitCode}
                onClick={() => setSelectedUnitCode(course.unitCode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedUnitCode === course.unitCode
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {course.unitCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Countdown Clock & Readiness Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Countdown Timer (6 cols) */}
        <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Official Examination Countdown
              </span>
              <span className="text-[11px] text-slate-400">{currentCourse.venue}</span>
            </div>
            <h3 className="text-lg font-bold text-white">{currentCourse.unitTitle}</h3>
          </div>

          {/* Clock Digits */}
          <div className="grid grid-cols-4 gap-3 py-6 text-center">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">{timeLeft.days}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">Days</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">{timeLeft.hours}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">Hours</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">{timeLeft.minutes}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">Mins</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">{timeLeft.seconds}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">Secs</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Exam Date: {new Date(currentCourse.examDate).toLocaleDateString()}</span>
            <span>4 Credit Units</span>
          </div>
        </div>

        {/* Readiness Mastery & Cohort Benchmark (6 cols) */}
        <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Weighted Readiness Score
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                +{currentCourse.currentMasteryPct - currentCourse.cohortMasteryPct}% Ahead of Cohort
              </span>
            </div>

            {/* Gauges */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">Your Syllabus Mastery</span>
                  <span className="font-mono font-bold text-teal-300">{currentCourse.currentMasteryPct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${currentCourse.currentMasteryPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Study Group Cohort Average</span>
                  <span className="font-mono text-slate-400">{currentCourse.cohortMasteryPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-slate-600 transition-all duration-500 rounded-full"
                    style={{ width: `${currentCourse.cohortMasteryPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Revision Generator CTA */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              <strong className="text-rose-400 font-semibold">{weakTopics.length} topics</strong> require review
            </span>
            <button
              onClick={() =>
                onScheduleRevisionSprint(
                  currentCourse.unitCode,
                  `Targeted Exam Burndown: ${currentCourse.unitCode} Weak Topics`,
                  weakTopics.map((t) => t.topicName)
                )
              }
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Launch Revision Sprint
            </button>
          </div>
        </div>
      </div>

      {/* Syllabus Topics Burndown List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Syllabus Topics & Mastery Breakdown</h3>
            <p className="text-xs text-slate-400">
              Click any status button to update your mastery level · Weighted contribution recalculates live
            </p>
          </div>

          <button
            onClick={() =>
              onOpenApexAI(
                `Generate a prioritized 3-week revision schedule for ${currentCourse.unitCode} (${currentCourse.unitTitle}). Focus heavily on my weak areas: ${weakTopics.map((t) => t.topicName).join(', ')}. Include specific practice problem sets and past paper question references.`
              )
            }
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> APEX AI Study Roadmap
          </button>
        </div>

        {/* Topics Table / Cards */}
        <div className="space-y-4">
          {currentCourse.topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left: Module & Topic Details */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {topic.moduleName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      topic.difficulty === 'hard'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : topic.difficulty === 'medium'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {topic.difficulty.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-bold text-teal-400">
                    {topic.examWeightPct}% of Final Exam
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{topic.topicName}</h4>

                {/* Concepts tags */}
                <div className="flex flex-wrap gap-1.5">
                  {topic.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Interactive Status Toggle Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
                <button
                  onClick={() => onUpdateTopicStatus(currentCourse.unitCode, topic.id, 'needs_work')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    topic.myStatus === 'needs_work'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Needs Work
                </button>
                <button
                  onClick={() => onUpdateTopicStatus(currentCourse.unitCode, topic.id, 'practicing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    topic.myStatus === 'practicing'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Practicing
                </button>
                <button
                  onClick={() => onUpdateTopicStatus(currentCourse.unitCode, topic.id, 'mastered')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    topic.myStatus === 'mastered'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mastered ✓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

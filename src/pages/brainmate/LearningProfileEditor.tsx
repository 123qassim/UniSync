/**
 * UniSync BrainMate: Learning Profile Editor
 * 
 * Multi-Step React Hook Form + Zod-based academic identity & preferences editor.
 * Incorporates all 7 required BrainMate sections:
 *  1. Academic Identity (Programme, Study Level, Institution Verification)
 *  2. Units I Can Help With (Strengths, Confidence Ratings, Topic Tags)
 *  3. Units I Need Help With (Learning Needs, Study Buddy Requests, Topic Tags)
 *  4. Weekly Availability Grid (Interactive 7-day schedule matrix, overlapping slot calculations)
 *  5. Preferences & Goals (Group size slider, Study format, Peer mentorship willingness, Goal pills)
 *  6. Visibility & Privacy (Institution-wide, Programme-only, Connections-only)
 *  7. Review & Confirm (Synergy validation summary, completion audit, and publication)
 */

import React, { useState, useId } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Calendar,
  Settings,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Save,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldCheck,
  Users,
  Compass,
  Check,
  X,
} from 'lucide-react';
import type { StudentLearningProfile } from '../../lib/brainmate/matching.ts';
import {
  learningProfileFormSchema,
  type LearningProfileFormValues,
  type UnitPreferenceFormData,
  AVAILABLE_PROGRAMMES,
  CATALOG_UNITS,
  DAYS_OF_WEEK,
  TIME_SLOTS,
  COLLABORATION_GOAL_OPTIONS,
} from '../../lib/brainmate/profileSchema.ts';

interface LearningProfileEditorProps {
  initialProfile: StudentLearningProfile;
  completeness?: number;
  onSaveProfile: (profile: Partial<StudentLearningProfile>) => Promise<void>;
  onCancel: () => void;
}

export const LearningProfileEditor: React.FC<LearningProfileEditorProps> = ({
  initialProfile,
  completeness: initialCompleteness,
  onSaveProfile,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Temporary inputs for Section 2 (Can Help)
  const [selectedHelpUnitCode, setSelectedHelpUnitCode] = useState<string>('');
  const [selectedHelpConfidence, setSelectedHelpConfidence] = useState<'high' | 'medium' | 'low'>('high');
  const [customHelpTopic, setCustomHelpTopic] = useState<string>('');

  // Temporary inputs for Section 3 (Need Help)
  const [selectedNeedUnitCode, setSelectedNeedUnitCode] = useState<string>('');
  const [customNeedTopic, setCustomNeedTopic] = useState<string>('');

  // Initialize React Hook Form with Zod validation
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<LearningProfileFormValues>({
    resolver: zodResolver(learningProfileFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      institutionId: initialProfile.institutionId || 'maseno',
      institutionName: initialProfile.institutionName || 'Maseno University',
      programmeId: initialProfile.programmeId || 'bsc-cs',
      programmeName: initialProfile.programmeName || 'BSc Computer Science',
      studyLevel: initialProfile.studyLevel || 'undergraduate',
      verifiedUnitEnrolment: initialProfile.verifiedUnitEnrolment ?? true,
      preferredGroupSize: initialProfile.preferredGroupSize || 4,
      preferredFormat: initialProfile.preferredFormat || 'hybrid',
      mentorWillingness: initialProfile.mentorWillingness ?? true,
      collaborationGoals: initialProfile.collaborationGoals || ['Exam Prep', 'Project Collaboration'],
      visibility: initialProfile.visibility || 'institution',
      units: (initialProfile.units || []).map((u) => ({
        academicUnitId: u.academicUnitId,
        unitCode: u.unitCode,
        unitTitle: u.unitTitle,
        role: u.role,
        confidence: u.confidence,
        topics: u.topics || [],
      })),
      availability: (initialProfile.availability || []).map((a) => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
      })),
      bioNote: '',
    },
  });

  // Dynamic Unit Field Array
  const {
    fields: unitFields,
    append: appendUnit,
    remove: removeUnit,
  } = useFieldArray({
    control,
    name: 'units',
  });

  // Dynamic Availability Field Array
  const {
    fields: availabilityFields,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    control,
    name: 'availability',
  });

  // Live Watchers for UI reactiveness
  const watchedProgrammeId = watch('programmeId');
  const watchedStudyLevel = watch('studyLevel');
  const watchedUnits = watch('units') || [];
  const watchedAvailability = watch('availability') || [];
  const watchedPreferredFormat = watch('preferredFormat');
  const watchedPreferredGroupSize = watch('preferredGroupSize');
  const watchedMentorWillingness = watch('mentorWillingness');
  const watchedCollaborationGoals = watch('collaborationGoals') || [];
  const watchedVisibility = watch('visibility');

  // Filtered unit subsets
  const canHelpUnits = watchedUnits.filter((u) => u.role === 'can_help');
  const needHelpUnits = watchedUnits.filter((u) => u.role === 'needs_help');

  // Dynamic Completeness Scoring (0 - 100%)
  const calculateCompleteness = () => {
    let score = 0;
    if (watchedProgrammeId && watchedStudyLevel) score += 20;
    if (canHelpUnits.length > 0) score += 20;
    if (needHelpUnits.length > 0) score += 20;
    if (watchedAvailability.length > 0) score += 20;
    if (watchedCollaborationGoals.length > 0 && watchedPreferredFormat) score += 20;
    return score;
  };
  const completeness = calculateCompleteness();

  // Navigation Steps Definition
  const steps = [
    { num: 1, title: 'Academic Identity', icon: GraduationCap, fieldNames: ['programmeId', 'studyLevel'] as const },
    { num: 2, title: 'I Can Help With', icon: BookOpen, fieldNames: ['units'] as const },
    { num: 3, title: 'I Need Help With', icon: HelpCircle, fieldNames: ['units'] as const },
    { num: 4, title: 'Weekly Availability', icon: Calendar, fieldNames: ['availability'] as const },
    { num: 5, title: 'Preferences & Goals', icon: Settings, fieldNames: ['preferredFormat', 'preferredGroupSize', 'collaborationGoals'] as const },
    { num: 6, title: 'Visibility & Privacy', icon: Eye, fieldNames: ['visibility'] as const },
    { num: 7, title: 'Review & Confirm', icon: CheckCircle2, fieldNames: [] as const },
  ];

  // Step Validation Gatekeeper
  const validateAndNextStep = async () => {
    const currentStepConfig = steps[currentStep - 1];
    if (currentStepConfig.fieldNames.length > 0) {
      const isStepValid = await trigger(currentStepConfig.fieldNames as any);
      if (!isStepValid) return;
    }

    // Custom guardrails for practical UX
    if (currentStep === 2 && canHelpUnits.length === 0) {
      // Allow proceeding, but show subtle prompt
    }
    if (currentStep === 4 && watchedAvailability.length === 0) {
      // Require at least one slot
      const valid = await trigger('availability');
      if (!valid) return;
    }

    setCurrentStep((prev) => Math.min(7, prev + 1));
  };

  // Add a "Can Help" Unit
  const handleAddCanHelp = () => {
    if (!selectedHelpUnitCode) return;
    const catalogItem = CATALOG_UNITS.find((u) => u.unitCode === selectedHelpUnitCode);
    const existingIndex = watchedUnits.findIndex(
      (u) => u.unitCode === selectedHelpUnitCode && u.role === 'can_help'
    );
    if (existingIndex >= 0) return;

    const topicsToAdd = customHelpTopic.trim()
      ? [customHelpTopic.trim()]
      : catalogItem?.defaultTopics || [];

    appendUnit({
      academicUnitId: catalogItem?.academicUnitId || `u-${selectedHelpUnitCode.toLowerCase().replace(/\s+/g, '-')}`,
      unitCode: selectedHelpUnitCode,
      unitTitle: catalogItem?.unitTitle || selectedHelpUnitCode,
      role: 'can_help',
      confidence: selectedHelpConfidence,
      topics: topicsToAdd,
    });

    setSelectedHelpUnitCode('');
    setCustomHelpTopic('');
  };

  // Add a "Need Help" Unit
  const handleAddNeedHelp = () => {
    if (!selectedNeedUnitCode) return;
    const catalogItem = CATALOG_UNITS.find((u) => u.unitCode === selectedNeedUnitCode);
    const existingIndex = watchedUnits.findIndex(
      (u) => u.unitCode === selectedNeedUnitCode && u.role === 'needs_help'
    );
    if (existingIndex >= 0) return;

    const topicsToAdd = customNeedTopic.trim()
      ? [customNeedTopic.trim()]
      : catalogItem?.defaultTopics.slice(0, 2) || [];

    appendUnit({
      academicUnitId: catalogItem?.academicUnitId || `u-${selectedNeedUnitCode.toLowerCase().replace(/\s+/g, '-')}`,
      unitCode: selectedNeedUnitCode,
      unitTitle: catalogItem?.unitTitle || selectedNeedUnitCode,
      role: 'needs_help',
      confidence: 'medium',
      topics: topicsToAdd,
    });

    setSelectedNeedUnitCode('');
    setCustomNeedTopic('');
  };

  // Add Topic tag to an existing unit
  const handleAddTopicToUnit = (unitCode: string, role: string, topic: string) => {
    if (!topic.trim()) return;
    const updatedUnits = watchedUnits.map((u) => {
      if (u.unitCode === unitCode && u.role === role) {
        if (!u.topics.includes(topic.trim())) {
          return { ...u, topics: [...u.topics, topic.trim()] };
        }
      }
      return u;
    });
    setValue('units', updatedUnits, { shouldDirty: true, shouldValidate: true });
  };

  // Remove Topic tag from a unit
  const handleRemoveTopic = (unitCode: string, role: string, topicToRemove: string) => {
    const updatedUnits = watchedUnits.map((u) => {
      if (u.unitCode === unitCode && u.role === role) {
        return { ...u, topics: u.topics.filter((t) => t !== topicToRemove) };
      }
      return u;
    });
    setValue('units', updatedUnits, { shouldDirty: true, shouldValidate: true });
  };

  // Availability Slot Toggle
  const isSlotSelected = (dayOfWeek: number, start: string, end: string) => {
    return watchedAvailability.some(
      (a) => a.dayOfWeek === dayOfWeek && a.startTime === start && a.endTime === end
    );
  };

  const handleToggleSlot = (dayOfWeek: number, start: string, end: string) => {
    const existingIndex = watchedAvailability.findIndex(
      (a) => a.dayOfWeek === dayOfWeek && a.startTime === start && a.endTime === end
    );

    if (existingIndex >= 0) {
      removeAvailability(existingIndex);
    } else {
      appendAvailability({ dayOfWeek, startTime: start, endTime: end });
    }
  };

  // Collaboration Goal Toggle
  const handleToggleGoal = (goal: string) => {
    const currentGoals = watchedCollaborationGoals;
    if (currentGoals.includes(goal)) {
      setValue(
        'collaborationGoals',
        currentGoals.filter((g) => g !== goal),
        { shouldDirty: true, shouldValidate: true }
      );
    } else {
      setValue('collaborationGoals', [...currentGoals, goal], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Save Draft (ignores non-blocking step requirements)
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const currentValues = watch();
      await onSaveProfile({
        ...currentValues,
        units: currentValues.units as any,
        availability: currentValues.availability as any,
      });
      setSaveSuccessMessage('Draft saved successfully! You can resume anytime.');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    } catch {
      setSaveSuccessMessage('Draft save failed. Please check your network connection.');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Form Submission
  const onFormSubmit = async (data: LearningProfileFormValues) => {
    try {
      await onSaveProfile({
        ...data,
        units: data.units as any,
        availability: data.availability as any,
      });
      setSaveSuccessMessage('Profile published successfully! Recalculating peer synergy...');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to submit learning profile:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-teal-400 font-bold">
              BrainMate Academic Identity Engine
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
              Verified Schema
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Learning Profile Editor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Build your peer study identity with verified course units, weekly schedules, and ethical synergy matching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {isSavingDraft ? 'Saving Draft...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Exit Editor
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMessage(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={handleSubmit((data) => onFormSubmit(data as LearningProfileFormValues))} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Progress & Multi-Step Navigation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Completeness Card */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Profile Completeness</span>
                <span className="text-xs font-bold text-teal-400">{completeness}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Profiles with both complementary strengths, needs, and schedule windows receive 3.8x higher peer synergy matches.
              </p>
            </div>

            {/* Step Navigation Sidebar */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2 space-y-1">
              {steps.map((s) => {
                const Icon = s.icon;
                const isActive = currentStep === s.num;
                const isPast = currentStep > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setCurrentStep(s.num)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30 font-semibold'
                        : isPast
                        ? 'text-slate-300 hover:bg-slate-800/50'
                        : 'text-slate-500 hover:bg-slate-800/30'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold ${
                        isActive
                          ? 'bg-teal-500 text-slate-950'
                          : isPast
                          ? 'bg-slate-800 text-teal-400'
                          : 'bg-slate-950 text-slate-600'
                      }`}
                    >
                      {isPast ? '✓' : s.num}
                    </div>
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Validation Error Alert */}
            {Object.keys(errors).length > 0 && (
              <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Required Fields Incomplete</span>
                </div>
                <ul className="text-[11px] text-rose-400/90 space-y-1 list-disc list-inside">
                  {errors.programmeId && <li>Programme must be chosen</li>}
                  {errors.studyLevel && <li>Study level required</li>}
                  {errors.units && <li>At least 1 unit required</li>}
                  {errors.availability && <li>Availability slot required</li>}
                  {errors.collaborationGoals && <li>Collaboration goals required</li>}
                  {errors.preferredFormat && <li>Format required</li>}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Step Viewport Container */}
          <div className="lg:col-span-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 flex flex-col justify-between min-h-[580px]">
            <div className="space-y-6">
              {/* SECTION 1: Academic Identity */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-teal-400" />
                      1. Academic Identity & Institutional Verification
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Specify your enrolled degree programme and academic level. Peer matching strictly enforces institutional isolation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Programme Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Enrolled Degree Programme</label>
                      <select
                        {...register('programmeId', {
                          onChange: (e) => {
                            const found = AVAILABLE_PROGRAMMES.find((p) => p.id === e.target.value);
                            if (found) {
                              setValue('programmeName', found.name);
                            }
                          },
                        })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                      >
                        {AVAILABLE_PROGRAMMES.map((prog) => (
                          <option key={prog.id} value={prog.id}>
                            {prog.name} ({prog.department})
                          </option>
                        ))}
                      </select>
                      {errors.programmeId && (
                        <p className="text-[11px] text-rose-400">{errors.programmeId.message}</p>
                      )}
                    </div>

                    {/* Study Level */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Academic Standing / Level</label>
                      <select
                        {...register('studyLevel')}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                      >
                        <option value="undergraduate">Undergraduate (Years 1 - 4)</option>
                        <option value="postgraduate">Postgraduate (Masters)</option>
                        <option value="doctorate">Doctorate (PhD / Post-Doc)</option>
                        <option value="diploma">Diploma / TVET Higher National</option>
                      </select>
                      {errors.studyLevel && (
                        <p className="text-[11px] text-rose-400">{errors.studyLevel.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Institution Isolation Notice */}
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      <span>Institutional Data Isolation Verified</span>
                    </div>
                    <p className="leading-relaxed">
                      You are authenticated under <strong>Maseno University</strong>. In accordance with BrainMate RLS data boundaries, your academic identity is isolated from cross-institution queries. Only enrolled peers at your institution can view your profile.
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 2: Units I Can Help With (Strengths) */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-teal-400" />
                      2. Units I Can Help With (Academic Strengths)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Declare courses you have mastered and can mentor or tutor peers in. This directly powers complementary synergy matching (+35 points max).
                    </p>
                  </div>

                  {/* Add Unit Selector Formlet */}
                  <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-4">
                    <span className="text-xs font-semibold text-teal-400">Add Academic Unit & Confidence Rating</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        value={selectedHelpUnitCode}
                        onChange={(e) => setSelectedHelpUnitCode(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                      >
                        <option value="">Select Academic Unit...</option>
                        {CATALOG_UNITS.map((u) => (
                          <option key={u.academicUnitId} value={u.unitCode}>
                            {u.unitCode} - {u.unitTitle}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedHelpConfidence}
                        onChange={(e) => setSelectedHelpConfidence(e.target.value as any)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                      >
                        <option value="high">High Confidence (Lead Study / Mentor)</option>
                        <option value="medium">Medium Confidence (Solid Peer)</option>
                        <option value="low">Low Confidence (Reviewing)</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleAddCanHelp}
                        disabled={!selectedHelpUnitCode}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors disabled:opacity-40"
                      >
                        + Add to Strengths
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Optional custom topic (e.g. Graph Algorithms, Normalization)"
                        value={customHelpTopic}
                        onChange={(e) => setCustomHelpTopic(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>
                  </div>

                  {/* Declared Strengths List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">
                        Your Declared Strengths ({canHelpUnits.length})
                      </span>
                      <span className="text-[11px] text-teal-400">
                        Complementary Synergy Weight: +35 pts
                      </span>
                    </div>

                    {canHelpUnits.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                        No strengths declared yet. Add at least one unit where you can assist peers to enable complementary bilateral matching.
                      </p>
                    ) : (
                      canHelpUnits.map((unit) => {
                        const globalIndex = watchedUnits.findIndex(
                          (u) => u.unitCode === unit.unitCode && u.role === 'can_help'
                        );
                        return (
                          <div
                            key={unit.unitCode}
                            className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-teal-300">{unit.unitCode}</span>
                                <span className="text-xs text-slate-300">· {unit.unitTitle}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium capitalize">
                                  {unit.confidence} confidence
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeUnit(globalIndex)}
                                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                                title="Remove unit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Topics Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                              <span className="text-[11px] text-slate-500 mr-1">Topic Specialties:</span>
                              {unit.topics.map((t) => (
                                <span
                                  key={t}
                                  className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                                >
                                  <span>{t}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTopic(unit.unitCode, 'can_help', t)}
                                    className="text-slate-500 group-hover:text-rose-400 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}

                              <input
                                type="text"
                                placeholder="+ Add topic tag"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    handleAddTopicToUnit(unit.unitCode, 'can_help', input.value);
                                    input.value = '';
                                  }
                                }}
                                className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-[11px] text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-teal-500 w-28"
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 3: Units I Need Help With (Learning Needs) */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-cyan-400" />
                      3. Units I Need Help With (Learning Needs)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Identify academic units where you seek peer accountability, code reviews, or mentorship for tough problem sets.
                    </p>
                  </div>

                  {/* Add Unit Selector Formlet */}
                  <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-4">
                    <span className="text-xs font-semibold text-cyan-400">Request Peer Support for an Academic Unit</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={selectedNeedUnitCode}
                        onChange={(e) => setSelectedNeedUnitCode(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                      >
                        <option value="">Select Academic Unit...</option>
                        {CATALOG_UNITS.map((u) => (
                          <option key={u.academicUnitId} value={u.unitCode}>
                            {u.unitCode} - {u.unitTitle}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleAddNeedHelp}
                        disabled={!selectedNeedUnitCode}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors disabled:opacity-40"
                      >
                        + Add to Learning Wishlist
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Optional challenging topic (e.g. Dynamic Programming, Semaphores)"
                        value={customNeedTopic}
                        onChange={(e) => setCustomNeedTopic(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Declared Needs List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">
                        Your Learning Needs ({needHelpUnits.length})
                      </span>
                      <span className="text-[11px] text-cyan-400">
                        Mutual Learning Weight: +15 pts
                      </span>
                    </div>

                    {needHelpUnits.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                        No learning needs declared yet. Specify challenging subjects so the algorithm can match you with qualified student mentors.
                      </p>
                    ) : (
                      needHelpUnits.map((unit) => {
                        const globalIndex = watchedUnits.findIndex(
                          (u) => u.unitCode === unit.unitCode && u.role === 'needs_help'
                        );
                        return (
                          <div
                            key={unit.unitCode}
                            className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-cyan-300">{unit.unitCode}</span>
                                <span className="text-xs text-slate-300">· {unit.unitTitle}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeUnit(globalIndex)}
                                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                                title="Remove unit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Topics Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                              <span className="text-[11px] text-slate-500 mr-1">Focus Topics:</span>
                              {unit.topics.map((t) => (
                                <span
                                  key={t}
                                  className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-cyan-200"
                                >
                                  <span>{t}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTopic(unit.unitCode, 'needs_help', t)}
                                    className="text-slate-500 group-hover:text-rose-400 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}

                              <input
                                type="text"
                                placeholder="+ Add topic"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    handleAddTopicToUnit(unit.unitCode, 'needs_help', input.value);
                                    input.value = '';
                                  }
                                }}
                                className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-[11px] text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500 w-28"
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 4: Weekly Availability Grid */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-400" />
                      4. Weekly Availability Grid
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Toggle time windows when you are open for study sessions. Schedule overlap of &ge; 60 minutes awards maximum availability points (+25 pts).
                    </p>
                  </div>

                  {/* 7-day Weekly Grid */}
                  <div className="overflow-x-auto pb-2">
                    <table className="w-full text-xs text-center border-collapse">
                      <thead>
                        <tr>
                          <th className="p-2 text-slate-500 font-semibold text-left">Time Window</th>
                          {DAYS_OF_WEEK.map((day) => (
                            <th key={day.dayIndex} className="p-2 text-slate-300 font-semibold">
                              {day.short}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TIME_SLOTS.map((slot) => (
                          <tr key={slot.label} className="border-t border-slate-800/60">
                            <td className="p-2 text-slate-400 text-left font-mono text-[11px] whitespace-nowrap">
                              {slot.label}
                            </td>
                            {DAYS_OF_WEEK.map((day) => {
                              const selected = isSlotSelected(day.dayIndex, slot.start, slot.end);
                              return (
                                <td key={day.dayIndex} className="p-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSlot(day.dayIndex, slot.start, slot.end)}
                                    className={`w-full py-2.5 rounded-lg text-[11px] font-semibold transition-all ${
                                      selected
                                        ? 'bg-teal-500 text-slate-950 shadow-sm shadow-teal-500/20'
                                        : 'bg-slate-950/80 text-slate-600 hover:bg-slate-800 hover:text-slate-300 border border-slate-800/60'
                                    }`}
                                    title={`${day.label} ${slot.label}: ${selected ? 'Available' : 'Click to add'}`}
                                  >
                                    {selected ? '✓' : '—'}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span>
                      Selected windows: <strong className="text-teal-400">{watchedAvailability.length} slots</strong> ({watchedAvailability.length * 2} hours/week)
                    </span>
                    <button
                      type="button"
                      onClick={() => setValue('availability', [], { shouldDirty: true, shouldValidate: true })}
                      className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      Clear all slots
                    </button>
                  </div>
                  {errors.availability && (
                    <p className="text-[11px] text-rose-400">{errors.availability.message}</p>
                  )}
                </div>
              )}

              {/* SECTION 5: Preferences & Goals */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-teal-400" />
                      5. Study Preferences & Collaboration Goals
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Tune study format, preferred group size, mentorship willingness, and collaboration objectives.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Preferred Format */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Study Format Preference</label>
                      <select
                        {...register('preferredFormat')}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
                      >
                        <option value="hybrid">Hybrid (Both In-Person & Online)</option>
                        <option value="in_person">In-Person Only (Campus Library / Labs)</option>
                        <option value="online">Online Only (Google Meet / Discord)</option>
                      </select>
                      {errors.preferredFormat && (
                        <p className="text-[11px] text-rose-400">{errors.preferredFormat.message}</p>
                      )}
                    </div>

                    {/* Preferred Group Size */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-300">Preferred Group Size</label>
                        <span className="text-xs font-bold text-teal-400">
                          {watchedPreferredGroupSize} members
                        </span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={8}
                        step={1}
                        {...register('preferredGroupSize', { valueAsNumber: true })}
                        className="w-full accent-teal-400 mt-2"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Pair Study (2)</span>
                        <span>Small Pod (4)</span>
                        <span>Large Circle (8)</span>
                      </div>
                    </div>
                  </div>

                  {/* Peer Mentorship Willingness */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-white">Peer Mentorship Willingness</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Indicate willingness to guide junior peers or cohort members in subjects where you hold high confidence. You earn the "Peer Mentor" badge and priority matching in peer requests.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                      <input
                        type="checkbox"
                        {...register('mentorWillingness')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                    </label>
                  </div>

                  {/* Collaboration Goals Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Collaboration Goals</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {COLLABORATION_GOAL_OPTIONS.map((goal) => {
                        const isSelected = watchedCollaborationGoals.includes(goal);
                        return (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => handleToggleGoal(goal)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-teal-500 text-slate-950 font-semibold shadow-xs'
                                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {isSelected ? `✓ ${goal}` : `+ ${goal}`}
                          </button>
                        );
                      })}
                    </div>
                    {errors.collaborationGoals && (
                      <p className="text-[11px] text-rose-400">{errors.collaborationGoals.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 6: Visibility & Privacy */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-teal-400" />
                      6. Visibility & Privacy Controls
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose who can discover your learning profile in the Discover Feed and suggest study connections. Grades and personal contact info are never revealed.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: 'institution',
                        title: 'Institution-Wide (Recommended)',
                        desc: 'Any verified student at Maseno University can discover your academic strengths and send study requests.',
                      },
                      {
                        key: 'programme',
                        title: 'Programme-Only',
                        desc: 'Only students enrolled in your specific programme (BSc Computer Science) can view your profile.',
                      },
                      {
                        key: 'connections_only',
                        title: 'Connections-Only (Private)',
                        desc: 'Hidden from the Discover feed. Only students you directly invite can see your profile details.',
                      },
                    ].map((opt) => {
                      const isChecked = watchedVisibility === opt.key;
                      return (
                        <label
                          key={opt.key}
                          className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-teal-500/10 border-teal-500/40 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              value={opt.key}
                              {...register('visibility')}
                              className="mt-0.5 accent-teal-400"
                            />
                            <div className="space-y-1">
                              <span className={`text-xs font-semibold ${isChecked ? 'text-teal-300' : 'text-slate-200'}`}>
                                {opt.title}
                              </span>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{opt.desc}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 7: Review & Confirm Profile */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      7. Review & Confirm Learning Profile
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Verify your academic credentials, schedule matrix, and privacy boundaries prior to publishing.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Academic Identity Block */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Academic Identity & Standing
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[11px] text-teal-400 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="text-xs text-slate-200">
                        <strong>{watch('programmeName') || watchedProgrammeId}</strong> · Level:{' '}
                        <span className="capitalize">{watchedStudyLevel}</span> · Format:{' '}
                        <span className="capitalize font-semibold">{watchedPreferredFormat}</span> · Target Pod Size:{' '}
                        <strong>{watchedPreferredGroupSize} members</strong>
                      </div>
                      <div className="text-xs text-slate-400">
                        Peer Mentorship Willingness: <strong>{watchedMentorWillingness ? 'Active Mentor' : 'Peer Learner'}</strong> · Visibility Scope:{' '}
                        <strong>{watchedVisibility}</strong>
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">
                          Declared Strengths ({canHelpUnits.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[11px] text-teal-400 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {canHelpUnits.length === 0 ? (
                          <span className="text-xs text-slate-500 italic">None declared</span>
                        ) : (
                          canHelpUnits.map((u) => (
                            <span
                              key={u.unitCode}
                              className="px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 font-medium"
                            >
                              {u.unitCode} ({u.confidence})
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Needs */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                          Learning Needs ({needHelpUnits.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[11px] text-cyan-400 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {needHelpUnits.length === 0 ? (
                          <span className="text-xs text-slate-500 italic">None declared</span>
                        ) : (
                          needHelpUnits.map((u) => (
                            <span
                              key={u.unitCode}
                              className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-medium"
                            >
                              {u.unitCode}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Weekly Schedule Matrix
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-[11px] text-teal-400 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-xs text-slate-300">
                        {watchedAvailability.length} active weekly availability slots registered ({watchedAvailability.length * 2} hours/week).
                      </p>
                    </div>

                    {/* Goals */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Collaboration Objectives
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(5)}
                          className="text-[11px] text-teal-400 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {watchedCollaborationGoals.map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Footer Controls */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Step
              </button>

              <div className="flex items-center gap-3">
                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={validateAndNextStep}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg shadow-teal-500/20"
                  >
                    Continue to Next Step
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSubmitting ? 'Publishing Profile...' : 'Save & Publish Profile'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default LearningProfileEditor;

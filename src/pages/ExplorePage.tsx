import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Info,
  Trash2,
  Plus
} from 'lucide-react';
import {
  UNIVERSITIES,
  DEMO_PROGRAMMES,
  GRADING_SCALES,
} from '../data/mockData';
import {
  University,
  Programme,
  Unit,
  StudentUnitEntry,
  GradingScaleType,
} from '../types';
import { DemoDataBadge } from '../components/DemoDataBadge';

interface ExplorePageProps {
  onCompleteExploration: (payload: {
    programme: Programme;
    selectedUnits: StudentUnitEntry[];
    interests: string[];
    skillsToDevelop: string[];
    careerGoals: string;
    gradingScale: GradingScaleType;
  }) => void;
  onNavigate: (route: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onCompleteExploration,
  onNavigate,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: University & Programme
  const [universityId, setUniversityId] = useState<string>('maseno');
  const [programmeId, setProgrammeId] = useState<string>('bsc-cs');
  const [programmeSearch, setProgrammeSearch] = useState<string>('');

  // Step 2: Year, Semester & Units
  const [selectedYear, setSelectedYear] = useState<number>(2);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedUnits, setSelectedUnits] = useState<StudentUnitEntry[]>([
    {
      unitId: 'cs-211',
      unitCode: 'CSC 211',
      unitTitle: 'Data Structures & Algorithms',
      academicPeriod: 'Year 2, Sem 1',
      status: 'completed',
    },
    {
      unitId: 'cs-212',
      unitCode: 'CSC 212',
      unitTitle: 'Database Systems & SQL Modeling',
      academicPeriod: 'Year 2, Sem 1',
      status: 'completed',
    },
  ]);

  // Step 3: Optional Marks & Grading Scale
  const [gradingScale, setGradingScale] = useState<GradingScaleType>('percentage');
  const [markErrors, setMarkErrors] = useState<Record<string, string>>({});

  // Step 4: Interests & Goals
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Software Engineering',
    'Cloud Computing',
  ]);
  const [selectedSkillsToDev, setSelectedSkillsToDev] = useState<string[]>([
    'TypeScript',
    'Docker',
  ]);
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [careerGoals, setCareerGoals] = useState('');

  // Derived active programme
  const activeProgramme = useMemo(() => {
    return DEMO_PROGRAMMES.find((p) => p.id === programmeId) || DEMO_PROGRAMMES[0];
  }, [programmeId]);

  // Units available for current programme, year, semester
  const availableUnitsForCurrentPeriod = useMemo(() => {
    const yearData = activeProgramme.academicYears.find((y) => y.yearNumber === selectedYear);
    if (!yearData) return [];
    const semData = yearData.semesters.find((s) => s.semesterNumber === selectedSemester);
    return semData ? semData.units : [];
  }, [activeProgramme, selectedYear, selectedSemester]);

  // Handle unit selection toggle
  const toggleUnitSelection = (unit: Unit) => {
    const exists = selectedUnits.some((u) => u.unitId === unit.id);
    if (exists) {
      setSelectedUnits((prev) => prev.filter((u) => u.unitId !== unit.id));
    } else {
      setSelectedUnits((prev) => [
        ...prev,
        {
          unitId: unit.id,
          unitCode: unit.unitCode,
          unitTitle: unit.title,
          academicPeriod: `Year ${selectedYear}, Sem ${selectedSemester}`,
          status: 'completed',
        },
      ]);
    }
  };

  // Handle mark input and scale validation
  const handleMarkChange = (unitId: string, valueStr: string) => {
    const currentScale = GRADING_SCALES[gradingScale] || GRADING_SCALES.percentage;

    if (valueStr.trim() === '') {
      // Allow blank!
      setSelectedUnits((prev) =>
        prev.map((u) => (u.unitId === unitId ? { ...u, mark: undefined } : u))
      );
      setMarkErrors((prev) => {
        const next = { ...prev };
        delete next[unitId];
        return next;
      });
      return;
    }

    const num = parseFloat(valueStr);
    if (isNaN(num)) {
      setMarkErrors((prev) => ({
        ...prev,
        [unitId]: 'Please enter a numeric mark value.',
      }));
      return;
    }

    if (num < currentScale.min || num > currentScale.max) {
      setMarkErrors((prev) => ({
        ...prev,
        [unitId]: `Mark must be between ${currentScale.min} and ${currentScale.max} for ${currentScale.name}.`,
      }));
    } else {
      setMarkErrors((prev) => {
        const next = { ...prev };
        delete next[unitId];
        return next;
      });
      setSelectedUnits((prev) =>
        prev.map((u) => (u.unitId === unitId ? { ...u, mark: num } : u))
      );
    }
  };

  // Interest options
  const popularInterests = [
    'Software Engineering',
    'Artificial Intelligence',
    'Cloud Computing',
    'Cybersecurity',
    'Data Science',
    'Financial Modeling',
    'Clinical Healthcare',
    'Embedded Systems & IoT',
    'STEM Education',
    'Product Management',
  ];

  const popularSkills = [
    'TypeScript',
    'Python',
    'Docker',
    'PostgreSQL / SQL',
    'React',
    'Linux CLI',
    'Statistical Modeling',
    'System Architecture',
  ];

  const handleFinish = () => {
    onCompleteExploration({
      programme: activeProgramme,
      selectedUnits,
      interests: selectedInterests,
      skillsToDevelop: selectedSkillsToDev,
      careerGoals,
      gradingScale,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Step Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Stage {step} of 4
          </span>
          <DemoDataBadge label="Illustrative Syllabus Data" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {step === 1 && 'Select Your Degree Programme'}
          {step === 2 && 'Select Your Units & Curriculum Period'}
          {step === 3 && 'Optional Academic Marks (Skip Anytime)'}
          {step === 4 && 'Career Interests & Learning Objectives'}
        </h1>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: University & Programme Selection */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-900">
              1. Choose University
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {UNIVERSITIES.map((uni) => (
                <button
                  key={uni.id}
                  type="button"
                  onClick={() => setUniversityId(uni.id)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    universityId === uni.id
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{uni.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{uni.city}, {uni.country}</div>
                  {uni.isDemo && (
                    <span className="inline-block mt-2 text-[10px] text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
                      Partner Demo
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-sm font-bold text-slate-900">
                2. Select Degree Programme
              </label>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search programmes..."
                  value={programmeSearch}
                  onChange={(e) => setProgrammeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {DEMO_PROGRAMMES.filter((p) => {
                if (programmeSearch) {
                  return (
                    p.name.toLowerCase().includes(programmeSearch.toLowerCase()) ||
                    p.code.toLowerCase().includes(programmeSearch.toLowerCase())
                  );
                }
                return true;
              }).map((prog) => {
                const isSelected = programmeId === prog.id;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => {
                      setProgrammeId(prog.id);
                      // Reset selected units to avoid mismatch
                      setSelectedUnits([]);
                    }}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{prog.name}</span>
                      <span className="text-xs font-mono font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {prog.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {prog.description}
                    </p>
                    <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{prog.durationYears} Years</span>
                      <span>·</span>
                      <span>{prog.level}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Year, Semester & Current Units */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {activeProgramme.name} ({activeProgramme.code})
              </h2>
              <p className="text-xs text-slate-500">
                Select your academic year and semester to view illustrative units.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                >
                  {activeProgramme.academicYears.map((y) => (
                    <option key={y.yearNumber} value={y.yearNumber}>
                      Year {y.yearNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Units in Year {selectedYear}, Semester {selectedSemester} (Click to select/deselect)
              </span>
              <span className="text-xs text-indigo-600 font-medium">
                {selectedUnits.length} units selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableUnitsForCurrentPeriod.map((unit) => {
                const isChecked = selectedUnits.some((u) => u.unitId === unit.id);
                return (
                  <div
                    key={unit.id}
                    onClick={() => toggleUnitSelection(unit)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-700">
                        {unit.unitCode}
                      </span>
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          isChecked ? 'text-indigo-600 fill-indigo-100' : 'text-slate-300'
                        }`}
                      />
                    </div>
                    <div className="font-bold text-slate-900 text-sm mt-1">{unit.title}</div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {unit.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {unit.coreSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Optional Marks & Grading Scale */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-sky-900 space-y-1">
              <p className="font-bold">Marks Are Completely Voluntary</p>
              <p className="leading-relaxed">
                You can leave all marks blank or skip this step entirely. Recommendations are generated primarily from your degree and interests. A low mark will never permanently disqualify you from any career path.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <label className="block text-sm font-bold text-slate-900">
                Grading Scale Framework
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your institution's scale to ensure proper validation.
              </p>
            </div>

            <select
              value={gradingScale}
              onChange={(e) => setGradingScale(e.target.value as GradingScaleType)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="percentage">Standard Percentage Scale (0 - 100%)</option>
              <option value="gpa4">4.0 GPA Scale (0.0 - 4.0)</option>
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Enter Marks for Selected Units (Optional)
            </h3>

            {selectedUnits.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No units were selected in Step 2. You may continue without marks!
              </div>
            ) : (
              <div className="space-y-3">
                {selectedUnits.map((u) => (
                  <div
                    key={u.unitId}
                    className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-700">
                        {u.unitCode}
                      </span>
                      <div className="font-bold text-slate-900 text-sm">{u.unitTitle}</div>
                      <span className="text-xs text-slate-400">{u.academicPeriod}</span>
                    </div>

                    <div className="w-full sm:w-48">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step={gradingScale === 'gpa4' ? '0.1' : '1'}
                          placeholder={gradingScale === 'gpa4' ? 'e.g. 3.7' : 'e.g. 72'}
                          value={u.mark ?? ''}
                          onChange={(e) => handleMarkChange(u.unitId, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                        {u.mark !== undefined && (
                          <button
                            type="button"
                            onClick={() => handleMarkChange(u.unitId, '')}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                            title="Clear mark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {markErrors[u.unitId] && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">
                          {markErrors[u.unitId]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Career Interests & Goals */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Select Your Career Interests
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Choose professional domains you would like to explore.
            </p>
            <div className="flex flex-wrap gap-2">
              {popularInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedInterests((prev) => prev.filter((i) => i !== interest));
                      } else {
                        setSelectedInterests((prev) => [...prev, interest]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Skills You Wish to Develop
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Target skills you want reflected in your roadmap milestones.
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => {
                const isSelected = selectedSkillsToDev.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSkillsToDev((prev) => prev.filter((s) => s !== skill));
                      } else {
                        setSelectedSkillsToDev((prev) => [...prev, skill]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Personal Career Ambition or Target (Optional)
            </label>
            <textarea
              rows={3}
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="e.g. I want to build cloud distributed backends for health and banking systems..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons (Back & Continue) */}
      <div className="flex items-center justify-between pt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev - 1) as any)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev + 1) as any)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Career Exploration Dashboard</span>
          </button>
        )}
      </div>
    </div>
  );
};

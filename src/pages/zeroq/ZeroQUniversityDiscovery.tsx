import React, { useState } from 'react';
import {
  Building2,
  ExternalLink,
  MapPin,
  Calendar,
  Home,
  CheckCircle,
  FileText,
  DollarSign,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ZeroQUniversity } from '../../types/zeroq';
import { ZEROQ_UNIVERSITIES } from '../../data/zeroqMockData';

interface ZeroQUniversityDiscoveryProps {
  onStartApplication: () => void;
  onOpenApexAI: () => void;
  applicationStatus: string;
}

export const ZeroQUniversityDiscovery: React.FC<ZeroQUniversityDiscoveryProps> = ({
  onStartApplication,
  onOpenApexAI,
  applicationStatus,
}) => {
  const [selectedUniId, setSelectedUniId] = useState<string>('maseno');
  const [activeSection, setActiveSection] = useState<'programmes' | 'fees' | 'hostels' | 'calendar' | 'requirements'>('programmes');

  const university = ZEROQ_UNIVERSITIES.find((u) => u.id === selectedUniId) || ZEROQ_UNIVERSITIES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* University Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {ZEROQ_UNIVERSITIES.map((uni) => (
          <button
            key={uni.id}
            onClick={() => setSelectedUniId(uni.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedUniId === uni.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {uni.name} ({uni.shortName})
          </button>
        ))}
      </div>

      {/* Hero Cover Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-lg">
        <div className="h-48 sm:h-64 w-full relative">
          <img
            src={university.coverImage}
            alt={university.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 relative -mt-20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded border border-teal-500/30">
                {university.ranking}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {university.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{university.location}</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={university.officialWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onStartApplication}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>{applicationStatus === 'Approved' ? 'View My Application' : 'Continue Application'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSection('programmes')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'programmes' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Available Programmes ({university.programmes.length})
        </button>
        <button
          onClick={() => setActiveSection('requirements')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'requirements' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Admission Requirements
        </button>
        <button
          onClick={() => setActiveSection('fees')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'fees' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tuition & Fee Structure
        </button>
        <button
          onClick={() => setActiveSection('hostels')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'hostels' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Hostels & Accommodation
        </button>
        <button
          onClick={() => setActiveSection('calendar')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'calendar' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Academic Calendar
        </button>
      </div>

      {/* SECTION: Available Programmes */}
      {activeSection === 'programmes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {university.programmes.map((prog) => (
            <div
              key={prog.code}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                    Code: {prog.code}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Cluster: {prog.clusterPoints} pts
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{prog.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{prog.duration}</span>
                  <span>·</span>
                  <span>{prog.level}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Tuition Per Year:</span>
                  <span className="text-slate-900 font-mono font-bold">
                    KSh {prog.tuitionPerYearKSh.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  <strong className="text-slate-700">Prerequisites:</strong> {prog.requirements.join(' · ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION: Admission Requirements */}
      {activeSection === 'requirements' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Mandatory Documents & Registration Requirements
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All prospective candidates admitted via KUCCPS to {university.name} must submit certified copies of the following items prior to orientation week:
          </p>

          <ul className="space-y-3 pt-2">
            {university.admissionRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECTION: Fees Information */}
      {activeSection === 'fees' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Approved University Fee Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Government-Sponsored Student Programme (GSSP) scheduled payments for 2026/2027.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[11px] uppercase font-semibold">Semester 1 Deposit</span>
              <div className="text-xl font-bold font-mono text-slate-900">KSh 64,000</div>
              <p className="text-slate-400 text-[10px]">Due before reporting date</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[11px] uppercase font-semibold">Semester 2 Deposit</span>
              <div className="text-xl font-bold font-mono text-slate-900">KSh 64,000</div>
              <p className="text-slate-400 text-[10px]">Due before exam registration</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[11px] uppercase font-semibold">HEF / HELB Loan Support</span>
              <div className="text-xl font-bold text-teal-700">Eligible</div>
              <p className="text-slate-400 text-[10px]">Direct portal disbursement</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Accommodation & Hostels */}
      {activeSection === 'hostels' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-violet-600" />
            <span>Hostel Booking & Campus Accommodation</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {university.accommodation.description}
          </p>

          <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-violet-950 block">Average On-Campus Rate</span>
              <span className="text-violet-700 font-mono font-extrabold text-base">
                KSh {university.accommodation.averageFeePerSemesterKSh.toLocaleString()} / Semester
              </span>
            </div>

            <a
              href={university.accommodation.hostelBookingUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Launch Official Hostel Booking</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* SECTION: Academic Calendar */}
      {activeSection === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Academic Reporting Calendar</span>
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Official Reporting Date:</span>
              <span className="font-bold text-slate-900">{university.academicCalendar.reportingDate}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Orientation Week:</span>
              <span className="font-bold text-slate-900">{university.academicCalendar.orientationWeek}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Classes Begin:</span>
              <span className="font-bold text-slate-900">{university.academicCalendar.classesBegin}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

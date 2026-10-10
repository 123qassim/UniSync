import React, { useState } from 'react';
import {
  FileText,
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Upload
} from 'lucide-react';
import { ZeroQApplication, ZeroQDocument } from '../../types/zeroq';
import { ZEROQ_UNIVERSITIES } from '../../data/zeroqMockData';

interface ZeroQApplicationWizardProps {
  existingApplication: ZeroQApplication;
  documents: ZeroQDocument[];
  onSaveApplication: (app: ZeroQApplication) => void;
  onNavigateTab: (tab: string) => void;
}

export const ZeroQApplicationWizard: React.FC<ZeroQApplicationWizardProps> = ({
  existingApplication,
  documents,
  onSaveApplication,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ZeroQApplication>(existingApplication);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(existingApplication.status !== 'Draft');

  const selectedUni = ZEROQ_UNIVERSITIES.find((u) => u.id === formData.universityId) || ZEROQ_UNIVERSITIES[0];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      // Submit application
      const updatedApp: ZeroQApplication = {
        ...formData,
        status: 'Submitted',
        submissionTimestamp: new Date().toISOString(),
        timeline: [
          ...formData.timeline,
          {
            id: `evt-${Date.now()}`,
            status: 'Submitted',
            note: 'Application submitted through ZeroQ multi-step wizard.',
            timestamp: new Date().toISOString(),
            actor: 'Brian Otieno (Applicant)',
          },
        ],
      };
      setFormData(updatedApp);
      onSaveApplication(updatedApp);
      setIsSubmitted(true);
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Wizard Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-violet-400 bg-violet-950 px-2 py-0.5 rounded uppercase tracking-wider">
            ZeroQ Admissions Portal
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">
            Reference: {formData.id}
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          University Admission Application Wizard
        </h1>

        {/* Step Indicator */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-violet-600 to-teal-400 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Personal Information */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-600" />
              <span>Step 1: Personal Information</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm your official bio-data as recorded in your KCSE registration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.personalInfo.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, fullName: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.personalInfo.dateOfBirth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, email: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Phone Number</label>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, phone: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">County of Residence</label>
              <input
                type="text"
                value={formData.personalInfo.county}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, county: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nationality</label>
              <input
                type="text"
                value={formData.personalInfo.nationality}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, nationality: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Academic Information */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-violet-600" />
              <span>Step 2: Academic Background & KCSE Record</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified national high school examination credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Examination Type</label>
              <input
                type="text"
                value={formData.academicInfo.examinationType}
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Examination Year</label>
              <input
                type="number"
                value={formData.academicInfo.examinationYear}
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Secondary School Attended</label>
              <input
                type="text"
                value={formData.academicInfo.schoolAttended}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicInfo: { ...formData.academicInfo, schoolAttended: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">KNEC Candidate Index Number</label>
              <input
                type="text"
                value={formData.academicInfo.indexNumber}
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono text-slate-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Mean Grade / Aggregate Results</label>
              <input
                type="text"
                value={formData.academicInfo.meanGrade}
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: University Selection */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-violet-600" />
              <span>Step 3: University & Programme Confirmation</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm the institution where your admission will be processed.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase">Selected Institution</span>
                <div className="text-lg font-extrabold text-slate-900">{selectedUni.name}</div>
                <div className="text-xs text-slate-500">{selectedUni.location}</div>
              </div>
              <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">
                Code: {selectedUni.id.toUpperCase()}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Target Programme</span>
              <div className="text-sm font-bold text-slate-900">{formData.programmeName}</div>
              <div className="text-xs text-slate-500">Code: {formData.programmeCode}</div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Required Documents Review */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              <span>Step 4: Required Documents Verification</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These items are synchronised from your Document Centre.
            </p>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{doc.documentType}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{doc.fileName || 'Not uploaded yet'}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
                  doc.status === 'Accepted' || doc.status === 'Uploaded'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All 5 mandatory documents have been uploaded and will be transferred upon submission.</span>
          </div>
        </div>
      )}

      {/* STEP 5: Final Review Before Submission */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <span>Step 5: Review & Submit</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Carefully verify all particulars before submitting to the university admissions desk.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Application Summary</span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>Candidate: <strong>{formData.personalInfo.fullName}</strong></div>
                <div>Index: <strong>{formData.academicInfo.indexNumber}</strong></div>
                <div>Institution: <strong>{selectedUni.name}</strong></div>
                <div>Programme: <strong>{formData.programmeName}</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-200 text-violet-950 text-xs space-y-1">
              <strong>Applicant Legal Declaration:</strong>
              <p className="leading-relaxed">
                I certify that the information and documents provided herein are authentic copies of my KCSE and identity records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Submission Confirmation & Next Steps */}
      {currentStep === 6 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Admission Application Submitted!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Your application has been received by Maseno University Admissions Desk under reference{' '}
              <strong className="font-mono text-slate-900">{formData.id}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-700 font-mono">{formData.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timestamp:</span>
              <span className="font-mono text-slate-800">{new Date(formData.submissionTimestamp || Date.now()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Next Action:</span>
              <span className="font-semibold text-slate-800">Registrar Document Review</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('face-check')}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Proceed to Face Check Demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Back to Overview
            </button>
          </div>
        </div>
      )}

      {/* Navigation Controls (Back & Next) */}
      {currentStep < 6 && (
        <div className="flex items-center justify-between pt-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <span>{currentStep === 5 ? 'Confirm & Submit to Admissions' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

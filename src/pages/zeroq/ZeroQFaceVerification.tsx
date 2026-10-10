import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Video,
  VideoOff,
  UserCheck,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';

interface ZeroQFaceVerificationProps {
  onVerificationComplete: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ZeroQFaceVerification: React.FC<ZeroQFaceVerificationProps> = ({
  onVerificationComplete,
  onNavigateTab,
}) => {
  const [step, setStep] = useState<'intro' | 'scanning' | 'complete'>('intro');
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startScan = async () => {
    if (!agreedToPrivacy) return;
    setStep('scanning');
    setScanProgress(0);
    setCameraError(null);

    // Try live webcam stream if permitted
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setUseLiveCamera(true);
        }
      }
    } catch (err) {
      // Graceful fallback to synthetic social-app camera view
      setUseLiveCamera(false);
      setCameraError('Camera access declined or unavailable. Running in high-fidelity simulated camera mode.');
    }

    // Run scanning animation sequence
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
          }
          setStep('complete');
          onVerificationComplete();
          return 100;
        }
        return prev + 20;
      });
    }, 600);
  };

  const handleRetry = () => {
    setStep('intro');
    setScanProgress(0);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded uppercase tracking-wider border border-teal-500/30">
          Smart Onboarding
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Face Verification Demonstration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          A modern, social-app-inspired selfie check simulation to prepare for digital student credential issuance.
        </p>
      </div>

      {/* STEP 1: Introduction & Privacy Consent */}
      {step === 'intro' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-violet-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md">
            <Camera className="w-8 h-8" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Why We Perform a Face Check
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Universities require confirmation that the candidate completing digital registration matches the submitted KCSE exam portrait before issuing a physical or digital campus smart card.
            </p>
          </div>

          {/* Privacy Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Biometric Privacy & Hackathon Policy</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li>• In demo mode, no real facial biometric templates or vectors are stored.</li>
              <li>• Live camera images are processed only inside your local browser runtime.</li>
              <li>• Final university identity approval is performed by the admissions office.</li>
            </ul>
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                I agree to proceed with the simulated face-verification check
              </span>
              <span className="text-slate-500">
                I understand this is a demonstration feature for institutional onboarding.
              </span>
            </div>
          </label>

          <button
            onClick={startScan}
            disabled={!agreedToPrivacy}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Open Face Check Preview</span>
          </button>
        </div>
      )}

      {/* STEP 2: Active Scanning View */}
      {step === 'scanning' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 text-white text-center">
          {cameraError && (
            <div className="p-3 bg-amber-950/60 border border-amber-500/30 text-amber-300 rounded-xl text-xs flex items-center justify-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Camera Viewport with Futuristic Face Oval */}
          <div className="relative w-64 h-80 sm:w-72 sm:h-96 mx-auto rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-700 flex items-center justify-center">
            {/* Live Video Feed or Animated Avatar fallback */}
            {useLiveCamera ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-teal-400 flex items-center justify-center">
                  <UserCheck className="w-12 h-12 text-teal-400 animate-pulse" />
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  Simulated Camera Sensor
                </span>
              </div>
            )}

            {/* Glowing Face Oval Scanner Overlay */}
            <div className="absolute inset-8 border-2 border-teal-400/80 rounded-[45%] pointer-events-none shadow-[0_0_20px_rgba(45,212,191,0.3)] animate-pulse" />

            {/* Scan Beam Effect */}
            <div
              className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-teal-400 to-transparent transition-all duration-300 pointer-events-none"
              style={{ top: `${scanProgress}%` }}
            />
          </div>

          {/* Dynamic Instructions */}
          <div className="space-y-1">
            <h3 className="text-base font-bold text-teal-300 animate-pulse">
              {scanProgress < 40 && 'Position your face inside the frame'}
              {scanProgress >= 40 && scanProgress < 80 && 'Look directly at camera & hold still'}
              {scanProgress >= 80 && 'Analyzing liveness & facial symmetry...'}
            </h3>
            <p className="text-xs text-slate-400">
              Demonstration progress: {scanProgress}%
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Verification Outcome Result */}
      {step === 'complete' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Demo Face Check Completed
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Simulated facial alignment test captured successfully.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-700 font-mono">Demonstration successful</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Identity Match:</span>
              <span className="font-semibold text-slate-700">Simulated (Demo Mode)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">University Verification:</span>
              <span className="font-bold text-teal-700">Approved by Registrar</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('digital-id')}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>View ZeroQ Digital Student ID</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRetry}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Demonstration</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

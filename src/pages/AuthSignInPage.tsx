import React, { useState } from 'react';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types';
import { requestSignInCode } from '../lib/auth.ts';

interface AuthSignInPageProps {
  onSignInSuccess: (profile: StudentProfile) => void;
  onNavigate: (route: string) => void;
}

export const AuthSignInPage: React.FC<AuthSignInPageProps> = ({
  onSignInSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState('student@example.ac.ke');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please provide a valid student or institutional email address.');
      return;
    }

    setLoading(true);
    try {
      await requestSignInCode(email.trim());
      setError('Check your email for the secure sign-in link.');
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold mx-auto shadow-xs">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to UniPath
        </h1>
        <p className="text-xs text-slate-500">
          Save your persistent career roadmaps, voluntary marks, and peer study requests.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@example.ac.ke"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Quick demo login available with default student email.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In / Open Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>New student? </span>
          <button
            onClick={() => onNavigate('/auth/sign-up')}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>You can explore all public career roadmaps without an account.</span>
      </div>
    </div>
  );
};

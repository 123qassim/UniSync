import React, { useState } from 'react';
import { Compass, Menu, X, User, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';
import { UniPathLogo } from './BrandLogos';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  currentUser: StudentProfile | null;
  onOpenApexAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  currentUser,
  onOpenApexAI,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore', route: '/explore' },
    { label: 'Careers', route: '/careers' },
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Compare', route: '/compare' },
    { label: 'BrainMate Peers', route: '/brainmate', badge: 'Peer Learning' },
    { label: 'ZeroQ Admissions', route: '/zeroq', badge: 'Onboarding' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand Zone */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
            >
              <UniPathLogo size={36} />
              <div className="leading-tight">
                <span className="text-lg font-black tracking-tight block text-slate-950">UniPath</span>
                <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wider">UniSync Ecosystem</span>
              </div>
            </button>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="text-xs text-slate-500 font-medium hidden md:inline">Academic Discovery & Career Guidance</span>
          </div>

          {/* Zone 2: 4-5 single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenApexAI}
              className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Open shared academic assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Apex AI
            </button>
            {currentUser ? (
              <button
                onClick={() => onNavigate('/profile')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                {currentUser.displayName || 'Profile'}
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/auth/sign-in')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenApexAI}
              className="p-1.5 text-indigo-600 bg-indigo-50 rounded-md"
              aria-label="Open AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={() => {
                  onNavigate('/profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 bg-slate-100 rounded-md flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Signed in as {currentUser.displayName}
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('/auth/sign-in');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-medium text-white bg-indigo-600 rounded-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

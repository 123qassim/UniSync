import React, { useState } from 'react';
import {
  QrCode,
  GraduationCap,
  ShoppingBag,
  Ticket,
  FileText,
  Camera,
  Shield,
  Layers,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  User,
  Store,
  Settings,
  RotateCcw
} from 'lucide-react';
import { ZeroQRole } from '../types/zeroq';

interface ZeroQNavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeRole: ZeroQRole;
  onSwitchRole: (role: ZeroQRole) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenApexAI: () => void;
  onResetDemoData: () => void;
}

export const ZeroQNavbar: React.FC<ZeroQNavbarProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  onSwitchRole,
  cartCount,
  onOpenCart,
  onOpenApexAI,
  onResetDemoData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const studentNavItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'placement', label: 'KUCCPS Results' },
    { id: 'university', label: 'University' },
    { id: 'application', label: 'Application' },
    { id: 'documents', label: 'Documents' },
    { id: 'face-check', label: 'Face Check' },
    { id: 'digital-id', label: 'My ZeroQ ID' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'vouchers', label: 'My Vouchers' },
  ];

  const roleLabels: Record<ZeroQRole, { label: string; icon: any }> = {
    student: { label: 'Student (Brian Otieno)', icon: User },
    admissions_officer: { label: 'Admissions Officer', icon: GraduationCap },
    university_admin: { label: 'University Admin', icon: Shield },
    merchant: { label: 'Campus Merchant', icon: Store },
    platform_admin: { label: 'Platform Admin', icon: Settings },
  };

  const CurrentRoleIcon = roleLabels[activeRole].icon;

  return (
    <nav className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
      {/* Top Demo Bar & Role Switcher */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-violet-600/30 text-violet-300 border border-violet-500/40 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            ZeroQ Prototype
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            From placement to campus life. One QR away.
          </span>
        </div>

        {/* Role Selector (Demo Feature) */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Switch user role to test student, admissions, merchant, or admin workflows"
            >
              <CurrentRoleIcon className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] font-semibold">{roleLabels[activeRole].label}</span>
              <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1 py-0.2 rounded uppercase font-mono">
                DEMO ROLE
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                  Select Demo Persona
                </div>
                {(Object.keys(roleLabels) as ZeroQRole[]).map((r) => {
                  const ItemIcon = roleLabels[r].icon;
                  const isSelected = activeRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        onSwitchRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-violet-600/30 text-violet-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ItemIcon className="w-3.5 h-3.5 text-teal-400" />
                        <span>{roleLabels[r].label}</span>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={onResetDemoData}
            className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1 hover:underline"
            title="Reset demo data back to pristine state"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab(activeRole === 'student' ? 'dashboard' : 'role-dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-violet-600 to-teal-400 flex items-center justify-center font-extrabold text-white shadow-md">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-xl font-extrabold tracking-tight text-white block">
                  Zero<span className="text-teal-400">Q</span>
                </span>
              </div>
            </button>
            <span className="text-slate-700 hidden md:inline">|</span>
            <span className="text-xs text-slate-400 font-medium hidden lg:inline">
              Your Future. Verified. Connected.
            </span>
          </div>

          {/* Student Tabs Navigation (when student role is active) */}
          {activeRole === 'student' && (
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto text-xs font-semibold">
              {studentNavItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Role specific quick label when non-student */}
          {activeRole !== 'student' && (
            <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-400">
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">
                Logged in as <strong className="text-white">{roleLabels[activeRole].label}</strong>
              </span>
            </div>
          )}

          {/* Right Actions: Apex AI & Cart */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenApexAI}
              className="px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/60 hover:bg-teal-900/60 border border-teal-500/30 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Apex AI</span>
            </button>

            {activeRole === 'student' && (
              <button
                onClick={onOpenCart}
                className="relative p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"
                title="View Campus Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2">
          {activeRole === 'student' ? (
            studentNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                  currentTab === item.id
                    ? 'bg-violet-600 text-white font-bold'
                    : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))
          ) : (
            <div className="p-3 text-xs text-slate-400">
              Active Dashboard: {roleLabels[activeRole].label}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

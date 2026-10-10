/**
 * UniPath Application Entry Point
 * UniSync Ecosystem: Academic Discovery, Career Pathways & Student Guidance
 */

import React, { useState, useEffect } from 'react';
import { EcosystemBar } from './components/EcosystemBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ApexAIChatModal } from './components/ApexAIChatModal';

import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { DashboardPage } from './pages/DashboardPage';
import { CareersPage } from './pages/CareersPage';
import { CareerDetailPage } from './pages/CareerDetailPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ComparePage } from './pages/ComparePage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AuthSignInPage } from './pages/AuthSignInPage';
import { AuthSignUpPage } from './pages/AuthSignUpPage';
import { ZeroQPortal } from './pages/zeroq/ZeroQPortal';
import { BrainMatePortal } from './pages/brainmate/BrainMatePortal';

import { DEMO_PROGRAMMES, CAREERS } from './data/mockData';
import {
  Programme,
  StudentUnitEntry,
  CareerRecommendation,
  StudentProfile,
  GradingScaleType,
} from './types';
import { calculateCareerRecommendations } from './services/recommendationEngine';

export default function App() {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [activeCareerSlug, setActiveCareerSlug] = useState<string>('software-engineer');
  const [activeModule, setActiveModule] = useState<'unipath' | 'brainmate' | 'zeroq'>('unipath');

  // Modal State
  const [isApexAIOpen, setIsApexAIOpen] = useState<boolean>(false);

  // Authenticated Student State (default: null for anonymous visitor, or can sign in)
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);

  // Exploration / Academic State (Session Persisted)
  const [activeProgramme, setActiveProgramme] = useState<Programme>(DEMO_PROGRAMMES[0]);
  const [selectedUnits, setSelectedUnits] = useState<StudentUnitEntry[]>([
    {
      unitId: 'cs-111',
      unitCode: 'CSC 111',
      unitTitle: 'Introduction to Programming in C',
      academicPeriod: 'Year 1, Sem 1',
      mark: 74,
      status: 'completed',
    },
    {
      unitId: 'cs-211',
      unitCode: 'CSC 211',
      unitTitle: 'Data Structures & Algorithms',
      academicPeriod: 'Year 2, Sem 1',
      mark: 72,
      status: 'completed',
    },
    {
      unitId: 'cs-212',
      unitCode: 'CSC 212',
      unitTitle: 'Database Systems & SQL Modeling',
      academicPeriod: 'Year 2, Sem 1',
      mark: 70,
      status: 'completed',
    },
  ]);
  const [declaredInterests, setDeclaredInterests] = useState<string[]>([
    'Software Engineering',
    'Cloud Computing',
    'Artificial Intelligence',
  ]);
  const [declaredSkillsToDev, setDeclaredSkillsToDev] = useState<string[]>([
    'TypeScript',
    'Docker',
    'Distributed Systems',
  ]);
  const [careerGoals, setCareerGoals] = useState<string>(
    'Aspiring Full-Stack Software Engineer building educational and fintech platforms.'
  );

  // Roadmap Progress Tracking (Step IDs completed)
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(['step-se-1']);

  // Computed Recommendations
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>(() => {
    return calculateCareerRecommendations({
      programme: DEMO_PROGRAMMES[0],
      selectedUnits: [
        { unitId: 'cs-111', unitCode: 'CSC 111', unitTitle: 'Introduction to Programming in C', academicPeriod: 'Year 1, Sem 1', mark: 74, status: 'completed' },
        { unitId: 'cs-211', unitCode: 'CSC 211', unitTitle: 'Data Structures & Algorithms', academicPeriod: 'Year 2, Sem 1', mark: 72, status: 'completed' },
      ],
      interests: ['Software Engineering', 'Cloud Computing'],
      skillsToDevelop: ['TypeScript', 'Docker'],
    });
  });

  // Check if session profile exists on mount
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          // Keep as available demo profile
          setCurrentUser(data);
          if (data.units && data.units.length > 0) {
            setSelectedUnits(data.units);
          }
          if (data.completedRoadmapSteps) {
            setCompletedStepIds(data.completedRoadmapSteps);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    if (route.startsWith('/zeroq')) {
      setActiveModule('zeroq');
    } else if (
      route.startsWith('/brainmate') ||
      route.startsWith('/app/brainmate') ||
      route === '/community'
    ) {
      setActiveModule('brainmate');
    } else {
      setActiveModule('unipath');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModuleSwitch = (module: 'unipath' | 'brainmate' | 'zeroq') => {
    setActiveModule(module);
    if (module === 'brainmate') {
      handleNavigate('/brainmate');
    } else if (module === 'unipath') {
      handleNavigate('/');
    } else if (module === 'zeroq') {
      handleNavigate('/zeroq');
    }
  };

  const handleOpenCareer = (slug: string) => {
    setActiveCareerSlug(slug);
    handleNavigate(`/careers/${slug}`);
  };

  const handleOpenRoadmap = (slug: string) => {
    setActiveCareerSlug(slug);
    handleNavigate(`/roadmap/${slug}`);
  };

  const handleToggleRoadmapStep = (stepId: string) => {
    setCompletedStepIds((prev) => {
      const updated = prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId];
      return updated;
    });
  };

  const handleCompleteExploration = (payload: {
    programme: Programme;
    selectedUnits: StudentUnitEntry[];
    interests: string[];
    skillsToDevelop: string[];
    careerGoals: string;
    gradingScale: GradingScaleType;
  }) => {
    setActiveProgramme(payload.programme);
    setSelectedUnits(payload.selectedUnits);
    setDeclaredInterests(payload.interests);
    setDeclaredSkillsToDev(payload.skillsToDevelop);
    setCareerGoals(payload.careerGoals);

    // Run recommendation engine
    const results = calculateCareerRecommendations({
      programme: payload.programme,
      selectedUnits: payload.selectedUnits,
      interests: payload.interests,
      skillsToDevelop: payload.skillsToDevelop,
      careerGoals: payload.careerGoals,
    });
    setRecommendations(results);

    handleNavigate('/dashboard');
  };

  const activeCareerObj =
    CAREERS.find((c) => c.slug === activeCareerSlug || c.id === activeCareerSlug) ||
    CAREERS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Ecosystem Top Strip */}
      <EcosystemBar
        activeModule={activeModule}
        onNavigateModule={handleModuleSwitch}
        onOpenApexAI={() => setIsApexAIOpen(true)}
      />

      {/* Main Responsive Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenApexAI={() => setIsApexAIOpen(true)}
      />

      {/* Main Viewport Routing */}
      <main className="flex-1">
        {currentRoute === '/' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenApexAI={() => setIsApexAIOpen(true)}
          />
        )}

        {currentRoute === '/explore' && (
          <ExplorePage
            onCompleteExploration={handleCompleteExploration}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === '/dashboard' && (
          <DashboardPage
            programme={activeProgramme}
            selectedUnits={selectedUnits}
            recommendations={recommendations}
            onNavigate={handleNavigate}
            onOpenCareer={handleOpenCareer}
            onOpenRoadmap={handleOpenRoadmap}
            onOpenApexAI={() => setIsApexAIOpen(true)}
          />
        )}

        {currentRoute === '/careers' && (
          <CareersPage
            onOpenCareer={handleOpenCareer}
            onOpenRoadmap={handleOpenRoadmap}
          />
        )}

        {currentRoute.startsWith('/careers/') && (
          <CareerDetailPage
            career={activeCareerObj}
            onBack={() => handleNavigate('/careers')}
            onOpenRoadmap={handleOpenRoadmap}
            onOpenApexAI={() => setIsApexAIOpen(true)}
          />
        )}

        {currentRoute.startsWith('/roadmap/') && (
          <RoadmapPage
            career={activeCareerObj}
            completedStepIds={completedStepIds}
            onToggleStep={handleToggleRoadmapStep}
            onBack={() => handleNavigate(`/careers/${activeCareerSlug}`)}
            onOpenApexAI={() => setIsApexAIOpen(true)}
          />
        )}

        {currentRoute === '/compare' && (
          <ComparePage
            initialUnits={selectedUnits}
            onNavigate={handleNavigate}
            onOpenApexAI={() => setIsApexAIOpen(true)}
          />
        )}

        {(currentRoute === '/community' ||
          currentRoute === '/brainmate' ||
          currentRoute.startsWith('/brainmate/') ||
          currentRoute.startsWith('/app/brainmate')) && (
          <BrainMatePortal
            initialTab={
              currentRoute.includes('profile')
                ? 'profile'
                : currentRoute.includes('discover')
                ? 'discover'
                : currentRoute.includes('skill-swap')
                ? 'skill-swap'
                : currentRoute.includes('focus-pod') || currentRoute.includes('focus')
                ? 'focus-pod'
                : currentRoute.includes('overlap')
                ? 'overlap'
                : currentRoute.includes('readiness') || currentRoute.includes('syllabus')
                ? 'readiness'
                : currentRoute.includes('karma')
                ? 'karma'
                : currentRoute.includes('connections')
                ? 'connections'
                : currentRoute.includes('groups')
                ? 'groups'
                : currentRoute.includes('sessions')
                ? 'sessions'
                : 'overview'
            }
            onOpenApexAI={(prompt) => {
              setIsApexAIOpen(true);
            }}
            onNavigateHome={() => handleNavigate('/')}
          />
        )}

        {currentRoute === '/profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            onUpdateProfile={(updated) => {
              setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
            }}
            onSignOut={() => {
              setCurrentUser(null);
              handleNavigate('/');
            }}
            onNavigate={handleNavigate}
            onOpenApexAI={() => setIsApexAIOpen(true)}
          />
        )}

        {currentRoute === '/about' && <AboutPage />}
        {currentRoute === '/privacy' && <PrivacyPage />}
        {currentRoute === '/terms' && <TermsPage />}

        {currentRoute === '/auth/sign-in' && (
          <AuthSignInPage
            onSignInSuccess={(profile) => {
              setCurrentUser(profile);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === '/auth/sign-up' && (
          <AuthSignUpPage
            onSignUpSuccess={(profile) => {
              setCurrentUser(profile);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {(currentRoute === '/zeroq' || currentRoute.startsWith('/zeroq/')) && (
          <ZeroQPortal
            onOpenApexAI={() => setIsApexAIOpen(true)}
            onNavigateHome={() => handleNavigate('/')}
          />
        )}
      </main>

      {/* Shared Apex AI Assistant Modal */}
      <ApexAIChatModal
        isOpen={isApexAIOpen}
        onClose={() => setIsApexAIOpen(false)}
        context={{
          programmeName: activeProgramme.name,
          currentYear: 2,
          completedUnits: selectedUnits.map((u) => u.unitCode),
          careerInterests: declaredInterests,
          targetCareer: activeCareerObj.title,
        }}
      />

      {/* Shared Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

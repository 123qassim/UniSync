import React, { useState } from 'react';
import { Search, Compass, ArrowRight, Filter, BookOpen } from 'lucide-react';
import { CAREERS } from '../data/mockData';
import { DemoDataBadge } from '../components/DemoDataBadge';

interface CareersPageProps {
  onOpenCareer: (slug: string) => void;
  onOpenRoadmap: (slug: string) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({
  onOpenCareer,
  onOpenRoadmap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology & Computing', 'Business & Finance', 'Healthcare & Clinical Sciences', 'Engineering & Physical Sciences', 'Education & Learning Design'];

  const filteredCareers = CAREERS.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.technicalSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Professional Directory
          </span>
          <DemoDataBadge label="Curated Frameworks" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Degree-Aligned Careers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Comprehensive, non-judgmental career profiles mapped directly to university syllabus units, required technical skills, and practical portfolio milestones.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by career title, skill (e.g. TypeScript, SQL, React), or responsibilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600">
                  {c.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {c.portfolioProjects.length} Projects
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {c.summary}
                </p>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Top Skills
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.technicalSkills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onOpenCareer(c.slug)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Profile Details
              </button>
              <button
                onClick={() => onOpenRoadmap(c.slug)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
              >
                <span>Roadmap</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { SourceTag } from '../components/common/SourceTag';
import { EmptyState } from '../components/common/EmptyState';
import { formatIndianCurrency } from '../components/common/StatCard';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, Filter, MapPin, IndianRupee, ArrowRight, Eye, Calendar, 
  RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, Smartphone, 
  MessageSquareQuote, Droplet, GraduationCap, Stethoscope, Construction,
  Landmark, Sun, Waves, Trash2, Layers
} from 'lucide-react';

interface PublicExplorerProps {
  onOpenProject: (projectId: string) => void;
  onViewMap: (projectId: string) => void;
  onInspect?: (projectId: string) => void;
  onComplaint?: (projectId: string) => void;
  initialSearch?: string;
  initialCategory?: string;
}

const DEPT_PILLS = [
  { id: '', labelKey: 'all_categories', defaultLabel: 'All Departments', icon: Layers },
  { id: 'Drinking Water', labelKey: 'mission_water', defaultLabel: 'Drinking Water', icon: Droplet },
  { id: 'Education', labelKey: 'mission_edu', defaultLabel: 'Education', icon: GraduationCap },
  { id: 'Healthcare', labelKey: 'mission_health', defaultLabel: 'Healthcare', icon: Stethoscope },
  { id: 'Roads & Bridges', labelKey: 'mission_roads', defaultLabel: 'Roads & PWD', icon: Construction },
  { id: 'Community Infrastructure', labelKey: 'mission_community', defaultLabel: 'Community', icon: Landmark },
  { id: 'Solar Energy', labelKey: 'mission_solar', defaultLabel: 'Solar Energy', icon: Sun },
  { id: 'Irrigation', labelKey: 'mission_irrigation', defaultLabel: 'Irrigation', icon: Waves },
  { id: 'Sanitation', labelKey: 'mission_sanitation', defaultLabel: 'Sanitation', icon: Trash2 },
];

export const PublicExplorer: React.FC<PublicExplorerProps> = ({
  onOpenProject,
  onViewMap,
  onInspect,
  onComplaint,
  initialSearch = '',
  initialCategory = '',
}) => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(initialSearch || '');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');

  // Load all projects on mount to maintain stable filters
  useEffect(() => {
    loadAllProjects();
  }, []);

  const loadAllProjects = async () => {
    try {
      const data = await api.getProjects();
      setAllProjects(data);
    } catch {
      // fallback handled
    }
  };

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearch(initialSearch);
      fetchProjects(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    fetchProjects();
  }, [selectedState, selectedDistrict, selectedCategory, selectedStatus, selectedRisk]);

  const fetchProjects = async (searchOverride?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      const activeSearch = searchOverride !== undefined ? searchOverride : search;
      if (activeSearch) params.search = activeSearch;
      if (selectedState) params.state = selectedState;
      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedRisk) params.risk_level = selectedRisk;

      const data = await api.getProjects(params);
      setProjects(data);
    } catch {
      // fallback handled in api
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
    showToast(`Searching for "${search || 'all works'}"...`, 'info');
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedRisk('');
    showToast('Filters reset to default nationwide view', 'info');
  };

  // Derive stable filter options from allProjects
  const uniqueStates = Array.from(new Set(allProjects.map(p => p.state).filter(Boolean))).sort();
  const uniqueDistricts = Array.from(new Set(
    allProjects
      .filter(p => !selectedState || p.state === selectedState)
      .map(p => p.district)
      .filter(Boolean)
  )).sort();

  return (
    <div className="space-y-6 pb-20">
      {/* Light & Prestigious Explorer Filter & Query Console */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Animated Tricolor Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 animate-tiranga-shimmer opacity-95"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300 font-mono">
                {t('satyameva_jayate')} • {t('govt_of_india')}
              </span>
              <span className="text-xs font-mono font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                {projects.length} {t('works_mapped')}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {t('nav_projects')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Search and filter across India's MPLADS sanctions, physical milestones, fund flows, and early warning risk tags.
            </p>
          </div>

          <button
            onClick={resetFilters}
            className="text-xs font-bold text-slate-700 hover:text-amber-950 flex items-center gap-2 self-start md:self-auto px-4 py-2.5 rounded-xl border border-amber-200 bg-[#FCFAF7] hover:bg-amber-50 transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
            <span>{t('reset_filters')}</span>
          </button>
        </div>

        {/* 8 Department Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3.5 no-scrollbar border-b border-amber-100">
          <span className="text-xs font-mono font-bold text-amber-950 uppercase tracking-widest text-[10px] shrink-0 pr-1">
            Department:
          </span>
          {DEPT_PILLS.map(dept => {
            const Icon = dept.icon;
            const isSelected = selectedCategory === dept.id;
            const label = dept.labelKey ? t(dept.labelKey, dept.defaultLabel) : dept.defaultLabel;
            return (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedCategory(dept.id);
                  showToast(dept.id ? `Filtered by ${label}` : 'Showing all departments', 'info');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs ring-2 ring-orange-400 font-bold'
                    : 'bg-[#FCFAF7] text-slate-700 hover:bg-amber-50 hover:text-amber-950 border border-amber-200/80 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Multi-facet Filter Grid */}
        <form onSubmit={handleSearchSubmit} className="mt-5 space-y-3">
          <div className="relative">
            <button
              type="submit"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-orange-600 transition-colors focus:outline-none"
              title="Click Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-amber-200/90 focus:border-amber-500 rounded-2xl pl-11 pr-32 py-3 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchProjects('');
                  showToast('Search query cleared', 'info');
                }}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 transition-colors"
                title="Clear Search"
              >
                ✕ {t('clear_button')}
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t('search_button')}</span>
            </button>
          </div>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          <select
            value={selectedState}
            onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            <option value="">All States ({uniqueStates.length || 10})</option>
            {uniqueStates.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none disabled:opacity-50"
          >
            <option value="">{selectedState ? `All Districts in ${selectedState}` : 'Select State First'}</option>
            {uniqueDistricts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            <option value="">All Execution Statuses</option>
            <option value="UNDER PROGRESS">Under Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="STALLED">Stalled Work</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none"
          >
            <option value="">All AI Risk Levels</option>
            <option value="NORMAL">Normal (&lt;30)</option>
            <option value="WATCH">Watch (30-49)</option>
            <option value="HIGH RISK">High Risk (50-74)</option>
            <option value="CRITICAL">Critical (75-100)</option>
          </select>

          <div className="flex items-center text-[11px] text-slate-500 font-semibold px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 justify-between">
            <span>Matching Works:</span>
            <strong className="text-gov-navy text-xs">{projects.length}</strong>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-16 bg-slate-100 rounded"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Matching Public Works Found"
          description="We could not find any project matching your specific query or filter combination. Try clearing filters to view all monitored infrastructure."
          actionText="Reset All Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const delayDays = proj.delay_days || 0;
            return (
              <div
                key={proj.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group bg-white/90"
              >
                <div>
                  {/* Top ID & Risk Badge */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 text-xs">
                    <span className="font-mono font-bold text-slate-400 uppercase text-[11px] tracking-wide">
                      {proj.id}
                    </span>
                    <RiskBadge level={proj.risk_level} size="sm" />
                  </div>

                  {/* Project Title */}
                  <h3 
                    onClick={() => onOpenProject(proj.id)}
                    className="font-bold text-slate-900 text-sm hover:text-orange-600 cursor-pointer transition-colors line-clamp-2 leading-snug"
                  >
                    {proj.title}
                  </h3>

                  {/* Location & Category */}
                  <div className="text-xs text-slate-500 mt-2.5 space-y-1">
                    <p className="flex items-center gap-1.5 truncate" title={`${proj.village || 'Village'}, ${proj.district}, ${proj.state}`}>
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate font-medium">{proj.village ? `${proj.village}, ` : ''}{proj.district}, {proj.state}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 pl-5">
                      Sector: <span className="font-medium text-slate-700">{proj.category}</span>
                    </p>
                  </div>

                  {/* Financial & Physical Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-3.5 bg-slate-50/90 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] font-mono uppercase font-bold block">Sanctioned</span>
                      <span className="font-black text-slate-900 text-sm mt-0.5 block">
                        {formatIndianCurrency(proj.sanctioned_amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] font-mono uppercase font-bold block">Status</span>
                      <span className={`font-bold text-xs mt-0.5 block ${
                        proj.status === 'COMPLETED' ? 'text-emerald-700' : proj.status === 'STALLED' ? 'text-rose-600' : 'text-blue-600'
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] font-mono uppercase font-bold block">Physical</span>
                      <span className="font-black text-emerald-600 text-xs mt-0.5 block">
                        {proj.physical_progress}%
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] font-mono uppercase font-bold block">Disbursed</span>
                      <span className="font-black text-slate-900 text-xs mt-0.5 block">
                        {proj.financial_progress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar comparison */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Physical ({proj.physical_progress}%)</span>
                      <span>Disbursed ({proj.financial_progress}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" 
                        style={{ width: `${Math.min(100, proj.physical_progress)}%` }}
                        title={`Physical Progress: ${proj.physical_progress}%`}
                      ></div>
                    </div>
                    {delayDays > 0 && (
                      <span className="text-[10px] text-rose-600 font-bold block">
                        ⚠ {delayDays} days delayed beyond scheduled milestone
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onOpenProject(proj.id)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    title="Trace 360 Degree Work Record"
                  >
                    <span>{t('trace_work')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>

                  {onInspect && (
                    <button
                      onClick={() => onInspect(proj.id)}
                      className="py-2 px-2.5 bg-[#FCFAF7] hover:bg-amber-100/70 text-slate-700 font-semibold rounded-xl border border-amber-200/80 transition-colors flex items-center gap-1"
                      title="Conduct Geotagged Field Inspection"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                      <span>Inspect</span>
                    </button>
                  )}

                  {onComplaint && (
                    <button
                      onClick={() => onComplaint(proj.id)}
                      className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold rounded-xl transition-colors flex items-center gap-1"
                      title="Report Citizen Grievance"
                    >
                      <MessageSquareQuote className="w-3.5 h-3.5 text-orange-600" />
                      <span>Grievance</span>
                    </button>
                  )}

                  <button
                    onClick={() => onViewMap(proj.id)}
                    className="p-2 bg-[#FCFAF7] text-slate-700 hover:bg-amber-100/70 font-semibold rounded-xl border border-amber-200/80 transition-colors flex items-center justify-center"
                    title="View Location on Interactive India Map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

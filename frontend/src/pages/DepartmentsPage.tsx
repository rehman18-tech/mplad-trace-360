import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { formatIndianCurrency } from '../components/common/StatCard';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Droplet, GraduationCap, Stethoscope, Construction, Landmark, 
  Sun, Waves, Trash2, ArrowRight, MapPin, Eye, Search, 
  CheckCircle2, Clock, AlertTriangle, Filter, Sparkles, Smartphone,
  MessageSquareQuote, RefreshCw, Layers
} from 'lucide-react';

interface DepartmentsPageProps {
  onOpenProject: (projectId: string) => void;
  onViewMap: (projectId: string) => void;
  onInspect?: (projectId: string) => void;
  onComplaint?: (projectId: string) => void;
}

interface DepartmentMeta {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  bgLight: string;
  borderLight: string;
  ministry: string;
  nodalAgency: string;
  benchmark: string;
  description: string;
}

const DEPARTMENTS: DepartmentMeta[] = [
  {
    id: 'drinking-water',
    name: 'Drinking Water & Jal Jeevan',
    category: 'Drinking Water',
    icon: Droplet,
    color: 'text-cyan-600',
    bgLight: 'bg-cyan-50/80',
    borderLight: 'border-cyan-200',
    ministry: 'Ministry of Jal Shakti',
    nodalAgency: 'Rural Water Supply & Sanitation (RWSS)',
    benchmark: 'ISO 10500 Potable Water Quality Standards',
    description: 'Overhead service reservoirs, piped drinking water tap networks, solar dual-pump borewells and RO purification plants.'
  },
  {
    id: 'education',
    name: 'School Education & Literacy',
    category: 'Education',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bgLight: 'bg-indigo-50/80',
    borderLight: 'border-indigo-200',
    ministry: 'Ministry of Education',
    nodalAgency: 'Samagra Shiksha / State School Education Dept',
    benchmark: 'NEP 2020 Standard Infrastructure Guidelines',
    description: 'Smart classrooms, science and robotic labs, digital libraries, and girls sanitary block constructions.'
  },
  {
    id: 'healthcare',
    name: 'Public Health & Family Welfare',
    category: 'Healthcare',
    icon: Stethoscope,
    color: 'text-rose-600',
    bgLight: 'bg-rose-50/80',
    borderLight: 'border-rose-200',
    ministry: 'Ministry of Health & Family Welfare',
    nodalAgency: 'National Health Mission (NHM) / CMO Directorate',
    benchmark: 'IPHS 2022 Primary Health Centre Norms',
    description: 'Sub-centre upgrades, maternity wings, cold-chain immunization rooms, and oxygen generation plant infrastructure.'
  },
  {
    id: 'roads-bridges',
    name: 'Public Works & Rural Roads',
    category: 'Roads & Bridges',
    icon: Construction,
    color: 'text-amber-600',
    bgLight: 'bg-amber-50/80',
    borderLight: 'border-amber-200',
    ministry: 'Ministry of Rural Development / MoRTH',
    nodalAgency: 'State Public Works Department (PWD / PR Engg)',
    benchmark: 'IRC:SP:20 Rural Road Specifications',
    description: 'Bituminous all-weather roads, CC village streets, box culverts, and high-level causeway bridges.'
  },
  {
    id: 'community',
    name: 'Community & Social Welfare',
    category: 'Community Infrastructure',
    icon: Landmark,
    color: 'text-purple-600',
    bgLight: 'bg-purple-50/80',
    borderLight: 'border-purple-200',
    ministry: 'Ministry of Social Justice & Empowerment',
    nodalAgency: 'Zilla Parishad / Municipal Administration',
    benchmark: 'Accessible India Campaign / Universal Design Norms',
    description: 'Multipurpose community centres, Anganwadi buildings, crematorium sheds, and rural weekly haat platforms.'
  },
  {
    id: 'solar',
    name: 'Renewable Energy & Power',
    category: 'Solar Energy',
    icon: Sun,
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50/80',
    borderLight: 'border-emerald-200',
    ministry: 'Ministry of New and Renewable Energy',
    nodalAgency: 'State Renewable Energy Development Agency',
    benchmark: 'MNRE Technical Specifications (5-Yr Comprehensive AMC)',
    description: 'High-mast LED solar street lamps, off-grid rooftop solar packs for rural health centres, and solar water heaters.'
  },
  {
    id: 'irrigation',
    name: 'Irrigation & Water Bodies',
    category: 'Irrigation',
    icon: Waves,
    color: 'text-blue-600',
    bgLight: 'bg-blue-50/80',
    borderLight: 'border-blue-200',
    ministry: 'Ministry of Jal Shakti',
    nodalAgency: 'Minor Irrigation Department / Command Area Authority',
    benchmark: 'CWC Minor Irrigation Manual Norms',
    description: 'Check dams, community desiltation, lift irrigation pump houses, and village pond rejuvenation works.'
  },
  {
    id: 'sanitation',
    name: 'Sanitation & Solid Waste',
    category: 'Sanitation',
    icon: Trash2,
    color: 'text-teal-600',
    bgLight: 'bg-teal-50/80',
    borderLight: 'border-teal-200',
    ministry: 'Ministry of Housing & Urban Affairs',
    nodalAgency: 'Swachh Bharat Mission (Grameen / Urban)',
    benchmark: 'SBM ODF-Plus Community Asset Protocol',
    description: 'Community sanitary complexes (CSC), faecal sludge treatment units, and segregated wet/dry waste segregation sheds.'
  }
];

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  onOpenProject,
  onViewMap,
  onInspect,
  onComplaint
}) => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('drinking-water');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch {
      showToast('Loading offline mock portfolio records', 'info');
    } finally {
      setLoading(false);
    }
  };

  const activeDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];

  const allDeptProjects = projects.filter(p => 
    p.category.toLowerCase().includes(activeDept.category.toLowerCase()) ||
    activeDept.category.toLowerCase().includes(p.category.toLowerCase())
  );

  const filteredProjects = allDeptProjects.filter(p => {
    const matchesSearch = !searchFilter || 
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.district.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.contractor_name && p.contractor_name.toLowerCase().includes(searchFilter.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || p.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSanctioned = allDeptProjects.reduce((acc, p) => acc + (p.sanctioned_amount || 0), 0);
  const totalSpent = allDeptProjects.reduce((acc, p) => acc + (p.actual_expenditure || 0), 0);
  const completedCount = allDeptProjects.filter(p => p.status === 'COMPLETED').length;
  const inProgressCount = allDeptProjects.filter(p => p.status === 'UNDER PROGRESS').length;
  const stalledCount = allDeptProjects.filter(p => p.status === 'STALLED').length;
  const highRiskCount = allDeptProjects.filter(p => p.risk_level === 'HIGH RISK' || p.risk_level === 'CRITICAL').length;
  const avgPhysical = allDeptProjects.length > 0 
    ? Math.round(allDeptProjects.reduce((acc, p) => acc + (p.physical_progress || 0), 0) / allDeptProjects.length)
    : 0;

  const handleSelectDept = (id: string, name: string) => {
    setSelectedDeptId(id);
    showToast(`Switched view to: ${name}`, 'info');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Department Portal Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle Tricolor Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-[3px] tiranga-top-bar"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-100/80 text-amber-950 border border-amber-300">
                {t('Department Intelligence Hub', 'Department Intelligence Hub')}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                {t('8 Portfolios Mapped', '8 Portfolios Mapped')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('Departmental Monitoring Portals', 'Departmental Monitoring Portals')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {t('Sector-specific intelligence dashboards configured with Indian administrative benchmarks, nodal executing agencies, and automated project milestone tracking.', 'Sector-specific intelligence dashboards configured with Indian administrative benchmarks, nodal executing agencies, and automated project milestone tracking.')}
            </p>
          </div>

          <button
            onClick={loadProjects}
            className="self-start lg:self-auto px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span>{t('Sync All Records', 'Sync All Records')}</span>
          </button>
        </div>

        {/* 8 Department Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            const isSelected = dept.id === selectedDeptId;
            const count = projects.filter(p => 
              p.category.toLowerCase().includes(dept.category.toLowerCase()) ||
              dept.category.toLowerCase().includes(p.category.toLowerCase())
            ).length;

            return (
              <button
                key={dept.id}
                onClick={() => handleSelectDept(dept.id, dept.name)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between group transform hover:-translate-y-0.5 ${
                  isSelected
                    ? `bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/60 border-amber-400 ring-2 ring-orange-400 text-amber-950 font-bold shadow-sm`
                    : `bg-[#FCFAF7] hover:bg-amber-50/60 border-amber-200/80 text-slate-700 hover:border-amber-300 hover:shadow-xs`
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`p-2 rounded-xl transition-transform group-hover:scale-105 ${isSelected ? 'bg-amber-200 text-amber-950 border border-amber-300' : `${dept.bgLight} ${dept.color}`}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-amber-200 text-amber-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-amber-950 font-extrabold' : 'text-slate-900 group-hover:text-amber-950'}`}>
                    {t(dept.category, dept.category)}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Department Overview Ribbon */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${activeDept.bgLight} ${activeDept.color} shadow-inner`}>
              <activeDept.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{activeDept.ministry}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">{activeDept.nodalAgency}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {t(activeDept.name, activeDept.name)} {t('Portfolio', 'Portfolio')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-slate-600">{t('Standard:', 'Standard:')} <strong>{activeDept.benchmark}</strong></span>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 text-xs">
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <span className="text-slate-500 text-[10px] font-mono font-bold uppercase block">{t('stat_sanctioned_funds', 'Total Sanctioned')}</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">
              {formatIndianCurrency(totalSanctioned)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{allDeptProjects.length} {t('schemes tracked', 'schemes tracked')}</span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <span className="text-slate-500 text-[10px] font-mono font-bold uppercase block">{t('stat_disbursed_funds', 'Disbursed Outlay')}</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">
              {formatIndianCurrency(totalSpent)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">
              {totalSanctioned > 0 ? Math.round((totalSpent / totalSanctioned) * 100) : 0}% {t('fund utilization', 'fund utilization')}
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <span className="text-slate-500 text-[10px] font-mono font-bold uppercase block">{t('col_progress', 'Avg Physical Velocity')}</span>
            <span className="text-lg font-black text-emerald-600 mt-1 block">
              {avgPhysical}%
            </span>
            <span className="text-[10px] text-slate-400">{t('MB Record verified', 'MB Record verified')}</span>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
            <span className="text-emerald-800 text-[10px] font-mono font-bold uppercase block">{t('status_completed', 'Completed & Handover')}</span>
            <span className="text-lg font-black text-emerald-900 mt-1 block">
              {completedCount} {t('Works', 'Works')}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">{t('100% UC generated', '100% UC generated')}</span>
          </div>

          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/80">
            <span className="text-indigo-800 text-[10px] font-mono font-bold uppercase block">{t('status_in_progress', 'Under Execution')}</span>
            <span className="text-lg font-black text-indigo-900 mt-1 block">
              {inProgressCount} {t('Works', 'Works')}
            </span>
            <span className="text-[10px] text-indigo-700 font-semibold">{t('Under surveillance', 'Under surveillance')}</span>
          </div>

          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200/80">
            <span className="text-rose-800 text-[10px] font-mono font-bold uppercase block">{t('WATCHLIST WARNINGS', 'Watchlist Warnings')}</span>
            <span className="text-lg font-black text-rose-900 mt-1 block">
              {highRiskCount + stalledCount} {t('Works', 'Works')}
            </span>
            <span className="text-[10px] text-rose-700 font-bold">{t('Needs verification audit', 'Needs verification audit')}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Department Works */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-4 shadow-gov flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={`${t('Search', 'Search')} ${t(activeDept.category, activeDept.category)} ${t('works by Title, ID, District, or Contractor...', 'works by Title, ID, District, or Contractor...')}`}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-500 shrink-0">{t('Execution Status:', 'Execution Status:')}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">{t('All Execution States', 'All Execution States')}</option>
            <option value="UNDER PROGRESS">{t('Under Progress', 'Under Progress')}</option>
            <option value="COMPLETED">{t('Completed', 'Completed')}</option>
            <option value="STALLED">{t('Stalled / Stagnated', 'Stalled / Stagnated')}</option>
          </select>
        </div>
      </div>

      {/* Department Projects Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-gov-navy border-t-gov-saffron rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-gov-navy">{t('Retrieving', 'Retrieving')} {t(activeDept.category, activeDept.category)} {t('project ledgers...', 'project ledgers...')}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <activeDept.icon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">{t('No projects found matching the selected filter criteria.', 'No works matched current search criteria')}</h3>
          <p className="text-xs text-slate-400 mt-1">{t('Try clearing the search query or changing the execution status filter.', 'Try clearing the search query or changing the execution status filter.')}</p>
          <button
            onClick={() => { setSearchFilter(''); setStatusFilter('ALL'); }}
            className="mt-3 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded-lg"
          >
            {t('reset_filters', 'Reset Filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => {
            const delayDays = proj.delay_days || 0;
            return (
              <div
                key={proj.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group bg-white/90"
              >
                <div>
                  {/* Card Header: Project ID & Risk */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 text-xs">
                    <span className="font-mono font-bold text-slate-400 uppercase text-[11px] tracking-wide">
                      {proj.id}
                    </span>
                    <RiskBadge level={proj.risk_level} size="sm" />
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenProject(proj.id)}
                    className="font-bold text-slate-900 text-sm hover:text-orange-600 cursor-pointer transition-colors line-clamp-2 leading-snug"
                  >
                    {proj.title}
                  </h3>

                  {/* Location & MP */}
                  <div className="text-xs text-slate-500 mt-2.5 space-y-1">
                    <p className="flex items-center gap-1.5 truncate" title={`${proj.village || 'Village'}, ${proj.district}, ${proj.state}`}>
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate font-medium">{proj.village ? `${proj.village}, ` : ''}{proj.district}, {proj.state}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 pl-5">
                      {t('Executing Agency:', 'Executing Agency:')} <span className="font-medium text-slate-700">{proj.contractor_name || t('Designated Nodal Agency', 'Designated Nodal Agency')}</span>
                    </p>
                  </div>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-3.5 bg-slate-50/90 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono font-bold block">{t('Sanctioned', 'Sanctioned')}</span>
                      <span className="font-black text-slate-900 text-sm mt-0.5 block">
                        {formatIndianCurrency(proj.sanctioned_amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono font-bold block">{t('Status', 'Status')}</span>
                      <span className={`font-bold text-xs mt-0.5 block ${
                        proj.status === 'COMPLETED' ? 'text-emerald-700' : proj.status === 'STALLED' ? 'text-rose-600' : 'text-blue-600'
                      }`}>
                        {t(proj.status, proj.status)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono font-bold block">{t('Physical', 'Physical')}</span>
                      <span className="font-black text-emerald-600 text-xs mt-0.5 block">
                        {proj.physical_progress}%
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono font-bold block">{t('Disbursed', 'Disbursed')}</span>
                      <span className="font-black text-slate-900 text-xs mt-0.5 block">
                        {proj.financial_progress}%
                      </span>
                    </div>
                  </div>

                  {/* Dual Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, proj.physical_progress)}%` }}
                        title={`Physical Progress: ${proj.physical_progress}%`}
                      ></div>
                    </div>
                    {delayDays > 0 && (
                      <span className="text-[10px] text-rose-600 font-bold block">
                        ⚠ {delayDays} {t('days schedule slippage', 'days schedule slippage')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Interactive Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onOpenProject(proj.id)}
                    className="flex-1 py-2 px-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
                    title="Open Complete 360 Degree Work Dossier"
                  >
                    <span>{t('Trace 360°', 'Trace 360°')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                  </button>

                  {onInspect && (
                    <button
                      onClick={() => onInspect(proj.id)}
                      className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center gap-1"
                      title="Conduct Geotagged Field Inspection"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t('Inspect', 'Inspect')}</span>
                    </button>
                  )}

                  {onComplaint && (
                    <button
                      onClick={() => onComplaint(proj.id)}
                      className="py-2 px-2.5 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200/80 font-semibold rounded-xl transition-colors flex items-center gap-1"
                      title="Lodge Citizen Grievance for this work"
                    >
                      <MessageSquareQuote className="w-3.5 h-3.5 text-orange-600" />
                      <span>{t('Grievance', 'Grievance')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onViewMap(proj.id)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center"
                    title="View on Map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
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

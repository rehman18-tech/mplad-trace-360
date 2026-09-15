import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project, OverviewAnalytics } from '../types';
import { StatCard, formatIndianCurrency } from '../components/common/StatCard';
import { 
  IndianRupee, TrendingUp, ShieldCheck, CheckCircle2, AlertTriangle, 
  Eye, Landmark, Building, Wallet, Search, Users, Award, 
  PlusCircle, Sparkles, Sliders, Check, FileCheck, Layers
} from 'lucide-react';

interface FundFlowPageProps {
  onOpenProject: (projectId: string) => void;
}

interface MPConstituencyData {
  id: string;
  name: string;
  mp_name: string;
  house: 'LOK_SABHA' | 'RAJYA_SABHA';
  party: string;
  state: string;
  annual_entitlement: number; // ₹5.00 Crore
  total_recommended: number;
  total_sanctioned: number;
  total_disbursed: number;
  sc_allocation: number; // Statutory min 15%
  st_allocation: number; // Statutory min 7.5%
  recommended_works: {
    id: string;
    title: string;
    sector: string;
    estimated_cost: number;
    beneficiary_type: 'SC_HABITATION' | 'ST_HABITATION' | 'GENERAL_PUBLIC';
    dm_status: 'SANCTIONED' | 'UNDER_APPRAISAL' | 'COMPLETED';
    recommended_date: string;
  }[];
}

const INITIAL_CONSTITUENCIES: MPConstituencyData[] = [
  {
    id: 'PC-AP-04',
    name: 'Visakhapatnam (Lok Sabha)',
    mp_name: 'Shri M. Sribharat',
    house: 'LOK_SABHA',
    party: 'TDP / NDA',
    state: 'Andhra Pradesh',
    annual_entitlement: 50000000, // ₹5.00 Crore
    total_recommended: 54000000,
    total_sanctioned: 48500000,
    total_disbursed: 41200000,
    sc_allocation: 8250000, // 17.0% (Compliant with >= 15%)
    st_allocation: 4100000, // 8.5% (Compliant with >= 7.5%)
    recommended_works: [
      {
        id: 'REC-AP-01',
        title: 'Modern Science & Digital Laboratory at ZP High School, Bheemunipatnam',
        sector: 'Education',
        estimated_cost: 2950000,
        beneficiary_type: 'GENERAL_PUBLIC',
        dm_status: 'SANCTIONED',
        recommended_date: '2025-06-12'
      },
      {
        id: 'REC-AP-02',
        title: 'Concrete Road & Drainage Network in Dr. B.R. Ambedkar SC Colony, Gajuwaka',
        sector: 'Roads & Drainage',
        estimated_cost: 4800000,
        beneficiary_type: 'SC_HABITATION',
        dm_status: 'SANCTIONED',
        recommended_date: '2025-07-04'
      },
      {
        id: 'REC-AP-03',
        title: 'Solar High-Mast Lighting & Community Water Kiosk in Tribal Hamlet, Anandapuram',
        sector: 'Drinking Water & Energy',
        estimated_cost: 4100000,
        beneficiary_type: 'ST_HABITATION',
        dm_status: 'SANCTIONED',
        recommended_date: '2025-08-19'
      },
      {
        id: 'REC-AP-04',
        title: 'Pedestrian Overbridge & Stormwater Channel at Pendurthi Junction',
        sector: 'Civic Amenities',
        estimated_cost: 7200000,
        beneficiary_type: 'GENERAL_PUBLIC',
        dm_status: 'UNDER_APPRAISAL',
        recommended_date: '2026-01-15'
      }
    ]
  },
  {
    id: 'PC-UP-77',
    name: 'Varanasi (Lok Sabha)',
    mp_name: 'Shri Narendra Modi',
    house: 'LOK_SABHA',
    party: 'BJP / NDA',
    state: 'Uttar Pradesh',
    annual_entitlement: 50000000,
    total_recommended: 56000000,
    total_sanctioned: 50000000,
    total_disbursed: 47500000,
    sc_allocation: 9000000, // 18.0% (Compliant)
    st_allocation: 3800000, // 7.6% (Compliant)
    recommended_works: [
      {
        id: 'REC-UP-01',
        title: 'Smart Health Sub-Center & Diagnostic Unit, Kashi Vidyapeeth',
        sector: 'Healthcare',
        estimated_cost: 4500000,
        beneficiary_type: 'GENERAL_PUBLIC',
        dm_status: 'COMPLETED',
        recommended_date: '2025-05-10'
      },
      {
        id: 'REC-UP-02',
        title: 'Piped Drinking Water Over-Head Tank in Ravidas SC Basti, Rohania',
        sector: 'Drinking Water',
        estimated_cost: 5200000,
        beneficiary_type: 'SC_HABITATION',
        dm_status: 'SANCTIONED',
        recommended_date: '2025-06-22'
      },
      {
        id: 'REC-UP-03',
        title: 'Tribal Artisans Skill Development Center, Sewapuri Tribal Pocket',
        sector: 'Skill Development',
        estimated_cost: 3800000,
        beneficiary_type: 'ST_HABITATION',
        dm_status: 'SANCTIONED',
        recommended_date: '2025-09-05'
      }
    ]
  },
  {
    id: 'PC-BR-30',
    name: 'Patna Sahib (Lok Sabha)',
    mp_name: 'Shri Ravi Shankar Prasad',
    house: 'LOK_SABHA',
    party: 'BJP / NDA',
    state: 'Bihar',
    annual_entitlement: 50000000,
    total_recommended: 49000000,
    total_sanctioned: 41000000,
    total_disbursed: 32000000,
    sc_allocation: 6500000, // 15.8% (Compliant)
    st_allocation: 3200000, // 7.8% (Compliant)
    recommended_works: [
      {
        id: 'REC-BR-01',
        title: 'Multipurpose Community Center & Library, Bakhtiyarpur',
        sector: 'Education',
        estimated_cost: 3500000,
        beneficiary_type: 'GENERAL_PUBLIC',
        dm_status: 'SANCTIONED',
        recommended_date: '2025-07-14'
      },
      {
        id: 'REC-BR-02',
        title: 'CC Pavement & Solar Street Lighting, Fatuha SC Ward-8',
        sector: 'Civic Amenities',
        estimated_cost: 3800000,
        beneficiary_type: 'SC_HABITATION',
        dm_status: 'SANCTIONED',
        recommended_date: '2025-08-01'
      }
    ]
  }
];

export const FundFlowPage: React.FC<FundFlowPageProps> = ({ onOpenProject }) => {
  const [activeViewTab, setActiveViewTab] = useState<'TREASURY_PIPELINE' | 'MP_QUOTA_TRACKER'>('TREASURY_PIPELINE');

  const [analytics, setAnalytics] = useState<OverviewAnalytics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // MP Quota Constituency Tracker State
  const [constituencies, setConstituencies] = useState<MPConstituencyData[]>(INITIAL_CONSTITUENCIES);
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string>('PC-AP-04');

  // New MP Recommendation Form Modal
  const [showRecModal, setShowRecModal] = useState(false);
  const [newRecTitle, setNewRecTitle] = useState('');
  const [newRecSector, setNewRecSector] = useState('Education');
  const [newRecCost, setNewRecCost] = useState('2500000');
  const [newRecBeneficiary, setNewRecBeneficiary] = useState<'SC_HABITATION' | 'ST_HABITATION' | 'GENERAL_PUBLIC'>('SC_HABITATION');

  useEffect(() => {
    Promise.all([
      api.getOverviewAnalytics().catch(() => null),
      api.getProjects().catch(() => [])
    ]).then(([analyticsData, projectsData]) => {
      if (analyticsData) setAnalytics(analyticsData);
      if (projectsData && Array.isArray(projectsData)) setProjects(projectsData);
      setLoading(false);
    });
  }, []);

  const filteredProjects = projects.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.id && p.id.toLowerCase().includes(term)) ||
      (p.district && p.district.toLowerCase().includes(term)) ||
      (p.state && p.state.toLowerCase().includes(term))
    );
  });

  const totalSanctioned = analytics?.total_sanctioned_amount ?? 165750000;
  const totalReleased = analytics?.total_funds_released ?? 138311000;
  const totalExpenditure = analytics?.total_actual_expenditure ?? 132056000;
  const unspent = analytics?.unspent_balance ?? Math.max(0, totalReleased - totalExpenditure);
  const utilization = analytics?.fund_utilization_pct ?? (totalReleased > 0 ? Math.round((totalExpenditure / totalReleased) * 100) : 95);

  const currentConstituency = constituencies.find(c => c.id === selectedConstituencyId) || constituencies[0];
  
  // Calculate Statutory Quota Percentages
  const currentSanctioned = currentConstituency.total_sanctioned || 1;
  const scPct = Math.round((currentConstituency.sc_allocation / currentSanctioned) * 1000) / 10;
  const stPct = Math.round((currentConstituency.st_allocation / currentSanctioned) * 1000) / 10;
  const generalAllocation = Math.max(0, currentConstituency.total_sanctioned - currentConstituency.sc_allocation - currentConstituency.st_allocation);
  const generalPct = Math.round((generalAllocation / currentSanctioned) * 1000) / 10;

  const isScCompliant = scPct >= 15.0;
  const isStCompliant = stPct >= 7.5;

  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Number(newRecCost) || 1000000;
    
    setConstituencies(prev => prev.map(c => {
      if (c.id !== selectedConstituencyId) return c;

      const newRec = {
        id: `REC-${c.state.slice(0, 2).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`,
        title: newRecTitle.trim(),
        sector: newRecSector,
        estimated_cost: cost,
        beneficiary_type: newRecBeneficiary,
        dm_status: 'UNDER_APPRAISAL' as const,
        recommended_date: new Date().toISOString().slice(0, 10)
      };

      const updatedRecommended = c.total_recommended + cost;
      const updatedSanctioned = c.total_sanctioned + cost;
      const updatedSc = newRecBeneficiary === 'SC_HABITATION' ? c.sc_allocation + cost : c.sc_allocation;
      const updatedSt = newRecBeneficiary === 'ST_HABITATION' ? c.st_allocation + cost : c.st_allocation;

      return {
        ...c,
        total_recommended: updatedRecommended,
        total_sanctioned: updatedSanctioned,
        sc_allocation: updatedSc,
        st_allocation: updatedSt,
        recommended_works: [newRec, ...c.recommended_works]
      };
    }));

    setShowRecModal(false);
    setNewRecTitle('');
    setNewRecCost('2500000');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 animate-tiranga-shimmer opacity-95"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-amber-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-gov-saffron" />
              <span>Fund Flow &amp; Public Expenditure Intelligence</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end fiscal tracking: Central Ministry Allocation → District Escrow → Implementing Agency → Contractor Bills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start md:self-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PFMS Scheme Code 0466 Active
            </span>
          </div>
        </div>

        {/* Top-Level Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 border-b border-slate-100">
          <button
            onClick={() => setActiveViewTab('TREASURY_PIPELINE')}
            className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeViewTab === 'TREASURY_PIPELINE'
                ? 'border-gov-navy text-gov-navy bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-gov-saffron" />
            <span>4-Stage Treasury Pipeline &amp; Site Expenditure</span>
          </button>

          <button
            onClick={() => setActiveViewTab('MP_QUOTA_TRACKER')}
            className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeViewTab === 'MP_QUOTA_TRACKER'
                ? 'border-gov-navy text-gov-navy bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Hon'ble MP Quota &amp; MoSPI Statutory Compliance</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-100 text-indigo-800">
              ₹5 Cr / Year
            </span>
          </button>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Total Sanctioned"
            value={totalSanctioned}
            icon={IndianRupee}
            inr={true}
            subtitle="Official MPLADS Allocation"
          />
          <StatCard
            title="Funds Released"
            value={totalReleased}
            icon={TrendingUp}
            inr={true}
            subtitle="Disbursed to District Escrow"
          />
          <StatCard
            title="Actual Expenditure"
            value={totalExpenditure}
            icon={CheckCircle2}
            inr={true}
            subtitle="Verified in Measurement Books"
            badge={{ text: `${utilization}% Utilization`, variant: 'positive' }}
          />
          <StatCard
            title="Unspent Balance"
            value={unspent}
            icon={AlertTriangle}
            inr={true}
            subtitle="Lying in District Treasuries"
            badge={{ text: unspent > 10000000 ? 'Monitor Action' : 'Within Bounds', variant: unspent > 10000000 ? 'warning' : 'neutral' }}
          />
        </div>
      </div>

      {/* VIEW 1: 4-STAGE FISCAL PIPELINE & PROJECT TABLE */}
      {activeViewTab === 'TREASURY_PIPELINE' && (
        <div className="space-y-6">
          {/* 4-Stage Visual Fund Trail */}
          <div className="bg-white rounded-2xl border border-amber-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>4-Stage Fiscal Pipeline &amp; Accountability Trail (PFMS Scheme Code 0466)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 font-medium">Real-Time Audit Ledger</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-bold font-mono">STAGE 1</span>
                  <Landmark className="w-4 h-4 text-gov-navy" />
                </div>
                <span className="text-xs font-bold text-gov-navy block">Ministry Allocation</span>
                <span className="text-lg font-extrabold text-gov-navy mt-1 block">{formatIndianCurrency(totalSanctioned)}</span>
                <span className="text-[10px] text-slate-500 mt-1 block">MoSPI Central Sector Release</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-blue-600 font-bold font-mono">STAGE 2</span>
                  <Building className="w-4 h-4 text-blue-700" />
                </div>
                <span className="text-xs font-bold text-gov-navy block">District Collector Escrow</span>
                <span className="text-lg font-extrabold text-blue-800 mt-1 block">{formatIndianCurrency(totalReleased)}</span>
                <span className="text-[10px] text-blue-600 mt-1 block">SNA Treasury Account Inflow</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-amber-700 font-bold font-mono">STAGE 3</span>
                  <Wallet className="w-4 h-4 text-amber-700" />
                </div>
                <span className="text-xs font-bold text-gov-navy block">Executing Agency (PWD/PRED)</span>
                <span className="text-lg font-extrabold text-amber-900 mt-1 block">{formatIndianCurrency(totalReleased * 0.96)}</span>
                <span className="text-[10px] text-amber-700 mt-1 block">Work Letter of Credit (LoC)</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-emerald-700 font-bold font-mono">STAGE 4</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <span className="text-xs font-bold text-gov-navy block">Verified Site Expenditure</span>
                <span className="text-lg font-extrabold text-emerald-800 mt-1 block">{formatIndianCurrency(totalExpenditure)}</span>
                <span className="text-[10px] text-emerald-700 mt-1 block">{utilization}% Disbursed against MB Records</span>
              </div>
            </div>
          </div>

          {/* Project Financial Breakdown Table */}
          <div className="bg-white rounded-2xl border border-amber-200/90 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-gov-navy">Project-Wise Fund Disbursal &amp; Utilization</h3>
                <span className="text-xs text-slate-500">Showing {filteredProjects.length} active works</span>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search project or district..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-gov-navy font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Project ID &amp; Title</th>
                    <th className="p-3 font-semibold">State / District</th>
                    <th className="p-3 font-semibold text-right">Sanctioned (₹)</th>
                    <th className="p-3 font-semibold text-right">Released (₹)</th>
                    <th className="p-3 font-semibold text-right">Expenditure (₹)</th>
                    <th className="p-3 font-semibold text-center">Utilization</th>
                    <th className="p-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.slice(0, 20).map((p) => {
                    const sanctioned = p.sanctioned_amount ?? 0;
                    const released = p.funds_released ?? sanctioned;
                    const expenditure = p.actual_expenditure ?? 0;
                    const util = released > 0 ? Math.min(100, Math.round((expenditure / released) * 100)) : 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-medium">
                          <span className="font-mono text-[11px] text-slate-500 block">{p.id}</span>
                          <span className="font-bold text-gov-navy block truncate max-w-xs">{p.title}</span>
                        </td>
                        <td className="p-3 text-slate-600">
                          {p.district || 'District'}, {p.state || 'State'}
                        </td>
                        <td className="p-3 text-right font-bold text-gov-navy">
                          {formatIndianCurrency(sanctioned)}
                        </td>
                        <td className="p-3 text-right text-slate-700">
                          {formatIndianCurrency(released)}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-700">
                          {formatIndianCurrency(expenditure)}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            util >= 80 ? 'bg-emerald-100 text-emerald-800' : util >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {util}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onOpenProject(p.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-gov-navy font-bold text-xs inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-gov-saffron" />
                            <span>Trace</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: HON'BLE MP QUOTA & STATUTORY MOSPI COMPLIANCE TRACKER */}
      {activeViewTab === 'MP_QUOTA_TRACKER' && (
        <div className="space-y-6">
          {/* Statutory Mandate Notice Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-gov-navy rounded-2xl p-6 text-white border border-indigo-800 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500 text-white uppercase tracking-wider">
                    MoSPI Parliamentary Guidelines
                  </span>
                  <span className="text-xs font-bold text-indigo-300">
                    MPLADS Scheme Code 0466 • Citizen's Charter &amp; Statutory Earmarking
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white">
                  Parliamentary Constituency Allocation &amp; SC/ST Statutory Earmarking Ledger
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Under statutory MoSPI guidelines, each Member of Parliament (Lok Sabha &amp; Rajya Sabha) is entitled to <strong>₹5.00 Crore per fiscal year</strong>. Crucially, the law mandates that <strong>at least 15%</strong> of funds must be earmarked for Scheduled Caste (SC) areas and <strong>at least 7.5%</strong> for Scheduled Tribe (ST) areas.
                </p>
              </div>

              {/* Constituency Switcher */}
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-2 shrink-0">
                <label className="text-[10px] uppercase font-bold text-indigo-300 block">Select Constituency:</label>
                <select
                  value={selectedConstituencyId}
                  onChange={(e) => setSelectedConstituencyId(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-indigo-500/40 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-400"
                >
                  {constituencies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.mp_name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                  <span>House: <strong>{currentConstituency.house.replace('_', ' ')}</strong></span>
                  <span>State: <strong>{currentConstituency.state}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* MP Entitlement & Compliance Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Annual Statutory Entitlement</span>
              <div className="text-xl font-extrabold text-gov-navy">
                {formatIndianCurrency(currentConstituency.annual_entitlement)}
              </div>
              <span className="text-[11px] text-slate-500 block">₹2.50 Cr × 2 Installments</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Works Recommended by MP</span>
              <div className="text-xl font-extrabold text-indigo-700">
                {formatIndianCurrency(currentConstituency.total_recommended)}
              </div>
              <span className="text-[11px] text-slate-500 block">
                {currentConstituency.recommended_works.length} Projects Recommended
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">District Magistrate Sanctioned</span>
              <div className="text-xl font-extrabold text-emerald-700">
                {formatIndianCurrency(currentConstituency.total_sanctioned)}
              </div>
              <span className="text-[11px] text-slate-500 block">
                {Math.round((currentConstituency.total_sanctioned / currentConstituency.annual_entitlement) * 100)}% Sanction Rate
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Actual Disbursal on Ground</span>
              <div className="text-xl font-extrabold text-amber-700">
                {formatIndianCurrency(currentConstituency.total_disbursed)}
              </div>
              <span className="text-[11px] text-slate-500 block">
                {Math.round((currentConstituency.total_disbursed / currentConstituency.total_sanctioned) * 100)}% Expenditure
              </span>
            </div>
          </div>

          {/* Statutory SC / ST Quota Compliance Audit Hub */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-gov-navy flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>MoSPI Statutory Earmarking Compliance Audit (Clause 2.11)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Autonomous validation of constitutional affirmative action guidelines for marginalized communities.
                </p>
              </div>

              <button
                onClick={() => setShowRecModal(true)}
                className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-gov-saffron" />
                <span>Simulate New MP Recommendation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SC Area Allocation Gauge */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gov-navy">
                    Scheduled Caste (SC) Area Allocation
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isScCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isScCompliant ? '✓ MoSPI Compliant (≥ 15%)' : '⚠️ Statutory Shortfall (< 15%)'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">Allocated: <strong>{formatIndianCurrency(currentConstituency.sc_allocation)}</strong></span>
                    <span className="font-extrabold text-gov-navy">{scPct}% (Target: 15.0%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isScCompliant ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, (scPct / 25) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Statutory minimum requirement: <strong>₹75.00 Lakhs (15%)</strong>. Current allocation covers Ambedkar colonies, drinking water networks, and community centers.
                </p>
              </div>

              {/* ST Area Allocation Gauge */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gov-navy">
                    Scheduled Tribe (ST) Area Allocation
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isStCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isStCompliant ? '✓ MoSPI Compliant (≥ 7.5%)' : '⚠️ Statutory Shortfall (< 7.5%)'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">Allocated: <strong>{formatIndianCurrency(currentConstituency.st_allocation)}</strong></span>
                    <span className="font-extrabold text-gov-navy">{stPct}% (Target: 7.5%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isStCompliant ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, (stPct / 15) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Statutory minimum requirement: <strong>₹37.50 Lakhs (7.5%)</strong>. Current allocation covers tribal hamlets, solar illumination, and forest school infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Works Register */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-gov-navy">
                  Constituency Works Recommendation Register ({currentConstituency.name})
                </h3>
                <span className="text-xs text-slate-500">
                  Formally recommended by Hon'ble MP {currentConstituency.mp_name} to District Magistrate
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Citizen's Charter: 45 Days Appraisal Window
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Recommendation ID &amp; Title</th>
                    <th className="p-3 font-semibold">Sector</th>
                    <th className="p-3 font-semibold">Beneficiary Category</th>
                    <th className="p-3 font-semibold text-right">Estimated Cost (₹)</th>
                    <th className="p-3 font-semibold text-center">DM Appraisal Status</th>
                    <th className="p-3 font-semibold text-center">Recommended Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentConstituency.recommended_works.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">
                        <span className="font-mono text-[10px] text-slate-500 block">{rec.id}</span>
                        <span className="font-bold text-gov-navy block">{rec.title}</span>
                      </td>
                      <td className="p-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {rec.sector}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.beneficiary_type === 'SC_HABITATION' 
                            ? 'bg-purple-100 text-purple-800'
                            : rec.beneficiary_type === 'ST_HABITATION'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rec.beneficiary_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-gov-navy">
                        {formatIndianCurrency(rec.estimated_cost)}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.dm_status === 'SANCTIONED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.dm_status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.dm_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-500 text-[11px]">
                        {rec.recommended_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATE MP RECOMMENDATION MODAL */}
      {showRecModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-gov-navy text-sm">
                  Simulate Hon'ble MP Work Recommendation
                </h3>
              </div>
              <button
                onClick={() => setShowRecModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Propose a new developmental work under <strong>{currentConstituency.name}</strong>. The system will automatically compute the impact on statutory SC/ST reservation thresholds.
            </p>

            <form onSubmit={handleAddRecommendation} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Work Title / Description:</label>
                <input
                  type="text"
                  value={newRecTitle}
                  onChange={(e) => setNewRecTitle(e.target.value)}
                  placeholder="e.g. Construction of Community Center at SC Colony"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Development Sector:</label>
                  <select
                    value={newRecSector}
                    onChange={(e) => setNewRecSector(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Drinking Water">Drinking Water</option>
                    <option value="Roads & Drainage">Roads &amp; Drainage</option>
                    <option value="Civic Amenities">Civic Amenities</option>
                    <option value="Skill Development">Skill Development</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Beneficiary Target Category:</label>
                  <select
                    value={newRecBeneficiary}
                    onChange={(e) => setNewRecBeneficiary(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="SC_HABITATION">SC Habitation (15% Reserve)</option>
                    <option value="ST_HABITATION">ST Habitation (7.5% Reserve)</option>
                    <option value="GENERAL_PUBLIC">General Public</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estimated Cost (₹ INR):</label>
                <input
                  type="number"
                  value={newRecCost}
                  onChange={(e) => setNewRecCost(e.target.value)}
                  step="50000"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-950 space-y-1">
                <strong>Statutory Compliance Impact:</strong> Submitting this work as{' '}
                <span className="font-bold underline">{newRecBeneficiary.replace('_', ' ')}</span> will automatically recalculate the constituency's affirmative action percentage and update the live parliamentary audit ledger.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-gov-saffron" />
                  <span>Submit Recommendation to District Authority</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

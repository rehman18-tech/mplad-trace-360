import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project, MarketCommodityRate, TenderViabilityResult, CrossCadreOfficer } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { marketRatesOracle } from '../services/marketRatesOracle';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  FileText, Building, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Eye, 
  Scale, TrendingUp, TrendingDown, RefreshCw, Cpu, UserCheck, ShieldAlert, 
  Check, XCircle, ArrowRight, Zap, Info, Shield, Layers, Lock, Unlock
} from 'lucide-react';

interface ContractsPageProps {
  onOpenProject: (projectId: string) => void;
  onSelectContractor?: (contractorId: string) => void;
}

export const ContractsPage: React.FC<ContractsPageProps> = ({ onOpenProject, onSelectContractor }) => {
  const { role, isAdmin, isVigilanceAuditor } = useAuth();
  const { showToast } = useToast();
  const canAccessCrossCadre = isAdmin || isVigilanceAuditor;
  const [isJudiciallyUnmasked, setIsJudiciallyUnmasked] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'registry' | 'market-oracle' | 'cross-cadre'>('registry');

  // If role changes and user is on cross-cadre without permission, reset to registry
  useEffect(() => {
    if (!canAccessCrossCadre && activeTab === 'cross-cadre') {
      setActiveTab('registry');
    }
  }, [canAccessCrossCadre, activeTab]);

  // Market Oracle State
  const [selectedDistrict, setSelectedDistrict] = useState('Visakhapatnam');
  const [commodityRates, setCommodityRates] = useState<MarketCommodityRate[]>([]);
  const [lastOracleSync, setLastOracleSync] = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  // Interactive Bid Scrutinizer Simulator State
  const [scrutinizerProject, setScrutinizerProject] = useState<string>('MPLAD-AP-2026-00125');
  const [scrutinizerContractor, setScrutinizerContractor] = useState('M/s Sri Krishna Infratech');
  const [scrutinizerQuotedAmount, setScrutinizerQuotedAmount] = useState<number>(1050000);
  const [scrutinizerSanctioned, setScrutinizerSanctioned] = useState<number>(1500000);
  const [viabilityResult, setViabilityResult] = useState<TenderViabilityResult | null>(null);

  // Cross-Cadre Pool State
  const [crossCadrePool, setCrossCadrePool] = useState<CrossCadreOfficer[]>([]);
  const [blindDispatchResult, setBlindDispatchResult] = useState<{ officer: CrossCadreOfficer; noticeWindow: string } | null>(null);

  useEffect(() => {
    api.getProjects().then(data => {
      setProjects(data);
      setLoading(false);
      if (data.length > 0) {
        setScrutinizerProject(data[0].id);
        setScrutinizerContractor(data[0].contractor_name || 'M/s Sri Krishna Infratech');
        setScrutinizerSanctioned(data[0].sanctioned_amount || 1500000);
        setScrutinizerQuotedAmount(Math.round((data[0].sanctioned_amount || 1500000) * 0.72)); // Default to low bid for demo
      }
    }).catch(() => setLoading(false));

    // Load initial rates and pool
    setCommodityRates(marketRatesOracle.getDistrictRates(selectedDistrict));
    setCrossCadrePool(marketRatesOracle.getCrossCadrePool());
  }, []);

  useEffect(() => {
    setCommodityRates(marketRatesOracle.getDistrictRates(selectedDistrict));
  }, [selectedDistrict]);

  // Run bid evaluation whenever inputs change
  useEffect(() => {
    const result = marketRatesOracle.evaluateTenderViability(
      scrutinizerProject,
      scrutinizerContractor,
      scrutinizerQuotedAmount,
      scrutinizerSanctioned,
      selectedDistrict
    );
    setViabilityResult(result);
  }, [scrutinizerProject, scrutinizerContractor, scrutinizerQuotedAmount, scrutinizerSanctioned, selectedDistrict]);

  const handleRefreshRates = () => {
    setIsRefreshingRates(true);
    setTimeout(() => {
      setCommodityRates(marketRatesOracle.getDistrictRates(selectedDistrict));
      setLastOracleSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshingRates(false);
    }, 600);
  };

  const handleTriggerBlindDispatch = () => {
    const res = marketRatesOracle.assignBlindInspector(scrutinizerProject);
    setBlindDispatchResult(res);
  };

  const getContractHealthBadge = (p: Project) => {
    if (p.delay_days > 90 || p.overall_risk_score >= 75) {
      return <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 whitespace-nowrap shadow-2xs">🔴 Critical</span>;
    }
    if (p.delay_days > 45 || p.overall_risk_score >= 50) {
      return <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 whitespace-nowrap shadow-2xs">🟠 High Risk</span>;
    }
    if (p.delay_days > 0 || p.overall_risk_score >= 30) {
      return <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap shadow-2xs">🟡 Attention</span>;
    }
    return <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap shadow-2xs">🟢 Normal</span>;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Mode Switcher */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-gov-saffron" />
              <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy">
                Contracts Registry & Live Anti-Corruption Oracle
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wide">
                CVC Norms Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated institutional price floor oracle (CPWD DSR, MoSPI WPI, GeM API), predatory L1 bid prevention, and cross-cadre blind dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded bg-slate-100 text-slate-700">
              {projects.length} Active Public Contracts
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-4 gap-2">
          <button
            onClick={() => setActiveTab('registry')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'registry'
                ? 'border-gov-navy text-gov-navy font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📜 Public Contracts Registry & SLA</span>
          </button>

          <button
            onClick={() => setActiveTab('market-oracle')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'market-oracle'
                ? 'border-gov-saffron text-gov-navy font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4 text-gov-saffron" />
            <span>⚖️ Live Market Price Oracle & Tender Price Floor</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">
              ANTI-CORRUPTION
            </span>
          </button>

          {canAccessCrossCadre && (
            <button
              onClick={() => setActiveTab('cross-cadre')}
              className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 ${
                activeTab === 'cross-cadre'
                  ? 'border-indigo-600 text-indigo-800 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>🛡️ Cross-Cadre Shared Inspector Pool</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-100 text-indigo-800">
                BLIND DISPATCH
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: CONTRACTS REGISTRY ================= */}
      {activeTab === 'registry' && (
        <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="font-bold text-gov-navy text-[11px] uppercase tracking-wider">Contract Health Legend:</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-800">🟢 Normal (Compliant)</span>
              <span className="flex items-center gap-1.5 font-medium text-amber-800">🟡 Attention (&lt;45d delay)</span>
              <span className="flex items-center gap-1.5 font-medium text-orange-800">🟠 High Risk (Significant lag)</span>
              <span className="flex items-center gap-1.5 font-medium text-red-800">🔴 Critical (Default / Breach)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">Contractor & Reg</th>
                  <th className="p-3 font-semibold">Work Agreement</th>
                  <th className="p-3 font-semibold text-right">Contract Value (₹)</th>
                  <th className="p-3 font-semibold text-center">Start / Target Date</th>
                  <th className="p-3 font-semibold text-center">Defect Liability</th>
                  <th className="p-3 font-semibold text-center">Contract Health</th>
                  <th className="p-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.slice(0, 15).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium">
                      {onSelectContractor && p.contractor_id ? (
                        <button
                          onClick={() => onSelectContractor(p.contractor_id!)}
                          className="text-left group hover:opacity-80 transition-opacity"
                          title="Open Contractor Intelligence Scorecard"
                        >
                          <span className="font-bold text-gov-navy group-hover:text-blue-700 block transition-colors">
                            {p.contractor_name || 'Assigned PWD Agency'}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 group-hover:text-blue-600">
                            {p.contractor_id} ↗
                          </span>
                        </button>
                      ) : (
                        <>
                          <span className="font-bold text-gov-navy block">{p.contractor_name || 'Assigned PWD Agency'}</span>
                          <span className="font-mono text-[10px] text-slate-400">{p.contractor_id || 'CON-REG-AUTO'}</span>
                        </>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-gov-charcoal block truncate max-w-xs">{p.title}</span>
                      <span className="text-[10px] text-slate-400">{p.id}</span>
                    </td>
                    <td className="p-3 text-right font-extrabold text-gov-navy whitespace-nowrap">
                      {formatIndianCurrency(p.contract_amount || p.sanctioned_amount)}
                    </td>
                    <td className="p-3 text-center text-slate-600 whitespace-nowrap min-w-[120px]">
                      <div className="text-[11px] font-bold text-gov-navy">{p.start_date || '2025-06-01'}</div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Due: {p.expected_completion_date || '2026-03-31'}</div>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                        36 Months
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap min-w-[130px]">
                      {getContractHealthBadge(p)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onOpenProject(p.id)}
                        className="p-1.5 rounded hover:bg-slate-200 text-gov-navy font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-gov-saffron" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: LIVE MARKET PRICE ORACLE & TENDER PRICE FLOOR ================= */}
      {activeTab === 'market-oracle' && (
        <div className="space-y-6">
          {/* Statutory Policy Callout */}
          <div className="bg-gradient-to-r from-slate-900 to-gov-navy rounded-xl p-5 text-white shadow-md border border-slate-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                    Central Vigilance Commission (CVC) Statutory Price Floor Directive
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold">
                  Automated Market Rates Oracle & Abnormally Low Tender (ALT) Prevention
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Engineers can no longer manually fabricate baseline rates. Grade-A material rates (Cement, TMT Steel, Sand, Aggregate, Labor) are fetched autonomously from institutional feeds (CPWD DSR, MoSPI Wholesale Price Index, GeM Procurement). If a contractor bids below the Minimum Viable Material Cost (MVMC), the system halts the award automatically.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10 self-start lg:self-center">
                <div className="text-right">
                  <div className="text-[10px] text-slate-300 font-medium">Oracle Sync Status</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    SYNCED ({lastOracleSync})
                  </div>
                </div>
                <button
                  onClick={handleRefreshRates}
                  disabled={isRefreshingRates}
                  className="px-3 py-1.5 bg-gov-saffron hover:bg-gov-saffron-dark text-white rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingRates ? 'animate-spin' : ''}`} />
                  <span>Sync Oracle</span>
                </button>
              </div>
            </div>
          </div>

          {/* District Selector & Live Rates Grid */}
          <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
                  <Building className="w-5 h-5 text-gov-saffron" />
                  <span>Institutional Commodity Price Board (District Benchmarks)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time baseline prices used to compute statutory tender floors. Any bid below -15% cannot mathematically purchase certified BIS materials.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gov-charcoal">District Schedule:</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="text-xs border border-slate-300 rounded-md px-3 py-1.5 font-semibold text-gov-navy bg-slate-50 focus:ring-2 focus:ring-gov-navy"
                >
                  <option value="Visakhapatnam">Visakhapatnam (AP-04)</option>
                  <option value="Varanasi">Varanasi (UP-77)</option>
                  <option value="Patna">Patna (BR-02)</option>
                </select>
              </div>
            </div>

            {/* Commodity Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commodityRates.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 block">{c.id}</span>
                      <h4 className="font-extrabold text-xs text-gov-navy">{c.commodity_name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{c.specification}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs font-bold">
                      {c.change_pct_7d >= 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> +{c.change_pct_7d}%
                        </span>
                      ) : (
                        <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" /> {c.change_pct_7d}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-medium">Market Benchmark</span>
                      <span className="text-sm font-extrabold text-gov-navy">
                        ₹{c.district_benchmark_rate.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-500 font-normal"> / {c.unit}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-600 block font-bold">Statutory Floor (-12%)</span>
                      <span className="text-sm font-extrabold text-red-700">
                        ₹{c.statutory_price_floor.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-500 font-normal"> / {c.unit}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">BIS Compliance:</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[170px]">{c.bis_standard_norm}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Data Feed:</span>
                      <span className="font-bold text-blue-700 truncate max-w-[170px]">{c.source_feed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Bid Scrutinizer Simulator */}
          <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-gov-saffron" />
                <h3 className="text-base font-extrabold text-gov-navy">
                  Interactive Tender Price Scrutinizer (Anti-Predatory L1 Engine)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Test how the automated floor engine evaluates any contractor quotation against statutory minimum viable material costs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Input Controls */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-gov-navy tracking-wider">Tender Parameters</h4>

                <div>
                  <label className="block text-xs font-bold text-gov-navy mb-1">Select Active Project</label>
                  <select
                    value={scrutinizerProject}
                    onChange={(e) => {
                      const pId = e.target.value;
                      setScrutinizerProject(pId);
                      const p = projects.find(x => x.id === pId);
                      if (p) {
                        setScrutinizerContractor(p.contractor_name || 'Assigned Agency');
                        setScrutinizerSanctioned(p.sanctioned_amount || 1500000);
                        setScrutinizerQuotedAmount(Math.round((p.sanctioned_amount || 1500000) * 0.75));
                      }
                    }}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold text-gov-navy bg-white focus:ring-2 focus:ring-gov-navy"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {p.title.slice(0, 45)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gov-navy mb-1">Sanctioned Administrative Estimate (₹)</label>
                  <input
                    type="number"
                    value={scrutinizerSanctioned}
                    onChange={(e) => setScrutinizerSanctioned(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono font-bold text-gov-navy bg-white focus:ring-2 focus:ring-gov-navy"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Baseline estimate benchmarked against CPWD DSR.</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gov-navy">Contractor Quoted Amount (₹)</label>
                    <span className="text-xs font-mono font-bold text-gov-saffron">
                      {Math.round(((scrutinizerQuotedAmount - scrutinizerSanctioned) / scrutinizerSanctioned) * 100)}% Variance
                    </span>
                  </div>
                  <input
                    type="number"
                    value={scrutinizerQuotedAmount}
                    onChange={(e) => setScrutinizerQuotedAmount(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono font-bold text-gov-navy bg-white focus:ring-2 focus:ring-gov-navy"
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setScrutinizerQuotedAmount(Math.round(scrutinizerSanctioned * 0.70))}
                      className="px-2 py-1 bg-red-100 text-red-800 rounded text-[10px] font-bold hover:bg-red-200"
                    >
                      Test -30% (Predatory L1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScrutinizerQuotedAmount(Math.round(scrutinizerSanctioned * 0.88))}
                      className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-[10px] font-bold hover:bg-amber-200"
                    >
                      Test -12% (APS Required)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScrutinizerQuotedAmount(Math.round(scrutinizerSanctioned * 0.96))}
                      className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold hover:bg-emerald-200"
                    >
                      Test -4% (Viable Bid)
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold block text-gov-navy">Participating Contractor:</span>
                  <span className="font-semibold text-slate-800">{scrutinizerContractor}</span>
                </div>
              </div>

              {/* Scrutiny Verdict */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                {viabilityResult && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Automated Viability Verdict</span>
                        {viabilityResult.viability_status === 'VIABLE' && (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED FOR FINANCIAL AWARD
                          </span>
                        )}
                        {viabilityResult.viability_status === 'REQUIRES_PERFORMANCE_BOND' && (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> ADDITIONAL PERFORMANCE SECURITY REQUIRED
                          </span>
                        )}
                        {viabilityResult.viability_status === 'ABNORMALLY_LOW_REJECTED' && (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5" /> STATUTORY REJECTION (PREDATORY L1)
                          </span>
                        )}
                        {viabilityResult.viability_status === 'INFLATED_REVIEW_REQUIRED' && (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> INFLATED ESTIMATE INVESTIGATION
                          </span>
                        )}
                      </div>

                      {/* Metric Comparison Cards */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block font-medium">Quoted Bid</span>
                          <span className="text-sm font-extrabold text-gov-navy">
                            ₹{viabilityResult.quoted_amount.toLocaleString('en-IN')}
                          </span>
                          <span className={`text-[10px] font-bold block mt-0.5 ${viabilityResult.variance_from_baseline_pct < -15 ? 'text-red-600' : 'text-slate-600'}`}>
                            {viabilityResult.variance_from_baseline_pct}% vs Est.
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block font-medium">Minimum Viable Material Cost (62%)</span>
                          <span className="text-sm font-extrabold text-blue-700">
                            ₹{viabilityResult.minimum_viable_material_cost.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-blue-600 block mt-0.5 font-medium">
                            BIS Grade-A Floor
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                          <span className="text-[10px] text-slate-500 block font-medium">Statutory Floor (-15%)</span>
                          <span className="text-sm font-extrabold text-gov-charcoal">
                            ₹{viabilityResult.statutory_price_floor.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                            Permissible Threshold
                          </span>
                        </div>
                      </div>

                      {/* Viability Flag Description */}
                      <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                        viabilityResult.viability_status === 'ABNORMALLY_LOW_REJECTED' 
                          ? 'bg-red-50 text-red-900 border-red-200'
                          : viabilityResult.viability_status === 'REQUIRES_PERFORMANCE_BOND'
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block mb-0.5">Enforcement Rationale:</span>
                            {viabilityResult.ai_risk_flag}
                          </div>
                        </div>
                      </div>

                      {/* Cryptographic Clearance Hash or Rejection Notice */}
                      {viabilityResult.clearance_certificate_issued ? (
                        <div className="bg-white p-3 rounded-lg border border-emerald-300 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                              Automated Clearance Hash (Tamper-Proof)
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-800">
                              {viabilityResult.clearance_hash}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded shrink-0">
                            VALIDATED
                          </span>
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-lg border border-red-300 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                              Procurement Freeze Order
                            </span>
                            <span className="text-xs font-semibold text-red-700">
                              Contract Award blocked under Central Vigilance Commission Circular 01/01/2021.
                            </span>
                          </div>
                          <span className="px-2.5 py-1 bg-red-600 text-white font-bold text-[10px] rounded shrink-0">
                            BLOCKED
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <span>Viability Health Score: <strong className="text-gov-navy">{viabilityResult.viability_score}/100</strong></span>
                      <button
                        onClick={() => onOpenProject(scrutinizerProject)}
                        className="font-bold text-gov-navy hover:underline flex items-center gap-1"
                      >
                        <span>Open Project Record</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CROSS-CADRE SHARED INSPECTOR POOL ================= */}
      {canAccessCrossCadre && activeTab === 'cross-cadre' && (
        <div className="space-y-6">
          {/* Solution Callout */}
          <div className="bg-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-800 space-y-4 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base md:text-lg font-black tracking-tight flex items-center gap-2">
                    <span>Cross-Cadre Shared Inspector Pool &amp; Anti-Collusion Engine</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-800 text-indigo-200 border border-indigo-700">
                      CVC DIRECTIVE 04/2026
                    </span>
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Zero-Trust randomized deployment preventing local familiarity, bribery, and contractor lobbying.
                  </p>
                </div>
              </div>

              {/* Judicial Unmasking Switch (Restricted to CTEO / CVC Vigilance Wing) */}
              {isVigilanceAuditor && (
                <div className="flex items-center gap-2 bg-indigo-900/90 p-2 rounded-xl border border-indigo-700">
                  <button
                    onClick={() => {
                      const nextState = !isJudiciallyUnmasked;
                      setIsJudiciallyUnmasked(nextState);
                      showToast(
                        nextState
                          ? '⚖️ CTEO Statutory Judicial Unmask Activated (Logged to Vigilance Audit Trail)'
                          : '🔒 Officer identities re-sealed in cryptographic escrow',
                        nextState ? 'warning' : 'info'
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                      isJudiciallyUnmasked
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 font-extrabold'
                        : 'bg-indigo-700 text-indigo-100 hover:bg-indigo-600'
                    }`}
                    title="Section 88 Central Vigilance Commission Act statutory unmasking"
                  >
                    {isJudiciallyUnmasked ? <Unlock className="w-3.5 h-3.5 text-slate-950" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{isJudiciallyUnmasked ? 'Re-Seal Escrow (Mask)' : 'CTEO Judicial Unmask (Sec 88)'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Explanatory Protocol Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-indigo-900/50 border border-indigo-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase block">01. Cross-Cadre Randomization</span>
                <p className="text-indigo-100 text-[11px] leading-relaxed">
                  Engineers from 5 independent cadres (Irrigation, R&amp;B, RWSS, PR, Municipal) audit non-home works. An Irrigation AE inspects school roofs.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-900/50 border border-indigo-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase block">02. 2-Hour Dispatch Window</span>
                <p className="text-indigo-100 text-[11px] leading-relaxed">
                  Assigned engineer receives destination coordinates and encrypted OTP only <strong>2 hours prior to physical audit</strong>.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-900/50 border border-indigo-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-rose-300 uppercase block">03. Zero Contractor Advance Notice</span>
                <p className="text-indigo-100 text-[11px] leading-relaxed">
                  Contractor receives <strong>0 minutes advance notice</strong>. Pre-inspection bribery, cosmetic staging, and sub-standard hiding are eliminated.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleTriggerBlindDispatch}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 text-amber-200" />
                <span>Simulate AI Automated Blind Dispatch for {scrutinizerProject}</span>
              </button>

              <span className="text-[11px] font-mono text-indigo-300">
                AI Algorithm: Biometric Presence Validated • Zero Inter-Cadre Prior Contact
              </span>
            </div>
          </div>

          {/* Judicial Unmasking Status Banner */}
          {isJudiciallyUnmasked && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-amber-950">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <strong className="block font-bold">⚠️ CTEO STATUTORY JUDICIAL UNMASK ACTIVE</strong>
                  <span>
                    Officer identities and active deployment locations unmasked under Section 88 CVC Act. Audit entry logged to National Vigilance Register.
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsJudiciallyUnmasked(false);
                  showToast('🔒 Officer identities re-sealed in cryptographic escrow', 'info');
                }}
                className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg shrink-0 border border-amber-400 transition-colors"
              >
                Re-Seal Roster
              </button>
            </div>
          )}

          {/* Blind Dispatch Notification Modal/Toast */}
          {blindDispatchResult && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-5 shadow-lg space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-extrabold text-sm text-emerald-900">
                    Blind Dispatch Assignment Generated Successfully
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded">
                  OTP-ENCRYPTED DISPATCH (2-HOUR WINDOW)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Dispatched Independent Officer</span>
                  <strong className="text-gov-navy text-sm block">
                    {isJudiciallyUnmasked ? (
                      blindDispatchResult.officer.name
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        <Lock className="w-3 h-3 text-indigo-600" />
                        [ 🔒 CADRE-TOKEN-{blindDispatchResult.officer.id.replace(/[^0-9]/g, '').slice(-3) || '042'} ]
                      </span>
                    )}
                  </strong>
                  <span className="text-slate-600 font-medium">
                    {isJudiciallyUnmasked ? blindDispatchResult.officer.designation : 'Independent Grade-A Engineer'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Non-Home Parent Department</span>
                  <strong className="text-indigo-800 text-sm block">{blindDispatchResult.officer.parent_department}</strong>
                  <span className="text-slate-600 font-medium">
                    Active Zone: {isJudiciallyUnmasked ? blindDispatchResult.officer.active_subdivision : '🔒 [LOCATION ENCRYPTED]'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Anti-Collusion Protocol</span>
                  <strong className="text-emerald-800 text-xs block">{blindDispatchResult.noticeWindow}</strong>
                  <span className="text-slate-600 text-[10px]">Zero contractor advance notice. Mandated under CVC Rule 7.4.</span>
                </div>
              </div>
            </div>
          )}

          {/* Cross Cadre Active Roster */}
          <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>Cross-Cadre Technical Officers Roster</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Total {crossCadrePool.length} verified technical officers in district reserve. Names and subdivisions are cryptographically masked to eliminate bribery risk.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                  5 Departments Integrated
                </span>
                {!isJudiciallyUnmasked && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 text-amber-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>MASKED</span>
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Officer Name &amp; ID</th>
                    <th className="p-3 font-semibold">Designation</th>
                    <th className="p-3 font-semibold">Parent Department</th>
                    <th className="p-3 font-semibold">Technical Specialization</th>
                    <th className="p-3 font-semibold">Active Subdivision</th>
                    <th className="p-3 font-semibold text-center">Dispatch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {crossCadrePool.map((off) => (
                    <tr key={off.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">
                        {isJudiciallyUnmasked ? (
                          <>
                            <span className="font-bold text-gov-navy block">{off.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{off.id}</span>
                          </>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-indigo-950 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-200">
                              <Lock className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span>CADRE-TOKEN-{off.id.replace(/[^0-9]/g, '').slice(-3) || '001'}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">Sealed in Escrow</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {isJudiciallyUnmasked ? off.designation : 'Executive Cadre Engineer'}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-100">
                          {off.parent_department}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{off.specialization}</td>
                      <td className="p-3 text-slate-600 font-medium">
                        {isJudiciallyUnmasked ? (
                          off.active_subdivision
                        ) : (
                          <span className="font-mono text-[10px] text-slate-400 italic">
                            🔒 [ENCRYPTED ZONE]
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {off.blind_dispatch_status === 'AVAILABLE' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            🟢 Available (Pool)
                          </span>
                        ) : off.blind_dispatch_status === 'DISPATCHED' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">
                            🟣 Dispatched (Active)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            ⚪ Standby
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

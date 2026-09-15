import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { OverviewAnalytics } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, ShieldCheck, Search, MapPin, Eye, CheckCircle2, 
  Cpu, AlertTriangle, Scale, Clock, Users, Building, Layers, Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenProject: (projectId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenProject }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<OverviewAnalytics | null>(null);

  useEffect(() => {
    api.getOverviewAnalytics().then(setStats).catch(() => {});
  }, []);

  const steps = [
    { num: '01', title: 'Discover', desc: 'Search and inspect any MPLADS work across village, district, or constituency.' },
    { num: '02', title: 'Trace', desc: 'Trace every rupee across sanction, treasury release, escrow, and contractor payout.' },
    { num: '03', title: 'Verify', desc: 'Validate on-ground execution with geotagged, timestamped mobile field inspections.' },
    { num: '04', title: 'Detect', desc: 'Continuous AI comparison of Planned vs. Actual velocity and spatial duplicates.' },
    { num: '05', title: 'Alert', desc: 'Autonomous multi-tier escalation to district and implementing authorities.' },
    { num: '06', title: 'Resolve', desc: 'Track dispute resolution, contractor rectification, and guarantee extensions.' }
  ];

  const intelligenceCards = [
    { icon: AlertTriangle, title: 'Cost & Fund Anomaly', desc: 'Flags expenditure outpacing verified physical progress or contract deviations.' },
    { icon: Clock, title: 'Delay Prediction', desc: 'Bayesian timeline forecasting estimating schedule slippage before deadlines pass.' },
    { icon: Layers, title: 'Spatial Duplicate Detection', desc: 'Identifies overlapping road or water sanctions across departments within 250m.' },
    { icon: Users, title: 'Contractor Scorecard', desc: 'Assesses contractor execution velocity, concurrent works, and dispute track record.' },
    { icon: Scale, title: 'Dispute & Claim Review', desc: 'Compares contractor measurement claims against field officer physical audits.' },
    { icon: ShieldCheck, title: 'Guarantee Countdown', desc: 'Automated 30-day alerts before Performance Bank Guarantees or warranties expire.' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Light & Prestigious Indian Government National Surveillance Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F1F8F2] text-slate-900 p-8 md:p-12 shadow-lg border border-amber-200/90">
        {/* Animated Tricolor Top Shimmer Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 animate-tiranga-shimmer opacity-95"></div>

        {/* Ambient Subtle Radial Warm & Emerald Glows */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-3xl">
            {/* Top Government of India & Satyameva Jayate Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-semibold shadow-xs">
                <span className="text-amber-900 font-extrabold font-mono tracking-wider">सत्यमेव जयते</span>
                <span className="text-amber-400">|</span>
                <span className="font-mono text-[11px] text-amber-900 uppercase font-bold">{t('govt_of_india')}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>{t('mospi_active')}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-slate-950 mb-4">
              {t('hero_title_1')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700">
                {t('hero_title_2')}
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-700 mb-6 max-w-2xl leading-relaxed">
              {t('hero_desc')}
            </p>

            {/* Quick Department / Sector Launch Chips with Authentic Indian Missions */}
            <div className="mb-7">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-950 block mb-2 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                <span>{t('hero_missions_label')}:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: `🚰 ${t('mission_water')}`, dept: 'Drinking Water' },
                  { label: `🏫 ${t('mission_edu')}`, dept: 'Education' },
                  { label: `🏥 ${t('mission_health')}`, dept: 'Healthcare' },
                  { label: `🛣️ ${t('mission_roads')}`, dept: 'Roads & Bridges' },
                  { label: `⚡ ${t('mission_solar')}`, dept: 'Solar Energy' },
                  { label: `🌾 ${t('mission_irrigation')}`, dept: 'Irrigation' },
                  { label: `🚽 ${t('mission_sanitation')}`, dept: 'Sanitation' },
                ].map((item) => (
                  <button
                    key={item.dept}
                    onClick={() => onNavigate('departments')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200/90 text-xs font-semibold text-slate-800 hover:text-amber-950 transition-all shadow-xs hover:border-amber-400"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('projects')}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>{t('hero_search_cta')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="px-6 py-3 bg-white hover:bg-amber-50 text-slate-800 border border-amber-300 font-bold text-xs md:text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs hover:border-amber-400"
              >
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>{t('hero_map_cta')}</span>
              </button>

              <button
                onClick={() => onOpenProject('MPLAD-AP-2026-00125')}
                className="px-4 py-2.5 rounded-xl bg-amber-100/70 hover:bg-amber-100 text-amber-950 text-xs md:text-sm font-bold transition-colors flex items-center gap-1.5 border border-amber-300/80 shadow-xs"
              >
                <Eye className="w-4 h-4 text-orange-600" />
                <span>Spotlight: Community Hall (AP)</span>
              </button>
            </div>
          </div>

          {/* Right Side: Light Geospatial Radar & 24-Spoke Ashoka Chakra */}
          <div className="w-full lg:w-80 flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-amber-200/90 relative overflow-hidden shadow-lg">
            {/* Animated Radar Sweep Overlay */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              {/* Radar Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/40"></div>
              <div className="absolute inset-6 rounded-full border border-amber-300/40"></div>
              <div className="absolute inset-12 rounded-full border border-emerald-400/40"></div>
              <div className="absolute inset-18 rounded-full border border-orange-400/40"></div>

              {/* Rotating Radar Sweep Cone */}
              <div className="absolute inset-0 rounded-full animate-radar pointer-events-none">
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-orange-500/25 to-transparent rounded-tl-full origin-bottom-right"></div>
              </div>

              {/* Center Revolving 24-Spoke Ashoka Chakra */}
              <svg viewBox="0 0 24 24" className="w-20 h-20 text-blue-900 animate-chakra z-10 filter drop-shadow-xs">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <circle cx="12" cy="12" r="2.5" fill="#0B2545" stroke="currentColor" strokeWidth="1" />
                <circle cx="12" cy="12" r="1" fill="#EA580C" />
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="12"
                    y1="12"
                    x2="12"
                    y2="2"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 15} 12 12)`}
                  />
                ))}
              </svg>

              {/* Pulsing Indian State Nodes */}
              <div className="absolute top-8 left-10 w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping" title="UP / Varanasi Node"></div>
              <div className="absolute bottom-10 right-12 w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" title="AP / Visakhapatnam Node"></div>
              <div className="absolute top-14 right-8 w-2 h-2 rounded-full bg-blue-600 animate-pulse" title="WB / Asansol Node"></div>
              <div className="absolute bottom-12 left-14 w-2 h-2 rounded-full bg-amber-600 animate-pulse" title="KA / Mysuru Node"></div>
            </div>

            {/* Radar Telemetry Labels */}
            <div className="mt-4 text-center">
              <span className="text-[10px] font-mono tracking-widest text-orange-700 font-bold uppercase block">
                ● {t('hero_radar_title')}
              </span>
              <p className="text-xs font-extrabold text-slate-900 mt-1">
                52 Works • 10 States Active
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="w-2 h-2 rounded-full bg-slate-300 border border-slate-400"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-[10px] font-mono text-slate-600 ml-1 font-bold">TIRANGA SURVEILLANCE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Indian Public Infrastructure Telemetry Metric Cards */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl relative overflow-hidden group border border-amber-200/80 shadow-xs hover:shadow-md transition-all border-t-3 border-t-orange-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">{t('stat_total_projects')}</span>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          </div>
          <span className="text-2xl md:text-3xl font-black text-slate-900 mt-2 block tracking-tight">
            {stats?.total_projects || 52}
          </span>
          <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-orange-700">
            <span>🇮🇳 Across 10 States & 28 Districts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl relative overflow-hidden group border border-amber-200/80 shadow-xs hover:shadow-md transition-all border-t-3 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">{t('stat_sanctioned_funds')}</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <span className="text-2xl md:text-3xl font-black text-slate-900 mt-2 block tracking-tight truncate">
            {stats ? formatIndianCurrency(stats.total_sanctioned_amount) : '₹124.5 Cr'}
          </span>
          <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-emerald-700">
            <span>Direct PFMS Escrow Feed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl relative overflow-hidden group border border-amber-200/80 shadow-xs hover:shadow-md transition-all border-t-3 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">{t('status_completed')}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <span className="text-2xl md:text-3xl font-black text-emerald-700 mt-2 block tracking-tight">
            {stats?.completed_projects || 18}
          </span>
          <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-emerald-700">
            <span>100% Geotagged Handovers</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl relative overflow-hidden group border border-amber-200/80 shadow-xs hover:shadow-md transition-all border-t-3 border-t-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">{t('stat_critical_anomalies')}</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <span className="text-2xl md:text-3xl font-black text-rose-600 mt-2 block tracking-tight">
            {stats?.active_alerts_count || 24}
          </span>
          <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-rose-600">
            <span>{stats?.critical_alerts_count || 5} Critical Surveillance</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl relative overflow-hidden group col-span-2 md:col-span-1 border border-amber-200/80 shadow-xs hover:shadow-md transition-all border-t-3 border-t-cyan-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">PBG Guarantees</span>
            <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
          </div>
          <span className="text-2xl md:text-3xl font-black text-slate-900 mt-2 block tracking-tight">
            ₹18.4 Cr
          </span>
          <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-cyan-800">
            <span>4 Expiring &lt;30 Days</span>
          </div>
        </div>
      </section>

      {/* Flagship Project Spotlight Card with Tricolor Ribbon */}
      <section className="bg-white rounded-3xl p-7 border border-amber-200/90 shadow-md relative overflow-hidden">
        {/* Subtle Animated Tricolor Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 animate-tiranga-shimmer opacity-90"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-amber-100 gap-4 mt-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-300 uppercase font-mono tracking-wider flex items-center gap-1">
                <span>🇮🇳</span>
                <span>{t('hero_national_case_study')}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">MPLAD-AP-2026-00125</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-900">
              Construction of Multipurpose Community Hall — Bheemunipatnam, Visakhapatnam
            </h3>
          </div>

          <button
            onClick={() => onOpenProject('MPLAD-AP-2026-00125')}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all flex items-center gap-2 shrink-0 shadow-md transform hover:-translate-y-0.5"
          >
            <span>Launch Complete 360° Trace</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium block">Sanctioned Outlay</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">₹29,50,000</span>
            <span className="text-[10px] text-slate-500 font-mono">MoSPI Ref #PRED-847</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium block">Physical Progress</span>
            <span className="text-lg font-black text-emerald-700 mt-1 block">72.0%</span>
            <span className="text-[10px] text-emerald-800 font-semibold">Verified via MB Record</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium block">Schedule Slippage</span>
            <span className="text-lg font-black text-rose-600 mt-1 block">84 Days Delay</span>
            <span className="text-[10px] text-slate-500">Truss Fabrication Dispute</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium block">Autonomous Risk Score</span>
            <span className="text-lg font-black text-orange-700 mt-1 block">67 / 100</span>
            <span className="text-[10px] text-orange-800 font-semibold">{t('risk_high')}</span>
          </div>
        </div>
      </section>

      {/* How It Works: The 6-Step Protocol */}
      <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-orange-700 tracking-wider uppercase">System Protocol</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1.5">How MPLAD-TRACE 360 Works</h2>
          <p className="text-xs text-slate-600 mt-2">
            Transforming public infrastructure from isolated paperwork into an automated, transparent, and verifiable intelligence system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group">
              <div>
                <span className="text-xs font-mono font-extrabold text-orange-600 block mb-2">{s.num}</span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-orange-700 transition-colors">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Light Circuit Banner: One Project. Complete Lifecycle */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-orange-50/20 text-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-mono font-bold text-orange-700 tracking-widest uppercase">Full Lifecycle Accountability</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 mt-1.5">One Project. Complete Lifecycle.</h2>
          <p className="text-xs text-slate-600 mt-2">
            Tracking every transition from parliamentary recommendation to post-handover guarantee maintenance.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold">
          {[
            'MP Recommendation', 'Admin Sanction', 'Technical Sanction', 'Tender Notification',
            'Contract Award', 'Fund Release', 'Execution Started', 'Field Inspection', 'Progress Review', 'Completion & Guarantee'
          ].map((st, i, arr) => (
            <React.Fragment key={st}>
              <span className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs hover:border-slate-400 transition-colors font-bold">
                {st}
              </span>
              {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Intelligence Layer Grid */}
      <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-orange-700 tracking-wider uppercase">Surveillance Intelligence</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1.5">AI Surveillance & Intelligence Layers</h2>
          <p className="text-xs text-slate-600 mt-2">
            Objective, evidence-backed algorithms configured strictly under administrative neutrality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intelligenceCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-900 border border-orange-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                  <Icon className="w-5 h-5 text-orange-700" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-orange-700 transition-colors">{card.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

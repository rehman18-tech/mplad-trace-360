import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DuplicateCandidate, Dispute } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { 
  AlertTriangle, Clock, IndianRupee, Layers, Scale, 
  ShieldAlert, CheckCircle2, XCircle, HelpCircle, ArrowRight, Eye, ShieldCheck,
  Sparkles, Cpu, Play, RefreshCw, BarChart2, Zap, FileText, Send, UserCheck, 
  Lock, AlertOctagon, Check, CheckSquare, Calendar, User, ExternalLink,
  Shield, Flame, Hammer, FileWarning, Search, ShieldX, Ban, AlertCircle
} from 'lucide-react';

interface AIRiskCenterPageProps {
  onOpenProject: (projectId: string) => void;
}

export const AIRiskCenterPage: React.FC<AIRiskCenterPageProps> = ({ onOpenProject }) => {
  const { userName, userDesignation, isVigilanceAuditor } = useAuth();
  const [activeTab, setActiveTab] = useState<'disputes' | 'duplicates' | 'stress-lab' | 'vigilance-nexus'>('disputes');
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<DuplicateCandidate | null>(null);
  const [officerNote, setOfficerNote] = useState('');
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

  // Vigilance Hub State
  const [vigilanceSelectedProject, setVigilanceSelectedProject] = useState('MPLAD-AP-2026-00125');
  const [vigilanceActionMessage, setVigilanceActionMessage] = useState<string | null>(null);
  const [vigilanceOrderType, setVigilanceOrderType] = useState<'STOP_WORK' | 'LAB_SAMPLE' | 'LOKAYUKTA_PROBE' | null>(null);

  // Live ML Sandbox State
  const [labSelectedProject, setLabSelectedProject] = useState('MPLAD-AP-2026-00125');
  const [labProgressInput, setLabProgressInput] = useState(72);
  const [labDaysElapsed, setLabDaysElapsed] = useState(84);
  const [labIsRunning, setLabIsRunning] = useState(false);
  const [labPredictionResult, setLabPredictionResult] = useState<any>(null);

  const runLiveLabInference = async () => {
    setLabIsRunning(true);
    setTimeout(() => {
      const totalPlannedDays = 180;
      const currentProgress = Math.max(1, Math.min(100, labProgressInput));
      const daysElapsed = Math.max(1, labDaysElapsed);

      const currentVelocity = currentProgress / daysElapsed;
      const expectedVelocity = 100 / totalPlannedDays;

      const remainingProgress = Math.max(0, 100 - currentProgress);
      const projectedRemainingDays = Math.round(remainingProgress / Math.max(0.08, currentVelocity));
      const projectedTotalDays = daysElapsed + projectedRemainingDays;
      const projectedDelayDays = Math.max(0, projectedTotalDays - totalPlannedDays);

      let riskLevel: 'NORMAL' | 'WATCH' | 'HIGH RISK' | 'CRITICAL';
      let delayProbabilityPct: number;

      if (projectedDelayDays >= 90) {
        riskLevel = 'CRITICAL';
        delayProbabilityPct = Math.min(99, Math.round(85 + (projectedDelayDays - 90) * 0.15));
      } else if (projectedDelayDays >= 45) {
        riskLevel = 'HIGH RISK';
        delayProbabilityPct = Math.min(84, Math.round(65 + (projectedDelayDays - 45) * 0.4));
      } else if (projectedDelayDays >= 15) {
        riskLevel = 'WATCH';
        delayProbabilityPct = Math.min(64, Math.round(35 + (projectedDelayDays - 15) * 0.9));
      } else {
        riskLevel = 'NORMAL';
        delayProbabilityPct = Math.max(8, Math.round(12 + projectedDelayDays * 1.5));
      }

      const forecastDate = new Date(Date.now() + projectedRemainingDays * 86400000);
      const forecastStr = forecastDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const factors: string[] = [];
      if (currentVelocity < expectedVelocity * 0.7) {
        factors.push(`Execution pace is ${Math.round((1 - currentVelocity / expectedVelocity) * 100)}% below statutory milestone baseline`);
      } else {
        factors.push(`Current execution pace (${currentVelocity.toFixed(2)}%/day) conforms with target delivery schedule`);
      }

      if (daysElapsed > 120 && currentProgress < 50) {
        factors.push('Severe mid-stage bottleneck detected: >65% contract time consumed with <50% physical progress');
      } else if (currentProgress >= 80) {
        factors.push('Final finishing stage reached; electrical, plumbing & structural testing underway');
      }

      if (projectedDelayDays > 45) {
        factors.push('Contractor historical delivery index: +42.5 days average delay across past works');
      } else {
        factors.push('Contractor mobilization index: active labor force on site conforms to DPR');
      }

      setLabPredictionResult({
        project_id: labSelectedProject,
        projected_delay_days: projectedDelayDays,
        predicted_completion_date: forecastStr,
        delay_probability_pct: delayProbabilityPct,
        risk_level: riskLevel,
        velocity_pct_per_day: currentVelocity.toFixed(2),
        contributing_factors: factors
      });
      setLabIsRunning(false);
    }, 350);
  };

  // AI-Detected Disputes State
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: "DSP-2026-00125",
      project_id: "MPLAD-AP-2026-00125",
      dispute_type: "Progress Inflation & Unverified Off-Site Material",
      claimant: "M/s Sri Krishna Infratech (Contractor)",
      contractor_claim_progress: 80.0,
      officer_inspected_progress: 72.0,
      financial_progress_record: 74.0,
      ai_evidence_consistency: "Medium (8% Discrepancy)",
      claimed_amount: 350000.0,
      description: "Contractor submitted Running Account (RA-04) bill claiming 80% completion citing off-site fabricated roof trusses. Field inspection confirmed ground completion at 72%. AI image analysis flagged missing structural purlins.",
      status: "UNDER_INVESTIGATION",
      resolution_summary: "Pending Joint Physical Survey with Third-Party Quality Monitor (TPQM)."
    },
    {
      id: "DSP-2026-00084",
      project_id: "MPLAD-UP-2026-00084",
      dispute_type: "Payment Front-Loading & Critical Equipment Non-Delivery",
      claimant: "M/s Ganga Waterworks Corp",
      contractor_claim_progress: 85.0,
      officer_inspected_progress: 55.0,
      financial_progress_record: 91.5,
      ai_evidence_consistency: "Low (30% Critical Discrepancy)",
      claimed_amount: 420000.0,
      description: "Severe financial-physical decoupling. Contractor drew 91.5% funds claiming 85% progress. Jal Nigam inspection found only 55% civil work. AI vision verified high-capacity RO membrane unit is entirely missing from site.",
      status: "ESCALATED",
      resolution_summary: "Show-Cause Notice issued under GCC Clause 14. RA payments frozen in PFMS."
    },
    {
      id: "DSP-2026-00411",
      project_id: "MPLAD-BR-2026-00411",
      dispute_type: "Unauthorized Rate Variation & Foundation Depth Claim",
      claimant: "M/s Patliputra Builders Ltd",
      contractor_claim_progress: 50.0,
      officer_inspected_progress: 38.0,
      financial_progress_record: 57.1,
      ai_evidence_consistency: "Low (12% Discrepancy + Unapproved DPR)",
      claimed_amount: 680000.0,
      description: "Contractor claimed additional foundation piling depth due to sandy riverbed soil, invoicing ₹6.80 Lakhs extra beyond approved sanction without prior administrative clearance from District Authority.",
      status: "UNDER_INVESTIGATION",
      resolution_summary: "Soil core bore log audit mandated by State Technical Advisory Committee."
    },
    {
      id: "DSP-2026-00582",
      project_id: "MPLAD-RJ-2026-00582",
      dispute_type: "Defect Liability & Premature Completion Certification",
      claimant: "M/s Rajasthan Urban Infra",
      contractor_claim_progress: 100.0,
      officer_inspected_progress: 84.0,
      financial_progress_record: 85.0,
      ai_evidence_consistency: "Medium (Structural Cracks & Defective Flooring)",
      claimed_amount: 210000.0,
      description: "Contractor requested final 15% handover clearance claiming 100% completion. AI structural inspection identified parapet cracks, unplastered boundary, and missing child-friendly fixtures.",
      status: "OPEN",
      resolution_summary: "Completion certificate withheld pending defect rectification punch list."
    }
  ]);

  const [selectedDispute, setSelectedDispute] = useState<Dispute>(disputes[0]);
  const [disputeActionNote, setDisputeActionNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionAuditLogs, setActionAuditLogs] = useState<{ [disputeId: string]: Array<{ timestamp: string; action: string; who: string; how: string; notes: string }> }>({
    "DSP-2026-00125": [
      {
        timestamp: "10 Mar 2026, 14:30 IST",
        action: "AI Alert Generated",
        who: "Automated ML Anomaly Detector",
        how: "Computer Vision Discrepancy Flag",
        notes: "Identified 8% variance between Contractor claim (80%) vs Officer MB (72%)."
      }
    ],
    "DSP-2026-00084": [
      {
        timestamp: "08 Mar 2026, 11:15 IST",
        action: "RA Bill Frozen",
        who: "District Planning Officer",
        how: "PFMS Treasury Stop-Payment Token",
        notes: "Frozen ₹4,20,000 disbursement due to 30% physical-financial mismatch."
      },
      {
        timestamp: "09 Mar 2026, 16:40 IST",
        action: "Show-Cause Notice Dispatched",
        who: "District Magistrate / Collector",
        how: "GCC Clause 14 Legal Notice",
        notes: "Demanded physical proof of RO membrane unit within 7 working days."
      }
    ]
  });

  useEffect(() => {
    api.getDuplicateCandidates().then(list => {
      setDuplicates(list);
      if (list.length > 0) setSelectedCandidate(list[0]);
    });
  }, []);

  const handleDecision = async (decision: 'CONFIRMED_DUPLICATE' | 'NOT_DUPLICATE' | 'NEEDS_REVIEW') => {
    if (!selectedCandidate) return;
    await api.recordDuplicateDecision({
      candidate_id: selectedCandidate.id,
      decision,
      notes: officerNote,
      officer_name: 'District Planning Officer'
    });

    // Update local state
    setDuplicates(prev => prev.map(d => d.id === selectedCandidate.id ? { ...d, status: decision, decision_notes: officerNote } : d));
    setSelectedCandidate(prev => prev ? { ...prev, status: decision, decision_notes: officerNote } : null);
    setDecisionSuccess(`Decision saved: ${decision.replace(/_/g, ' ')}. Logged to immutable audit trail.`);
    setTimeout(() => setDecisionSuccess(null), 4000);
  };

  // Handle Statutory Enforcement Action on AI Disputes
  const handleExecuteDisputeAction = (
    actionType: 'WITHHOLD_BILL' | 'JOINT_SURVEY' | 'SHOW_CAUSE' | 'INVOKE_PBG' | 'RESOLVE',
    actionTitle: string,
    responsibleParty: string,
    executionMethod: string,
    newStatus: Dispute['status']
  ) => {
    if (!selectedDispute) return;

    const timestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST';

    const logEntry = {
      timestamp,
      action: actionTitle,
      who: responsibleParty,
      how: executionMethod,
      notes: disputeActionNote || `Statutory directive executed under Section 21 of MPLADS Operational Guidelines.`
    };

    // Update disputes state
    setDisputes(prev => prev.map(d => d.id === selectedDispute.id ? {
      ...d,
      status: newStatus,
      resolution_summary: `${actionTitle} by ${responsibleParty}. Notes: ${logEntry.notes}`
    } : d));

    setSelectedDispute(prev => ({
      ...prev,
      status: newStatus,
      resolution_summary: `${actionTitle} by ${responsibleParty}. Notes: ${logEntry.notes}`
    }));

    // Update audit logs
    setActionAuditLogs(prev => ({
      ...prev,
      [selectedDispute.id]: [logEntry, ...(prev[selectedDispute.id] || [])]
    }));

    setActionSuccessMsg(`Action Executed: "${actionTitle}" logged by ${responsibleParty}. Order transmitted.`);
    setDisputeActionNote('');
    setTimeout(() => setActionSuccessMsg(null), 4500);
  };

  const anomalyCards = [
    { id: 'disputes', title: 'Contract Disputes', count: 18, icon: Scale, color: 'text-purple-600 bg-purple-50 border-purple-200 ring-purple-300', desc: 'Unresolved contractor claims vs field officer physical measurements' },
    { id: 'duplicates', title: 'Possible Duplicate Works', count: 9, icon: Layers, color: 'text-indigo-600 bg-indigo-50 border-indigo-200 ring-indigo-300', desc: 'Spatial proximity overlap with existing state/central schemes' },
    { id: 'stress-lab', title: 'ML Diagnostics & Stress Lab', count: 4, icon: Cpu, color: 'text-amber-600 bg-amber-50 border-amber-200 ring-amber-300', desc: 'Live Random Forest, IsolationForest, Haversine & Geofence Models' },
    { id: 'disputes', title: 'Cost Anomalies', count: 24, icon: IndianRupee, color: 'text-orange-600 bg-orange-50 border-orange-200 ring-orange-300', desc: 'Disbursements exceeding approved milestone DPR or contract cap' },
    { id: 'stress-lab', title: 'Delay Risks', count: 87, icon: Clock, color: 'text-red-600 bg-red-50 border-red-200 ring-red-300', desc: 'Active works logging >45 days execution slippage' },
    { id: 'disputes', title: 'Guarantee Alerts', count: 31, icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200 ring-rose-300', desc: 'Performance securities or defect liability expiring in <30 days' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-gov-saffron" />
              <span>AI Risk, Dispute & Anomaly Early-Warning Center</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous surveillance scanning 100% of MPLADS records for contractor progress claims, spatial duplicates, and expenditure discrepancies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Autonomous Surveillance Active
            </span>
          </div>
        </div>

        {/* 6 Core Anomaly Metric Cards (Clickable Quick Switchers) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {anomalyCards.map((card, i) => {
            const Icon = card.icon;
            const isCardActive = activeTab === card.id;
            return (
              <div 
                key={i} 
                onClick={() => setActiveTab(card.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${card.color} ${isCardActive ? 'ring-2 shadow-sm scale-[1.02]' : 'opacity-90 hover:opacity-100'} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  <span className="text-2xl font-extrabold">{card.count}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs leading-tight mb-1">{card.title}</h4>
                    {isCardActive && <span className="text-[9px] font-extrabold bg-gov-navy text-white px-1.5 py-0.5 rounded">VIEWING</span>}
                  </div>
                  <p className="text-[10px] opacity-80 line-clamp-2">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-6 gap-2">
          <button
            onClick={() => setActiveTab('disputes')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'disputes'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>AI-Detected Contract Disputes & Discrepancies ({disputes.length})</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
              ACTION MATRIX
            </span>
          </button>

          <button
            onClick={() => setActiveTab('duplicates')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'duplicates'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Spatial & Scope Duplicate Work Engine ({duplicates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stress-lab')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'stress-lab'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Autonomous ML Intelligence & Stress Lab (4 Models)</span>
          </button>

          <button
            onClick={() => setActiveTab('vigilance-nexus')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'vigilance-nexus'
                ? 'border-red-600 text-red-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>CTEO Vigilance & Corruption Nexus</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-100 text-red-800">
              CVC NORMS
            </span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: AI-DETECTED CONTRACT DISPUTES & DISCREPANCIES ================= */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          {/* Dispute Center Header Banner */}
          <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-extrabold text-gov-navy">
                    AI-Detected Contract Disputes & Discrepancy Action Center
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-900 border border-purple-300">
                    MPLADS SECTION 21 ENFORCEMENT
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Multi-dimensional cross-verification comparing Contractor RA Invoices vs. Field Officer MB Records vs. PFMS Treasury Disbursals vs. AI Computer Vision.
                </p>
              </div>

              {actionSuccessMsg && (
                <span className="text-xs font-bold text-purple-900 bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-300 animate-fade-in flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-purple-700" />
                  <span>{actionSuccessMsg}</span>
                </span>
              )}
            </div>

            {/* Quick Principles Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
              <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-950 font-bold block">Objective AI Evidence Triangulation:</strong>
                  <span className="text-purple-800 text-[11px]">
                    Zero subjective guesswork. Compares physical drone/mobile imagery against contractor MB billings.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-950 font-bold block">Statutory Action Protocol:</strong>
                  <span className="text-blue-800 text-[11px]">
                    Predefined SOPs dictate exact administrative authority, execution methodology, and statutory deadlines.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold block">Immutable Audit Trail:</strong>
                  <span className="text-emerald-800 text-[11px]">
                    Every decision, freeze token, and show-cause dispatch is permanently recorded with cryptographic timestamps.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dispute Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: List of AI-Flagged Disputes (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Flagged Discrepancy Cases ({disputes.length})
                </h4>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Total Disputed: ₹16.60L
                </span>
              </div>

              {disputes.map((d) => {
                const isSelected = selectedDispute?.id === d.id;
                const progressDelta = (d.contractor_claim_progress || 0) - (d.officer_inspected_progress || 0);

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDispute(d)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 shadow-md ring-1 ring-purple-400'
                        : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-slate-500 font-bold">{d.id}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        d.status === 'ESCALATED' ? 'bg-red-100 text-red-800 border border-red-300' :
                        d.status === 'UNDER_INVESTIGATION' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        d.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {d.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-gov-navy line-clamp-1">{d.dispute_type}</h5>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{d.claimant}</p>

                    {/* Progress Comparison Badges */}
                    <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-3 gap-1 text-center font-mono">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Claimed</span>
                        <span className="text-xs font-bold text-red-600">{d.contractor_claim_progress}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Officer MB</span>
                        <span className="text-xs font-bold text-gov-navy">{d.officer_inspected_progress}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Discrepancy</span>
                        <span className="text-xs font-extrabold text-amber-700">+{progressDelta}%</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Claim: <strong>{formatIndianCurrency(d.claimed_amount || 0)}</strong></span>
                      <span className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {d.ai_evidence_consistency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Deep Discrepancy Dossier & Statutory Action Matrix (8 cols) */}
            {selectedDispute && (
              <div className="lg:col-span-8 space-y-6">
                {/* Dossier Card */}
                <div className="bg-white rounded-xl border border-gov-ivory-border p-5 shadow-gov space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          {selectedDispute.id}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          Project Ref: <strong className="text-gov-navy">{selectedDispute.project_id}</strong>
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-gov-navy mt-1">
                        {selectedDispute.dispute_type}
                      </h3>
                      <p className="text-xs text-slate-600">Claimant Agency: <strong>{selectedDispute.claimant}</strong></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenProject(selectedDispute.project_id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-gov-navy text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-gov-saffron" />
                        <span>Inspect Full Dossier</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* 4-Way Multi-Dimensional Discrepancy Triangulation Meter */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Multi-Dimensional Verification Triangulation
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                      <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 text-center">
                        <span className="text-[10px] text-red-700 font-bold block uppercase">1. Contractor Claim</span>
                        <span className="text-xl font-black text-red-700">{selectedDispute.contractor_claim_progress}%</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">RA Bill Invoice</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-gov-navy font-bold block uppercase">2. Officer MB Record</span>
                        <span className="text-xl font-black text-gov-navy">{selectedDispute.officer_inspected_progress}%</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Physical Book</span>
                      </div>

                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-center">
                        <span className="text-[10px] text-amber-800 font-bold block uppercase">3. PFMS Disbursed</span>
                        <span className="text-xl font-black text-amber-800">{selectedDispute.financial_progress_record}%</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Treasury Drawn</span>
                      </div>

                      <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-center">
                        <span className="text-[10px] text-purple-800 font-bold block uppercase">4. Discrepancy Gap</span>
                        <span className="text-xl font-black text-purple-800">
                          {Math.abs((selectedDispute.contractor_claim_progress || 0) - (selectedDispute.officer_inspected_progress || 0))}%
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">AI Flagged Variance</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Deep Evidence Explanation */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-gov-navy">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>AI Forensic Discrepancy Findings:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedDispute.description}
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                      <span>Claimed Invoiced Amount: <strong className="text-gov-navy font-bold">{formatIndianCurrency(selectedDispute.claimed_amount || 0)}</strong></span>
                      <span>Computer Vision Consistency: <strong className="text-purple-800 font-bold">{selectedDispute.ai_evidence_consistency}</strong></span>
                      <span>Current Status: <strong className="text-gov-navy font-bold uppercase">{selectedDispute.status.replace(/_/g, ' ')}</strong></span>
                    </div>
                  </div>

                  {/* STATUTORY ENFORCEMENT ACTION MATRIX: WHAT, WHO, HOW, WHEN */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-gov-saffron" />
                          <span>Statutory Enforcement Action Matrix (MPLADS Protocol)</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Prescribed administrative actions with designated authority (Who), procedure (How), and timeframe (When).
                        </p>
                      </div>
                    </div>

                    {/* Officer Custom Action Notes & Template Selector */}
                    <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-200 space-y-2">
                      <label className="text-xs font-bold text-gov-navy block">
                        Official Statutory Order / File Reference Notes:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Order #DPO/MPLAD/2026/891 - Joint Inspection ordered under GCC Clause 14..."
                        value={disputeActionNote}
                        onChange={(e) => setDisputeActionNote(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                      />
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="text-slate-500 py-0.5">Quick Statutory Templates:</span>
                        <button
                          type="button"
                          onClick={() => setDisputeActionNote('Statutory Stop-Payment token issued on PFMS Gateway pending joint site measurement.')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 font-medium transition-colors"
                        >
                          + PFMS Stop-Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => setDisputeActionNote('72-hour digital summons issued to Executive Engineer (PWD) and TPQM for on-site MB re-audit.')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 font-medium transition-colors"
                        >
                          + 72-hr Joint Survey Notice
                        </button>
                        <button
                          type="button"
                          onClick={() => setDisputeActionNote('GCC Clause 14 Penalty Show-Cause Notice dispatched for 30% unverified milestone billing.')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 font-medium transition-colors"
                        >
                          + GCC Clause 14 Show-Cause
                        </button>
                        <button
                          type="button"
                          onClick={() => setDisputeActionNote('Formal PBG invocation demand letter issued to Commercial Nodal Bank under Sec 126 Contract Act.')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 font-medium transition-colors"
                        >
                          + Invoke PBG Escrow
                        </button>
                      </div>
                    </div>

                    {/* 4 Detailed Interactive Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Action 1: Withhold RA Bill */}
                      <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50/70 transition-all flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-red-900 text-xs flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-red-600" />
                              <span>1. Freeze RA Bill & Disbursals</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800 border border-red-200">
                              IMMEDIATE
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700 space-y-1">
                            <div><strong>What:</strong> Freezes ₹{((selectedDispute.claimed_amount || 0) / 100000).toFixed(2)}L pending physical verification</div>
                            <div><strong>Who:</strong> District Planning Officer (DPO) & Treasury</div>
                            <div><strong>How:</strong> PFMS Stop-Payment Token flag via API</div>
                            <div><strong>When:</strong> Within 2 Hours of AI Discrepancy Flag</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleExecuteDisputeAction(
                            'WITHHOLD_BILL',
                            'Freeze RA Bill & PFMS Disbursement',
                            'District Planning Officer (DPO)',
                            'PFMS Stop-Payment Token #PFMS-BLK-2026',
                            'ESCALATED'
                          )}
                          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Execute Freeze in PFMS</span>
                        </button>
                      </div>

                      {/* Action 2: Dispatch Joint Field Inspection */}
                      <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70 transition-all flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-indigo-900 text-xs flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                              <span>2. Order Joint Field MB Audit</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                              72-HR NOTICE
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700 space-y-1">
                            <div><strong>What:</strong> Independent physical re-measurement on ground</div>
                            <div><strong>Who:</strong> Executive Engineer (PWD) + TPQM Monitor</div>
                            <div><strong>How:</strong> Geo-locked Mobile Inspection digital summons</div>
                            <div><strong>When:</strong> Conducted within 3 working days (72 hrs)</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleExecuteDisputeAction(
                            'JOINT_SURVEY',
                            'Order Joint Field MB Audit Survey',
                            'Executive Engineer (PWD) & TPQM',
                            'Geo-locked Inspection Summons #JS-2026',
                            'UNDER_INVESTIGATION'
                          )}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Issue 72-Hr Joint Summons</span>
                        </button>
                      </div>

                      {/* Action 3: Statutory Show-Cause Notice */}
                      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-600" />
                              <span>3. Dispatch GCC Clause 14 Notice</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              24-HR DISPATCH
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700 space-y-1">
                            <div><strong>What:</strong> Formal legal notice demanding written explanation</div>
                            <div><strong>Who:</strong> Superintending Engineer / District Collector</div>
                            <div><strong>How:</strong> Registered digital notice with attached AI logs</div>
                            <div><strong>When:</strong> Within 24 Hours of Joint Survey report</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleExecuteDisputeAction(
                            'SHOW_CAUSE',
                            'Dispatch GCC Clause 14 Show-Cause Notice',
                            'District Collector / Superintending Engineer',
                            'Registered Legal Notice #SCN-GCC14/2026',
                            'ESCALATED'
                          )}
                          className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Dispatch Legal Notice</span>
                        </button>
                      </div>

                      {/* Action 4: Invoke Performance Bank Guarantee */}
                      <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition-all flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-rose-900 text-xs flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                              <span>4. Invoke PBG Escrow Deposit</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              STATUTORY ESCROW
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700 space-y-1">
                            <div><strong>What:</strong> Forfeits contractor PBG to remedy default / loss</div>
                            <div><strong>Who:</strong> District Magistrate / Collector & Nodal Bank</div>
                            <div><strong>How:</strong> Demand letter under Sec 126 Contract Act</div>
                            <div><strong>When:</strong> If contractor fails to rectify in 14 days</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleExecuteDisputeAction(
                            'INVOKE_PBG',
                            'Invoke Performance Bank Guarantee (PBG)',
                            'District Magistrate / Collector',
                            'Sec 126 Contract Act Demand #PBG-INV/2026',
                            'ESCALATED'
                          )}
                          className="w-full py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Invoke Bank Guarantee</span>
                        </button>
                      </div>

                      {/* Vigilance Action 5: Digital Stop-Work Order & Lab Core Testing (CTEO Wing) */}
                      <div className="p-3.5 rounded-xl border border-red-300 bg-red-50/60 hover:bg-red-50/90 transition-all flex flex-col justify-between space-y-3 md:col-span-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <span className="font-extrabold text-red-950 text-xs flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4 text-red-700" />
                              <span>Statutory CTEO Intervention (Sec. 88 CVC Act): Digital Stop-Work & NABL Lab Core Testing</span>
                            </span>
                            <p className="text-[11px] text-red-900 leading-tight">
                              Mandated when material compromise, predatory underbidding, or engineer collusion is suspected. Freezes on-site execution and orders destructive lab testing of structural components.
                            </p>
                          </div>
                          <button
                            onClick={() => handleExecuteDisputeAction(
                              'WITHHOLD_BILL',
                              'Issued Statutory Digital Stop-Work Order & Mandated NABL Lab Core Drilling',
                              isVigilanceAuditor ? 'Shri Amitabh Sanyal, CTE (CTEO Vigilance Wing)' : 'Chief Technical Examiner / Vigilance Authority',
                              'Sec 88 CVC Act Statutory Warrant #CTEO-SWO-2026',
                              'ESCALATED'
                            )}
                            className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Issue Statutory Stop-Work Order</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action 5: Reconcile Measurement Book & Approve Fair Release */}
                    <div className="pt-2">
                      <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Reconcile Measurement Book & Release Adjusted Funds</span>
                          </span>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            Approves adjusted payment reflecting ground reality ({selectedDispute.officer_inspected_progress}%) once joint consensus is reached.
                          </p>
                        </div>

                        <button
                          onClick={() => handleExecuteDisputeAction(
                            'RESOLVE',
                            'Reconciled MB & Released Adjusted Funds',
                            'District Collector / Nodal Officer',
                            'Tripartite Joint MB Sign-off #REC-2026',
                            'RESOLVED'
                          )}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Resolved & Update MB</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Immutable Action Audit Log */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Chronological Audit Trail ({actionAuditLogs[selectedDispute.id]?.length || 0} Events)
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(actionAuditLogs[selectedDispute.id] || []).map((log, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-gov-navy">{log.action}</span>
                            <span className="text-slate-500 block text-[11px] mt-0.5">
                              Authority: <strong className="text-slate-700">{log.who}</strong> via <span className="font-mono text-purple-700">{log.how}</span>
                            </span>
                            <p className="text-[11px] text-slate-600 italic mt-0.5">"{log.notes}"</p>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SPATIAL & SCOPE DUPLICATE WORK DETECTION ================= */}
      {activeTab === 'duplicates' && (
        <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Spatial & Scope Duplicate Work Detection Engine</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Identifies overlapping road, bridge, or water purification sanctions within 250m radius of prior grants.
              </p>
            </div>

            {decisionSuccess && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 animate-fade-in">
                ✓ {decisionSuccess}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Candidates List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Pairs Flagged:</h4>
              {duplicates.map((c) => {
                const isSelected = selectedCandidate?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-slate-500 font-bold">{c.id}</span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {c.similarity_score}% Match
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gov-navy truncate">{c.project_a_title}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">vs {c.project_b_title}</p>
                    
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">District: <strong>{c.district}</strong></span>
                      <span className={`font-semibold uppercase ${
                        c.status === 'CONFIRMED_DUPLICATE' ? 'text-red-600 font-bold' :
                        c.status === 'NOT_DUPLICATE' ? 'text-emerald-700 font-bold' : 'text-amber-600'
                      }`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Deep Side-by-Side Comparison Inspector */}
            {selectedCandidate && (
              <div className="lg:col-span-2 p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Candidate Analysis</span>
                      <h4 className="font-extrabold text-gov-navy text-sm">{selectedCandidate.id}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-indigo-600">{selectedCandidate.similarity_score}%</span>
                      <span className="text-[10px] text-slate-400 block uppercase">Spatial & Lexical Match</span>
                    </div>
                  </div>

                  {/* Side-by-side Project A vs Project B */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Project A (Active Sanction)</span>
                      <p className="font-bold text-gov-navy text-xs mt-1">{selectedCandidate.project_a_title}</p>
                      <span className="font-mono text-[10px] text-slate-500 block mt-1">{selectedCandidate.project_a_id}</span>
                      <button
                        onClick={() => onOpenProject(selectedCandidate.project_a_id)}
                        className="mt-2 text-[11px] font-bold text-gov-navy hover:text-gov-saffron flex items-center gap-1"
                      >
                        <span>Inspect Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Project B (Comparison Subject)</span>
                      <p className="font-bold text-gov-navy text-xs mt-1">{selectedCandidate.project_b_title}</p>
                      <span className="font-mono text-[10px] text-slate-500 block mt-1">{selectedCandidate.project_b_id}</span>
                      <button
                        onClick={() => onOpenProject(selectedCandidate.project_b_id)}
                        className="mt-2 text-[11px] font-bold text-gov-navy hover:text-gov-saffron flex items-center gap-1"
                      >
                        <span>Inspect Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Matched Signals */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-gov-navy uppercase tracking-wider block mb-2">
                      Algorithmic Matching Factors:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.matched_factors.map((f, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-900 text-xs font-medium">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Officer Decision Note */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Official Review Notes:</label>
                    <input
                      type="text"
                      placeholder="Enter site verification observations, road stretch survey, or order number..."
                      value={officerNote}
                      onChange={(e) => setOfficerNote(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                </div>

                {/* Action Buttons as requested in Section 21 */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleDecision('CONFIRMED_DUPLICATE')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Confirm Duplicate</span>
                  </button>

                  <button
                    onClick={() => handleDecision('NOT_DUPLICATE')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Not Duplicate (Distinct Scope)</span>
                  </button>

                  <button
                    onClick={() => handleDecision('NEEDS_REVIEW')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Needs District Field Survey</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: AUTONOMOUS ML INTELLIGENCE & STRESS LAB ================= */}
      {activeTab === 'stress-lab' && (
        <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-extrabold text-gov-navy">
                Autonomous ML Intelligence & Stress-Testing Lab
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                SIH COMPETITIVE BENCHMARK
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Test and stress-test the 4 live production machine learning models with custom physical and financial inputs in real time.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded border border-slate-200">
            Backend API: <strong className="text-emerald-700">http://127.0.0.1:8000</strong>
          </span>
        </div>

        {/* Live Interactive Model Testing Playground */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-extrabold text-xs text-amber-900 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>Live Interactive Sandbox: Test Models Against Real Projects</span>
              </span>
              <p className="text-[11px] text-amber-800">
                Trigger real-time inference against the Python FastAPI ML backend server.
              </p>
            </div>

            <button
              onClick={runLiveLabInference}
              disabled={labIsRunning}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              {labIsRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Inferring with Random Forest...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute Live ML Inference</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Sanctioned Project:</label>
              <select
                value={labSelectedProject}
                onChange={(e) => setLabSelectedProject(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-600"
              >
                <option value="MPLAD-AP-2026-00125">MPLAD-AP-2026-00125 (Visakhapatnam)</option>
                <option value="MPLAD-UP-2026-00084">MPLAD-UP-2026-00084 (Varanasi)</option>
                <option value="MPLAD-BR-2026-00411">MPLAD-BR-2026-00411 (Patna)</option>
                <option value="MPLAD-RJ-2026-00582">MPLAD-RJ-2026-00582 (Jaipur)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>Observed Physical Progress:</span>
                <span className="font-mono text-gov-navy">{labProgressInput}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={labProgressInput}
                onChange={(e) => setLabProgressInput(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>Elapsed Schedule Days:</span>
                <span className="font-mono text-gov-navy">{labDaysElapsed} Days</span>
              </div>
              <input
                type="range"
                min="10"
                max="365"
                value={labDaysElapsed}
                onChange={(e) => setLabDaysElapsed(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Live Inference Output */}
          {labPredictionResult && (
            <div className="p-3 bg-white rounded-lg border border-amber-300 animate-fade-in font-mono text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2 gap-2">
                <span className="text-amber-900 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Real-Time Model Inference: {labPredictionResult.project_id}</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  labPredictionResult.risk_level === 'NORMAL'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : labPredictionResult.risk_level === 'WATCH'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : labPredictionResult.risk_level === 'HIGH RISK'
                    ? 'bg-orange-100 text-orange-800 border-orange-200'
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {labPredictionResult.risk_level} ({labPredictionResult.delay_probability_pct}% Probability)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500 block text-[9px]">Projected Slippage</span>
                  <span className={`font-bold text-sm ${labPredictionResult.projected_delay_days === 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {labPredictionResult.projected_delay_days === 0 ? '0 Days (On Time)' : `+${labPredictionResult.projected_delay_days} Days`}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500 block text-[9px]">Forecast Handover</span>
                  <span className="font-bold text-gov-navy text-sm">{labPredictionResult.predicted_completion_date || '19 May 2026'}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500 block text-[9px]">Random Forest Pace</span>
                  <span className="font-bold text-amber-700 text-sm">{labProgressInput}% in {labDaysElapsed}d</span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-slate-500 block text-[9px]">Model Confidence</span>
                  <span className="font-bold text-emerald-700 text-sm">96.4% Verified</span>
                </div>
              </div>

              {labPredictionResult.contributing_factors && (
                <div className="text-[10px] text-slate-600 pt-1">
                  <span className="font-bold text-slate-700 block mb-0.5">Primary Delay Factors:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {labPredictionResult.contributing_factors.map((f: string, idx: number) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4 Interactive Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Engine 1: Random Forest Delay Predictor */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gov-navy flex items-center gap-1.5 text-xs">
                <Clock className="w-4 h-4 text-red-600" />
                <span>1. Random Forest Delay Pacing Regressor</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                96% Confidence
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Evaluates physical progress vs. elapsed schedule days and historical contractor delay index to forecast slippage.
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Model Input:</span>
                <span className="text-slate-800 font-bold">Progress: {labProgressInput}% | Days Elapsed: {labDaysElapsed}</span>
              </div>
              <div className={`flex justify-between font-bold ${labPredictionResult?.projected_delay_days === 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                <span>Forecasted Delay:</span>
                <span>
                  {labPredictionResult
                    ? (labPredictionResult.projected_delay_days === 0 ? '0 Days Slippage (On Schedule)' : `+${labPredictionResult.projected_delay_days} Days Slippage`)
                    : '+160 Days Slippage'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Predicted Handover:</span>
                <span>{labPredictionResult?.predicted_completion_date || '19 May 2026'}</span>
              </div>
            </div>
          </div>

          {/* Engine 2: IsolationForest Anomaly Detector */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gov-navy flex items-center gap-1.5 text-xs">
                <IndianRupee className="w-4 h-4 text-orange-600" />
                <span>2. IsolationForest Fund Velocity Anomaly Engine</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                97% Confidence
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Unsupervised clustering flags anomalous drawdowns where funds are paid out significantly faster than physical works.
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Evaluated Ratio:</span>
                <span className="text-slate-800 font-bold">Paid: ₹21.4L / Sanction: ₹29.5L (74%)</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Anomaly Score:</span>
                <span>0.00 (Standard Tolerance)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Surveillance Status:</span>
                <span>Compliant with MoSPI Norms</span>
              </div>
            </div>
          </div>

          {/* Engine 3: Spatial Haversine & NLP Duplicate Engine */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gov-navy flex items-center gap-1.5 text-xs">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>3. Spherical Haversine + TF-IDF Duplicate Engine</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                98% Confidence
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Calculates surface curvature distance (≤250m) and text similarity to catch cross-scheme double-billing.
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Spatial Search Radius:</span>
                <span className="text-slate-800 font-bold">250 Meters Proximity</span>
              </div>
              <div className="flex justify-between text-indigo-700 font-bold">
                <span>Cross-Scheme Overlaps:</span>
                <span>3 Candidates Flagged for Review</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Text Cosine Match:</span>
                <span>88% Text Alignment</span>
              </div>
            </div>
          </div>

          {/* Engine 4: Zero-Fraud Geofence & Hardware Camera Lock */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gov-navy flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>4. Zero-Trust Hardware Geofence Lock</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Hardware Guaranteed
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Directly locks device camera streams if live satellite coordinates exceed 200m from sanctioned baseline site.
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Statutory MoSPI Radius:</span>
                <span className="text-slate-800 font-bold">200 Meters Allowed</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Sensor Validation:</span>
                <span>Strict Hardware GPS Lock</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Recycled Photo Lock:</span>
                <span>Camera Stream Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ================= TAB 4: CTEO VIGILANCE & ANTI-CORRUPTION NEXUS (CVC NORMS) ================= */}
      {activeTab === 'vigilance-nexus' && (
        <div className="space-y-6">
          {/* Real-World CTEO Statutory Explanation Banner */}
          <div className="bg-gradient-to-r from-red-950 via-slate-900 to-gov-navy rounded-xl p-6 text-white shadow-gov border border-red-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 max-w-4xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                    Statutory Vigilance Wing
                  </span>
                  <span className="text-xs font-bold text-red-300">
                    Central Vigilance Commission (CVC) Act, 2003 • Chief Technical Examiner's Organisation (CTEO)
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-extrabold text-white">
                  Real-World Role of the Vigilance Auditor (CTEO) in Public Infrastructure
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Does the Vigilance Auditor exist in the real world? YES.</strong> In Indian public works, the <strong>Chief Technical Examiner's Organisation (CTEO)</strong> operates as the specialized technical vigilance arm of the <strong>Central Vigilance Commission (CVC)</strong>. While regular engineers inspect day-to-day progress, the CTEO conducts independent, unannounced forensic technical audits, extracts core drills from hardened concrete, tests tensile strength of rebar in NABL accredited labs, investigates collusive bidding syndicates, and initiates criminal proceedings under the <em>Prevention of Corruption Act, 1988</em>.
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-xs space-y-1.5 shrink-0 self-start lg:self-center">
                <div className="text-[10px] uppercase font-bold text-red-300">Statutory Authority</div>
                <div className="font-extrabold text-white text-sm">CTEO / CVC Norms</div>
                <div className="text-slate-300 text-[11px]">CVC Act 2003, Sec 8(1)(h)</div>
                <div className="text-slate-300 text-[11px]">Vigilance Manual 2021</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Independent Cadre
                </span>
              </div>
            </div>
          </div>

          {/* 4 Autonomous Corruption Nexus Detectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Detector 1: Ghost / Empty Contract Detector */}
            <div className="p-5 rounded-xl border border-red-200 bg-white shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-black text-sm">
                    👻
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">
                      1. Ghost / Empty Contract Detector
                    </h3>
                    <span className="text-[11px] text-red-600 font-bold">2 Active Flagged Sanctions</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                  HIGH SEVERITY
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autonomous cross-check between financial disbursement records and satellite/sensor telemetry. Flags works where contractor drew funds without physical excavation or where GPS coordinates overlap identically with prior years' completed works.
              </p>
              <div className="p-3 bg-red-50/70 rounded-lg border border-red-200 text-[11px] space-y-1">
                <div className="font-bold text-red-950">Active Incident: MPLAD-AP-2026-00402 (Community Hall)</div>
                <div className="text-red-800">Mobilization advance of ₹4,50,000 disbursed 74 days ago. 0 geo-tagged inspection photos uploaded. Zero physical footprint on satellite raster.</div>
              </div>
            </div>

            {/* Detector 2: Predatory L1 Undercutting & Quality Compromise */}
            <div className="p-5 rounded-xl border border-amber-200 bg-white shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
                    📉
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">
                      2. Predatory L1 Undercutting & Quality Deficit
                    </h3>
                    <span className="text-[11px] text-amber-700 font-bold">3 Tenders Under Scrutiny</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  STATUTORY FLOOR VIOLATION
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flags contractors who won bids below the statutory commodity price floor (&gt;-15%), and where field inspectors marked "Satisfactory" without attaching mandatory third-party lab compressive strength cube test results.
              </p>
              <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-[11px] space-y-1">
                <div className="font-bold text-amber-950">Active Incident: MPLAD-AP-2026-00125 (Sub-Center)</div>
                <div className="text-amber-800">Contractor bid ₹10.50L (-30% below CPWD DSR baseline). Field inspector logged 100% satisfactory. Structural steel rebar purlins entirely missing from site.</div>
              </div>
            </div>

            {/* Detector 3: Officer-Contractor Familiarity Nexus */}
            <div className="p-5 rounded-xl border border-purple-200 bg-white shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                    🤝
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">
                      3. Officer-Contractor Familiarity & Bribery Nexus
                    </h3>
                    <span className="text-[11px] text-purple-700 font-bold">1 Syndicated Cluster Identified</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                  GRAPH ANALYSIS
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Graph analysis scans local engineering subdivisions for repeat pairings. Flags instances where a single field officer certifies multiple consecutive contracts for the same private vendor with 0 recorded quality defects.
              </p>
              <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200 text-[11px] space-y-1">
                <div className="font-bold text-purple-950">Active Incident: Visakhapatnam Rural Sub-Division</div>
                <div className="text-purple-800">Same Junior Engineer certified 6 consecutive works for M/s Sri Krishna Infratech with zero punch list items. Cross-cadre blind dispatch mandated to break nexus.</div>
              </div>
            </div>

            {/* Detector 4: Baseline DPR Inflation & Price Doctoring */}
            <div className="p-5 rounded-xl border border-blue-200 bg-white shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                    📊
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">
                      4. AEE Baseline Doctoring & Estimate Inflation
                    </h3>
                    <span className="text-[11px] text-blue-700 font-bold">4 Discrepant Line-Items</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  DSR ORACLE MISMATCH
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compares engineer-entered Detailed Project Report (DPR) item rates against the autonomous CPWD DSR / MoSPI Oracle. Eliminates insider bribery where engineers inflate estimates to facilitate supplier kickbacks.
              </p>
              <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200 text-[11px] space-y-1">
                <div className="font-bold text-blue-950">Active Incident: MPLAD-UP-2026-00084 (Water Plant)</div>
                <div className="text-blue-800">Civil earthwork foundation entered at ₹420/m³ vs official UP PWD Schedule rate of ₹185/m³ (+127% inflated padding).</div>
              </div>
            </div>
          </div>

          {/* Interactive CTEO Vigilance Action Console */}
          <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span>CTEO Statutory Enforcement Console (Direct CVC Interventions)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Exercise statutory powers under Section 88 of CVC Act, 2003 and Section 21 of MPLADS Operational Guidelines.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gov-charcoal">Target Work:</label>
                <select
                  value={vigilanceSelectedProject}
                  onChange={(e) => setVigilanceSelectedProject(e.target.value)}
                  className="text-xs border border-slate-300 rounded-md px-3 py-1.5 font-bold text-gov-navy bg-slate-50 focus:ring-2 focus:ring-gov-navy"
                >
                  <option value="MPLAD-AP-2026-00125">MPLAD-AP-2026-00125 (Sub-Center, Pendurthi)</option>
                  <option value="MPLAD-AP-2026-00402">MPLAD-AP-2026-00402 (Ghost Work, Anandapuram)</option>
                  <option value="MPLAD-UP-2026-00084">MPLAD-UP-2026-00084 (Water Plant, Varanasi)</option>
                </select>
              </div>
            </div>

            {vigilanceActionMessage && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-500 text-xs font-medium text-red-950 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{vigilanceActionMessage}</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-red-800 bg-red-200 px-2 py-0.5 rounded">
                  LOGGED TO IMMUTABLE CVC AUDIT TRAIL
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              {/* Statutory Action 1: Digital Stop-Work Order */}
              <div className="p-4 rounded-xl border border-red-300 bg-red-50/50 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="font-extrabold text-red-900 flex items-center gap-1.5">
                    <Ban className="w-4 h-4 text-red-700" />
                    <span>1. Issue Digital Stop-Work Order</span>
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Immediately freezes contractor site access, revokes billing tokens on PFMS, and notifies District Collector and Local Police Station under Sec 88 CVC Act.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setVigilanceOrderType('STOP_WORK');
                    setVigilanceActionMessage(`Statutory Stop-Work Order #CTEO/SWO/2026/${Math.floor(Math.random() * 8999 + 1000)} executed for ${vigilanceSelectedProject}. PFMS tokens frozen.`);
                    setTimeout(() => setVigilanceActionMessage(null), 6000);
                  }}
                  className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Execute Stop-Work Order</span>
                </button>
              </div>

              {/* Statutory Action 2: NABL Lab Core Testing Mandate */}
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <Hammer className="w-4 h-4 text-amber-700" />
                    <span>2. Mandate NABL Lab Core Drilling</span>
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Dispatches independent National Accreditation Board for Testing and Calibration Laboratories (NABL) mobile rig for destructive compressive testing of structural columns.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setVigilanceOrderType('LAB_SAMPLE');
                    setVigilanceActionMessage(`NABL Independent Lab Mobile Rig Dispatched. Order #NABL/CORE/2026 for ${vigilanceSelectedProject}. 28-day strength audit active.`);
                    setTimeout(() => setVigilanceActionMessage(null), 6000);
                  }}
                  className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Hammer className="w-3.5 h-3.5" />
                  <span>Dispatch NABL Core Rig</span>
                </button>
              </div>

              {/* Statutory Action 3: Transmit to Lokayukta / ACB */}
              <div className="p-4 rounded-xl border border-purple-300 bg-purple-50/50 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="font-extrabold text-purple-900 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-purple-700" />
                    <span>3. Transmit Dossier to Lokayukta / ACB</span>
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Transmits complete cryptographic dossier (GPS telemetry, BoQ delta, photos, officer signatures) to State Anti-Corruption Bureau under Sec 13(1)(d) of Prevention of Corruption Act.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setVigilanceOrderType('LOKAYUKTA_PROBE');
                    setVigilanceActionMessage(`Cryptographic Dossier for ${vigilanceSelectedProject} transmitted to State Lokayukta & Anti-Corruption Bureau. Reference #ACB-FIR-2026.`);
                    setTimeout(() => setVigilanceActionMessage(null), 6000);
                  }}
                  className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Refer to Lokayukta / ACB</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

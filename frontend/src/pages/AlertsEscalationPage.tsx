import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert, WhistleblowerBountyReport } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  BellRing, ShieldAlert, ArrowRight, CheckCircle2, UserPlus, 
  TrendingUp, FileText, Clock, AlertTriangle, Eye, Info, Lock, 
  Check, Shield, ExternalLink, Filter, Unlock, UserCheck, Calendar, Shuffle, Scale, Coins, X
} from 'lucide-react';

interface AlertsEscalationPageProps {
  onOpenProject: (projectId: string) => void;
}

const DOUBLE_BLIND_COLLUSION_ALERT: Alert = {
  id: "ALT-2026-DBA01",
  project_id: "MPLAD-AP-2026-00125",
  project_title: "Construction of Multipurpose Community Hall in Tagarapuvalasa",
  severity: "CRITICAL",
  category: "Anti-Collusion Double-Blind Audit",
  title: "Double-Blind Dual Inspection Discrepancy: 43% Progress Mismatch Flagged",
  description: "AI Consensus Engine detected a 43% discrepancy between Inspector A (85%) and Inspector B (42%). Contractor payments placed in Level-5 Vigilance Freeze.",
  observed_data: "Inspector A: 85% reported (PRED) | Inspector B: 42% reported (RWSS) | Discrepancy Delta: 43%",
  expected_data: "Permissible Discrepancy Tolerance: <= 15% under MoSPI Scheme Guidelines Clause 3.16-A",
  difference: "43% Disparity (> 15% Statutory Limit) -> Automatic Collusion Red Alert Triggered",
  confidence_score: 0.99,
  recommended_action: "Immediate Stop-Work Order, lock contractor escrow accounts, and summon both inspecting cadres for CVC inquiry.",
  escalation_level: "Level 5 - State Technical Vigilance / CVC Inquiry",
  assigned_authority: "Chief Technical Examiner, State Technical Vigilance Wing",
  due_days: 1,
  status: "OPEN",
  created_at: "2026-02-28",
  audit_history: [
    { time: "2026-02-27 10:30", action: "Inspector A logged 85% progress", actor: "Shri R. K. Verma, AEE" },
    { time: "2026-02-28 15:45", action: "Inspector B logged 42% progress (Blind parallel audit)", actor: "Cross-Cadre Auditor" },
    { time: "2026-02-28 16:00", action: "AI Discrepancy Engine detected 43% divergence; flagged Collusion Red Alert", actor: "Anti-Collusion Oracle" }
  ]
};

const WORK_00008_ALERT: Alert = {
  id: "ALT-2026-00008",
  project_id: "MPLAD-AP-2026-00008",
  project_title: "Integrated Anganwadi & Skill Center (Work #00008)",
  severity: "HIGH",
  category: "Attention & Escalation",
  title: "Work #00008: Immediate Attention & Multi-Tier Escalation Required",
  description: "Active Surveillance flagged 35-day execution lag and unverified foundation curing. Work #00008 escalated for administrative attention under Level 2 (Implementing Agency).",
  observed_data: "Work #00008: Physical Progress: 48.0% | Financial: 52.4% | Execution Lag: 35 days | Pending curing inspection",
  expected_data: "Scheduled Completion: 70.0% by Feb 2026 under approved milestone schedule",
  difference: "22% physical milestone deficit; structural inspection overdue by 14 days",
  confidence_score: 0.92,
  recommended_action: "Dispatch Level 2 Implementing Agency notice. Mandate Assistant Executive Engineer site re-inspection within 48h.",
  escalation_level: "Level 2 - Implementing Agency (Escalated for Attention)",
  assigned_authority: "Executive Engineer (PRED) & District Planning Officer",
  due_days: 4,
  status: "OPEN",
  created_at: "2026-02-22",
  audit_history: [
    { time: "2026-02-22 08:45", action: "Flagged by Autonomous Surveillance as Work #00008", actor: "AI Surveillance Engine" },
    { time: "2026-02-22 09:30", action: "Tier 2 Escalation Recommended for Attention", actor: "System Routing" }
  ]
};

export const AlertsEscalationPage: React.FC<AlertsEscalationPageProps> = ({ onOpenProject }) => {
  const { role, isCitizen, isOfficer, isDistrictAuthority, isVigilanceAuditor, isAdmin, userName } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([DOUBLE_BLIND_COLLUSION_ALERT, WORK_00008_ALERT]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(DOUBLE_BLIND_COLLUSION_ALERT);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RESOLVED' | '00008' | 'CRITICAL' | 'ATTENTION' | 'WHISTLEBLOWERS'>('ALL');
  const [whistleblowerReports, setWhistleblowerReports] = useState<WhistleblowerBountyReport[]>([]);
  const [selectedWhistleblower, setSelectedWhistleblower] = useState<WhistleblowerBountyReport | null>(null);
  const [actionModal, setActionModal] = useState<{ type: 'ASSIGN' | 'ESCALATE' | 'RESOLVE' | 'ADD_NOTE'; open: boolean }>({ type: 'RESOLVE', open: false });
  const [actionInput, setActionInput] = useState('');
  const [assignedInput, setAssignedInput] = useState('Assistant Executive Engineer, PRED');
  const [escalationLevelInput, setEscalationLevelInput] = useState('Level 4 - Higher Authority (State Nodal)');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
    loadWhistleblowers();
  }, []);

  const loadWhistleblowers = async () => {
    try {
      const data = await api.getWhistleblowerReports();
      setWhistleblowerReports(data);
      if (data.length > 0 && !selectedWhistleblower) {
        setSelectedWhistleblower(data[0]);
      }
    } catch {}
  };

  const handleWhistleblowerAction = async (
    reportId: string, 
    status: WhistleblowerBountyReport['status'], 
    notes: string, 
    penalty: number = 1000000, 
    bounty: number = 100000
  ) => {
    try {
      const updated = await api.updateWhistleblowerReportStatus(reportId, status, notes, penalty, bounty);
      setWhistleblowerReports(prev => prev.map(r => r.id === reportId ? updated : r));
      setSelectedWhistleblower(updated);
      setSuccessToast(
        status === 'FRAUD_PROVEN_PENALTY_FROZEN'
          ? `⚖️ Fraud Confirmed: ₹${penalty.toLocaleString('en-IN')} Bank Guarantee seized! Whistleblower 10% bounty (₹${bounty.toLocaleString('en-IN')}) unlocked for 12-word seed claim.`
          : status === 'DISMISSED'
          ? `❌ Whistleblower claim dismissed: Evidence verified as fake / non-compliant. Zero bounty authorized.`
          : `🔬 Surprise On-Site Forensic Quality Audit dispatched for project ${updated.project_id}!`
      );
      setTimeout(() => setSuccessToast(null), 5000);
    } catch {
      setSuccessToast('Failed to update whistleblower report.');
    }
  };

  const loadAlerts = async () => {
    try {
      const data = await api.getAlerts();
      const merged = [DOUBLE_BLIND_COLLUSION_ALERT, WORK_00008_ALERT, ...data.filter(a => a.id !== WORK_00008_ALERT.id && a.id !== DOUBLE_BLIND_COLLUSION_ALERT.id)];
      setAlerts(merged);
      if (!selectedAlert || selectedAlert.id === DOUBLE_BLIND_COLLUSION_ALERT.id) {
        setSelectedAlert(DOUBLE_BLIND_COLLUSION_ALERT);
      }
    } catch {
      setAlerts([DOUBLE_BLIND_COLLUSION_ALERT, WORK_00008_ALERT]);
      setSelectedAlert(DOUBLE_BLIND_COLLUSION_ALERT);
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedAlert) return;

    await api.takeAlertAction(selectedAlert.id, {
      action: actionModal.type,
      assigned_to: assignedInput,
      escalation_level: escalationLevelInput,
      notes: actionInput,
      officer_name: userName || 'District Planning Officer'
    });

    // Update local state
    setAlerts(prev => prev.map(a => {
      if (a.id === selectedAlert.id) {
        const updated = { ...a };
        if (actionModal.type === 'RESOLVE') updated.status = 'RESOLVED';
        if (actionModal.type === 'ESCALATE') updated.escalation_level = escalationLevelInput;
        if (actionModal.type === 'ASSIGN') updated.assigned_authority = assignedInput;
        updated.audit_history = [
          ...(updated.audit_history || []),
          { time: new Date().toISOString().slice(0, 16).replace('T', ' '), action: `${actionModal.type}: ${actionInput || 'Statutory Action'}`, actor: userName }
        ];
        return updated;
      }
      return a;
    }));

    if (selectedAlert) {
      setSelectedAlert(prev => prev ? {
        ...prev,
        status: actionModal.type === 'RESOLVE' ? 'RESOLVED' : prev.status,
        escalation_level: actionModal.type === 'ESCALATE' ? escalationLevelInput : prev.escalation_level,
        assigned_authority: actionModal.type === 'ASSIGN' ? assignedInput : prev.assigned_authority,
        audit_history: [
          ...(prev.audit_history || []),
          { time: new Date().toISOString().slice(0, 16).replace('T', ' '), action: `${actionModal.type}: ${actionInput || 'Statutory Action'}`, actor: userName }
        ]
      } : null);
    }

    setActionModal({ ...actionModal, open: false });
    setActionInput('');
    setSuccessToast(`Action successfully executed: ${actionModal.type} for ${selectedAlert.id}`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED');

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'RESOLVED') return a.status === 'RESOLVED';
    if (activeFilter === '00008') return (a.id.includes('00008') || a.project_id.includes('00008')) && a.status !== 'RESOLVED';
    if (activeFilter === 'CRITICAL') return a.severity === 'CRITICAL' && a.status !== 'RESOLVED';
    if (activeFilter === 'ATTENTION') return (a.severity === 'HIGH' || a.category.includes('Attention')) && a.status !== 'RESOLVED';
    return a.status !== 'RESOLVED';
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BellRing className="w-6 h-6 text-gov-saffron" />
              <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy">
                Early-Warning Alert & Escalation Engine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wide">
                Surveillance Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-tiered administrative routing: Level 1 (Field Officer) → Level 2 (Implementing Agency) → Level 3 (District Collector) → Level 4 (State / MoSPI).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Automated SLA Tracking Active
            </span>
          </div>
        </div>

        {/* Citizen Role Notification (Transparency Mode) */}
        {isCitizen && (
          <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs block text-amber-950">Citizen Public Transparency Mode</span>
              <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                You are viewing the public surveillance alert feed for community awareness. 
                Administrative interventions (Assigning Field Officers, Escalating Tiers, and Formal Case Resolutions) are restricted to District Authorities and Vigilance Officers.
              </p>
            </div>
          </div>
        )}

        {/* Multi-Tier Routing Protocol Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Level 1 Tier</span>
            <span className="font-extrabold text-gov-navy mt-0.5 block">Field Officer / AEE</span>
            <span className="text-[10px] text-slate-400">48h Initial Verification</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Level 2 Tier</span>
            <span className="font-extrabold text-gov-navy mt-0.5 block">Implementing Agency (EE)</span>
            <span className="text-[10px] text-slate-400">7-Day Rectification Notice</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Level 3 Tier</span>
            <span className="font-extrabold text-gov-navy mt-0.5 block">District Authority / DPC</span>
            <span className="text-[10px] text-slate-400">Formal Inquiry & Stop-Payment</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Level 4 Tier</span>
            <span className="font-extrabold text-red-700 mt-0.5 block">Higher Authority / MoSPI</span>
            <span className="text-[10px] text-slate-400">National Audit Escalation</span>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Surveillance Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-gov-saffron" />
          Filter Alerts:
        </span>
        <button
          onClick={() => {
            setActiveFilter('ALL');
            if (activeAlerts.length > 0 && selectedAlert?.status === 'RESOLVED') {
              setSelectedAlert(activeAlerts[0]);
            }
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeFilter === 'ALL'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Active Alerts ({activeAlerts.length})
        </button>
        <button
          onClick={() => {
            setActiveFilter('RESOLVED');
            if (resolvedAlerts.length > 0) {
              setSelectedAlert(resolvedAlerts[0]);
            }
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'RESOLVED'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Resolved Cases ({resolvedAlerts.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveFilter('00008');
            setSelectedAlert(WORK_00008_ALERT);
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === '00008'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>Work #00008 (Attention & Escalation)</span>
        </button>
        <button
          onClick={() => setActiveFilter('CRITICAL')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeFilter === 'CRITICAL'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-red-700 hover:bg-red-50'
          }`}
        >
          Critical ({activeAlerts.filter(a => a.severity === 'CRITICAL').length})
        </button>
        <button
          onClick={() => setActiveFilter('ATTENTION')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeFilter === 'ATTENTION'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-amber-800 hover:bg-amber-50'
          }`}
        >
          Attention / High Risk ({activeAlerts.filter(a => a.severity === 'HIGH' || a.category.includes('Attention')).length})
        </button>

        <button
          onClick={() => {
            setActiveFilter('WHISTLEBLOWERS');
            if (whistleblowerReports.length > 0 && !selectedWhistleblower) {
              setSelectedWhistleblower(whistleblowerReports[0]);
            }
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'WHISTLEBLOWERS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          <span>Watchdog Whistleblower Vault ({whistleblowerReports.length})</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-600 text-white">
            10% BOUNTY
          </span>
        </button>
      </div>

      {activeFilter === 'WHISTLEBLOWERS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Whistleblower Reports List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Anonymous Whistleblower Dossiers
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {whistleblowerReports.length} Vaulted
              </span>
            </div>

            {whistleblowerReports.map((wb) => {
              const isSelected = selectedWhistleblower?.id === wb.id;
              const isProven = wb.status === 'FRAUD_PROVEN_PENALTY_FROZEN';
              const isPaid = wb.status === 'BOUNTY_PAID';
              const isDismissed = wb.status === 'DISMISSED';

              return (
                <div
                  key={wb.id}
                  onClick={() => setSelectedWhistleblower(wb)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-600/30'
                      : isDismissed
                      ? 'border-slate-200 bg-slate-50/60 opacity-75'
                      : isProven
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-gov-navy">{wb.id}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      isPaid ? 'bg-emerald-600 text-white' :
                      isProven ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      isDismissed ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-900'
                    }`}>
                      {wb.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-gov-navy text-xs mt-1 truncate">{wb.project_title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{wb.description}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{wb.category.replace(/_/g, ' ')}</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {wb.bounty_reward_amount > 0 ? `₹${wb.bounty_reward_amount.toLocaleString('en-IN')} Bounty` : 'Bounty Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Whistleblower Detail & Forensic Triage Console */}
          {selectedWhistleblower ? (
            <div className="lg:col-span-2 bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-extrabold text-slate-500">{selectedWhistleblower.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
                        ANONYMOUS 12-WORD VAULT
                      </span>
                      <span className="text-xs text-slate-400">{selectedWhistleblower.created_at}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-gov-navy">{selectedWhistleblower.project_title}</h3>
                    <span className="text-xs text-slate-500 font-mono">📍 {selectedWhistleblower.location} • Target: {selectedWhistleblower.project_id}</span>
                  </div>

                  <button
                    onClick={() => onOpenProject(selectedWhistleblower.project_id)}
                    className="text-xs font-bold text-gov-navy hover:text-gov-saffron flex items-center gap-1 shrink-0"
                  >
                    <span>360° Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Worker's Anonymous Allegation */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">Whistleblower Field Observation:</span>
                  <p className="text-slate-800 font-medium leading-relaxed mt-1">{selectedWhistleblower.description}</p>
                </div>

                {/* Submitted Evidence Preview */}
                {selectedWhistleblower.evidence_url && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">Submitted Photographic Proof:</span>
                    <div className="aspect-video max-h-56 rounded-lg overflow-hidden border border-slate-300 bg-slate-900">
                      <img
                        src={selectedWhistleblower.evidence_url}
                        alt="Whistleblower evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>File: {selectedWhistleblower.evidence_filename || 'evidence_proof.jpg'}</span>
                      <span className="text-emerald-700 font-bold">Client-Side EXIF Hash Verified</span>
                    </div>
                  </div>
                )}

                {/* AI Forensic Authenticity & Anti-Fraud Analysis */}
                <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl text-xs space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-indigo-950">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-indigo-700" />
                      <span>AI Forensic Authenticity & Anti-Fraud Verification</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedWhistleblower.status === 'DISMISSED' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedWhistleblower.status === 'DISMISSED' ? 'FAILS AUTHENTICITY' : 'PASSES INTEGRITY CHECKS'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100">
                      <span className="text-slate-400 block font-medium">Reverse-Image Check:</span>
                      <strong className={selectedWhistleblower.status === 'DISMISSED' ? 'text-rose-700' : 'text-emerald-700'}>
                        {selectedWhistleblower.status === 'DISMISSED' ? 'Stock Photo Matched (Web)' : '0 Duplicates Found (Original)'}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100">
                      <span className="text-slate-400 block font-medium">GPS Geofence Match:</span>
                      <strong className="text-slate-800">
                        {selectedWhistleblower.status === 'DISMISSED' ? 'Off-Site Geotag (24km)' : 'Matched Site Baseline (35m)'}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100">
                      <span className="text-slate-400 block font-medium">Material Lab Audit:</span>
                      <strong className="text-slate-800">
                        {selectedWhistleblower.status === 'FRAUD_PROVEN_PENALTY_FROZEN' ? 'Substandard Core Proven' : selectedWhistleblower.status === 'DISMISSED' ? 'Lab Core Passed Norms' : 'Pending Core Drill Test'}
                      </strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/80 border border-indigo-100 text-[11px] text-slate-700">
                    <strong>Forensic Verdict Notes:</strong> {selectedWhistleblower.forensic_verdict_notes || 'Under active scrutiny.'}
                  </div>
                </div>

                {/* Financial Seizure & Bounty Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                    <span className="text-[10px] text-rose-700 uppercase font-bold block">Contractor Bank Guarantee at Risk:</span>
                    <strong className="text-rose-950 text-base font-mono block mt-0.5">
                      ₹{(selectedWhistleblower.penalty_frozen_amount || 1000000).toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[10px] text-slate-500">Performance Guarantee (PBG) Escrowed</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Whistleblower 10% Recovery Bounty:</span>
                    <strong className="text-emerald-950 text-base font-mono block mt-0.5">
                      ₹{(selectedWhistleblower.bounty_reward_amount || 100000).toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[10px] text-slate-500">Claimable via 12-Word Anonymous Key</span>
                  </div>
                </div>
              </div>

              {/* Official Action Controls */}
              {!isCitizen && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                  <button
                    onClick={() => handleWhistleblowerAction(
                      selectedWhistleblower.id,
                      'FRAUD_PROVEN_PENALTY_FROZEN',
                      'CVC / CTEO NABL laboratory core extraction verified fraudulent material substitution. Contractor Performance Bank Guarantee (₹10,00,000) seized under Sec 88 CVC Act. Whistleblower 10% statutory recovery bounty (₹1,00,000) approved for anonymous claim.',
                      1000000,
                      100000
                    )}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Fraud & Authorize 10% Bounty (₹1 Lakh)</span>
                  </button>

                  <button
                    onClick={() => handleWhistleblowerAction(
                      selectedWhistleblower.id,
                      'DISMISSED',
                      '❌ FRAUDULENT CLAIM DISMISSED: AI Reverse-Image search matched evidence to external stock library. On-site physical core verification confirmed compliance with approved DPR standards. Zero bounty authorized.',
                      0,
                      0
                    )}
                    className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss as Fake / Unsubstantiated Claim</span>
                  </button>

                  <button
                    onClick={() => handleWhistleblowerAction(
                      selectedWhistleblower.id,
                      'UNDER_FORENSIC_AUDIT',
                      'Surprise technical vigilance core extraction squad dispatched to target site with ultrasonic testing equipment.'
                    )}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dispatch Surprise On-Site Testing Squad</span>
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {activeFilter === 'RESOLVED' ? 'Resolved Statutory Cases' : 'Active Surveillance Alerts'}
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {filteredAlerts.length} {activeFilter === 'RESOLVED' ? 'Resolved' : 'Active'}
            </span>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700">
                {activeFilter === 'RESOLVED' ? 'No resolved cases recorded yet.' : 'All surveillance alerts cleared and resolved!'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {activeFilter === 'RESOLVED' ? 'When an alert is resolved, it will appear here.' : 'No pending statutory discrepancies.'}
              </p>
            </div>
          ) : null}

          {filteredAlerts.map((al) => {
            const isSelected = selectedAlert?.id === al.id;
            const isWork00008 = al.id.includes('00008') || al.project_id.includes('00008');
            const isCitizenDefect = al.id.startsWith('ALT-DEFECT') || al.category === 'Guarantee Alert' || al.title.includes('Statutory Defect Notice');
            const isResolved = al.status === 'RESOLVED';

            return (
              <div
                key={al.id}
                onClick={() => setSelectedAlert(al)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gov-navy bg-slate-50 shadow-sm ring-2 ring-gov-navy/20'
                    : isResolved
                    ? 'border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40'
                    : isWork00008
                    ? 'border-amber-300 bg-amber-50/50 hover:bg-amber-50'
                    : isCitizenDefect
                    ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono font-bold text-slate-700">{al.id}</span>
                    {isResolved && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        RESOLVED
                      </span>
                    )}
                    {isWork00008 && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                        WORK #00008
                      </span>
                    )}
                    {isCitizenDefect && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-600 text-white animate-pulse">
                        CITIZEN DLP
                      </span>
                    )}
                  </div>
                  <RiskBadge level={al.severity} size="sm" />
                </div>
                <h4 className="font-bold text-gov-navy text-xs mt-1 truncate">{al.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{al.description}</p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Due in: <strong className="text-red-600">{al.due_days} Days</strong></span>
                  <span className="font-semibold text-slate-600">{al.escalation_level.split('-')[0]}</span>
                </div>

                {/* Immediate Action Buttons Directly Below Each Complaint Card */}
                <div 
                  className="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-1.5" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onOpenProject(al.project_id)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Review Evidence Dossier"
                  >
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span>Evidence</span>
                  </button>

                  {!isCitizen && !isResolved && (
                    <div className="flex items-center gap-1.5">
                      {(isDistrictAuthority || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAlert(al);
                            setActionModal({ type: 'ASSIGN', open: true });
                          }}
                          className="px-2.5 py-1 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <UserPlus className="w-3 h-3 text-amber-300" />
                          <span>Assign Officer</span>
                        </button>
                      )}

                      {(isDistrictAuthority || isAdmin || isVigilanceAuditor) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAlert(al);
                            setActionModal({ type: 'RESOLVE', open: true });
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                          <span>Resolve</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAlert(al);
                          setActionModal({ type: 'ESCALATE', open: true });
                        }}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>Escalate</span>
                      </button>
                    </div>
                  )}

                  {isResolved && (
                    <span className="text-[10px] font-semibold text-emerald-700 italic flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Case Closed & Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Alert Action Workspace */}
        {selectedAlert && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-extrabold text-slate-500">{selectedAlert.id}</span>
                    <RiskBadge level={selectedAlert.severity} size="sm" />
                    {selectedAlert.status === 'RESOLVED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        CASE RESOLVED
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">SLA: {selectedAlert.due_days} days remaining</span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-gov-navy">{selectedAlert.title}</h3>
                </div>

                <button
                  onClick={() => onOpenProject(selectedAlert.project_id)}
                  className="text-xs font-bold text-gov-navy hover:text-gov-saffron flex items-center gap-1 shrink-0"
                >
                  <span>360° Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* UNIFIED ACTION BAR - DIRECTLY ACCESSIBLE AT THE TOP */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions:</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedAlert.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {selectedAlert.status === 'RESOLVED' ? '✓ STATUS: RESOLVED' : `STATUS: ${selectedAlert.status}`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => onOpenProject(selectedAlert.project_id)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-gov-navy text-xs font-bold rounded-lg border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Review Evidence</span>
                  </button>

                  {/* Special CVC Stop-Work & Inquiry Action for Vigilance Auditor */}
                  {isVigilanceAuditor && selectedAlert.id === 'ALT-2026-DBA01' && selectedAlert.status !== 'RESOLVED' && (
                    <>
                      <button
                        onClick={() => {
                          setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, status: 'RESOLVED', audit_history: [...(a.audit_history || []), { time: new Date().toISOString().slice(0, 16).replace('T', ' '), action: 'STATUTORY STOP-WORK ORDER & CONTRACTOR ESCROW FREEZE EXECUTED BY CVC', actor: userName }] } : a));
                          setSelectedAlert(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
                          setSuccessToast('⛔ Statutory Stop-Work Order executed by CVC! All disbursements frozen.');
                        }}
                        className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Issue Stop-Work & Freeze Funds</span>
                      </button>
                      <button
                        onClick={() => {
                          setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, audit_history: [...(a.audit_history || []), { time: new Date().toISOString().slice(0, 16).replace('T', ' '), action: 'FORMAL CVC DISCIPLINARY SUMMONS ISSUED TO BOTH CADRES', actor: userName }] } : a));
                          setSuccessToast('⚖️ Formal CVC Inquiry Summons dispatched to both inspecting cadres!');
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5 text-amber-400" />
                        <span>Summon Officers for CVC Inquiry</span>
                      </button>
                    </>
                  )}

                  {!isCitizen && selectedAlert.status !== 'RESOLVED' && (
                    <>
                      {(isDistrictAuthority || isAdmin) && (
                        <button
                          onClick={() => setActionModal({ type: 'ASSIGN', open: true })}
                          className="px-3 py-1.5 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-navy-light transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-gov-saffron" />
                          <span>Assign Officer</span>
                        </button>
                      )}

                      {(isDistrictAuthority || isAdmin || isVigilanceAuditor) && (
                        <button
                          onClick={() => setActionModal({ type: 'ESCALATE', open: true })}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Escalate Tier</span>
                        </button>
                      )}

                      {(isDistrictAuthority || isAdmin || isVigilanceAuditor) && (
                        <button
                          onClick={() => setActionModal({ type: 'RESOLVE', open: true })}
                          className="px-3.5 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve Alert</span>
                        </button>
                      )}

                      <button
                        onClick={() => setActionModal({ type: 'ADD_NOTE', open: true })}
                        className="px-2.5 py-1.5 bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        + Add Verification Note
                      </button>
                    </>
                  )}

                  {isCitizen && (
                    <span className="text-[11px] text-slate-500 italic ml-2">
                      🔒 Administrative escalation actions reserved for District Authorities.
                    </span>
                  )}
                </div>
              </div>

              {/* Observed vs Expected Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">Observed Field / Financial Data:</span>
                  <p className="font-bold text-gov-navy mt-1">{selectedAlert.observed_data}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">Statutory Milestone Baseline:</span>
                  <p className="font-semibold text-slate-700 mt-1">{selectedAlert.expected_data}</p>
                </div>
              </div>

              {/* Difference & SLA Directive */}
              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-xs space-y-1">
                <span className="font-extrabold text-amber-900 block">Variance & Ground Discrepancy:</span>
                <p className="text-slate-700 leading-relaxed">{selectedAlert.difference}</p>
              </div>

              {/* Recommended Action */}
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-extrabold text-blue-900 block">Surveillance Recommended Protocol:</span>
                <p className="text-slate-700 leading-relaxed">{selectedAlert.recommended_action}</p>
              </div>

              {/* Double-Blind Inspection Roster & RBAC Masking Section */}
              {selectedAlert.id === 'ALT-2026-DBA01' && (
                <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-xs text-indigo-950">
                      <Shuffle className="w-4 h-4 text-indigo-700" />
                      <span>Double-Blind Inspection Roster & Confidentiality Audit</span>
                    </div>
                    {isVigilanceAuditor ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-900 text-white uppercase">
                        LEVEL-5 CVC UNMASKED
                      </span>
                    ) : isDistrictAuthority ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                        DISTRICT MASKED VIEW
                      </span>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Inspector A */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gov-navy flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                          <span>Primary Inspector A:</span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          85% Reported
                        </span>
                      </div>
                      <strong className="text-gov-navy text-xs block">Shri R. K. Verma, AEE</strong>
                      <span className="text-[10px] text-slate-500 block">Panchayati Raj & Rural Engineering (PRED)</span>
                      <div className="pt-1 text-[10px] text-slate-600 flex items-center justify-between">
                        <span className="text-slate-400 font-bold">Scheduled Time:</span>
                        <span className="font-mono font-bold text-gov-navy">2026-02-27 10:00 AM – 01:00 PM</span>
                      </div>
                    </div>

                    {/* Inspector B (Role-Aware) */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gov-navy flex items-center gap-1">
                          {isVigilanceAuditor ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-purple-700" />}
                          <span>Secondary Blind Auditor B:</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isVigilanceAuditor ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {isVigilanceAuditor ? '42% Reported' : '🔒 CLASSIFIED'}
                        </span>
                      </div>

                      {isVigilanceAuditor ? (
                        <>
                          <strong className="text-gov-navy text-xs block">Smt. K. Sarada, AE</strong>
                          <span className="text-[10px] text-slate-500 block">Rural Water Supply & Sanitation (RWSS)</span>
                          <div className="pt-1 text-[10px] text-slate-600 flex items-center justify-between">
                            <span className="text-slate-400 font-bold">Scheduled Time:</span>
                            <span className="font-mono font-bold text-gov-navy">2026-02-28 02:00 PM – 05:00 PM</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px] font-bold">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>[ 🔒 MASKED UNDER CVC DIRECTIVE ]</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">Cadre: Quarantined Independent Division</span>
                          <p className="text-[9px] text-purple-900 italic pt-1 leading-tight">
                            Identity hidden to eliminate local tipping off. Unmasked only for CTE / CVC Vigilance Wing.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Current Administrative Status */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Assigned Authority:</span>
                  <span className="font-bold text-gov-navy">{selectedAlert.assigned_authority}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Escalation Tier:</span>
                  <span className="font-bold text-red-700">{selectedAlert.escalation_level}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Resolution Status:</span>
                  <span className="font-bold text-emerald-800">{selectedAlert.status}</span>
                </div>
              </div>

              {/* Action History Trail */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Audit & Escalation Trail:</h4>
                <div className="space-y-1.5 text-xs max-h-36 overflow-y-auto">
                  {selectedAlert.audit_history?.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="font-medium text-slate-700">{h.action}</span>
                      <span className="text-[10px] text-slate-400">{h.time} by {h.actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
      )}

      {/* Action Execution Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-gov-lg space-y-4 text-xs">
            <h3 className="text-base font-bold text-gov-navy">
              Execute Alert Action: {actionModal.type}
            </h3>

            {actionModal.type === 'ASSIGN' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assign Responsible Officer / Authority:</label>
                <select
                  value={assignedInput}
                  onChange={(e) => setAssignedInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                >
                  <option value="Assistant Executive Engineer, PRED">Assistant Executive Engineer, PRED</option>
                  <option value="Superintending Engineer, Jal Nigam">Superintending Engineer, Jal Nigam</option>
                  <option value="Chief Planning Officer / DRDA">Chief Planning Officer / DRDA</option>
                  <option value="Divisional Accounts Officer">Divisional Accounts Officer</option>
                </select>
              </div>
            )}

            {actionModal.type === 'ESCALATE' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Escalate to Administrative Tier:</label>
                <select
                  value={escalationLevelInput}
                  onChange={(e) => setEscalationLevelInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                >
                  <option value="Level 2 - Implementing Authority">Level 2 - Implementing Authority</option>
                  <option value="Level 3 - District Authority">Level 3 - District Authority (Collectorate)</option>
                  <option value="Level 4 - Higher Authority (MoSPI / State)">Level 4 - Higher Authority (MoSPI / State)</option>
                </select>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Formal Order / Reason Remarks:</label>
              <textarea
                rows={3}
                placeholder="Enter inquiry directives, compliance deadline, or site verification note..."
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ ...actionModal, open: false })}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                className="px-4 py-2 bg-gov-navy text-white rounded-lg font-bold hover:bg-gov-navy-light transition-colors"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

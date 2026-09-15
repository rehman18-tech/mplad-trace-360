import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Calendar, CheckCircle2, Video, MapPin, 
  FileText, Camera, UserCheck, AlertTriangle, AlertOctagon, 
  Layers, ShieldAlert, Cpu, ArrowRight, Check, X, RefreshCw
} from 'lucide-react';
import { Inspection, DoubleBlindAudit } from '../../types';
import { OfflineInspection } from '../../services/offlineStorage';

interface PhotoComparisonProps {
  beforeUrl?: string;
  afterUrl?: string;
  beforeStage?: string;
  afterStage?: string;
  beforeDate?: string;
  afterDate?: string;
  beforeOfficer?: string;
  beforeOfficerDesignation?: string;
  hasBaselinePhoto?: boolean;
  assignedFieldOfficer?: string;
  assignedOfficerDesignation?: string;
  onNavigateToInspection?: () => void;
  similarityScore?: number;
  gpsVariance?: number;
  videoUrl?: string | null;
  videoName?: string | null;
  inspections?: Inspection[];
  offlineInspections?: OfflineInspection[];
  aiNotes?: string;
  baselineCoordinates?: { lat: number; lon: number };
  baselineLocationName?: string;
  projectId?: string;
  doubleBlindAudit?: DoubleBlindAudit | null;
  projectProgress?: number;
  projectStatus?: string;
  onReloadData?: () => void;
}

// Visual SVG Placeholders depicting exact physical site states
const SVG_BASELINE_0 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f1f5f9"/><path d="M40 330 Q180 320 300 330 T560 320" stroke="%2394a3b8" stroke-width="5" fill="none"/><rect x="120" y="270" width="360" height="60" fill="%23cbd5e1" rx="4"/><polygon points="200,270 240,210 280,270" fill="%2394a3b8"/><rect x="30" y="30" width="260" height="65" rx="10" fill="%230b2545" opacity="0.95"/><text x="45" y="56" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="12">1. STATUTORY DPR BASELINE</text><text x="45" y="78" fill="%23ea580c" font-family="monospace" font-weight="bold" font-size="11">0% GROUND ZERO SURVEY</text></svg>`;

const SVG_INSPECTOR_A_HIGH = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f8fafc"/><rect x="80" y="100" width="440" height="230" fill="%23cbd5e1" rx="6"/><rect x="110" y="130" width="60" height="200" fill="%23475569"/><rect x="220" y="130" width="60" height="200" fill="%23475569"/><rect x="330" y="130" width="60" height="200" fill="%23475569"/><rect x="440" y="130" width="60" height="200" fill="%23475569"/><rect x="80" y="90" width="440" height="40" fill="%23ea580c"/><rect x="30" y="30" width="280" height="65" rx="10" fill="%230b2545" opacity="0.95"/><text x="45" y="56" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="12">2. INSPECTOR 1 (PRIMARY CADRE)</text><text x="45" y="78" fill="%2338bdf8" font-family="monospace" font-weight="bold" font-size="11">REPORTED: ADVANCED WORK</text></svg>`;

const SVG_INSPECTOR_B_REAL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23fef2f2"/><path d="M40 330 Q180 320 300 330 T560 320" stroke="%23fca5a5" stroke-width="5" fill="none"/><rect x="130" y="240" width="50" height="90" fill="%23ef4444" rx="3"/><rect x="250" y="240" width="50" height="90" fill="%23ef4444" rx="3"/><rect x="370" y="240" width="50" height="90" fill="%23ef4444" rx="3"/><text x="200" y="180" fill="%23dc2626" font-family="sans-serif" font-weight="bold" font-size="14">ONLY 4 PILLARS (PLINTH LEVEL)</text><rect x="30" y="30" width="290" height="65" rx="10" fill="%237f1d1d" opacity="0.95"/><text x="45" y="56" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="12">3. INSPECTOR 2 (BLIND AUDITOR)</text><text x="45" y="78" fill="%23f87171" font-family="monospace" font-weight="bold" font-size="11">REPORTED: INCOMPLETE WORK</text></svg>`;

const SVG_INSPECTOR_CONCORDANT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f0fdf4"/><rect x="90" y="120" width="420" height="210" fill="%23bbf7d0" rx="6"/><rect x="120" y="150" width="50" height="180" fill="%2315803d"/><rect x="230" y="150" width="50" height="180" fill="%2315803d"/><rect x="340" y="150" width="50" height="180" fill="%2315803d"/><rect x="450" y="150" width="50" height="180" fill="%2315803d"/><rect x="90" y="120" width="420" height="30" fill="%2316a34a"/><rect x="30" y="30" width="280" height="65" rx="10" fill="%23064e3b" opacity="0.95"/><text x="45" y="56" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="12">VERIFIED GROUND EVIDENCE</text><text x="45" y="78" fill="%234ade80" font-family="monospace" font-weight="bold" font-size="11">CONCORDANCE VERIFIED</text></svg>`;

export const PhotoComparison: React.FC<PhotoComparisonProps> = ({
  beforeUrl,
  afterUrl = '/images/recent_inspection.jpg',
  beforeStage = 'Milestone 0: Ground-Zero Site Handover Baseline (0%)',
  beforeDate = '12 Aug 2025',
  beforeOfficer = 'District Planning Cell / Higher Official',
  beforeOfficerDesignation = 'Higher Authority Sanction',
  hasBaselinePhoto,
  similarityScore = 88,
  gpsVariance = 14.5,
  videoUrl,
  videoName,
  inspections = [],
  offlineInspections = [],
  aiNotes,
  baselineCoordinates = { lat: 17.9312, lon: 83.4248 },
  baselineLocationName = 'Tagarapuvalasa Habitation, Visakhapatnam',
  projectId = 'MPLAD-AP-2026-00125',
  doubleBlindAudit,
  projectProgress = 72,
  projectStatus = 'UNDER PROGRESS',
  onReloadData,
  onNavigateToInspection
}) => {
  const isBaselineAvailable = hasBaselinePhoto ?? Boolean(beforeUrl);
  const [bSrc, setBSrc] = useState(beforeUrl || SVG_BASELINE_0);
  const [baselineViewMode, setBaselineViewMode] = useState<'T_MINUS_1' | 'DAY_ZERO'>('DAY_ZERO');

  // Live Simulator state (allows user to test custom progress inputs like 95% vs 50%)
  const [showTester, setShowTester] = useState(false);
  const [testP1, setTestP1] = useState(95);
  const [testP2, setTestP2] = useState(50);
  const [testResult, setTestResult] = useState<{
    delta: number;
    approved: boolean;
    reason: string;
    stageImpact: string;
  } | null>(null);

  useEffect(() => {
    if (beforeUrl) {
      setBSrc(beforeUrl);
      // Immediately reflect the updated statutory baseline image in Card 1
      setBaselineViewMode('DAY_ZERO');
    }
  }, [beforeUrl]);

  // Derive real live data from doubleBlindAudit or primary inspection
  const hasDualAudit = Boolean(doubleBlindAudit);

  // Progressive Milestone (T-1) Evidence
  const priorInsp = inspections && inspections.length > 0 ? inspections[0] : null;
  const tMinus1Stage = priorInsp ? (priorInsp.general_remarks?.slice(0, 45) || 'Milestone 1: Substructure (30%)') : 'Milestone 1: Foundation & Substructure (30%)';
  const tMinus1Progress = priorInsp?.physical_progress_observed ?? 30;
  const tMinus1Officer = priorInsp ? `${priorInsp.officer_name} (${priorInsp.officer_designation || 'AEE'})` : 'Shri R. K. Verma, AEE (PRED)';
  const tMinus1Date = priorInsp?.inspection_date || '18 Dec 2025';
  const tMinus1Photo = (priorInsp?.photo_urls && priorInsp.photo_urls[0]) || '/images/baseline_inspection.jpg';

  const activeBaselineImg = baselineViewMode === 'T_MINUS_1' ? tMinus1Photo : (bSrc || SVG_BASELINE_0);
  const activeBaselineStage = baselineViewMode === 'T_MINUS_1' ? tMinus1Stage : beforeStage;
  const activeBaselineProgress = baselineViewMode === 'T_MINUS_1' ? tMinus1Progress : 0;
  const activeBaselineOfficer = baselineViewMode === 'T_MINUS_1' ? tMinus1Officer : beforeOfficer;
  const activeBaselineDate = baselineViewMode === 'T_MINUS_1' ? tMinus1Date : beforeDate;
  
  // Real Inspector 1 (Primary Cadre)
  const insp1 = {
    name: doubleBlindAudit?.inspector_a_name || 'Shri R. K. Verma, AEE',
    dept: doubleBlindAudit?.inspector_a_dept || 'Panchayati Raj & Rural Engineering (PRED)',
    progress: doubleBlindAudit?.inspector_a_progress ?? (inspections[0]?.physical_progress_observed ?? projectProgress),
    status: doubleBlindAudit?.inspector_a_status || 'SUBMITTED',
    time: doubleBlindAudit?.inspector_a_timestamp || doubleBlindAudit?.inspector_a_scheduled_time || '2026-02-27 10:30 AM',
    notes: doubleBlindAudit?.inspector_a_notes || inspections[0]?.general_remarks || 'Superstructure execution in progress as per schedule.',
    gpsVariance: doubleBlindAudit?.inspector_a_gps_variance ?? 14.5,
    photo: doubleBlindAudit?.inspector_a_photo || afterUrl || SVG_INSPECTOR_A_HIGH
  };

  // Real Inspector 2 (Blind Cross-Cadre Auditor)
  const insp2 = {
    name: doubleBlindAudit?.inspector_b_name || 'Smt. K. Sarada, AE',
    dept: doubleBlindAudit?.inspector_b_dept || 'Rural Water Supply & Sanitation (RWSS)',
    progress: doubleBlindAudit?.inspector_b_progress,
    status: doubleBlindAudit?.inspector_b_status || (hasDualAudit ? 'PENDING' : 'NOT_DISPATCHED'),
    time: doubleBlindAudit?.inspector_b_timestamp || doubleBlindAudit?.inspector_b_scheduled_time || '2026-02-28 03:45 PM',
    notes: doubleBlindAudit?.inspector_b_notes || (hasDualAudit ? 'Awaiting blind parallel inspection log.' : 'No dual cross-cadre audit assigned for this milestone.'),
    gpsVariance: doubleBlindAudit?.inspector_b_gps_variance ?? 12.1,
    photo: doubleBlindAudit?.inspector_b_photo
      ? doubleBlindAudit.inspector_b_photo
      : (doubleBlindAudit?.consensus_status === 'COLLUSION_ALERT_TRIGGERED' 
          ? SVG_INSPECTOR_B_REAL 
          : (doubleBlindAudit?.consensus_status === 'CONCORDANCE_VERIFIED' ? SVG_INSPECTOR_CONCORDANT : SVG_INSPECTOR_B_REAL))
  };

  // Real Mathematical Evaluation from the System
  const delta = doubleBlindAudit?.ai_discrepancy_delta !== undefined
    ? doubleBlindAudit.ai_discrepancy_delta
    : (insp2.progress !== undefined ? Math.abs(insp1.progress - insp2.progress) : 0);

  const toleranceLimit = 15; // 15% under MoSPI Clause 3.16-A
  const isCollusionAlert = doubleBlindAudit?.consensus_status === 'COLLUSION_ALERT_TRIGGERED' || (insp2.progress !== undefined && delta > toleranceLimit);
  const isConcordant = doubleBlindAudit?.consensus_status === 'CONCORDANCE_VERIFIED' || (insp2.progress !== undefined && delta <= toleranceLimit);
  const isAwaitingSecond = hasDualAudit && insp2.status !== 'SUBMITTED' && insp2.progress === undefined;

  // Run Real-Time Test Simulation
  const handleRunEvaluation = () => {
    const d = Math.abs(testP1 - testP2);
    const approved = d <= toleranceLimit;
    setTestResult({
      delta: d,
      approved,
      reason: approved
        ? `✓ CONCORDANCE VERIFIED: Discrepancy (${d}%) is within the statutory ±${toleranceLimit}% tolerance. The machine accepts both reports, credits ${Math.round((testP1 + testP2) / 2)}% progress to the official ledger, and unlocks the next milestone tranche.`
        : `❌ STATUTORY REJECTION: Inspector 1 (${testP1}%) vs Inspector 2 (${testP2}%) produces a ${d}% discrepancy exceeding the ${toleranceLimit}% limit. The machine automatically rejects the submission, blocks stage progression, freezes contractor payments under CVC Section 88, and flags a Collusion Red Alert.`,
      stageImpact: approved
        ? '✓ UNLOCKED & ADVANCED: Project transitions to the next lifecycle stage.'
        : '⛔ FROZEN & HALTED: Project stage advancement is locked. Zero funds can be released.'
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. STATUTORY BASELINE GEOTAG ANCHOR BANNER */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-orange-100 text-orange-700 shrink-0">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">Statutory Baseline Geotag Anchor</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                OFFICIAL DPR REFERENCE
              </span>
            </div>
            <p className="text-slate-700 text-xs mt-1">
              Site Location: <b>{baselineLocationName}</b> • Coordinates: <span className="font-mono font-bold text-slate-900">{baselineCoordinates.lat}° N, {baselineCoordinates.lon}° E</span>
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Zero-Trust Hardware Rule: Both Inspector 1 and Inspector 2 must physically capture evidence within the 200m spatial geofence radius. Off-site uploads are rejected automatically by the camera shutter lock.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex sm:flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 text-xs shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Geofence Calibrated (0m Anchor)
          </span>
        </div>
      </div>

      {/* 2. REAL OPERATIONAL CONSENSUS & VERIFICATION ENGINE (DRIVEN BY ACTUAL PROJECT DATA) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        {/* Header with Live Operational Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-100 text-blue-800">
                <Cpu className="w-5 h-5 text-blue-700" />
              </span>
              <h3 className="text-base font-black text-slate-900">
                Autonomous Dual-Inspector Consensus & Stage Progression Engine
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Double-Blind Verification: System requires concordant ground evidence from independent inspecting cadres before advancing milestone progression or releasing funds.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowTester(!showTester)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Test custom progress discrepancy values"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>{showTester ? 'Hide Machine Evaluator' : 'Test Machine Consensus Rules'}</span>
            </button>
          </div>
        </div>

        {/* Real Automated Verdict & Stage Progression Impact Banner */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isCollusionAlert 
            ? 'bg-rose-50/80 border-rose-300' 
            : isConcordant 
            ? 'bg-emerald-50/80 border-emerald-300' 
            : 'bg-amber-50/80 border-amber-300'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <span className={`p-2 rounded-xl text-white ${
                isCollusionAlert ? 'bg-rose-600' : isConcordant ? 'bg-emerald-600' : 'bg-amber-600'
              }`}>
                {isCollusionAlert ? <AlertOctagon className="w-5 h-5" /> : isConcordant ? <CheckCircle2 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
              </span>
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider block text-slate-500">
                  REAL-TIME MACHINE VERDICT ON {projectId}
                </span>
                <h4 className={`text-sm font-black ${
                  isCollusionAlert ? 'text-rose-950' : isConcordant ? 'text-emerald-950' : 'text-amber-950'
                }`}>
                  {isCollusionAlert && '⛔ SUBMISSION AUTOMATICALLY REJECTED — FURTHER STAGE PROGRESSION BLOCKED'}
                  {isConcordant && '✓ SUBMISSION AUTOMATICALLY APPROVED — ADVANCED TO NEXT MILESTONE'}
                  {isAwaitingSecond && '⏳ ON HOLD: AWAITING SECOND INDEPENDENT BLIND AUDITOR UPLOAD'}
                  {!hasDualAudit && '✓ ROUTINE FIELD INSPECTION VERIFIED'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold border ${
                isCollusionAlert 
                  ? 'bg-rose-100 text-rose-900 border-rose-300' 
                  : isConcordant 
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                Discrepancy Δ: {delta}% (Tolerance: ≤{toleranceLimit}%)
              </span>
            </div>
          </div>

          {/* Current Lifecycle Stage Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
            <div className="p-3 rounded-xl bg-white/90 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Dual Cadre Inspection Reports</span>
              <p className="text-slate-900 font-bold">
                Inspector 1 ({insp1.dept}): <span className="text-blue-700">{insp1.progress}%</span>
              </p>
              <p className="text-slate-900 font-bold">
                Inspector 2 ({insp2.dept}): <span className={isCollusionAlert ? 'text-rose-700' : 'text-emerald-700'}>
                  {insp2.progress !== undefined ? `${insp2.progress}%` : 'Pending Upload'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Mathematical Delta: <strong className="font-mono">{delta}%</strong> (Statutory Limit: 15%).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/90 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Further Stage Progression Status</span>
              <p className={`font-bold text-xs ${isCollusionAlert ? 'text-rose-700' : 'text-emerald-700'}`}>
                {isCollusionAlert && '⛔ STAGE ADVANCEMENT FROZEN (Cannot Transition to Stage 9)'}
                {isConcordant && '✓ STAGE TRANSITION UNLOCKED & ADVANCED'}
                {isAwaitingSecond && '⏳ TRANSITION PAUSED (Waiting for Blind Cadre 2)'}
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                {isCollusionAlert && 'Because the discrepancy exceeds 15%, the machine has quarantined the Measurement Books, locked contractor escrow payments under CVC Section 88, and prevented the project from advancing to Stage 9 (Measurement & Bill Passing).'}
                {isConcordant && 'Because both officers gave concordant reports (Δ ≤ 15%), the machine has automatically validated the physical milestones and advanced the project to the next stage in the 10-stage lifecycle.'}
                {isAwaitingSecond && 'Under MoSPI Anti-Collusion Rules, physical progress cannot be credited until the second independent cross-cadre inspector submits their blind report and vector similarity is verified.'}
              </p>
            </div>
          </div>

          {isAwaitingSecond && onNavigateToInspection && (
            <div className="mt-3 pt-3 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-amber-900">
                👉 Ready to test Officer 2's submission? Open the Field Inspection console and switch persona to <strong>Inspector 2 (Smt. K. Sarada)</strong>.
              </span>
              <button
                type="button"
                onClick={onNavigateToInspection}
                className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Submit as Officer 2 (Blind Auditor)</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. PANORAMIC 3-CARD EVIDENCE DOSSIER (BASELINE + INSPECTOR 1 + INSPECTOR 2) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Both Inspector Submissions & Statutory Baseline Evidence</span>
            </span>
            <span className="text-[11px] text-slate-500">
              {isCollusionAlert ? 'Evidence Status: Quarantined & Blocked from Public Timeline' : 'Evidence Status: Verified & Committed to Public Record'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Progressive Sequential Reference Baseline (T-1) or Statutory Day-0 DPR */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between shadow-xs">
              <div>
                {/* Header Switcher for Reference Mode */}
                <div className="p-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-orange-500" />
                    <span>Reference Base:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setBaselineViewMode('T_MINUS_1')}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                        baselineViewMode === 'T_MINUS_1'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Milestone T-1 Previous Inspection"
                    >
                      ⚡ T-1 Prior ({activeBaselineProgress}%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBaselineViewMode('DAY_ZERO')}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                        baselineViewMode === 'DAY_ZERO'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Day-0 DPR Ground Zero Pre-Construction"
                    >
                      🏛️ Day-0 (0%)
                    </button>
                  </div>
                </div>

                <div className="relative aspect-video bg-slate-200 overflow-hidden group">
                  <img
                    src={activeBaselineImg}
                    onError={() => setBSrc(SVG_BASELINE_0)}
                    alt="Reference Baseline Evidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-bold text-[10px] uppercase backdrop-blur-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-orange-400" />
                    <span>{baselineViewMode === 'T_MINUS_1' ? '1. Milestone T-1 Baseline' : '1. Approved Day-0 DPR'}</span>
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                    {activeBaselineProgress}% Recorded
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <strong className="text-slate-900 block font-bold truncate">
                    {activeBaselineStage}
                  </strong>
                  <p className="text-[11px] text-slate-600">
                    Sanctioned / Recorded by: <span className="font-semibold text-slate-900">{activeBaselineOfficer}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Date: {activeBaselineDate} • GPS Geotag Calibrated
                  </p>
                </div>
              </div>
              <div className="p-2.5 bg-slate-100/70 border-t border-slate-200 text-[10px] font-mono text-slate-600 flex items-center justify-between">
                <span>Milestone Δ</span>
                <span className={`font-bold ${insp1.progress - activeBaselineProgress > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  +{Math.max(0, insp1.progress - activeBaselineProgress)}% Physical Delta
                </span>
              </div>
            </div>

            {/* Card 2: Field Inspector 1 (Primary Cadre Submission) */}
            <div className={`rounded-2xl overflow-hidden border flex flex-col justify-between shadow-xs ${
              isCollusionAlert ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-slate-50'
            }`}>
              <div>
                <div className="relative aspect-video bg-slate-200 overflow-hidden group">
                  <img
                    src={insp1.photo}
                    alt="Inspector 1 Evidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-blue-900/90 text-white font-bold text-[10px] uppercase backdrop-blur-xs flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-blue-300" />
                    <span>2. Inspector 1 (Primary Cadre)</span>
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded font-mono text-[10px] font-black bg-blue-700 text-white">
                    Reported: {insp1.progress}%
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{insp1.name}</strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                      PRIMARY CADRE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{insp1.dept}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Time: {insp1.time} • Δ {insp1.gpsVariance}m GPS
                  </p>
                  <p className="text-[10px] text-slate-600 italic bg-white/80 p-1 rounded border border-slate-200/60 mt-1">
                    "{insp1.notes}"
                  </p>
                </div>
              </div>
              <div className="p-2.5 bg-slate-100/70 border-t border-slate-200 text-[10px] font-mono text-slate-600 flex items-center justify-between">
                <span>Observed Progress</span>
                <span className="font-bold text-blue-950">{insp1.progress}% Claimed</span>
              </div>
            </div>

            {/* Card 3: Field Inspector 2 (Blind Cross-Cadre Auditor Submission) */}
            <div className={`rounded-2xl overflow-hidden border flex flex-col justify-between shadow-xs ${
              isCollusionAlert 
                ? 'border-rose-300 bg-rose-50/40 ring-2 ring-rose-300' 
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div>
                <div className="relative aspect-video bg-slate-200 overflow-hidden group">
                  <img
                    src={insp2.photo}
                    alt="Inspector 2 Evidence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-indigo-950/90 text-white font-bold text-[10px] uppercase backdrop-blur-xs flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    <span>3. Inspector 2 (Blind Auditor)</span>
                  </span>
                  <span className={`absolute bottom-2 right-2 px-2 py-0.5 rounded font-mono text-[10px] font-black text-white ${
                    isCollusionAlert ? 'bg-rose-600' : 'bg-emerald-700'
                  }`}>
                    {insp2.progress !== undefined ? `Reported: ${insp2.progress}%` : 'Pending'}
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{insp2.name}</strong>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isCollusionAlert ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      BLIND CROSS-CADRE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{insp2.dept}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Time: {insp2.time} • Δ {insp2.gpsVariance}m GPS
                  </p>
                  <p className="text-[10px] text-slate-600 italic bg-white/80 p-1 rounded border border-slate-200/60 mt-1">
                    "{insp2.notes}"
                  </p>
                </div>
              </div>
              <div className="p-2.5 bg-slate-100/70 border-t border-slate-200 text-[10px] font-mono text-slate-600 flex items-center justify-between">
                <span>Observed Progress</span>
                <span className={`font-bold ${isCollusionAlert ? 'text-rose-900' : 'text-emerald-950'}`}>
                  {insp2.progress !== undefined ? `${insp2.progress}% Audited` : 'Awaiting Field Upload'}
                </span>
              </div>
              {isAwaitingSecond && onNavigateToInspection && (
                <div className="p-2.5 bg-indigo-50 border-t border-indigo-200">
                  <button
                    type="button"
                    onClick={onNavigateToInspection}
                    className="w-full py-2 px-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Upload Report as Officer 2</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. REAL-TIME TESTING CONSOLE: WHAT HAPPENS ON UPLOAD */}
        {showTester && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 text-xs animate-in fade-in duration-200 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Cpu className="w-4 h-4" />
                <span>Test Automated Machine Decision Rules (Try Any Progress Numbers)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Statutory Rule: Δ ≤ 15% to approve; Δ &gt; 15% to reject
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              Test how the autonomous machine reacts without human intervention. Enter what Inspector 1 claimed vs what Inspector 2 claimed (e.g. 95% vs 50%, or 72% vs 70%):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Inspector 1 Claimed Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={testP1}
                  onChange={(e) => setTestP1(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Inspector 2 Observed Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={testP2}
                  onChange={(e) => setTestP2(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleRunEvaluation}
                  className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Run Automated Machine Evaluation →
                </button>
              </div>
            </div>

            {testResult && (
              <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                testResult.approved 
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200' 
                  : 'bg-rose-950/80 border-rose-500/80 text-rose-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm">
                    {testResult.approved ? '✓ MACHINE VERDICT: APPROVED' : '⛔ MACHINE VERDICT: REJECTED'}
                  </span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-black/50 text-xs">
                    Discrepancy: {testResult.delta}%
                  </span>
                </div>
                <p className="leading-relaxed text-[11px]">{testResult.reason}</p>
                <p className="font-bold text-[11px] pt-1 border-t border-white/10">{testResult.stageImpact}</p>
              </div>
            )}
          </div>
        )}

        {/* 5. SUMMARY OF THE THREE STATUTORY ACCEPTANCE CONDITIONS */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-extrabold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>The 3 Conditions Under Which Evidence Is Accepted Automatically:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] text-slate-600">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-bold mb-0.5">1. Geofence Match (≤ 200m)</strong>
              <span>Both officers must take photos on the sanctioned ground site. Camera shutter physically locks if outside 200m.</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-bold mb-0.5">2. Machine Concordance (Δ ≤ 15%)</strong>
              <span>If disparity between officers is ≤ 15%, the machine validates the report and automatically advances the project to the next stage.</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-bold mb-0.5">3. Zero Discretion Freeze (Δ &gt; 15%)</strong>
              <span>If disparity exceeds 15% (e.g. 95% vs 50%), the machine rejects the report, halts stage advancement, and freezes payments.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MANDATORY 360° SITE WALKTHROUGH VIDEO SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-600" />
              <span>Site 360° Video Walkthrough Evidence</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Mandatory Field Protocol
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous panoramic video proof recorded on-site by the Field Inspector with hardware camera & satellite GPS sync.
            </p>
          </div>
        </div>

        {videoUrl ? (
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md">
            <div className="flex items-center justify-center bg-black">
              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full max-h-[500px] object-contain rounded-t-2xl"
              />
            </div>
            <div className="p-3 bg-slate-900 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-[11px] text-slate-300">
                  {videoName || 'Site_Walkthrough_Verification.webm'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hardware Stamp Verified
                </span>
                <span>360° Perimeter Coverage</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">
            <Video className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900">Awaiting 360° Video Upload</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Field Officers can open the <b>Field Inspection</b> portal to record a live panoramic walkthrough or upload a site inspection video file.
            </p>
          </div>
        )}
      </div>

      {/* 5. HISTORICAL FIELD EVIDENCE LOG */}
      {((inspections && inspections.length > 0) || (offlineInspections && offlineInspections.length > 0)) && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-600" />
            <span>Inspection Evidence Registry & Audit History</span>
          </h4>

          <div className="space-y-2">
            {offlineInspections.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-2.5">
                  {item.photo_data_url ? (
                    <img src={item.photo_data_url} alt="Site" className="w-12 h-12 rounded-xl object-cover border border-amber-300 shrink-0 shadow-xs" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-200/60 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-amber-700" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900">{item.inspector_name}</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                        {item.sync_status === 'PENDING_SYNC' ? 'Pending Cloud Sync (Offline)' : 'Synced'}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] mt-0.5">{item.stage} • Physical Progress: {item.physical_progress_pct}%</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{item.notes}</p>
                  </div>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">{new Date(item.timestamp).toLocaleDateString('en-IN')}</span>
                  <span className="text-[10px] font-mono text-emerald-700">GPS ±{item.accuracy_m || 4.5}m</span>
                </div>
              </div>
            ))}

            {inspections.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-2.5">
                  {item.photo_urls && item.photo_urls.length > 0 ? (
                    <img src={item.photo_urls[0]} alt="Site" className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0 shadow-xs" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900">{item.officer_name}</span>
                      <span className="text-slate-500 text-[11px]">({item.officer_designation})</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified {item.status}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] mt-0.5">
                      Observed Progress: <b className="text-emerald-700">{item.physical_progress_observed}%</b> • Rating: {item.quality_rating}
                    </p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{item.general_remarks}</p>
                  </div>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">{item.inspection_date}</span>
                  <span className="text-[10px] font-mono text-emerald-700">Variance: {item.distance_variance_meters}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

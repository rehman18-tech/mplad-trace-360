import React, { useState } from 'react';
import { Dispute } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { Scale, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight, Eye, HelpCircle } from 'lucide-react';

interface DisputesPageProps {
  onOpenProject: (projectId: string) => void;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({ onOpenProject }) => {
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: "DSP-2026-00125",
      project_id: "MPLAD-AP-2026-00125",
      dispute_type: "Progress dispute",
      claimant: "Contractor",
      contractor_claim_progress: 80.0,
      officer_inspected_progress: 72.0,
      financial_progress_record: 74.0,
      ai_evidence_consistency: "Medium",
      claimed_amount: 350000.0,
      description: "Contractor submitted Running Account (RA) bill claiming 80% completion citing fabricated steel procured off-site. Field officer verified 72% on ground.",
      status: "UNDER_INVESTIGATION",
      resolution_summary: "Joint site measurement committee constituted by District Collector."
    },
    {
      id: "DSP-2026-00084",
      project_id: "MPLAD-UP-2026-00084",
      dispute_type: "Payment & Quality dispute",
      claimant: "Contractor & Citizen Ward",
      contractor_claim_progress: 85.0,
      officer_inspected_progress: 55.0,
      financial_progress_record: 91.5,
      ai_evidence_consistency: "Low",
      claimed_amount: 420000.0,
      description: "Discrepancy detected between contractor claim (85%) and Jal Nigam physical verification (55%). Citizen complaint logged regarding RO membrane non-delivery.",
      status: "ESCALATED",
      resolution_summary: "Notice issued to agency. Payment withheld pending membrane installation audit."
    },
    {
      id: "DSP-2026-00411",
      project_id: "MPLAD-BR-2026-00411",
      dispute_type: "Variation claim",
      claimant: "Contractor",
      contractor_claim_progress: 50.0,
      officer_inspected_progress: 38.0,
      financial_progress_record: 57.1,
      ai_evidence_consistency: "Low",
      claimed_amount: 680000.0,
      description: "Contractor claimed foundation depth increase due to sandy riverbed soil. PWD executive engineer disputed extra rate without prior administrative sanction.",
      status: "UNDER_INVESTIGATION",
      resolution_summary: "Soil core test records called for technical review."
    }
  ]);

  const [selectedDispute, setSelectedDispute] = useState<Dispute>(disputes[0]);
  const [resolutionNote, setResolutionNote] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleResolve = (status: 'RESOLVED' | 'ESCALATED') => {
    setDisputes(prev => prev.map(d => d.id === selectedDispute.id ? { ...d, status, resolution_summary: resolutionNote || 'Action updated by District Planning Authority' } : d));
    setSelectedDispute(prev => ({ ...prev, status, resolution_summary: resolutionNote || 'Action updated by District Planning Authority' }));
    setSuccessMsg(`Dispute updated to: ${status}. Case file synchronized.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <Scale className="w-6 h-6 text-gov-saffron" />
              <span>Contractual Dispute & Discrepancy Management</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Multi-dimensional cross-check comparing Contractor Claims vs. Field Officer MB Records vs. Financial Ledger Velocity.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300">
            {disputes.length} Active Discrepancies Under Investigation
          </span>
        </div>

        {/* Core Principles */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Neutral Governance Standard:</strong> The platform classifies variances as <em>"Potential Progress Discrepancy / Requires Official Joint Verification"</em> rather than unsupported fraud allegations.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispute Cases List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Dispute Cases</h3>
          {disputes.map((d) => {
            const isSelected = selectedDispute.id === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDispute(d)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-slate-500 font-bold">{d.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    d.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                    d.status === 'ESCALATED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-gov-navy text-xs mt-1 truncate">{d.project_id}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{d.description}</p>
              </div>
            );
          })}
        </div>

        {/* Deep Discrepancy Comparison Inspector */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Case Reference</span>
                <h3 className="text-base font-extrabold text-gov-navy">{selectedDispute.id} ({selectedDispute.dispute_type})</h3>
              </div>
              <button
                onClick={() => onOpenProject(selectedDispute.project_id)}
                className="text-xs font-bold text-gov-navy hover:text-gov-saffron flex items-center gap-1"
              >
                <span>View Full Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Discrepancy Signal Meter */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider block mb-3">
                Discrepancy Analysis: Contractor vs Officer vs Treasury
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase block">Contractor Claim</span>
                  <span className="text-xl font-extrabold text-gov-navy mt-1 block">
                    {selectedDispute.contractor_claim_progress}%
                  </span>
                  <span className="text-[10px] text-slate-400">RA Bill Submission</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase block">Officer Inspection</span>
                  <span className="text-xl font-extrabold text-emerald-700 mt-1 block">
                    {selectedDispute.officer_inspected_progress}%
                  </span>
                  <span className="text-[10px] text-slate-400">MB Record #2</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase block">Disbursed Ledger</span>
                  <span className="text-xl font-extrabold text-blue-700 mt-1 block">
                    {selectedDispute.financial_progress_record}%
                  </span>
                  <span className="text-[10px] text-slate-400">Treasury Released</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase block">AI CV Consistency</span>
                  <span className="text-xl font-extrabold text-amber-600 mt-1 block">
                    {selectedDispute.ai_evidence_consistency}
                  </span>
                  <span className="text-[10px] text-slate-400">Visual Correlation</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-950 font-medium">
                <strong>Variance Detected:</strong> Contractor claim exceeds certified field measurement by {
                  ((selectedDispute.contractor_claim_progress || 0) - (selectedDispute.officer_inspected_progress || 0)).toFixed(1)
                } percentage points (Claimed value: {formatIndianCurrency(selectedDispute.claimed_amount || 0)}).
              </div>
            </div>

            {/* Case Details */}
            <div className="space-y-3 text-xs mb-4">
              <div>
                <span className="font-semibold text-slate-500 block">Factual Summary:</span>
                <p className="text-slate-800 leading-relaxed mt-1">{selectedDispute.description}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-500 block">Resolution Status:</span>
                <p className="text-slate-800 mt-1 font-medium">{selectedDispute.resolution_summary || 'Under preliminary administrative review.'}</p>
              </div>
            </div>

            {/* Resolution Input */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Enter Resolution / Directive Note:</label>
              <input
                type="text"
                placeholder="Enter inquiry findings, joint survey date, or final settlement order..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gov-navy"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {successMsg && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded">
                ✓ {successMsg}
              </span>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => handleResolve('ESCALATE' as any)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Escalate to Superintending Engineer
              </button>

              <button
                onClick={() => handleResolve('RESOLVED')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Mark Case Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DuplicateCandidate } from '../types';
import { 
  AlertTriangle, Clock, IndianRupee, Layers, Scale, 
  ShieldAlert, CheckCircle2, XCircle, HelpCircle, ArrowRight, Eye, ShieldCheck 
} from 'lucide-react';

interface AIRiskCenterPageProps {
  onOpenProject: (projectId: string) => void;
}

export const AIRiskCenterPage: React.FC<AIRiskCenterPageProps> = ({ onOpenProject }) => {
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<DuplicateCandidate | null>(null);
  const [officerNote, setOfficerNote] = useState('');
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

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

  const anomalyCards = [
    { title: 'Cost Anomalies', count: 24, icon: IndianRupee, color: 'text-orange-600 bg-orange-50 border-orange-200', desc: 'Disbursements exceeding approved milestone DPR or contract cap' },
    { title: 'Delay Risks', count: 87, icon: Clock, color: 'text-red-600 bg-red-50 border-red-200', desc: 'Active works logging >45 days execution slippage' },
    { title: 'Fund Mismatches', count: 13, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200', desc: 'Financial progress delta >20% relative to physical MB cert' },
    { title: 'Possible Duplicate Works', count: 9, icon: Layers, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', desc: 'Spatial proximity overlap with existing state/central schemes' },
    { title: 'Contract Disputes', count: 18, icon: Scale, color: 'text-purple-600 bg-purple-50 border-purple-200', desc: 'Unresolved contractor claims vs field officer physical measurements' },
    { title: 'Guarantee Alerts', count: 31, icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200', desc: 'Performance securities or defect liability expiring in <30 days' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-gov-saffron" />
              <span>AI Risk & Anomaly Early-Warning Center</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Surveillance intelligence scanning 100% of MPLADS records for spatial duplicates, expenditure anomalies, and guarantee expirations.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            Rule-Based Deterministic + ML Heuristics
          </span>
        </div>

        {/* 6 Core Anomaly Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {anomalyCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className={`p-4 rounded-xl border ${card.color} flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  <span className="text-2xl font-extrabold">{card.count}</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-tight mb-1">{card.title}</h4>
                  <p className="text-[10px] opacity-80 line-clamp-2">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Duplicate Work Detection Module */}
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
    </div>
  );
};

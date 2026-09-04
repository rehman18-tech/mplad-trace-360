import React from 'react';
import { HelpCircle, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WhyAmISeeingThisProps {
  observedData: string;
  expectedData: string;
  difference: string;
  source?: string;
  confidenceScore: number;
  recommendedAction: string;
}

export const WhyAmISeeingThis: React.FC<WhyAmISeeingThisProps> = ({
  observedData,
  expectedData,
  difference,
  source = 'MPLAD-TRACE Multi-Factor Analytical Engine',
  confidenceScore,
  recommendedAction,
}) => {
  const confPct = Math.round(confidenceScore * 100);

  return (
    <div className="bg-amber-50/70 rounded-xl border border-amber-200 p-5 text-xs text-slate-800 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/80 mb-3">
        <h4 className="font-bold text-gov-navy text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-gov-saffron" />
          <span>Why Am I Seeing This? (Transparent AI Inference Breakdown)</span>
        </h4>
        <span className="font-semibold text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          Confidence: {confPct}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-white/90 rounded-lg border border-amber-200/60">
          <span className="text-slate-500 font-medium block text-[11px]">Observed Data (Official Ingestion)</span>
          <p className="font-bold text-gov-charcoal mt-1 text-xs leading-relaxed">{observedData}</p>
        </div>

        <div className="p-3 bg-white/90 rounded-lg border border-amber-200/60">
          <span className="text-slate-500 font-medium block text-[11px]">Expected Benchmark Data</span>
          <p className="font-bold text-gov-navy mt-1 text-xs leading-relaxed">{expectedData}</p>
        </div>

        <div className="p-3 bg-white/90 rounded-lg border border-amber-200/60">
          <span className="text-slate-500 font-medium block text-[11px]">Calculated Variance / Delta</span>
          <p className="font-bold text-red-700 mt-1 text-xs leading-relaxed">{difference}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-amber-200/80">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-semibold text-slate-500">Source:</span>
          <span>{source}</span>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-300 text-gov-navy font-semibold flex items-center gap-1.5">
          <span className="text-gov-saffron font-bold">Recommended Action:</span>
          <span>{recommendedAction}</span>
        </div>
      </div>
    </div>
  );
};

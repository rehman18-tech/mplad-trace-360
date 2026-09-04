import React from 'react';
import { DelayPrediction } from '../../types';
import { Clock, Calendar, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface DelayPredictionCardProps {
  prediction: DelayPrediction;
}

export const DelayPredictionCard: React.FC<DelayPredictionCardProps> = ({ prediction }) => {
  return (
    <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
            <Clock className="w-5 h-5 text-gov-saffron" />
            <span>AI Completion Forecasting & Delay Risk</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bayesian milestone velocity model evaluating contractor delivery history, seasonal logistics, and disbursement velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              prediction.delay_probability_pct > 70
                ? 'bg-red-100 text-red-800'
                : prediction.delay_probability_pct > 40
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            Delay Probability: {prediction.delay_probability_pct}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-[11px] block font-medium">Original Sanction Deadline</span>
          <div className="flex items-center gap-2 mt-1 text-sm font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{prediction.original_completion_date}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-amber-800 text-[11px] block font-medium">Forecasted Handover Date</span>
          <div className="flex items-center gap-2 mt-1 text-sm font-extrabold text-gov-navy">
            <Calendar className="w-4 h-4 text-gov-saffron" />
            <span>{prediction.predicted_completion_date}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200">
          <span className="text-red-800 text-[11px] block font-medium">Projected Milestone Slippage</span>
          <div className="flex items-center gap-2 mt-1 text-sm font-extrabold text-red-700">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>+{prediction.projected_delay_days} Days Delay</span>
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2">
          Key Contributing Factors Identified by ML Model:
        </h5>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {prediction.contributing_factors.map((factor, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron mt-1.5 shrink-0"></span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          {prediction.notice}
        </span>
        <span>Confidence: {Math.round(prediction.confidence_score * 100)}%</span>
      </div>
    </div>
  );
};

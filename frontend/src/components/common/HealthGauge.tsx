import React from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface HealthGaugeProps {
  score: number; // 0 - 100 overall risk
  financialHealth: number;
  physicalHealth: number;
  contractHealth: number;
  scheduleHealth: number;
  evidenceHealth: number;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  financialHealth,
  physicalHealth,
  contractHealth,
  scheduleHealth,
  evidenceHealth,
}) => {
  // Score is risk (0 is best, 100 is critical)
  const healthOverall = Math.max(5, 100 - score);

  const getScoreColor = (val: number, isRisk: boolean = false) => {
    if (isRisk) {
      if (val >= 75) return 'text-red-600 stroke-red-600 bg-red-50';
      if (val >= 50) return 'text-orange-600 stroke-orange-600 bg-orange-50';
      if (val >= 30) return 'text-amber-600 stroke-amber-600 bg-amber-50';
      return 'text-emerald-700 stroke-emerald-700 bg-emerald-50';
    }
    // Health (100 is best)
    if (val >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 60) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (val >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const dimensions = [
    { label: 'Financial Health', val: financialHealth, desc: 'Utilization vs milestone ratio' },
    { label: 'Physical Health', val: physicalHealth, desc: 'On-ground structural completion' },
    { label: 'Contract Health', val: contractHealth, desc: 'Tender baseline & contractor track' },
    { label: 'Schedule Health', val: scheduleHealth, desc: 'Pacing vs sanctioned completion' },
    { label: 'Evidence Health', val: evidenceHealth, desc: 'Geotags, MB records & CV audit' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Main Risk Gauge */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Ashoka decorative background ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`transition-all duration-1000 ease-out ${
                  score >= 75 ? 'stroke-red-600' : score >= 50 ? 'stroke-orange-500' : score >= 30 ? 'stroke-amber-500' : 'stroke-emerald-600'
                }`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-gov-navy tracking-tight">{score}</span>
              <span className="text-[10px] font-semibold tracking-wider text-gov-charcoal-muted uppercase">Risk Score</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                score >= 75
                  ? 'bg-red-100 text-red-800'
                  : score >= 50
                  ? 'bg-orange-100 text-orange-800'
                  : score >= 30
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {score >= 75 ? <ShieldAlert className="w-3.5 h-3.5" /> : score >= 30 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
              {score >= 75 ? 'Critical Surveillance' : score >= 50 ? 'High Risk Review' : score >= 30 ? 'Watch List' : 'Normal Operation'}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Requires official verification</p>
          </div>
        </div>

        {/* 5-Dimension Health Grid */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h4 className="text-sm font-bold text-gov-navy uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-navy"></span>
              5-Dimension Project Health Assessment
            </h4>
            <span className="text-xs text-slate-500">Overall Integrity: <strong className="text-gov-navy">{healthOverall}%</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dimensions.map((dim, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gov-charcoal">{dim.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(dim.val)}`}>
                    {dim.val}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      dim.val >= 80 ? 'bg-emerald-600' : dim.val >= 60 ? 'bg-blue-600' : dim.val >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${dim.val}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 truncate" title={dim.desc}>{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, Cpu, Database } from 'lucide-react';

interface SourceTagProps {
  sourceType: 'GOVERNMENT' | 'AI_INFERENCE' | 'CITIZEN_SUBMISSION' | 'FIELD_INSPECTION';
  sourceName?: string;
  size?: 'sm' | 'md';
}

export const SourceTag: React.FC<SourceTagProps> = ({ sourceType, sourceName, size = 'sm' }) => {
  const isGov = sourceType === 'GOVERNMENT' || sourceType === 'FIELD_INSPECTION';
  const isAI = sourceType === 'AI_INFERENCE';

  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  if (isGov) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClass}`}
        title="Official verified record derived from government e-governance databases"
      >
        <ShieldCheck className="w-3 h-3 text-emerald-700" />
        <span>Gov Record: {sourceName || 'e-SAKSHI Verified'}</span>
      </span>
    );
  }

  if (isAI) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded bg-indigo-50 text-indigo-800 border border-indigo-200 ${sizeClass}`}
        title="Predictive or anomaly detection score calculated by MPLAD-TRACE analytics"
      >
        <Cpu className="w-3 h-3 text-indigo-600" />
        <span>AI Inference: {sourceName || 'MPLAD-TRACE 360'}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded bg-slate-100 text-slate-700 border border-slate-200 ${sizeClass}`}>
      <Database className="w-3 h-3 text-slate-500" />
      <span>{sourceName || 'External Record'}</span>
    </span>
  );
};

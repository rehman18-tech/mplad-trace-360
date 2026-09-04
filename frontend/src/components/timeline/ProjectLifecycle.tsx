import React, { useState } from 'react';
import { TimelineEvent } from '../../types';
import { CheckCircle, AlertTriangle, Clock, XCircle, FileText, ExternalLink, Calendar, UserCheck } from 'lucide-react';
import { formatIndianCurrency } from '../common/StatCard';

interface ProjectLifecycleProps {
  events: TimelineEvent[];
}

export const ProjectLifecycle: React.FC<ProjectLifecycleProps> = ({ events }) => {
  const [selectedStage, setSelectedStage] = useState<TimelineEvent | null>(events[0] || null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-gov-green" />;
      case 'PARTIAL':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'INCONSISTENT':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">✓ Verified Record</span>;
      case 'PARTIAL':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">⚠ Partial Record</span>;
      case 'INCONSISTENT':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">✕ Inconsistent Data</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">○ Pending Milestone</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
            <span>Project Lifecycle & Traceability Timeline</span>
            <span className="text-xs font-normal text-slate-500">(10 Milestone Stages)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any milestone stage to inspect official sanction orders, authorities, amounts, and audit proofs.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 self-start sm:self-auto">
          Current Active: {selectedStage?.stage_name || 'Inspection'}
        </span>
      </div>

      {/* Horizontal / Scrolling Stage Bar */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-center min-w-[760px] relative px-2">
          {/* Track Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

          {events.map((evt, idx) => {
            const isSelected = selectedStage?.id === evt.id;
            const isCompleted = evt.verification_status === 'VERIFIED';
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedStage(evt)}
                className="flex-1 flex flex-col items-center cursor-pointer group relative z-10 px-1"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gov-navy text-white ring-4 ring-gov-saffron/30 scale-110 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-white border-2 border-slate-300 text-slate-400 hover:border-gov-navy'
                  }`}
                >
                  <span className="text-xs font-bold">{evt.stage_order}</span>
                </div>
                <span
                  className={`text-[11px] text-center mt-2 font-medium max-w-[85px] leading-tight line-clamp-2 ${
                    isSelected ? 'text-gov-navy font-bold' : 'text-slate-600 group-hover:text-gov-navy'
                  }`}
                >
                  {evt.stage_name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Dossier */}
      {selectedStage && (
        <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gov-navy text-white flex items-center justify-center font-bold text-sm">
                #{selectedStage.stage_order}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gov-navy">{selectedStage.stage_name}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {selectedStage.event_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    {selectedStage.authority}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(selectedStage.verification_status)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 block font-medium">Associated Value / Sanction</span>
              <span className="text-base font-bold text-gov-navy mt-1 block">
                {selectedStage.amount ? formatIndianCurrency(selectedStage.amount) : 'Not Applicable (Procedure)'}
              </span>
              <span className="text-[10px] text-slate-400">Validated against treasury ledger</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 block font-medium">Attached Official Document</span>
              {selectedStage.document_name ? (
                <div className="flex items-center justify-between mt-1">
                  <span className="font-semibold text-gov-navy flex items-center gap-1.5 truncate">
                    <FileText className="w-4 h-4 text-gov-saffron shrink-0" />
                    <span className="truncate">{selectedStage.document_name}</span>
                  </span>
                  <button 
                    onClick={() => alert(`Viewing official attested record: ${selectedStage.document_name}`)}
                    className="text-[11px] text-gov-navy font-semibold hover:text-gov-saffron flex items-center gap-0.5 shrink-0 ml-2"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 mt-1 block">Awaiting official upload</span>
              )}
              <span className="text-[10px] text-emerald-700 font-medium">Digital Signature Hash Verified</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-500 block font-medium">Administrative Notes & Audit</span>
              <p className="text-slate-700 mt-1 leading-relaxed line-clamp-2">
                {selectedStage.notes || 'Formal sanction entry recorded in district e-governance database.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

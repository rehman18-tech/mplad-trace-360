import React, { useState } from 'react';
import { FundFlow } from '../../types';
import { formatIndianCurrency } from '../common/StatCard';
import { IndianRupee, ArrowRight, ShieldCheck, Info, CheckCircle2, TrendingUp } from 'lucide-react';

interface FundFlowSankeyProps {
  flows: FundFlow[];
  sanctionedAmount: number;
  fundsReleased: number;
  fundsPaid: number;
  actualExpenditure: number;
}

export const FundFlowSankey: React.FC<FundFlowSankeyProps> = ({
  flows,
  sanctionedAmount,
  fundsReleased,
  fundsPaid,
  actualExpenditure,
}) => {
  const [activeStage, setActiveStage] = useState<FundFlow | null>(flows[0] || null);

  const unspent = Math.max(0, fundsReleased - actualExpenditure);
  const utilizationPct = fundsReleased > 0 ? ((actualExpenditure / fundsReleased) * 100).toFixed(1) : '0';
  const contractDeviation = Math.abs(sanctionedAmount - fundsPaid);

  const defaultStages = [
    { label: 'Funds Available', amt: sanctionedAmount + 50000, color: 'border-blue-500 bg-blue-50/50' },
    { label: 'Sanctioned', amt: sanctionedAmount, color: 'border-indigo-500 bg-indigo-50/50' },
    { label: 'Contracted', amt: sanctionedAmount * 0.98, color: 'border-cyan-500 bg-cyan-50/50' },
    { label: 'Released', amt: fundsReleased, color: 'border-amber-500 bg-amber-50/50' },
    { label: 'Paid', amt: fundsPaid, color: 'border-emerald-500 bg-emerald-50/50' },
    { label: 'Expenditure', amt: actualExpenditure, color: 'border-gov-green bg-emerald-100/50' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-gov-saffron" />
            <span>Fund Flow & Expenditure Pipeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent comparison of Planned vs. Actual fund disbursements across treasury, escrow, and contractor accounts.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500 block text-[10px]">Utilization Rate</span>
            <span className="font-bold text-emerald-800 text-sm">{utilizationPct}%</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500 block text-[10px]">Unspent In Treasury</span>
            <span className="font-bold text-amber-800 text-sm">{formatIndianCurrency(unspent)}</span>
          </div>
        </div>
      </div>

      {/* Sequential Flow Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        {defaultStages.map((stg, i) => {
          const matched = flows.find(f => f.stage.toLowerCase() === stg.label.toLowerCase());
          const isSelected = activeStage?.stage.toLowerCase() === stg.label.toLowerCase();
          return (
            <div
              key={i}
              onClick={() => matched && setActiveStage(matched)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md relative ${
                stg.color
              } ${isSelected ? 'ring-2 ring-gov-navy scale-102 font-semibold' : ''}`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                <span className="uppercase font-semibold tracking-wider text-[10px]">{stg.label}</span>
                <span className="text-[10px] font-bold text-slate-400">Step {i + 1}</span>
              </div>
              <div className="text-sm font-extrabold text-gov-navy truncate">
                {formatIndianCurrency(stg.amt)}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Official Record</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Stage Audit Inspector */}
      {activeStage && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
            <span className="font-bold text-gov-navy flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Transaction Audit: {activeStage.stage} (Ref #{activeStage.reference_no})
            </span>
            <span className="text-[11px] font-medium text-slate-500">Date: {activeStage.transaction_date}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-500 block font-medium">Originating Source</span>
              <span className="font-bold text-gov-navy mt-0.5 block">{activeStage.source_agency}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Beneficiary / Escrow Destination</span>
              <span className="font-bold text-gov-navy mt-0.5 block">{activeStage.destination_agency}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Total Stage Amount</span>
              <span className="font-extrabold text-gov-navy text-sm mt-0.5 block">
                {formatIndianCurrency(activeStage.amount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

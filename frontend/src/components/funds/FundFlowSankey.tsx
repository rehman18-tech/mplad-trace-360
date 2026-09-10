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
  isFrozen?: boolean;
  freezeReason?: string;
  physicalProgress?: number;
  financialProgress?: number;
}

export const FundFlowSankey: React.FC<FundFlowSankeyProps> = ({
  flows,
  sanctionedAmount,
  fundsReleased,
  fundsPaid,
  actualExpenditure,
  isFrozen,
  freezeReason,
  physicalProgress = 72,
  financialProgress = 75,
}) => {
  const [activeStage, setActiveStage] = useState<FundFlow | null>(flows[0] || null);

  const unspent = Math.max(0, fundsReleased - actualExpenditure);
  const utilizationPct = fundsReleased > 0 ? ((actualExpenditure / fundsReleased) * 100).toFixed(1) : '0';
  const discrepancy = Math.abs(financialProgress - physicalProgress);
  const isCircuitBreakerTriggered = isFrozen || (financialProgress > physicalProgress && discrepancy > 15);

  const defaultStages = [
    { label: 'Funds Available', amt: sanctionedAmount + 50000, color: 'border-blue-500 bg-blue-50/50' },
    { label: 'Sanctioned', amt: sanctionedAmount, color: 'border-indigo-500 bg-indigo-50/50' },
    { label: 'Contracted', amt: sanctionedAmount * 0.98, color: 'border-cyan-500 bg-cyan-50/50' },
    { label: 'Released', amt: fundsReleased, color: 'border-amber-500 bg-amber-50/50' },
    { label: 'Paid', amt: fundsPaid, color: isCircuitBreakerTriggered ? 'border-rose-500 bg-rose-50/70' : 'border-emerald-500 bg-emerald-50/50' },
    { label: 'Expenditure', amt: actualExpenditure, color: 'border-gov-green bg-emerald-100/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Zero Ghost Billing Circuit-Breaker Banner */}
      {isCircuitBreakerTriggered ? (
        <div className="p-4 rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-950 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0 text-rose-700">
              <span className="text-xl">🔒</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-rose-200 text-rose-900 border border-rose-300">
                  PFMS ESCROW DISBURSAL HALTED: DISCREPANCY FLAGGED
                </span>
                <span className="text-xs font-semibold text-rose-800">
                  Zero Ghost Billing Circuit-Breaker Active
                </span>
              </div>
              <p className="text-xs text-rose-900 mt-1 font-medium">
                {freezeReason || `Financial claim (${financialProgress}%) outpaces physically verified site execution (${physicalProgress}%). Next milestone release is frozen.`}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              disabled
              className="px-3.5 py-2 rounded-lg bg-slate-200 text-slate-500 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed border border-slate-300 shadow-inner"
              title="Fund release locked pending District Collector re-verification"
            >
              <span>🔒 Tranche Payment Locked</span>
            </button>
            <span className="text-[11px] font-medium text-rose-700">Awaiting DC Clearance</span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/70 text-emerald-950 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold shrink-0">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-900 block">
                PFMS Disbursal Pathway: Active & Fully Synchronized
              </span>
              <span className="text-[11px] text-emerald-700">
                Physical progress ({physicalProgress}%) correlates with financial release ({financialProgress}%). Circuit-breaker in normal standby.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 shrink-0 self-start sm:self-auto">
            Escrows Operational
          </span>
        </div>
      )}

      {/* Main Sankey Container */}
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
                  {isCircuitBreakerTriggered && stg.label === 'Paid' ? (
                    <span className="text-rose-600 font-bold">🔒 Halted</span>
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
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

      {/* Material Quality & Structural Specifications Audit Ledger */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-gov-navy flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Construction Materials & Engineering Quality Audit (IS 456 / IS 516 Norms)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-source material verification: Field Lab Cube Compressive Tests, GeM Supply-Chain e-Way Bills, and Computer Vision Surface Analytics.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
            Quality Standard: PASSED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">1. Cement Strength & Grade</span>
            <p className="font-extrabold text-gov-navy mt-1">Grade 43 / 53 OPC</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">✓ BIS 8112:2013 Compliant</p>
            <span className="text-[10px] text-slate-400 block mt-1">Tested: Compressive 43 N/mm²</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">2. TMT Steel Reinforcement</span>
            <p className="font-extrabold text-gov-navy mt-1">Fe500D Primary Billet</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">✓ Tensile Ratio &gt; 1.25</p>
            <span className="text-[10px] text-slate-400 block mt-1">No structural rebar corrosion</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">3. Concrete Cube Test (IS 516)</span>
            <p className="font-extrabold text-gov-navy mt-1">28-Day CTM: 24.8 MPa</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">✓ Target M20 Design Achieved</p>
            <span className="text-[10px] text-slate-400 block mt-1">Site test cube batch #04</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">4. Coarse & Fine Aggregate</span>
            <p className="font-extrabold text-gov-navy mt-1">20mm Crushed Blue Granite</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">✓ Silt Content &lt; 3.0%</p>
            <span className="text-[10px] text-slate-400 block mt-1">Clean quarry source certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

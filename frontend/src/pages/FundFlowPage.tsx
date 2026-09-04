import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project, OverviewAnalytics } from '../types';
import { StatCard, formatIndianCurrency } from '../components/common/StatCard';
import { IndianRupee, ArrowRight, TrendingUp, ShieldCheck, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

interface FundFlowPageProps {
  onOpenProject: (projectId: string) => void;
}

export const FundFlowPage: React.FC<FundFlowPageProps> = ({ onOpenProject }) => {
  const [analytics, setAnalytics] = useState<OverviewAnalytics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.getOverviewAnalytics().then(setAnalytics).catch(() => {});
    api.getProjects().then(setProjects).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-gov-saffron" />
              <span>Fund Flow & Public Expenditure Intelligence</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end tracking: Ministry Allocation → District Sanction → Work Escrow → Contractor Disbursal → Physical Milestone.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 self-start md:self-auto">
            PFMS Treasury Node Synchronized
          </span>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Total Sanctioned"
            value={analytics ? analytics.total_sanctioned_amount : 124500000}
            icon={IndianRupee}
            inr={true}
            subtitle="Official MPLADS Allocation"
          />
          <StatCard
            title="Funds Released"
            value={analytics ? analytics.total_funds_released : 108200000}
            icon={TrendingUp}
            inr={true}
            subtitle="Disbursed to District Escrow"
          />
          <StatCard
            title="Actual Expenditure"
            value={analytics ? analytics.total_actual_expenditure : 89400000}
            icon={CheckCircle2}
            inr={true}
            subtitle="Verified in Measurement Books"
            badge={{ text: `${analytics?.fund_utilization_pct || 82}% Utilization`, variant: 'positive' }}
          />
          <StatCard
            title="Unspent Balance"
            value={analytics ? analytics.unspent_balance : 18800000}
            icon={AlertTriangle}
            inr={true}
            subtitle="Lying in District Treasuries"
            badge={{ text: 'Action Required', variant: 'warning' }}
          />
        </div>
      </div>

      {/* Project Financial Breakdown Table */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-gov-navy">Project-Wise Fund Disbursal & Utilization</h3>
          <span className="text-xs text-slate-500">Showing {projects.length} works</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold">Project ID & Title</th>
                <th className="p-3 font-semibold">State / District</th>
                <th className="p-3 font-semibold text-right">Sanctioned (₹)</th>
                <th className="p-3 font-semibold text-right">Released (₹)</th>
                <th className="p-3 font-semibold text-right">Expenditure (₹)</th>
                <th className="p-3 font-semibold text-center">Utilization</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.slice(0, 15).map((p) => {
                const util = p.funds_released > 0 ? Math.round((p.actual_expenditure / p.funds_released) * 100) : 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium">
                      <span className="font-mono text-[11px] text-slate-500 block">{p.id}</span>
                      <span className="font-bold text-gov-navy block truncate max-w-xs">{p.title}</span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {p.district}, {p.state}
                    </td>
                    <td className="p-3 text-right font-bold text-gov-navy">
                      {formatIndianCurrency(p.sanctioned_amount)}
                    </td>
                    <td className="p-3 text-right text-slate-700">
                      {formatIndianCurrency(p.funds_released)}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      {formatIndianCurrency(p.actual_expenditure)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        util >= 80 ? 'bg-emerald-100 text-emerald-800' : util >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {util}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onOpenProject(p.id)}
                        className="p-1.5 rounded hover:bg-slate-200 text-gov-navy font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-gov-saffron" />
                        <span>Trace</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

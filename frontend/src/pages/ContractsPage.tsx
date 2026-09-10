import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project, Contractor } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { FileText, Building, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Eye } from 'lucide-react';

interface ContractsPageProps {
  onOpenProject: (projectId: string) => void;
  onSelectContractor?: (contractorId: string) => void;
}

export const ContractsPage: React.FC<ContractsPageProps> = ({ onOpenProject, onSelectContractor }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getContractHealthBadge = (p: Project) => {
    if (p.delay_days > 90 || p.overall_risk_score >= 75) {
      return <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 whitespace-nowrap shadow-2xs">🔴 Critical</span>;
    }
    if (p.delay_days > 45 || p.overall_risk_score >= 50) {
      return <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 whitespace-nowrap shadow-2xs">🟠 High Risk</span>;
    }
    if (p.delay_days > 0 || p.overall_risk_score >= 30) {
      return <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap shadow-2xs">🟡 Attention</span>;
    }
    return <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap shadow-2xs">🟢 Normal</span>;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <FileText className="w-6 h-6 text-gov-saffron" />
              <span>Contracts Registry & SLA Monitoring</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Public contracts registry tracking agreed tender baselines, performance securities, defect liabilities, and contract health.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded bg-slate-100 text-slate-700">
            {projects.length} Active Public Contracts
          </span>
        </div>

        {/* Contract Health Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs mt-4 pt-2">
          <span className="font-bold text-gov-navy text-[11px] uppercase tracking-wider">Contract Health Legend:</span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-800">🟢 Normal (On Schedule & Compliant)</span>
          <span className="flex items-center gap-1.5 font-medium text-amber-800">🟡 Attention (&lt;45d delay)</span>
          <span className="flex items-center gap-1.5 font-medium text-orange-800">🟠 High Risk (Significant lag)</span>
          <span className="flex items-center gap-1.5 font-medium text-red-800">🔴 Critical (Default / Abandonment risk)</span>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold">Contractor & Reg</th>
                <th className="p-3 font-semibold">Work Agreement</th>
                <th className="p-3 font-semibold text-right">Contract Value (₹)</th>
                <th className="p-3 font-semibold text-center">Start / Target Date</th>
                <th className="p-3 font-semibold text-center">Defect Liability</th>
                <th className="p-3 font-semibold text-center">Contract Health</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.slice(0, 15).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium">
                    <span className="font-bold text-gov-navy block">{p.contractor_name || 'Assigned PWD Agency'}</span>
                    <span className="font-mono text-[10px] text-slate-400">{p.contractor_id || 'CON-REG-AUTO'}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-gov-charcoal block truncate max-w-xs">{p.title}</span>
                    <span className="text-[10px] text-slate-400">{p.id}</span>
                  </td>
                  <td className="p-3 text-right font-extrabold text-gov-navy whitespace-nowrap">
                    {formatIndianCurrency(p.contract_amount || p.sanctioned_amount)}
                  </td>
                  <td className="p-3 text-center text-slate-600 whitespace-nowrap min-w-[120px]">
                    <div className="text-[11px] font-bold text-gov-navy">{p.start_date || '2025-06-01'}</div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Due: {p.expected_completion_date || '2026-03-31'}</div>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                      36 Months
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap min-w-[130px]">
                    {getContractHealthBadge(p)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onOpenProject(p.id)}
                      className="p-1.5 rounded hover:bg-slate-200 text-gov-navy font-semibold text-xs inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-gov-saffron" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project, OverviewAnalytics } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { FileCheck, Download, Printer, ShieldCheck, ArrowRight, Eye, Calendar, Building } from 'lucide-react';

interface ReportsPageProps {
  onOpenProject: (projectId: string) => void;
  selectedProjectId?: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onOpenProject, selectedProjectId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState(selectedProjectId || 'MPLAD-AP-2026-00125');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    api.getProjects().then(list => {
      setProjects(list);
      if (!selectedId && list.length > 0) setSelectedId(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedId) {
      api.getProjectById(selectedId).then(setActiveProject);
    }
  }, [selectedId]);

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    if (projects.length === 0) return;
    const headers = ["Project ID", "Title", "State", "District", "Category", "Status", "Sanctioned Amount", "Physical Progress %", "Financial Progress %", "Risk Score"];
    const rows = projects.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.state,
      p.district,
      p.category,
      p.status,
      p.sanctioned_amount,
      p.physical_progress,
      p.financial_progress,
      p.overall_risk_score
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MPLAD_TRACE_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 print-full">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-gov-saffron" />
              <span>Official Dossier & Audit Report Generator</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generate standardized parliamentary and district transparency audit reports, formatted for official review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-gov-navy focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.title.slice(0, 35)}...
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-navy-light transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-gov-saffron" />
              <span>Print / Export PDF</span>
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Official Statutory Documents & Master Manual Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gov-navy flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-4 h-4 text-gov-saffron" />
            </div>
            <div>
              <div className="text-xs font-bold text-gov-navy flex items-center gap-1.5">
                <span>Official System & Feature Manual (MoSPI & CVC Compliant)</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  7 Pages • 27 Chapters
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Complete technical architecture, satellite GPS outbox, AI vision, and 7-factor risk scoring compendium.
              </p>
            </div>
          </div>
          <a
            href="/MPLAD_TRACE_360_COMPLETE_SYSTEM_AND_USER_MANUAL.pdf"
            download="MPLAD_TRACE_360_COMPLETE_SYSTEM_AND_USER_MANUAL.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gov-saffron" />
            <span>Download Master Manual PDF</span>
          </a>
        </div>
      </div>

      {/* Official Printable Dossier */}
      {activeProject && (
        <div className="bg-white rounded-2xl border border-slate-300 p-8 md:p-12 shadow-gov max-w-4xl mx-auto text-xs space-y-6">
          {/* Government Formal Header */}
          <div className="text-center pb-6 border-b-2 border-slate-800 space-y-1">
            <div className="w-12 h-12 rounded-full border-2 border-slate-800 mx-auto flex items-center justify-center font-bold text-slate-800 text-sm mb-2">
              GOI
            </div>
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">
              MEMBER OF PARLIAMENT LOCAL AREA DEVELOPMENT SCHEME (MPLADS)
            </h2>
            <h3 className="text-sm font-bold text-slate-700">
              OFFICIAL WORK MONITORING & CONTRACT AUDIT DOSSIER
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Generated via MPLAD-TRACE 360 National Public Transparency Platform • {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
            </p>
          </div>

          {/* Project Summary Section */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 p-4 rounded-lg bg-slate-50/50">
            <div>
              <span className="text-slate-500 font-semibold block">Unique Work ID:</span>
              <span className="font-mono font-bold text-sm text-slate-900">{activeProject.id}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Sanction Year & Category:</span>
              <span className="font-bold text-slate-900">{activeProject.year} • {activeProject.category}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 font-semibold block">Title of Sanctioned Work:</span>
              <span className="font-bold text-sm text-slate-900">{activeProject.title}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Location:</span>
              <span className="font-bold text-slate-900">{activeProject.village}, {activeProject.district}, {activeProject.state}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Hon'ble MP & House:</span>
              <span className="font-bold text-slate-900">{activeProject.mp_name} ({activeProject.mp_house})</span>
            </div>
          </div>

          {/* Financial & Physical Ledger Table */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2">
              1. Financial Allocation & Execution Statement (INR)
            </h4>
            <table className="w-full border border-slate-300 text-left">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Recommended</th>
                  <th className="p-2 border-r border-slate-300">Sanctioned</th>
                  <th className="p-2 border-r border-slate-300">Contract Value</th>
                  <th className="p-2 border-r border-slate-300">Funds Released</th>
                  <th className="p-2">Actual Expenditure</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-r border-slate-300 font-bold">{formatIndianCurrency(activeProject.recommended_amount)}</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{formatIndianCurrency(activeProject.sanctioned_amount)}</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{formatIndianCurrency(activeProject.contract_amount)}</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{formatIndianCurrency(activeProject.funds_released)}</td>
                  <td className="p-2 font-bold text-emerald-800">{formatIndianCurrency(activeProject.actual_expenditure)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Physical Progress & Health */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-slate-300 p-3 rounded-lg text-center">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Physical Progress</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{activeProject.physical_progress}%</span>
              <span className="text-[10px] text-slate-400">Verified by Field Inspection</span>
            </div>
            <div className="border border-slate-300 p-3 rounded-lg text-center">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Schedule Slippage</span>
              <span className="text-2xl font-black text-red-700 mt-1 block">{activeProject.delay_days} Days</span>
              <span className="text-[10px] text-slate-400">Target: {activeProject.expected_completion_date}</span>
            </div>
            <div className="border border-slate-300 p-3 rounded-lg text-center">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Overall Risk Index</span>
              <span className="text-2xl font-black text-orange-600 mt-1 block">{activeProject.overall_risk_score} / 100</span>
              <span className="text-[10px] text-slate-400 font-bold">{activeProject.risk_level}</span>
            </div>
          </div>

          {/* Surveillance & Risk Breakdown */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2">
              2. Autonomous Surveillance Findings & Indicators
            </h4>
            <div className="border border-slate-300 p-3 rounded-lg space-y-1.5">
              {activeProject.risk_reasons?.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures / Attestation Block */}
          <div className="pt-12 grid grid-cols-3 gap-8 text-center text-[11px] text-slate-600">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-900">Assistant Executive Engineer</p>
              <p>Field Inspection Division</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-900">District Planning Officer</p>
              <p>District Collectorate</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-900">District Magistrate / DDC</p>
              <p>Implementing Authority</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

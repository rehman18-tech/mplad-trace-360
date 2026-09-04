import React, { useState } from 'react';
import { Guarantee } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

interface GuaranteesPageProps {
  onOpenProject: (projectId: string) => void;
}

export const GuaranteesPage: React.FC<GuaranteesPageProps> = ({ onOpenProject }) => {
  const [guarantees, setGuarantees] = useState<Guarantee[]>([
    {
      id: "PBG-UP-00084",
      project_id: "MPLAD-UP-2026-00084",
      contractor_name: "Purvanchal Nirman Nigam LLP",
      guarantee_type: "Performance Bank Guarantee (PBG)",
      bank_or_institution: "Punjab National Bank, Varanasi Main Branch",
      amount: 117500.0,
      issue_date: "2025-04-10",
      expiry_date: "2026-03-22",
      days_to_expiry: 18,
      status: "EXPIRING_SOON",
      action_required: true,
      defects_logged: "RO plant incomplete; statutory notice issued to extend bank guarantee prior to lapse.",
      contractor_response: "Awaiting bank revalidation certificate."
    },
    {
      id: "PBG-AP-00125",
      project_id: "MPLAD-AP-2026-00125",
      contractor_name: "Sri Venkateswara Infra Projects Ltd",
      guarantee_type: "Performance Bank Guarantee",
      bank_or_institution: "State Bank of India, Auto Nagar Branch",
      amount: 144500.0,
      issue_date: "2025-04-22",
      expiry_date: "2026-04-30",
      days_to_expiry: 56,
      status: "ACTIVE",
      action_required: false,
      defects_logged: "Routine inspection required before final defect liability period.",
      contractor_response: "Guarantees valid up to scheduled handover date."
    },
    {
      id: "DLP-MH-00214",
      project_id: "MPLAD-MH-2026-00214",
      contractor_name: "Sahyadri Civil Tech Solutions Pvt Ltd",
      guarantee_type: "Defect Liability & Equipment Warranty",
      bank_or_institution: "Bank of Maharashtra, Pune City",
      amount: 86000.0,
      issue_date: "2025-12-05",
      expiry_date: "2028-12-05",
      days_to_expiry: 1008,
      status: "ACTIVE",
      action_required: false,
      defects_logged: "None. Smart classroom hardware verified under 3-year OEM warranty.",
      contractor_response: "Quarterly maintenance inspection completed."
    }
  ]);

  const [selectedGuar, setSelectedGuar] = useState<Guarantee>(guarantees[0]);
  const [defectText, setDefectText] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleLogDefect = () => {
    if (!defectText.trim()) return;
    setGuarantees(prev => prev.map(g => g.id === selectedGuar.id ? { ...g, defects_logged: defectText, action_required: true } : g));
    setSelectedGuar(prev => ({ ...prev, defects_logged: defectText, action_required: true }));
    setSuccessToast("Defect notice recorded & formal contractor response demanded.");
    setDefectText('');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-gov-saffron" />
              <span>Contract Guarantee & Defect Liability Tracker</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Automated expiry surveillance for Performance Bank Guarantees (PBG), Defect Liability Periods (DLP), and Maintenance Obligations.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300">
            ⚠ 1 Critical Guarantee Expiring Within 30 Days
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guarantees List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Securities & Warranties</h3>
          {guarantees.map((g) => {
            const isSelected = selectedGuar.id === g.id;
            return (
              <div
                key={g.id}
                onClick={() => setSelectedGuar(g)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gov-navy bg-slate-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-slate-500 font-bold">{g.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    g.days_to_expiry <= 30 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {g.days_to_expiry <= 30 ? `Expires in ${g.days_to_expiry}d` : `${g.days_to_expiry}d left`}
                  </span>
                </div>
                <h4 className="font-bold text-gov-navy text-xs mt-1 truncate">{g.guarantee_type}</h4>
                <p className="text-[11px] text-slate-600 truncate">{g.contractor_name}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>Amount: <strong>{formatIndianCurrency(g.amount)}</strong></span>
                  <span className="text-slate-400">Due: {g.expiry_date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Inspector */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Instrument</span>
                <h3 className="text-base font-extrabold text-gov-navy">{selectedGuar.guarantee_type}</h3>
              </div>
              <button
                onClick={() => onOpenProject(selectedGuar.project_id)}
                className="text-xs font-bold text-gov-navy hover:text-gov-saffron flex items-center gap-1"
              >
                <span>View Project {selectedGuar.project_id}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Countdown Banner */}
            <div className={`p-4 rounded-xl mb-4 border ${
              selectedGuar.days_to_expiry <= 30
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Statutory Expiry Countdown</span>
                </span>
                <span className="text-xl font-black">{selectedGuar.days_to_expiry} Days Remaining</span>
              </div>
              <p className="text-xs mt-1">
                {selectedGuar.days_to_expiry <= 30
                  ? '⚠ Immediate administrative action required: Call for PBG extension or invoke security before expiry date.'
                  : 'Guarantee is currently active and enforceable under standard PWD contract provisions.'}
              </p>
            </div>

            {/* Financial & Institution Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Guaranteed Amount</span>
                <span className="text-sm font-bold text-gov-navy mt-0.5 block">{formatIndianCurrency(selectedGuar.amount)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Financial Institution</span>
                <span className="text-xs font-bold text-gov-navy mt-0.5 block truncate">{selectedGuar.bank_or_institution}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Executing Contractor</span>
                <span className="text-xs font-bold text-gov-navy mt-0.5 block truncate">{selectedGuar.contractor_name}</span>
              </div>
            </div>

            {/* Defect Log */}
            <div className="space-y-3 text-xs mb-4">
              <div>
                <span className="font-semibold text-slate-500 block">Logged Defect / Extension Notice:</span>
                <p className="text-slate-800 mt-1 p-2.5 rounded bg-slate-50 border border-slate-200">
                  {selectedGuar.defects_logged || 'No defect claims logged during the current inspection cycle.'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-500 block">Contractor Response:</span>
                <p className="text-slate-800 mt-1 p-2.5 rounded bg-slate-50 border border-slate-200">
                  {selectedGuar.contractor_response || 'No formal objection or response pending.'}
                </p>
              </div>
            </div>

            {/* Officer Defect Entry */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Record New Defect / Extension Directive:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter observed defect, structural crack, or bank guarantee extension notice..."
                  value={defectText}
                  onChange={(e) => setDefectText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gov-navy"
                />
                <button
                  onClick={handleLogDefect}
                  className="px-4 py-2 bg-gov-navy text-white font-bold text-xs rounded-lg hover:bg-gov-navy-light transition-colors"
                >
                  Issue Notice
                </button>
              </div>
            </div>
          </div>

          {successToast && (
            <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded text-center">
              ✓ {successToast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

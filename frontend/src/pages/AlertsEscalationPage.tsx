import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Alert } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  BellRing, ShieldAlert, ArrowRight, CheckCircle2, UserPlus, 
  TrendingUp, FileText, Clock, AlertTriangle, Eye 
} from 'lucide-react';

interface AlertsEscalationPageProps {
  onOpenProject: (projectId: string) => void;
}

export const AlertsEscalationPage: React.FC<AlertsEscalationPageProps> = ({ onOpenProject }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [actionModal, setActionModal] = useState<{ type: 'ASSIGN' | 'ESCALATE' | 'RESOLVE' | 'ADD_NOTE'; open: boolean }>({ type: 'RESOLVE', open: false });
  const [actionInput, setActionInput] = useState('');
  const [assignedInput, setAssignedInput] = useState('Assistant Executive Engineer, PRED');
  const [escalationLevelInput, setEscalationLevelInput] = useState('Level 4 - Higher Authority (State Nodal)');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data);
      if (data.length > 0) setSelectedAlert(data[0]);
    } catch {
      // handled
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedAlert) return;

    await api.takeAlertAction(selectedAlert.id, {
      action: actionModal.type,
      assigned_to: assignedInput,
      escalation_level: escalationLevelInput,
      notes: actionInput,
      officer_name: 'District Planning Officer'
    });

    setActionModal({ ...actionModal, open: false });
    setActionInput('');
    setSuccessToast(`Action successfully executed: ${actionModal.type}`);
    setTimeout(() => setSuccessToast(null), 3500);
    loadAlerts();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <BellRing className="w-6 h-6 text-gov-saffron" />
              <span>Early-Warning Alert & Escalation Engine</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Multi-tiered administrative routing: Level 1 (Field Officer) → Level 2 (Implementing Agency) → Level 3 (District Collector) → Level 4 (State / MoSPI).
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300">
            Automated SLA Tracking Active
          </span>
        </div>

        {/* Multi-Tier Routing Protocol Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Level 1 Tier</span>
            <span className="font-extrabold text-gov-navy mt-0.5 block">Field Officer / AEE</span>
            <span className="text-[10px] text-slate-400">48h Initial Verification</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Level 2 Tier</span>
            <span className="font-extrabold text-gov-navy mt-0.5 block">Implementing Agency (EE)</span>
            <span className="text-[10px] text-slate-400">7-Day Rectification Notice</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Level 3 Tier</span>
            <span className="font-extrabold text-gov-navy mt-0.5 block">District Authority / DPC</span>
            <span className="text-[10px] text-slate-400">Formal Inquiry & Stop-Payment</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Level 4 Tier</span>
            <span className="font-extrabold text-red-700 mt-0.5 block">Higher Authority / MoSPI</span>
            <span className="text-[10px] text-slate-400">National Audit Escalation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Surveillance Alerts</h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {alerts.length} Total
            </span>
          </div>

          {alerts.map((al) => {
            const isSelected = selectedAlert?.id === al.id;
            const isCitizenDefect = al.id.startsWith('ALT-DEFECT') || al.category === 'Guarantee Alert' || al.title.includes('Statutory Defect Notice');

            return (
              <div
                key={al.id}
                onClick={() => setSelectedAlert(al)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gov-navy bg-slate-50 shadow-sm ring-2 ring-gov-navy/20'
                    : isCitizenDefect
                    ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-500">{al.id}</span>
                    {isCitizenDefect && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-600 text-white animate-pulse">
                        CITIZEN DLP
                      </span>
                    )}
                  </div>
                  <RiskBadge level={al.severity} size="sm" />
                </div>
                <h4 className="font-bold text-gov-navy text-xs mt-1 truncate">{al.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{al.description}</p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Due in: <strong className="text-red-600">{al.due_days} Days</strong></span>
                  <span className="font-semibold text-slate-600">{al.escalation_level.split('-')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Alert Action Workspace */}
        {selectedAlert && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-extrabold text-slate-500">{selectedAlert.id}</span>
                    <RiskBadge level={selectedAlert.severity} size="sm" />
                    <span className="text-xs text-slate-400">SLA: {selectedAlert.due_days} days remaining</span>
                  </div>
                  <h3 className="text-base font-extrabold text-gov-navy">{selectedAlert.title}</h3>
                </div>

                <button
                  onClick={() => onOpenProject(selectedAlert.project_id)}
                  className="text-xs font-bold text-gov-navy hover:text-gov-saffron flex items-center gap-1 shrink-0"
                >
                  <span>360° Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Observed vs Expected Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 mb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase block">Target Public Work</span>
                    <span className="font-bold text-gov-navy mt-0.5 block">{selectedAlert.project_title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] font-semibold uppercase block">Current Tier</span>
                    <span className="font-extrabold text-gov-saffron mt-0.5 block">{selectedAlert.escalation_level}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium block">Observed Telemetry:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedAlert.observed_data}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Variance / Discrepancy:</span>
                    <p className="font-bold text-red-600 mt-0.5">{selectedAlert.difference}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium block">Mandatory Directive:</span>
                  <p className="font-semibold text-gov-navy mt-0.5">{selectedAlert.recommended_action}</p>
                </div>
              </div>

              {/* Action History Trail */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Audit & Escalation Trail:</h4>
                <div className="space-y-1.5 text-xs">
                  {selectedAlert.audit_history?.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="font-medium text-slate-700">{h.action}</span>
                      <span className="text-[10px] text-slate-400">{h.time} by {h.actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons as requested in Section 26 */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenProject(selectedAlert.project_id)}
                className="px-3.5 py-2 bg-slate-100 text-gov-charcoal text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Review Evidence</span>
              </button>

              <button
                onClick={() => setActionModal({ type: 'ASSIGN', open: true })}
                className="px-3.5 py-2 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-navy-light transition-colors flex items-center gap-1 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-gov-saffron" />
                <span>Assign Officer</span>
              </button>

              <button
                onClick={() => setActionModal({ type: 'ESCALATE', open: true })}
                className="px-3.5 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 shadow-xs"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Escalate Tier</span>
              </button>

              <button
                onClick={() => setActionModal({ type: 'RESOLVE', open: true })}
                className="px-3.5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resolve Alert</span>
              </button>

              <button
                onClick={() => setActionModal({ type: 'ADD_NOTE', open: true })}
                className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                + Add Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Execution Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-gov-lg space-y-4 text-xs">
            <h3 className="text-base font-bold text-gov-navy">
              Execute Alert Action: {actionModal.type}
            </h3>

            {actionModal.type === 'ASSIGN' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assign Responsible Officer / Authority:</label>
                <select
                  value={assignedInput}
                  onChange={(e) => setAssignedInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                >
                  <option value="Assistant Executive Engineer, PRED">Assistant Executive Engineer, PRED</option>
                  <option value="Superintending Engineer, Jal Nigam">Superintending Engineer, Jal Nigam</option>
                  <option value="Chief Planning Officer / DRDA">Chief Planning Officer / DRDA</option>
                  <option value="Divisional Accounts Officer">Divisional Accounts Officer</option>
                </select>
              </div>
            )}

            {actionModal.type === 'ESCALATE' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Escalate to Administrative Tier:</label>
                <select
                  value={escalationLevelInput}
                  onChange={(e) => setEscalationLevelInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                >
                  <option value="Level 2 - Implementing Authority">Level 2 - Implementing Authority</option>
                  <option value="Level 3 - District Authority">Level 3 - District Authority (Collectorate)</option>
                  <option value="Level 4 - Higher Authority (MoSPI / State)">Level 4 - Higher Authority (MoSPI / State)</option>
                </select>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Formal Order / Reason Remarks:</label>
              <textarea
                rows={3}
                placeholder="Enter inquiry directives, compliance deadline, or site verification note..."
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ ...actionModal, open: false })}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                className="px-4 py-2 bg-gov-navy text-white rounded-lg font-bold hover:bg-gov-navy-light transition-colors"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

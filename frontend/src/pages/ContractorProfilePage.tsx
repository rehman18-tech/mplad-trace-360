import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Contractor, Project } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Users, Building, CheckCircle2, Clock, AlertTriangle, 
  Scale, FileText, ArrowRight, ShieldCheck, Info, Phone, Mail, MapPin 
} from 'lucide-react';

interface ContractorProfilePageProps {
  onOpenProject: (projectId: string) => void;
  initialContractorId?: string;
}

export const ContractorProfilePage: React.FC<ContractorProfilePageProps> = ({
  onOpenProject,
  initialContractorId = 'CON-AP-042',
}) => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selectedId, setSelectedId] = useState(initialContractorId);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Synchronize when initialContractorId prop changes from navigation
  useEffect(() => {
    if (initialContractorId) {
      setSelectedId(initialContractorId);
    }
  }, [initialContractorId]);

  useEffect(() => {
    api.getContractors().then(list => {
      setContractors(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      Promise.all([
        api.getContractorById(selectedId),
        api.getContractorProjects ? api.getContractorProjects(selectedId) : api.getProjects({ contractor_id: selectedId })
      ]).then(([c, pList]) => {
        setContractor(c);
        setProjects(pList);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [selectedId]);

  // Dynamic portfolio metrics computed directly from the contractor's project portfolio
  const worksDoneList = projects.filter(p => p.status === 'COMPLETED' || (p.physical_progress ?? 0) >= 100);
  const currentWorksList = projects.filter(p => p.status !== 'COMPLETED' && (p.physical_progress ?? 0) < 100);
  const delayedWorksList = projects.filter(p => (p.delay_days || 0) > 0 && p.status !== 'COMPLETED');
  
  const totalWorksCount = projects.length;
  const worksDoneCount = worksDoneList.length;
  const currentWorksCount = currentWorksList.length;
  const delayedWorksCount = delayedWorksList.length;
  const totalWorksValue = projects.reduce((acc, p) => acc + (p.contract_amount || 0), 0);
  const averageDelayDays = delayedWorksCount > 0
    ? Math.round(delayedWorksList.reduce((acc, p) => acc + (p.delay_days || 0), 0) / delayedWorksCount)
    : 0;

  const [filterTab, setFilterTab] = useState<'ALL' | 'CURRENT' | 'DONE' | 'DELAYED'>('ALL');

  const displayedProjects = projects.filter(p => {
    if (filterTab === 'CURRENT') return p.status !== 'COMPLETED' && (p.physical_progress ?? 0) < 100;
    if (filterTab === 'DONE') return p.status === 'COMPLETED' || (p.physical_progress ?? 0) >= 100;
    if (filterTab === 'DELAYED') return (p.delay_days || 0) > 0 && p.status !== 'COMPLETED';
    return true;
  });

  if (!contractor && loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs">
        Loading contractor intelligence dossier...
      </div>
    );
  }

  if (!contractor) return null;

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Contractor Selector */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <Users className="w-6 h-6 text-gov-saffron" />
              <span>Contractor Intelligence & Performance Scorecard</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cross-project delivery metrics, concurrent workload capacity, historical delay indices, and defect liability compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Select Agency:</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gov-navy focus:outline-none"
            >
              {contractors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Contractor Profile Dossier */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-500">{contractor.registration_no}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{contractor.category_class}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  State PWD Master Registry: {totalWorksCount} Works in District Portfolio
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-gov-navy">{contractor.name}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {contractor.address}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Contact: <strong>{contractor.contact_person}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {contractor.contact_phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {contractor.contact_email}
              </span>
            </div>
          </div>

          {/* Right Performance Risk Indicator */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Performance Risk Indicator</span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  contractor.performance_score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                  contractor.performance_score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {contractor.performance_score} / 100
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                "{contractor.risk_notes}"
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[10px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-gov-saffron shrink-0" />
              <span>Execution scorecard synchronized with {totalWorksCount} active & completed works.</span>
            </div>
          </div>
        </div>

        {/* Synchronized Metrics Grid (100% Matching Works Done & Current Works) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Works</span>
            <span className="text-lg font-extrabold text-gov-navy mt-0.5 block">{totalWorksCount}</span>
            <span className="text-[10px] text-slate-500">In District Portfolio</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Portfolio Value</span>
            <span className="text-lg font-extrabold text-gov-navy mt-0.5 block truncate">
              {formatIndianCurrency(totalWorksValue > 0 ? totalWorksValue : contractor.total_contract_value)}
            </span>
            <span className="text-[10px] text-slate-500">Sanctioned works</span>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/80">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold">Works Done</span>
            <span className="text-lg font-extrabold text-emerald-800 mt-0.5 block">{worksDoneCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">100% Handover Certified</span>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/80">
            <span className="text-blue-700 block text-[10px] uppercase font-bold">Current Works</span>
            <span className="text-lg font-extrabold text-blue-900 mt-0.5 block">{currentWorksCount}</span>
            <span className="text-[10px] text-blue-600 font-semibold">Active Execution Sites</span>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80">
            <span className="text-amber-700 block text-[10px] uppercase font-bold">Delayed Works</span>
            <span className="text-lg font-extrabold text-amber-900 mt-0.5 block">{delayedWorksCount}</span>
            <span className="text-[10px] text-amber-600 font-semibold">Past Target Milestone</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Avg Schedule Lag</span>
            <span className={`text-lg font-extrabold mt-0.5 block ${averageDelayDays > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
              {averageDelayDays > 0 ? `${averageDelayDays}d` : '0d (On Time)'}
            </span>
            <span className="text-[10px] text-slate-500">Active delivery lag</span>
          </div>
        </div>
      </div>

      {/* Associated Public Works Portfolio with Interactive Tabs */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-base font-bold text-gov-navy">
              Public Works Executed by {contractor.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {displayedProjects.length} of {totalWorksCount} works in system ({worksDoneCount} completed, {currentWorksCount} active).
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-bold shrink-0">
            <button
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                filterTab === 'ALL'
                  ? 'bg-white text-gov-navy shadow-xs'
                  : 'text-slate-600 hover:text-gov-navy'
              }`}
            >
              All ({totalWorksCount})
            </button>
            <button
              onClick={() => setFilterTab('DONE')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                filterTab === 'DONE'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Works Done ({worksDoneCount})</span>
            </button>
            <button
              onClick={() => setFilterTab('CURRENT')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                filterTab === 'CURRENT'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-800 hover:bg-blue-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Current Works ({currentWorksCount})</span>
            </button>
            {delayedWorksCount > 0 && (
              <button
                onClick={() => setFilterTab('DELAYED')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'DELAYED'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Delayed ({delayedWorksCount})</span>
              </button>
            )}
          </div>
        </div>

        {displayedProjects.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Building className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              No works matching filter "{filterTab}" for {contractor.name}.
            </p>
            <button
              onClick={() => setFilterTab('ALL')}
              className="mt-3 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Reset to All Works ({totalWorksCount})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedProjects.map((proj) => {
              const isDone = proj.status === 'COMPLETED' || (proj.physical_progress ?? 0) >= 100;
              const hasDelay = (proj.delay_days || 0) > 0 && !isDone;

              return (
                <div
                  key={proj.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isDone 
                      ? 'border-emerald-200 bg-emerald-50/10 hover:border-emerald-400 hover:bg-emerald-50/20' 
                      : hasDelay 
                      ? 'border-amber-200 bg-amber-50/15 hover:border-amber-400 hover:bg-amber-50/25' 
                      : 'border-slate-200 bg-slate-50/40 hover:border-gov-navy hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2 flex-wrap gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-600 font-bold text-xs">{proj.id}</span>
                        {isDone ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            WORK DONE (COMPLETED)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-blue-600" />
                            CURRENT WORK (ACTIVE)
                          </span>
                        )}
                      </div>
                      <RiskBadge level={proj.risk_level} size="sm" />
                    </div>

                    <h4 className="font-bold text-gov-navy text-sm line-clamp-2">{proj.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      📍 {proj.village ? `${proj.village}, ` : ''}{proj.district}, {proj.state}
                    </p>

                    {/* Progress Visual Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className="text-slate-500">Physical Execution</span>
                        <span className={isDone ? 'text-emerald-700' : 'text-blue-700'}>
                          {proj.physical_progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isDone ? 'bg-emerald-600' : hasDelay ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, proj.physical_progress || 0)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block font-medium">Contract Value</span>
                        <span className="font-bold text-gov-navy">{formatIndianCurrency(proj.contract_amount)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-medium">Financial Spent</span>
                        <span className="font-bold text-slate-700">{proj.financial_progress}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-medium">Schedule Status</span>
                        {isDone ? (
                          <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Certified
                          </span>
                        ) : (
                          <span className={`font-bold ${hasDelay ? 'text-red-600' : 'text-emerald-700'}`}>
                            {hasDelay ? `${proj.delay_days}d lag` : 'On Schedule'}
                          </span>
                        )}
                      </div>
                    </div>

                    {isDone && proj.actual_completion_date && (
                      <div className="mt-2 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center justify-between">
                        <span>✓ Handover Completed:</span>
                        <span className="font-mono">{proj.actual_completion_date}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {isDone ? 'Permanent Public Asset' : `Due: ${proj.expected_completion_date || 'Target 2026'}`}
                    </span>
                    <button
                      onClick={() => onOpenProject(proj.id)}
                      className="px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded-lg hover:bg-gov-navy-light transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Trace Work 360°</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

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
      api.getContractorById(selectedId).then(setContractor);
      api.getProjects({ contractor_id: selectedId }).then(setProjects);
    }
  }, [selectedId]);

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
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-slate-500">{contractor.registration_no}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{contractor.category_class}</span>
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
              <span>Indicators require official verification; score reflects execution pacing.</span>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Contracts</span>
            <span className="text-lg font-extrabold text-gov-navy mt-0.5 block">{contractor.total_contracts}</span>
            <span className="text-[10px] text-slate-400">Awarded to date</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Value</span>
            <span className="text-lg font-extrabold text-gov-navy mt-0.5 block truncate">
              {formatIndianCurrency(contractor.total_contract_value)}
            </span>
            <span className="text-[10px] text-slate-400">Cumulative sanctions</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Completed Works</span>
            <span className="text-lg font-extrabold text-emerald-700 mt-0.5 block">{contractor.completed_projects}</span>
            <span className="text-[10px] text-emerald-600">Handovers certified</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Delayed Works</span>
            <span className="text-lg font-extrabold text-amber-700 mt-0.5 block">{contractor.delayed_projects}</span>
            <span className="text-[10px] text-amber-600">Past target milestone</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Avg Schedule Delay</span>
            <span className="text-lg font-extrabold text-red-600 mt-0.5 block">{contractor.average_delay_days}d</span>
            <span className="text-[10px] text-red-500">Historical delivery lag</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active In District</span>
            <span className="text-lg font-extrabold text-gov-navy mt-0.5 block">{contractor.active_projects_count}</span>
            <span className="text-[10px] text-slate-400">Concurrent work sites</span>
          </div>
        </div>
      </div>

      {/* Associated Public Works Portfolio */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-gov-navy">
            Current & Past Works Executed by {contractor.name}
          </h3>
          <span className="text-xs text-slate-500">{projects.length} Works found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-gov-navy bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono text-slate-500 font-bold">{proj.id}</span>
                  <RiskBadge level={proj.risk_level} size="sm" />
                </div>
                <h4 className="font-bold text-gov-navy text-sm line-clamp-2">{proj.title}</h4>
                <p className="text-xs text-slate-500 mt-1">📍 {proj.village ? `${proj.village}, ` : ''}{proj.district}, {proj.state}</p>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Contract</span>
                    <span className="font-bold text-gov-navy">{formatIndianCurrency(proj.contract_amount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Physical %</span>
                    <span className="font-bold text-emerald-700">{proj.physical_progress}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Delay</span>
                    <span className={`font-bold ${proj.delay_days > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                      {proj.delay_days > 0 ? `${proj.delay_days}d` : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => onOpenProject(proj.id)}
                  className="px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded-lg hover:bg-gov-navy-light transition-colors flex items-center gap-1"
                >
                  <span>Trace Work 360°</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

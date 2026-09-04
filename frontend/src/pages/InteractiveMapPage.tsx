import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project } from '../types';
import { IndiaProjectMap } from '../components/map/IndiaProjectMap';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  MapPin, Layers, Droplet, GraduationCap, Stethoscope, Construction, 
  Landmark, Sun, Waves, Trash2, ShieldCheck, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface InteractiveMapPageProps {
  onOpenProject: (projectId: string) => void;
  selectedProjectId?: string;
}

const DEPT_PILLS = [
  { id: '', label: 'All Departments', icon: Layers },
  { id: 'Drinking Water', label: 'Drinking Water', icon: Droplet },
  { id: 'Education', label: 'Education', icon: GraduationCap },
  { id: 'Healthcare', label: 'Healthcare', icon: Stethoscope },
  { id: 'Roads & Bridges', label: 'Roads & PWD', icon: Construction },
  { id: 'Community Infrastructure', label: 'Community', icon: Landmark },
  { id: 'Solar Energy', label: 'Solar Energy', icon: Sun },
  { id: 'Irrigation', label: 'Irrigation', icon: Waves },
  { id: 'Sanitation', label: 'Sanitation', icon: Trash2 },
];

export const InteractiveMapPage: React.FC<InteractiveMapPageProps> = ({
  onOpenProject,
  selectedProjectId,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {});
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (selectedDept && p.category !== selectedDept) return false;
    if (selectedState && p.state !== selectedState) return false;
    if (selectedRisk && p.risk_level !== selectedRisk) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white rounded-2xl border border-gov-ivory-border p-6 shadow-gov relative overflow-hidden">
        {/* Tiranga Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-tiranga-shimmer" />

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4 mt-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                सत्यमेव जयते • भारत सरकार
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                Live Sat-Geofence Active
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-50 to-orange-50 flex items-center justify-center border border-amber-300 shadow-xs">
                <svg className="w-5 h-5 text-blue-900 animate-chakra" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                  <circle cx="50" cy="50" r="8" fill="currentColor" />
                  {[...Array(24)].map((_, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={50 + 42 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={50 + 42 * Math.sin((i * 15 * Math.PI) / 180)}
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>
              </div>
              <span>Interactive India Project Surveillance Map</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Geospatial monitoring of MPLADS works across India. Colored marker pins indicate autonomous risk levels with geo-tagged verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-[#FAF7F0] border border-amber-200/90 rounded-xl px-3 py-1.5 text-slate-800 font-medium"
            >
              <option value="">All States</option>
              {['Andhra Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Bihar', 'Rajasthan', 'West Bengal', 'Delhi', 'Gujarat'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-[#FAF7F0] border border-amber-200/90 rounded-xl px-3 py-1.5 text-slate-800 font-medium"
            >
              <option value="">All Risk Levels</option>
              <option value="NORMAL">Normal</option>
              <option value="WATCH">Watch</option>
              <option value="HIGH RISK">High Risk</option>
              <option value="CRITICAL">Critical Surveillance</option>
            </select>

            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs">
              {filteredProjects.length} Works Mapped
            </div>
          </div>
        </div>

        {/* Department Quick Filter Pills */}
        <div className="py-3 border-b border-amber-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-amber-950 whitespace-nowrap uppercase tracking-wider text-[11px] pr-1">
            Department:
          </span>
          {DEPT_PILLS.map((dept) => {
            const Icon = dept.icon;
            const isSelected = selectedDept === dept.id;
            const count = dept.id 
              ? projects.filter(p => p.category === dept.id).length 
              : projects.length;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs ring-2 ring-orange-400'
                    : 'bg-[#FCFAF7] text-slate-700 hover:bg-amber-50 hover:text-amber-950 border border-amber-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{dept.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 font-bold'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Map Container */}
        <div className="mt-4">
          <IndiaProjectMap
            projects={filteredProjects}
            onSelectProject={onOpenProject}
            selectedProjectId={selectedProjectId}
            height="620px"
          />
        </div>
      </div>
    </div>
  );
};

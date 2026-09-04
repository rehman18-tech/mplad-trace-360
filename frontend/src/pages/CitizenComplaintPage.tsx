import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Complaint } from '../types';
import { useToast } from '../context/ToastContext';
import { MessageSquareQuote, ShieldCheck, CheckCircle2, Clock, Upload, ArrowRight, Eye, AlertCircle } from 'lucide-react';

interface CitizenComplaintPageProps {
  initialProjectId?: string;
  onOpenProject: (projectId: string) => void;
}

export const CitizenComplaintPage: React.FC<CitizenComplaintPageProps> = ({
  initialProjectId = 'MPLAD-AP-2026-00125',
  onOpenProject,
}) => {
  const { addToast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [projectId, setProjectId] = useState(initialProjectId);
  const [citizenName, setCitizenName] = useState('Resident Citizen');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState('Work stopped');
  const [location, setLocation] = useState('Tagarapuvalasa Habitation, Bheemunipatnam');
  const [description, setDescription] = useState('Work on community hall roof paused for past 3 weeks. Hall needed before monsoon wedding and harvest festival season.');
  const [submitting, setSubmitting] = useState(false);
  const [generatedComplaint, setGeneratedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    api.getComplaints().then(setComplaints).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitComplaint({
        project_id: projectId,
        citizen_name: isAnonymous ? 'Citizen (Identity Protected)' : citizenName,
        category,
        location,
        description,
        evidence_photo_url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600'
      });
      setGeneratedComplaint(res);
      setComplaints(prev => [res, ...prev]);
      addToast({
        type: 'success',
        title: 'Grievance Docket Created',
        message: `Tracking ID #${res.id} registered and escalated to District Nodal Cell.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Docket Registration Failed',
        message: 'Unable to submit grievance at this moment. Please retry.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'Poor quality', 'Work stopped', 'No work visible',
    'Incomplete work', 'Damage', 'Possible duplicate', 'Safety issue', 'Other'
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <MessageSquareQuote className="w-6 h-6 text-gov-saffron" />
              <span>Public Works Grievance & Issue Portal</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Direct citizen reporting channel. All submissions are automatically classified, geotagged, and assigned to district nodal officers.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded bg-slate-100 text-slate-700">
            Citizen Public Transparency
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-2">
          {generatedComplaint ? (
            <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gov-navy">Grievance Registered Successfully</h3>
                  <p className="text-xs text-slate-500">
                    Complaint Tracking ID: <strong className="font-mono text-gov-navy text-sm font-extrabold">{generatedComplaint.id}</strong>
                  </p>
                </div>
              </div>

              {/* Status Lifecycle Progress Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-3">
                  Grievance Redressal Lifecycle:
                </span>
                <div className="flex items-center justify-between text-[11px] font-semibold text-gov-navy">
                  <span className="text-emerald-700 font-bold">1. Submitted ✓</span>
                  <span className="text-emerald-700 font-bold">2. AI Classified ✓</span>
                  <span className="text-gov-saffron font-bold">3. Assigned (Active)</span>
                  <span className="text-slate-400">4. Field Inspection</span>
                  <span className="text-slate-400">5. Resolved</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden flex">
                  <div className="bg-emerald-600 w-2/5 h-full"></div>
                  <div className="bg-gov-saffron w-1/5 h-full animate-pulse"></div>
                </div>
                <div className="mt-3 text-[11px] text-slate-600">
                  Assigned Authority: <strong>{generatedComplaint.assigned_to}</strong>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => onOpenProject(generatedComplaint.project_id)}
                  className="py-2 px-4 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-navy-light transition-colors"
                >
                  View Related Public Work
                </button>
                <button
                  onClick={() => setGeneratedComplaint(null)}
                  className="py-2 px-4 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4 text-xs">
              <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wider pb-2 border-b border-slate-100">
                Submit Public Work Grievance
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project ID / Name:</label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold text-gov-navy focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Exact Location / Landmark:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description of Issue:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none"
                  required
                />
              </div>

              {/* Photo Upload Widget */}
              <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-center">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="font-bold text-gov-navy text-[11px] block">Upload Photo / Video Proof</span>
                <span className="text-[10px] text-slate-500">Supports JPG, PNG, MP4 up to 25MB</span>
              </div>

              {/* Identity Protection Option */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-gov-navy"
                />
                <label htmlFor="anon" className="font-bold text-slate-700 text-xs">
                  Protect My Identity (Submit as Anonymized Citizen under Whistleblower Protocol)
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs rounded-xl transition-all shadow-gov flex items-center justify-center gap-1.5 mt-4"
              >
                {submitting ? 'Registering Grievance...' : 'Submit Grievance for District Verification'}
              </button>
            </form>
          )}
        </div>

        {/* Right: Active Grievances Tracker */}
        <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-3">
          <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wider pb-2 border-b border-slate-100">
            Recent Grievance Submissions
          </h3>

          <div className="space-y-3 text-xs">
            {complaints.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gov-navy">{c.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                    {c.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 truncate">{c.category}: {c.project_id}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{c.submission_date}</span>
                  <button
                    onClick={() => onOpenProject(c.project_id)}
                    className="text-gov-navy font-bold hover:text-gov-saffron flex items-center gap-0.5"
                  >
                    <span>View Work</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

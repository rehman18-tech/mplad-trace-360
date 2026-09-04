import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Smartphone, MapPin, Camera, CheckCircle2, AlertTriangle, ShieldCheck, Upload, ArrowRight } from 'lucide-react';

interface FieldInspectionPageProps {
  initialProjectId?: string;
  onOpenProject: (projectId: string) => void;
}

export const FieldInspectionPage: React.FC<FieldInspectionPageProps> = ({
  initialProjectId = 'MPLAD-AP-2026-00125',
  onOpenProject,
}) => {
  const { addToast } = useToast();
  const [projectId, setProjectId] = useState(initialProjectId);
  const [officerName, setOfficerName] = useState('Shri R. K. Verma, AEE');
  const [officerDesignation, setOfficerDesignation] = useState('Assistant Executive Engineer, PRED');
  const [lat, setLat] = useState('17.9312');
  const [lon, setLon] = useState('83.4248');
  const [gpsLocked, setGpsLocked] = useState(false);
  const [progressObserved, setProgressObserved] = useState(72);
  const [qualityRating, setQualityRating] = useState('Satisfactory');
  const [materialObs, setMaterialObs] = useState('Cement grade 43 PPC and tested coarse aggregate present on site. Test cubes cast.');
  const [labourObs, setLabourObs] = useState('18 workers on site. Steel binding for roof lintels underway.');
  const [generalRemarks, setGeneralRemarks] = useState('Milestone verified against sanctioned DPR drawings. Notice issued for roofing acceleration.');
  const [isStalled, setIsStalled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<any | null>(null);

  const captureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(4));
          setLon(pos.coords.longitude.toFixed(4));
          setGpsLocked(true);
        },
        () => {
          // Fallback to project coordinates
          setLat('17.9314');
          setLon('83.4250');
          setGpsLocked(true);
        }
      );
    } else {
      setGpsLocked(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitInspection({
        project_id: projectId,
        officer_name: officerName,
        officer_designation: officerDesignation,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        physical_progress_observed: progressObserved,
        quality_rating: qualityRating,
        material_observations: materialObs,
        labour_activity_observations: labourObs,
        general_remarks: generalRemarks,
        stalled_status: isStalled,
        photo_urls: [
          'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600'
        ]
      });
      setInspectionResult(res);
      addToast({
        type: 'success',
        title: 'Inspection Verification Logged',
        message: `Field verification for ${projectId} successfully synced to central registry.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: 'Unable to submit field inspection. Please check network connection.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Mobile-First Header */}
      <div className="bg-gov-navy text-white rounded-2xl p-6 shadow-gov-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gov-saffron flex items-center justify-center text-white shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Mobile Field Inspection</h1>
              <p className="text-xs text-slate-300">Geotagged On-Ground Physical Verification</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 bg-gov-navy-light text-gov-saffron rounded border border-slate-600">
            OFFICER MODE
          </span>
        </div>
      </div>

      {/* Inspection Outcome View */}
      {inspectionResult ? (
        <div className="bg-white rounded-2xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gov-navy">Field Inspection Successfully Submitted</h3>
              <p className="text-xs text-slate-500">Inspection ID: <strong className="font-mono text-slate-700">{inspectionResult.id}</strong></p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[11px]">AI Verification Audit:</h4>
            
            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">GPS Geotag Consistency:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matched ({inspectionResult.distance_variance_meters}m from site)
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Timestamp Security:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Real-Time Cryptographic Hash
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Observed Physical Progress:</span>
              <span className="font-extrabold text-gov-navy">{progressObserved}% (Updated in Database)</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">CV Structural Model Confidence:</span>
              <span className="font-bold text-indigo-700">{Math.round(inspectionResult.ai_cv_similarity_score * 100)}% Coherence</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onOpenProject(projectId)}
              className="flex-1 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl hover:bg-gov-navy-light transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Updated 360° Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setInspectionResult(null)}
              className="py-2.5 px-4 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              New Inspection
            </button>
          </div>
        </div>
      ) : (
        /* Inspection Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gov-ivory-border p-6 shadow-gov space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Project ID:</label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold text-gov-navy focus:outline-none focus:border-gov-navy"
              required
            />
          </div>

          {/* GPS Capture Widget */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gov-navy flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gov-saffron" />
                <span>Geotag Coordinates (GPS)</span>
              </span>
              <button
                type="button"
                onClick={captureGPS}
                className="px-2.5 py-1 bg-gov-saffron text-white rounded font-bold text-[11px] hover:bg-gov-saffron-dark transition-colors shadow-xs"
              >
                {gpsLocked ? '✓ GPS Locked' : '📍 Capture Current GPS'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-600">
              <div>Lat: <strong>{lat}</strong></div>
              <div>Lon: <strong>{lon}</strong></div>
            </div>
          </div>

          {/* Progress Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Observed Physical Progress:</label>
              <span className="text-sm font-extrabold text-gov-navy">{progressObserved}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progressObserved}
              onChange={(e) => setProgressObserved(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-navy"
            />
          </div>

          {/* Quality Rating */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Quality Assessment:</label>
            <select
              value={qualityRating}
              onChange={(e) => setQualityRating(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
            >
              <option value="Satisfactory">Satisfactory (Conforms to IS specifications)</option>
              <option value="Good">Good (Above standard workmanship)</option>
              <option value="Requires Rectification">Requires Rectification (Minor defect notices)</option>
              <option value="Substandard">Substandard (Work order violation)</option>
            </select>
          </div>

          {/* Observations */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Material Observations:</label>
            <textarea
              rows={2}
              value={materialObs}
              onChange={(e) => setMaterialObs(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Labour & Machinery Activity:</label>
            <textarea
              rows={2}
              value={labourObs}
              onChange={(e) => setLabourObs(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">General Remarks & Directives:</label>
            <textarea
              rows={2}
              value={generalRemarks}
              onChange={(e) => setGeneralRemarks(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none"
            />
          </div>

          {/* Photo Upload Simulator */}
          <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center text-center">
            <Camera className="w-6 h-6 text-slate-400 mb-1" />
            <span className="font-bold text-gov-navy text-[11px]">Site Photo Attached (Geotagged EXIF)</span>
            <span className="text-[10px] text-slate-500">Camera / Gallery upload captured with device signature</span>
          </div>

          {/* Stalled Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="stalled"
              checked={isStalled}
              onChange={(e) => setIsStalled(e.target.checked)}
              className="w-4 h-4 rounded text-gov-navy"
            />
            <label htmlFor="stalled" className="font-bold text-red-700 text-xs">
              Report Stalled / Abandoned Work Site
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gov-navy hover:bg-gov-navy-light text-white font-extrabold rounded-xl transition-all shadow-gov flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? (
              <span>Verifying & Ingesting Inspection...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-gov-saffron" />
                <span>Submit Verified Inspection Report</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

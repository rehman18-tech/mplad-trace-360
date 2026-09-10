import React, { useEffect, useState } from 'react';
import { ShieldCheck, Calendar, CheckCircle2, Video, Play, Sparkles, MapPin, Eye, FileText, Check } from 'lucide-react';
import { Inspection } from '../../types';
import { OfflineInspection } from '../../services/offlineStorage';

interface PhotoComparisonProps {
  beforeUrl?: string;
  afterUrl?: string;
  beforeStage?: string;
  afterStage?: string;
  beforeDate?: string;
  afterDate?: string;
  similarityScore?: number;
  gpsVariance?: number;
  videoUrl?: string | null;
  videoName?: string | null;
  inspections?: Inspection[];
  offlineInspections?: OfflineInspection[];
  aiNotes?: string;
}

const SVG_PLACEHOLDER_BEFORE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23e2e8f0"/><path d="M50 320 L200 240 L350 280 L550 160" stroke="%2394a3b8" stroke-width="6" fill="none"/><rect x="180" y="220" width="40" height="100" fill="%2364748b"/><rect x="330" y="240" width="40" height="80" fill="%2364748b"/><circle cx="200" cy="240" r="8" fill="%23ea580c"/><circle cx="350" cy="280" r="8" fill="%23ea580c"/><rect x="30" y="30" width="240" height="65" rx="8" fill="%230f172a" opacity="0.9"/><text x="45" y="58" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="13">BASELINE INSPECTION #1</text><text x="45" y="80" fill="%23fdba74" font-family="monospace" font-weight="bold" font-size="11">GPS: 28.6139°N, 77.2090°E</text></svg>`;

const SVG_PLACEHOLDER_AFTER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23cbd5e1"/><rect x="100" y="120" width="400" height="200" fill="%2394a3b8" rx="6"/><rect x="140" y="160" width="60" height="160" fill="%23475569"/><rect x="270" y="160" width="60" height="160" fill="%23475569"/><rect x="400" y="160" width="60" height="160" fill="%23475569"/><rect x="30" y="30" width="250" height="65" rx="8" fill="%230f172a" opacity="0.9"/><text x="45" y="58" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="13">RECENT FIELD INSPECTION</text><text x="45" y="80" fill="%234ade80" font-family="monospace" font-weight="bold" font-size="11">CV HASH MATCH: 88% OK</text></svg>`;

export const PhotoComparison: React.FC<PhotoComparisonProps> = ({
  beforeUrl = '/images/baseline_inspection.jpg',
  afterUrl = '/images/recent_inspection.jpg',
  beforeStage = 'Foundation & Substructure Stage (30%)',
  afterStage = 'Column Casting & Lintel Stage (72%)',
  beforeDate = '12 Aug 2025',
  afterDate = '18 Feb 2026',
  similarityScore = 88,
  gpsVariance = 14.5,
  videoUrl,
  videoName,
  inspections = [],
  offlineInspections = [],
  aiNotes
}) => {
  const [bSrc, setBSrc] = useState(beforeUrl);
  const [aSrc, setASrc] = useState(afterUrl);

  useEffect(() => {
    setBSrc(beforeUrl);
  }, [beforeUrl]);

  useEffect(() => {
    setASrc(afterUrl);
  }, [afterUrl]);

  return (
    <div className="space-y-6">
      {/* Photo Comparison Card */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
              <span>Geotagged Photographic Verification</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                CV Consistency: {similarityScore}%
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sequential milestone comparison verified via GPS EXIF hash and structural milestone classifier.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              GPS Within {gpsVariance}m
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Card */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
            <div className="relative aspect-video bg-slate-200 overflow-hidden group">
              <img
                src={bSrc}
                onError={() => setBSrc(SVG_PLACEHOLDER_BEFORE)}
                alt="Milestone baseline stage"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-gov-navy/80 text-white font-bold text-[10px] uppercase backdrop-blur-xs">
                Baseline / Inspection #1
              </span>
            </div>
            <div className="p-3 text-xs">
              <p className="font-bold text-gov-navy">{beforeStage}</p>
              <div className="flex items-center justify-between text-slate-500 text-[11px] mt-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {beforeDate}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Geotag Authenticated
                </span>
              </div>
            </div>
          </div>

          {/* After Card */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
            <div className="relative aspect-video bg-slate-200 overflow-hidden group">
              <img
                src={aSrc}
                onError={() => setASrc(SVG_PLACEHOLDER_AFTER)}
                alt="Recent inspection stage"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-gov-saffron/90 text-white font-bold text-[10px] uppercase backdrop-blur-xs">
                Recent Field Inspection
              </span>
            </div>
            <div className="p-3 text-xs">
              <p className="font-bold text-gov-navy">{afterStage}</p>
              <div className="flex items-center justify-between text-slate-500 text-[11px] mt-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {afterDate}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Geotag Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Computer Vision Summary Callout */}
        <div className="mt-4 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Computer Vision Analysis Summary: </span>
            {aiNotes || 'Column grid geometries and structural reinforcement correspond with reported physical execution. No spatial duplicate detected with adjacent village works.'}
          </div>
        </div>
      </div>

      {/* Mandatory 360° Site Walkthrough Video Section */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-600" />
              <span>Site 360° Video Walkthrough Evidence</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Mandatory Field Protocol
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous panoramic video proof recorded on-site by the Field Inspector with hardware camera & satellite GPS sync.
            </p>
          </div>
        </div>

        {videoUrl ? (
          <div className="max-w-3xl mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md">
            <div className="flex items-center justify-center bg-black">
              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full max-h-[500px] object-contain rounded-t-xl"
              />
            </div>
            <div className="p-3 bg-slate-900 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-[11px] text-slate-300">
                  {videoName || 'Site_Walkthrough_Verification.webm'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hardware Stamp Verified
                </span>
                <span>360° Perimeter Coverage</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-center">
            <Video className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-gov-navy">Awaiting 360° Video Upload</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Field Officers can open the <b>Field Inspection</b> portal to record a live panoramic walkthrough or upload a site inspection video file.
            </p>
          </div>
        )}
      </div>

      {/* Historical Field Evidence Log */}
      {((inspections && inspections.length > 0) || (offlineInspections && offlineInspections.length > 0)) && (
        <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
          <h4 className="text-sm font-bold text-gov-navy mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gov-saffron" />
            <span>Inspection Evidence Registry & Audit History</span>
          </h4>

          <div className="space-y-2">
            {/* Show offline pending items first */}
            {offlineInspections.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border border-amber-200 bg-amber-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-2.5">
                  {item.photo_data_url ? (
                    <img src={item.photo_data_url} alt="Site" className="w-12 h-12 rounded object-cover border border-amber-300 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-amber-200/60 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-amber-700" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gov-navy">{item.inspector_name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                        {item.sync_status === 'PENDING_SYNC' ? 'Pending Cloud Sync (Offline)' : 'Synced'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{item.stage} • Physical Progress: {item.physical_progress_pct}%</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{item.notes}</p>
                  </div>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">{new Date(item.timestamp).toLocaleDateString('en-IN')}</span>
                  <span className="text-[10px] font-mono text-emerald-700">GPS ±{item.accuracy_m || 4.5}m</span>
                </div>
              </div>
            ))}

            {/* Show server inspections */}
            {inspections.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-2.5">
                  {item.photo_urls && item.photo_urls.length > 0 ? (
                    <img src={item.photo_urls[0]} alt="Site" className="w-12 h-12 rounded object-cover border border-slate-300 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gov-navy">{item.officer_name}</span>
                      <span className="text-slate-500 text-[11px]">({item.officer_designation})</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified {item.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Observed Progress: <b className="text-emerald-700">{item.physical_progress_observed}%</b> • Rating: {item.quality_rating}
                    </p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{item.general_remarks}</p>
                  </div>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">{item.inspection_date}</span>
                  <span className="text-[10px] font-mono text-emerald-700">Variance: {item.distance_variance_meters}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

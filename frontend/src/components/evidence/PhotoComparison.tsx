import React from 'react';
import { ShieldCheck, MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface PhotoComparisonProps {
  beforeUrl?: string;
  afterUrl?: string;
  beforeStage?: string;
  afterStage?: string;
  beforeDate?: string;
  afterDate?: string;
  similarityScore?: number;
  gpsVariance?: number;
}

export const PhotoComparison: React.FC<PhotoComparisonProps> = ({
  beforeUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600',
  afterUrl = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  beforeStage = 'Foundation & Substructure Stage (30%)',
  afterStage = 'Column Casting & Lintel Stage (72%)',
  beforeDate = '12 Aug 2025',
  afterDate = '18 Feb 2026',
  similarityScore = 88,
  gpsVariance = 14.5,
}) => {
  return (
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
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <div className="relative aspect-video bg-slate-200 overflow-hidden group">
            <img
              src={beforeUrl}
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
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <div className="relative aspect-video bg-slate-200 overflow-hidden group">
            <img
              src={afterUrl}
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

      <div className="mt-4 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Computer Vision Analysis Summary:</span> Column grid geometries and lintel reinforcement correspond with reported 72% physical execution. No spatial duplicate detected with adjacent village works.
        </div>
      </div>
    </div>
  );
};

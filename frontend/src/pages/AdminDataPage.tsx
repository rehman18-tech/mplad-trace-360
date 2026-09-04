import React, { useState } from 'react';
import { Settings, Upload, CheckCircle2, ShieldCheck, Database, RefreshCw, Cpu, Layers } from 'lucide-react';

export const AdminDataPage: React.FC = () => {
  const [costThreshold, setCostThreshold] = useState(15);
  const [delayDaysHigh, setDelayDaysHigh] = useState(45);
  const [delayDaysCritical, setDelayDaysCritical] = useState(90);
  const [guaranteeLeadDays, setGuaranteeLeadDays] = useState(30);
  const [duplicateRadiusMeters, setDuplicateRadiusMeters] = useState(250);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSimulateCSVImport = () => {
    setImportStatus("Validating CSV headers, coordinates, and INR schema...");
    setTimeout(() => {
      setImportStatus("✓ Success: 24 new MPLADS records validated & ingested into PostgreSQL schema without duplicate conflicts.");
    }, 1500);
  };

  const handleSaveRules = () => {
    alert("Risk thresholds updated in PostgreSQL engine and surveillance cron triggers.");
  };

  const dataSources = [
    { name: "e-SAKSHI MPLADS Official Web Portal", type: "National MoSPI Integration", lastSync: "Today, 04:30 IST", status: "OPERATIONAL", records: "18,450 Works", mode: "Cryptographic Hash & Official API Key" },
    { name: "PFMS (Public Financial Management System)", type: "Central Treasury & Banking Gateway", lastSync: "Today, 05:15 IST", status: "OPERATIONAL", records: "92,100 Payments", mode: "Direct Electronic Bank Scroll (EBS)" },
    { name: "State PWD / Jal Nigam e-Tendering Nodes", type: "Tender & Contract Agreement Pipeline", lastSync: "Yesterday, 22:00 IST", status: "OPERATIONAL", records: "4,120 Agreements", mode: "State Tender Portal Scraper & Webhook" },
    { name: "Field Officer Mobile Geotag Feeds", type: "On-Ground Inspection App", lastSync: "Live Streaming (2m ago)", status: "LIVE STREAMING", records: "1,280 Reports", mode: "GPS EXIF Metadata & Device Attestation" }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <Settings className="w-6 h-6 text-gov-saffron" />
              <span>Admin Data Management & Risk Rule Engine</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure surveillance sensitivity, manage national government data pipelines, and ingest administrative CSV/JSON datasets.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded bg-gov-navy text-white">
            Role 4: Higher Authority Admin
          </span>
        </div>
      </div>

      {/* Government Data Sources Transparency */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>Connected Government Data Sources & Verification Modes</span>
          </h3>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All 4 Gateways Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {dataSources.map((ds, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gov-navy text-sm">{ds.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {ds.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{ds.type}</p>
                <p className="text-[11px] text-slate-700 mt-2">
                  Verification Mode: <strong className="text-gov-navy">{ds.mode}</strong>
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Last Sync: {ds.lastSync}</span>
                <span className="font-bold text-slate-600">{ds.records}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSV Batch Ingestion Simulator */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
        <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
          <Upload className="w-5 h-5 text-gov-saffron" />
          <span>Batch Data Ingestion & Pre-Validation Pipeline (CSV / JSON)</span>
        </h3>
        <p className="text-xs text-slate-500">
          Administrative gateway to upload sanctioned works from state engineering divisions. Ingestion engine validates mandatory GPS coordinates, Indian rupee bounds, and MP constituency keys before database insertion.
        </p>

        <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="font-bold text-gov-navy text-xs mb-1">Select or Drag CSV / JSON Sanction Export</p>
          <p className="text-[11px] text-slate-500 mb-4">sample_district_sanctions_2026.csv (Format: MoSPI Schema v2.1)</p>
          <button
            type="button"
            onClick={handleSimulateCSVImport}
            className="px-5 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-navy-light transition-colors shadow-xs"
          >
            Run Pre-Validation & Ingest Batch
          </button>
        </div>

        {importStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-lg">
            {importStatus}
          </div>
        )}
      </div>

      {/* Configurable Surveillance Risk Rules */}
      <div className="bg-white rounded-xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
        <h3 className="text-base font-bold text-gov-navy flex items-center gap-2">
          <Cpu className="w-5 h-5 text-gov-saffron" />
          <span>Autonomous Early-Warning Sensitivity Calibration</span>
        </h3>
        <p className="text-xs text-slate-500">
          Adjust analytical thresholds used across the 7-factor scoring engine to calibrate alert dispatch sensitivity for district collectors.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Cost Anomaly Trigger Variance:</label>
              <span className="font-extrabold text-gov-navy">{costThreshold}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={costThreshold}
              onChange={(e) => setCostThreshold(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-navy"
            />
            <span className="text-[10px] text-slate-400 block">Flags projects where expenditure exceeds contracted baseline.</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Schedule Slippage (Critical Tier):</label>
              <span className="font-extrabold text-red-600">{delayDaysCritical} Days</span>
            </div>
            <input
              type="range"
              min="30"
              max="180"
              value={delayDaysCritical}
              onChange={(e) => setDelayDaysCritical(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <span className="text-[10px] text-slate-400 block">Triggers autonomous Level 3 District Collector intervention.</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Guarantee Expiry Alert Lead Time:</label>
              <span className="font-extrabold text-amber-700">{guaranteeLeadDays} Days</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              value={guaranteeLeadDays}
              onChange={(e) => setGuaranteeLeadDays(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <span className="text-[10px] text-slate-400 block">Countdown horizon before mandatory PBG revalidation notice.</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Duplicate Work GPS Radius Proximity:</label>
              <span className="font-extrabold text-indigo-700">{duplicateRadiusMeters} Meters</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={duplicateRadiusMeters}
              onChange={(e) => setDuplicateRadiusMeters(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[10px] text-slate-400 block">Spatial threshold for cross-scheme road or water overlap detection.</span>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="button"
            onClick={handleSaveRules}
            className="px-6 py-2.5 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs rounded-xl transition-colors shadow-gov"
          >
            Save & Deploy Risk Thresholds
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { Project } from '../../types';
import { formatIndianCurrency } from '../common/StatCard';
import L from 'leaflet';

interface IndiaProjectMapProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  selectedProjectId?: string;
  height?: string;
}

export const IndiaProjectMap: React.FC<IndiaProjectMapProps> = ({
  projects,
  onSelectProject,
  selectedProjectId,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of India (approx Nagpur 21.1458, 79.0882)
      const map = L.map(mapContainerRef.current, {
        center: [21.5, 79.0],
        zoom: 5,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | MPLAD-TRACE 360',
        maxZoom: 18,
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markers = markersRef.current;

    if (markers) {
      markers.clearLayers();

      projects.forEach((proj) => {
        if (!proj.latitude || !proj.longitude) return;

        // Determine marker color
        let pinColor = '#15803D'; // Green (Normal)
        let ringColor = 'rgba(21, 128, 61, 0.2)';
        if (proj.risk_level === 'CRITICAL') {
          pinColor = '#DC2626'; // Red
          ringColor = 'rgba(220, 38, 38, 0.3)';
        } else if (proj.risk_level === 'HIGH RISK') {
          pinColor = '#EA580C'; // Orange
          ringColor = 'rgba(234, 88, 12, 0.25)';
        } else if (proj.risk_level === 'WATCH') {
          pinColor = '#D97706'; // Amber / Yellow
          ringColor = 'rgba(217, 119, 6, 0.25)';
        }

        const customIcon = L.divIcon({
          className: 'custom-project-pin',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${pinColor};
              border: 2px solid white;
              box-shadow: 0 0 0 4px ${ringColor}, 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
              font-weight: bold;
              cursor: pointer;
            ">
              ${proj.overall_risk_score}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12],
        });

        const marker = L.marker([proj.latitude, proj.longitude], { icon: customIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-2 text-xs font-sans max-w-[240px]';
        popupContent.innerHTML = `
          <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
            <span style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: #64748b;">${proj.id}</span>
            <h4 style="font-weight: bold; font-size: 12px; color: #0B2545; line-height: 1.3; margin: 2px 0;">${proj.title}</h4>
            <span style="font-size: 11px; color: #475569;">📍 ${proj.village || ''}, ${proj.district}, ${proj.state}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 8px;">
            <div>
              <span style="color: #64748b; font-size: 10px;">Sanction:</span>
              <div style="font-weight: bold; color: #0B2545;">${formatIndianCurrency(proj.sanctioned_amount)}</div>
            </div>
            <div>
              <span style="color: #64748b; font-size: 10px;">Progress:</span>
              <div style="font-weight: bold; color: #15803D;">${proj.physical_progress}%</div>
            </div>
            <div>
              <span style="color: #64748b; font-size: 10px;">Risk Score:</span>
              <div style="font-weight: bold; color: ${pinColor};">${proj.overall_risk_score}/100</div>
            </div>
            <div>
              <span style="color: #64748b; font-size: 10px;">Last Insp:</span>
              <div style="font-weight: 500;">${proj.last_inspected_date || 'Pending'}</div>
            </div>
          </div>
          <button 
            id="btn-open-${proj.id.replace(/-/g, '_')}" 
            style="
              width: 100%;
              background: #0B2545;
              color: white;
              padding: 6px 10px;
              border-radius: 6px;
              font-weight: bold;
              font-size: 11px;
              cursor: pointer;
              border: none;
            "
          >
            Open Project 360° Trace →
          </button>
        `;

        // Attach event to button inside popup
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-open-${proj.id.replace(/-/g, '_')}`);
          if (btn) {
            btn.onclick = () => {
              onSelectProject(proj.id);
            };
          }
        });

        markers.addLayer(marker);
      });
    }
  }, [projects, onSelectProject]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-gov-ivory-border shadow-gov">
      {/* Map Header / Legend Overlay */}
      <div className="absolute top-3 right-3 z-1000 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-md text-xs">
        <span className="font-bold text-gov-navy block text-[11px] mb-1.5 uppercase tracking-wider">
          Early-Warning Severity
        </span>
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Normal (0 - 29)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Watch (30 - 49)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>High Risk (50 - 74)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>Critical Surveillance (75 - 100)</span>
          </div>
        </div>
      </div>

      <div ref={mapContainerRef} style={{ width: '100%', height }} className="z-0" />
    </div>
  );
};

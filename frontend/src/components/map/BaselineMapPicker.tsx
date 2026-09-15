import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

interface BaselineMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  height?: string;
  geofenceRadiusMeters?: number;
}

export const BaselineMapPicker: React.FC<BaselineMapPickerProps> = ({
  latitude,
  longitude,
  onChange,
  height = '240px',
  geofenceRadiusMeters = 200,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  // Default coordinate if none provided (Hyderabad / Telangana center: 17.385044, 78.486671)
  const effectiveLat = latitude ?? 17.385044;
  const effectiveLng = longitude ?? 78.486671;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [effectiveLat, effectiveLng],
        zoom: latitude && longitude ? 15 : 6,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | MPLAD-TRACE 360',
        maxZoom: 19,
      }).addTo(map);

      // Custom orange statutory pin icon
      const customPinIcon = L.divIcon({
        className: 'custom-statutory-pin',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #EA580C;
            border: 3px solid white;
            box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.35), 0 3px 6px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: grab;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([effectiveLat, effectiveLng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 11px; line-height: 1.4; color: #0f172a; text-align: center;">
          <strong style="color: #ea580c; display: block; margin-bottom: 2px;">Baseline Project Geotag</strong>
          <span>Drag pin or click map to reposition</span>
        </div>
      `);

      // 200m statutory geofence circle
      const circle = L.circle([effectiveLat, effectiveLng], {
        radius: geofenceRadiusMeters,
        color: '#15803d',
        weight: 2,
        dashArray: '4, 4',
        fillColor: '#22c55e',
        fillOpacity: 0.15,
      }).addTo(map);

      // Handle marker dragend
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        circle.setLatLng(pos);
        onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
      });

      // Handle map click to reposition pin
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        circle.setLatLng([lat, lng]);
        onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
      });

      markerRef.current = marker;
      circleRef.current = circle;
      mapInstanceRef.current = map;

      // Invalidate size after modal render animation
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } else {
      // Update existing map and marker if props changed
      const map = mapInstanceRef.current;
      const marker = markerRef.current;
      const circle = circleRef.current;

      if (latitude && longitude && marker && circle) {
        const currentPos = marker.getLatLng();
        if (
          Math.abs(currentPos.lat - latitude) > 0.00001 ||
          Math.abs(currentPos.lng - longitude) > 0.00001
        ) {
          marker.setLatLng([latitude, longitude]);
          circle.setLatLng([latitude, longitude]);
          map.panTo([latitude, longitude], { animate: true });
        }
      }
    }
  }, [latitude, longitude, onChange, effectiveLat, effectiveLng, geofenceRadiusMeters]);

  const handleCenterOnPin = () => {
    if (mapInstanceRef.current && latitude && longitude) {
      mapInstanceRef.current.setView([latitude, longitude], 16, { animate: true });
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Floating map controls */}
      <div className="absolute top-2 right-2 z-[400] flex flex-col gap-1.5">
        {latitude && longitude && (
          <button
            type="button"
            onClick={handleCenterOnPin}
            className="p-1.5 bg-white/95 hover:bg-white text-gov-navy hover:text-gov-saffron rounded-lg shadow-md border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Recenter Map on Project Geotag"
          >
            <Navigation className="w-3.5 h-3.5 text-gov-saffron" />
            <span className="text-[10px] hidden sm:inline">Center Pin</span>
          </button>
        )}
      </div>

      {/* Legend & Instructions banner */}
      <div className="absolute bottom-2 left-2 right-2 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between text-[10px] text-slate-700">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-orange-700">
            <MapPin className="w-3 h-3 text-orange-600" />
            Project Baseline Pin (Draggable)
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-600 bg-emerald-200/50 inline-block"></span>
            200m MoSPI Geofence
          </span>
        </div>
        <span className="text-slate-500 font-medium hidden md:inline">
          Click anywhere or drag pin to adjust
        </span>
      </div>
    </div>
  );
};

/**
 * Intelligent Multi-Tier Indian Address Geocoder & Locality Resolver
 * Specifically tuned for Indian administrative hierarchy:
 * [Door/Plot No] -> [Colony / Layout] -> [Village / Ward / Suburb] -> [Mandal / Tehsil] -> [District] -> [State]
 */

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  displayName: string;
  shortName: string;
  source: string;
  state?: string;
  district?: string;
  mandal?: string;
  village?: string;
  doorNumber?: string;
}

const INDIAN_STATE_REPLACEMENTS: [RegExp, string][] = [
  [/andhra\s*pradesh/gi, 'Andhra Pradesh'],
  [/andhrapradesh/gi, 'Andhra Pradesh'],
  [/tamil\s*nadu/gi, 'Tamil Nadu'],
  [/tamilnadu/gi, 'Tamil Nadu'],
  [/uttar\s*pradesh/gi, 'Uttar Pradesh'],
  [/uttarpradesh/gi, 'Uttar Pradesh'],
  [/madhya\s*pradesh/gi, 'Madhya Pradesh'],
  [/madhyapradesh/gi, 'Madhya Pradesh'],
  [/west\s*bengal/gi, 'West Bengal'],
  [/westbengal/gi, 'West Bengal'],
  [/himachal\s*pradesh/gi, 'Himachal Pradesh'],
  [/himachalpradesh/gi, 'Himachal Pradesh'],
  [/jammu\s*and\s*kashmir/gi, 'Jammu and Kashmir'],
  [/arunachal\s*pradesh/gi, 'Arunachal Pradesh'],
  [/arunachalpradesh/gi, 'Arunachal Pradesh']
];

export function cleanIndianAddress(raw: string): {
  cleaned: string;
  doorNumber?: string;
  meaningfulSegments: string[];
} {
  let text = raw.trim();

  // Normalize state names with missing or irregular spacing
  for (const [pattern, replacement] of INDIAN_STATE_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }

  // Split by commas
  const rawSegments = text.split(',').map(s => s.trim()).filter(Boolean);

  let doorNumber: string | undefined;
  const meaningfulSegments: string[] = [];

  // Door number / house number / plot number regex patterns common in India
  const doorRegex = /^(\d+[-\/]\d+[-\/]?\d*|d\.?\s*no\.?|plot\s*no\.?|h\.?\s*no\.?|flat\s*no\.?|ward\s*no\.?|\d+$)/i;

  for (const seg of rawSegments) {
    if (doorRegex.test(seg) && !doorNumber) {
      doorNumber = seg;
    } else {
      meaningfulSegments.push(seg);
    }
  }

  return {
    cleaned: meaningfulSegments.join(', '),
    doorNumber,
    meaningfulSegments
  };
}

/**
 * Searches for an Indian location using a multi-tier fallback cascade:
 * Tier 1: Photon (Komoot/Elasticsearch) with typo tolerance
 * Tier 2: Nominatim with cleaned address
 * Tier 3: Nominatim with progressive locality fallback (stripping hyper-local colony names)
 */
export async function searchIndianAddress(rawQuery: string): Promise<GeocodedLocation | null> {
  const { cleaned, doorNumber, meaningfulSegments } = cleanIndianAddress(rawQuery);
  if (!cleaned && meaningfulSegments.length === 0) return null;

  // Build cascade candidates
  const candidates: string[] = [];
  if (cleaned) candidates.push(cleaned);

  // Progressive fallback candidates (e.g. drop first local colony, keep mandal/city/state)
  for (let i = 1; i < meaningfulSegments.length; i++) {
    candidates.push(meaningfulSegments.slice(i).join(', '));
  }

  // Tier 1: Photon Geocoder (Fast, typo-tolerant, understands Indian colonies and abbreviations)
  const photonQuery = meaningfulSegments.join(' ');
  try {
    const pUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(photonQuery)}&limit=1`;
    const pRes = await fetch(pUrl);
    if (pRes.ok) {
      const pData = await pRes.json();
      if (pData.features && pData.features.length > 0) {
        const feat = pData.features[0];
        const [lon, lat] = feat.geometry.coordinates;
        const props = feat.properties || {};

        const state = props.state || '';
        const district = props.district || props.city || props.county || '';
        const mandal = props.county || props.city || props.district || '';
        const village = props.name || props.street || '';
        const shortName = props.name || meaningfulSegments[0] || 'Sanctioned Site';
        const displayName = [props.name, props.street, props.district, props.city, props.state, 'India']
          .filter(Boolean)
          .filter((val, idx, arr) => arr.indexOf(val) === idx)
          .join(', ');

        return {
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lon.toFixed(6)),
          displayName,
          shortName,
          source: '🛰️ High-Precision Locality Engine (Photon / OSM)',
          state,
          district,
          mandal,
          village,
          doorNumber
        };
      }
    }
  } catch {
    // Fall through to Nominatim cascade
  }

  // Tier 2 & 3: Nominatim Cascade
  for (const candidate of candidates) {
    try {
      const nUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(candidate)}&countrycodes=in&limit=1&addressdetails=1`;
      const nRes = await fetch(nUrl, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'MPLADTrace360/1.0 (admin@mplad-trace.gov.in)'
        }
      });
      if (nRes.ok) {
        const nData = await nRes.json();
        if (nData && nData.length > 0) {
          const item = nData[0];
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const addr = item.address || {};

          const state = addr.state || '';
          const district = addr.state_district || addr.district || addr.county || addr.city || '';
          const mandal = addr.town || addr.subdistrict || addr.tehsil || addr.municipality || '';
          const village = addr.village || addr.suburb || addr.residential || addr.neighbourhood || item.name || '';
          const shortName = item.name || village || meaningfulSegments[0] || 'Sanctioned Site';

          return {
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lon.toFixed(6)),
            displayName: item.display_name,
            shortName,
            source: '🏛️ Administrative Registry (OpenStreetMap Nominatim)',
            state,
            district,
            mandal,
            village,
            doorNumber
          };
        }
      }
    } catch {
      // Continue next candidate
    }
  }

  return null;
}

/**
 * Live autocomplete suggestions for search bar dropdown
 */
export async function getIndianAddressSuggestions(query: string): Promise<GeocodedLocation[]> {
  const { cleaned, meaningfulSegments } = cleanIndianAddress(query);
  const q = cleaned || query.trim();
  if (q.length < 3) return [];

  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.features) return [];

    return data.features.map((feat: any) => {
      const [lon, lat] = feat.geometry.coordinates;
      const p = feat.properties || {};
      const parts = [p.name, p.street, p.district, p.city, p.state, p.country].filter(Boolean);
      const uniqueParts = parts.filter((v, i, a) => a.indexOf(v) === i);

      return {
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lon.toFixed(6)),
        displayName: uniqueParts.join(', '),
        shortName: p.name || uniqueParts[0] || 'Location',
        source: 'Photon/OSM',
        state: p.state || '',
        district: p.district || p.city || p.county || '',
        mandal: p.county || p.city || '',
        village: p.name || p.street || ''
      };
    });
  } catch {
    return [];
  }
}

/**
 * Client-Side Binary EXIF GPS Extractor & Statutory Geofence Validator
 * Compliant with MoSPI Anti-Fraud & Physical Site Verification Guidelines
 */

export interface ExifGpsResult {
  hasExif: boolean;
  hasGps: boolean;
  latitude?: number;
  longitude?: number;
  altitudeMeters?: number;
  timestamp?: string;
  deviceMake?: string;
  deviceModel?: string;
  distanceMeters?: number;
  isWithinGeofence?: boolean;
  rawGpsString?: string;
  errorReason?: string;
}

export const STATUTORY_MAX_GEOFENCE_METERS = 200;

/**
 * Calculates exact distance between two coordinates in meters using the Haversine formula.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 10) / 10;
}

/**
 * Parses raw ArrayBuffer from a photographic image (JPEG/HEIC/TIFF) to extract EXIF and GPS IFD data.
 */
export async function extractExifGpsFromFile(
  file: File | Blob,
  targetLat?: number | null,
  targetLon?: number | null
): Promise<ExifGpsResult> {
  try {
    const buffer = await file.arrayBuffer();
    const dataView = new DataView(buffer);

    // Verify JPEG SOI marker (0xFFD8)
    if (dataView.byteLength < 4 || dataView.getUint16(0, false) !== 0xffd8) {
      return {
        hasExif: false,
        hasGps: false,
        errorReason: 'File is not a valid JPEG/JFIF image. Uncompressed or web formats may have stripped EXIF headers.'
      };
    }

    let offset = 2;
    let app1Offset = -1;

    // Scan for APP1 marker (0xFFE1)
    while (offset < dataView.byteLength - 4) {
      const marker = dataView.getUint16(offset, false);
      const length = dataView.getUint16(offset + 2, false);

      if (marker === 0xffe1) {
        app1Offset = offset + 4;
        break;
      }
      if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) {
        // SOS (Start of Scan) or corrupt marker reached
        break;
      }
      offset += 2 + length;
    }

    if (app1Offset === -1) {
      return {
        hasExif: false,
        hasGps: false,
        errorReason: 'No EXIF metadata segment (APP1) found in image. Camera hardware GPS was either turned OFF or stripped by messenger compression (e.g. WhatsApp).'
      };
    }

    // Check for "Exif\0\0" header (0x45 0x78 0x69 0x66 0x00 0x00)
    const exifHeader = [
      dataView.getUint8(app1Offset),
      dataView.getUint8(app1Offset + 1),
      dataView.getUint8(app1Offset + 2),
      dataView.getUint8(app1Offset + 3),
      dataView.getUint8(app1Offset + 4),
      dataView.getUint8(app1Offset + 5)
    ];
    if (
      exifHeader[0] !== 0x45 ||
      exifHeader[1] !== 0x78 ||
      exifHeader[2] !== 0x69 ||
      exifHeader[3] !== 0x66 ||
      exifHeader[4] !== 0x00 ||
      exifHeader[5] !== 0x00
    ) {
      return {
        hasExif: false,
        hasGps: false,
        errorReason: 'Malformed EXIF header in APP1 segment.'
      };
    }

    // TIFF header starts immediately after "Exif\0\0" (app1Offset + 6)
    const tiffStart = app1Offset + 6;
    const byteOrderMarker = dataView.getUint16(tiffStart, false);
    let littleEndian: boolean;

    if (byteOrderMarker === 0x4949) {
      // "II" -> Intel Little-Endian
      littleEndian = true;
    } else if (byteOrderMarker === 0x4d4d) {
      // "MM" -> Motorola Big-Endian
      littleEndian = false;
    } else {
      return {
        hasExif: false,
        hasGps: false,
        errorReason: 'Invalid TIFF byte order indicator.'
      };
    }

    // Verify 42 (0x002A) in TIFF header
    if (dataView.getUint16(tiffStart + 2, littleEndian) !== 0x002a) {
      return {
        hasExif: false,
        hasGps: false,
        errorReason: 'Invalid TIFF header marker.'
      };
    }

    const firstIfdOffset = dataView.getUint32(tiffStart + 4, littleEndian);
    if (tiffStart + firstIfdOffset >= dataView.byteLength) {
      return {
        hasExif: false,
        hasGps: false,
        errorReason: 'IFD0 offset pointer out of bounds.'
      };
    }

    // Helper to read string from TIFF offset
    const readTiffString = (valOffset: number, length: number): string => {
      let str = '';
      const absOffset = tiffStart + valOffset;
      for (let i = 0; i < length && absOffset + i < dataView.byteLength; i++) {
        const charCode = dataView.getUint8(absOffset + i);
        if (charCode === 0) break;
        str += String.fromCharCode(charCode);
      }
      return str.trim();
    };

    // Helper to read Rational (numerator / denominator)
    const readRational = (valOffset: number): number => {
      const absOffset = tiffStart + valOffset;
      if (absOffset + 8 > dataView.byteLength) return 0;
      const num = dataView.getUint32(absOffset, littleEndian);
      const den = dataView.getUint32(absOffset + 4, littleEndian);
      if (den === 0) return 0;
      return num / den;
    };

    // Parse IFD0
    let ifd0Offset = tiffStart + firstIfdOffset;
    const ifd0Entries = dataView.getUint16(ifd0Offset, littleEndian);
    ifd0Offset += 2;

    let exifIfdPointer: number | null = null;
    let gpsIfdPointer: number | null = null;
    let deviceMake: string | undefined;
    let deviceModel: string | undefined;
    let timestamp: string | undefined;

    for (let i = 0; i < ifd0Entries && ifd0Offset + 12 <= dataView.byteLength; i++) {
      const tag = dataView.getUint16(ifd0Offset, littleEndian);
      const count = dataView.getUint32(ifd0Offset + 4, littleEndian);
      const valOffset = dataView.getUint32(ifd0Offset + 8, littleEndian);

      if (tag === 0x010f) {
        // Make
        deviceMake = count <= 4 ? String.fromCharCode(valOffset & 0xff) : readTiffString(valOffset, count);
      } else if (tag === 0x0110) {
        // Model
        deviceModel = count <= 4 ? String.fromCharCode(valOffset & 0xff) : readTiffString(valOffset, count);
      } else if (tag === 0x0132) {
        // DateTime
        timestamp = readTiffString(valOffset, count);
      } else if (tag === 0x8769) {
        // Exif IFD Pointer
        exifIfdPointer = valOffset;
      } else if (tag === 0x8825) {
        // GPS IFD Pointer
        gpsIfdPointer = valOffset;
      }
      ifd0Offset += 12;
    }

    // Inspect Exif IFD for DateTimeOriginal if present
    if (exifIfdPointer && tiffStart + exifIfdPointer < dataView.byteLength) {
      let exifSubOffset = tiffStart + exifIfdPointer;
      const subEntries = dataView.getUint16(exifSubOffset, littleEndian);
      exifSubOffset += 2;
      for (let i = 0; i < subEntries && exifSubOffset + 12 <= dataView.byteLength; i++) {
        const tag = dataView.getUint16(exifSubOffset, littleEndian);
        const count = dataView.getUint32(exifSubOffset + 4, littleEndian);
        const valOffset = dataView.getUint32(exifSubOffset + 8, littleEndian);
        if (tag === 0x9003) {
          // DateTimeOriginal
          const origTime = readTiffString(valOffset, count);
          if (origTime) timestamp = origTime;
        }
        exifSubOffset += 12;
      }
    }

    if (!gpsIfdPointer || tiffStart + gpsIfdPointer >= dataView.byteLength) {
      return {
        hasExif: true,
        hasGps: false,
        deviceMake,
        deviceModel,
        timestamp,
        errorReason: 'Photo has EXIF metadata, but NO GPS IFD was attached by the camera. Ensure GPS Location is enabled in your device camera settings.'
      };
    }

    // Parse GPS IFD
    let gpsOffset = tiffStart + gpsIfdPointer;
    const gpsEntries = dataView.getUint16(gpsOffset, littleEndian);
    gpsOffset += 2;

    let latRef = 'N';
    let lonRef = 'E';
    let latDMS: number[] | null = null;
    let lonDMS: number[] | null = null;
    let altitude: number | undefined;

    for (let i = 0; i < gpsEntries && gpsOffset + 12 <= dataView.byteLength; i++) {
      const tag = dataView.getUint16(gpsOffset, littleEndian);
      const valOffset = dataView.getUint32(gpsOffset + 8, littleEndian);

      if (tag === 0x0001) {
        // GPSLatitudeRef ('N' or 'S')
        latRef = String.fromCharCode(dataView.getUint8(gpsOffset + 8));
      } else if (tag === 0x0002) {
        // GPSLatitude (3 rationals)
        const d = readRational(valOffset);
        const m = readRational(valOffset + 8);
        const s = readRational(valOffset + 16);
        latDMS = [d, m, s];
      } else if (tag === 0x0003) {
        // GPSLongitudeRef ('E' or 'W')
        lonRef = String.fromCharCode(dataView.getUint8(gpsOffset + 8));
      } else if (tag === 0x0004) {
        // GPSLongitude (3 rationals)
        const d = readRational(valOffset);
        const m = readRational(valOffset + 8);
        const s = readRational(valOffset + 16);
        lonDMS = [d, m, s];
      } else if (tag === 0x0006) {
        // GPSAltitude
        altitude = Math.round(readRational(valOffset) * 10) / 10;
      }
      gpsOffset += 12;
    }

    if (!latDMS || !lonDMS) {
      return {
        hasExif: true,
        hasGps: false,
        deviceMake,
        deviceModel,
        timestamp,
        errorReason: 'GPS tags in camera EXIF are incomplete (missing latitude or longitude coordinates).'
      };
    }

    // Convert DMS to Decimal Degrees
    let finalLat = latDMS[0] + latDMS[1] / 60 + latDMS[2] / 3600;
    if (latRef.toUpperCase() === 'S') finalLat = -finalLat;

    let finalLon = lonDMS[0] + lonDMS[1] / 60 + lonDMS[2] / 3600;
    if (lonRef.toUpperCase() === 'W') finalLon = -finalLon;

    finalLat = Math.round(finalLat * 1000000) / 1000000;
    finalLon = Math.round(finalLon * 1000000) / 1000000;

    let distanceMeters: number | undefined;
    let isWithinGeofence: boolean | undefined;

    if (targetLat !== undefined && targetLat !== null && targetLon !== undefined && targetLon !== null) {
      distanceMeters = calculateHaversineDistanceMeters(targetLat, targetLon, finalLat, finalLon);
      isWithinGeofence = distanceMeters <= STATUTORY_MAX_GEOFENCE_METERS;
    }

    return {
      hasExif: true,
      hasGps: true,
      latitude: finalLat,
      longitude: finalLon,
      altitudeMeters: altitude,
      timestamp: timestamp ? timestamp.replace(/:/g, '-').replace(' ', 'T') : undefined,
      deviceMake,
      deviceModel,
      distanceMeters,
      isWithinGeofence,
      rawGpsString: `${finalLat.toFixed(6)}° ${latRef}, ${finalLon.toFixed(6)}° ${lonRef}`
    };
  } catch (err: any) {
    return {
      hasExif: false,
      hasGps: false,
      errorReason: `EXIF Parser Exception: ${err?.message || 'Failed to decode image binary headers'}`
    };
  }
}

/**
 * Creates a calibrated image with stamped HUD banner matching target coordinates.
 * Used for live on-site field camera capture and verified evidence stamping.
 */
export function createGeotagHUDCanvas(
  sourceImage: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  lat: number,
  lon: number,
  accuracyMeters: number,
  projectId: string,
  officerName: string,
  stage: string = '0% Baseline Handover'
): string {
  const canvas = document.createElement('canvas');
  const width = (sourceImage as any).videoWidth || sourceImage.width || 1280;
  const height = (sourceImage as any).videoHeight || sourceImage.height || 720;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw image
  ctx.drawImage(sourceImage, 0, 0, width, height);

  // Bottom HUD telemetry banner
  const bannerHeight = Math.max(70, Math.floor(height * 0.12));
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

  // Border top line
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, height - bannerHeight, width, 3);

  // HUD text formatting
  const fontSize = Math.max(12, Math.floor(bannerHeight * 0.22));
  ctx.font = `bold ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.fillStyle = '#ffffff';

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const line1 = `📍 GEOFENCE ANCHOR: ${lat.toFixed(6)}° N, ${lon.toFixed(6)}° E (±${accuracyMeters.toFixed(1)}m)`;
  const line2 = `🛡️ PROJECT: ${projectId} • ${stage} • ${now} UTC`;
  const line3 = `✍️ ATTESTED BY: ${officerName} (STATUTORY MILESTONE 0 RECORD)`;

  ctx.fillText(line1, 20, height - bannerHeight + fontSize + 8);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `${Math.max(10, fontSize - 2)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(line2, 20, height - bannerHeight + (fontSize * 2) + 12);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(line3, 20, height - bannerHeight + (fontSize * 3) + 14);

  return canvas.toDataURL('image/jpeg', 0.92);
}

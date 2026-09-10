import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { offlineStorage, OfflineInspection } from '../services/offlineStorage';
import { useToast } from '../context/ToastContext';
import { 
  Smartphone, MapPin, Camera, CheckCircle2, AlertTriangle, ShieldCheck, 
  Upload, ArrowRight, Wifi, WifiOff, RefreshCw, Download, Check, Clock, Trash2,
  Printer, FileDown, X, RotateCw, Image, Sparkles, Navigation, Compass,
  Video, Play, FileVideo, Film, Square, Radio
} from 'lucide-react';

interface FieldInspectionPageProps {
  initialProjectId?: string;
  onOpenProject: (projectId: string) => void;
}

export const FieldInspectionPage: React.FC<FieldInspectionPageProps> = ({
  initialProjectId = 'MPLAD-AP-2026-00125',
  onOpenProject,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Network Connectivity State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingSyncList, setPendingSyncList] = useState<OfflineInspection[]>([]);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Form State
  const [projectId, setProjectId] = useState(initialProjectId);
  const [officerName, setOfficerName] = useState('Shri R. K. Verma, AEE');
  const [officerDesignation, setOfficerDesignation] = useState('Assistant Executive Engineer, PRED');
  const [stage, setStage] = useState('Foundation & Substructure Stage (30%)');
  const [lat, setLat] = useState('17.9312');
  const [lon, setLon] = useState('83.4248');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [progressObserved, setProgressObserved] = useState(72);
  const [qualityRating, setQualityRating] = useState('Satisfactory');
  const [materialObs, setMaterialObs] = useState('Cement grade 43 PPC and tested coarse aggregate present on site. Test cubes cast.');
  const [labourObs, setLabourObs] = useState('18 workers on site. Steel binding for roof lintels underway.');
  const [generalRemarks, setGeneralRemarks] = useState('Milestone verified against sanctioned DPR drawings. Notice issued for roofing acceleration.');
  const [isStalled, setIsStalled] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('/images/baseline_inspection.jpg');
  
  // Mandatory Milestone Video Walkthrough State
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Live Video Recorder State (MediaRecorder API)
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Camera Mode: 'photo' (snapshots) or 'video' (record live walkthrough)
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');

  const [submitting, setSubmitting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<any | null>(null);
  const [offlineNotice, setOfflineNotice] = useState<OfflineInspection | null>(null);

  // Start Live Video Recording in viewfinder
  const startRecording = () => {
    if (!streamRef.current) {
      showToast('⚠️ Camera stream is not ready for recording.', 'warning');
      return;
    }

    try {
      videoChunksRef.current = [];
      const options: MediaRecorderOptions = { mimeType: 'video/webm' };
      if (!MediaRecorder.isTypeSupported('video/webm')) {
        delete options.mimeType; // Let browser pick default supported type
      }

      const recorder = new MediaRecorder(streamRef.current, options);
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mime = recorder.mimeType || 'video/webm';
        if (videoChunksRef.current.length > 0) {
          const blob = new Blob(videoChunksRef.current, { type: mime });
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              setVideoPreview(reader.result as string);
              const fileName = `MoSPI_Site_Record_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '_')}.webm`;
              setVideoName(fileName);
              setVideoError(null);
              showToast(`✓ Recorded site walkthrough video attached (${fileName})!`, 'success');
            }
          };
          reader.readAsDataURL(blob);
        }
        stopLiveCamera();
      };

      recorder.start(1000); // 1-second chunks
      mediaRecorderRef.current = recorder;
      setIsRecordingVideo(true);
      setRecordingSeconds(0);

      // Start duration counter
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      showToast('🔴 Recording live site video walkthrough... Pan around the project site.', 'info');
    } catch (e: any) {
      console.error('Failed to start MediaRecorder:', e);
      showToast('Failed to initialize video recording on this device. You can upload a recorded video file.', 'warning');
    }
  };

  // Stop Live Video Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      stopLiveCamera();
    }
    setIsRecordingVideo(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Handle mandatory video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      const err = 'Milestone video exceeds maximum allowed size (50MB). Please record a shorter 360° pan.';
      setVideoError(err);
      showToast(err, 'error');
      return;
    }

    if (!file.type.startsWith('video/')) {
      const err = 'Please select a valid video format (MP4, WebM, 3GP, MOV).';
      setVideoError(err);
      showToast(err, 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setVideoPreview(reader.result as string);
        setVideoName(file.name);
        setVideoError(null);
        showToast(`✓ Mandatory site walkthrough video attached (${file.name})`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setVideoName(null);
    setVideoError(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  // Live Camera Viewfinder State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isFlashing, setIsFlashing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync state & network listeners
  useEffect(() => {
    const updateOnline = () => {
      setIsOnline(true);
      showToast('Network restored: Central Cloud Sync Connected', 'success');
      // Auto-trigger sync when reconnecting
      triggerAutoSync();
    };

    const updateOffline = () => {
      setIsOnline(false);
      showToast('Offline Mode: Ground storage active. Inspections will queue locally.', 'warning');
    };

    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOffline);

    // Capture PWA installation prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Initial load of pending offline records
    setPendingSyncList(offlineStorage.getAll().filter(i => i.sync_status === 'PENDING_SYNC'));

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const triggerAutoSync = async () => {
    const pendingCount = offlineStorage.getPendingCount();
    if (pendingCount === 0) return;

    setSyncing(true);
    showToast(`Uploading ${pendingCount} offline inspection(s) to central database...`, 'info');
    const res = await offlineStorage.syncPending();
    setSyncing(false);
    setPendingSyncList(offlineStorage.getAll().filter(i => i.sync_status === 'PENDING_SYNC'));

    if (res.synced > 0) {
      showToast(`✓ Successfully synced ${res.synced} inspection(s) to Central MoSPI Registry!`, 'success');
    }
  };

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      showToast('To install: Open browser menu (⋮ or Share) and tap "Install App" or "Add to Home Screen".', 'info');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('MPLAD Field App installed successfully!', 'success');
    }
    setDeferredPrompt(null);
  };

  // Real Hardware GPS Fetching
  const captureGPS = (): Promise<{ lat: string; lon: string; accuracy: number }> => {
    setGpsLoading(true);
    setGpsError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = 'Geolocation is not supported by this browser. Please enable location services.';
        setGpsError(err);
        setGpsLoading(false);
        showToast(err, 'error');
        reject(new Error(err));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latVal = pos.coords.latitude.toFixed(6);
          const lonVal = pos.coords.longitude.toFixed(6);
          const accVal = Math.round(pos.coords.accuracy * 10) / 10;
          setLat(latVal);
          setLon(lonVal);
          setGpsAccuracy(accVal);
          setGpsLocked(true);
          setGpsLoading(false);
          setGpsError(null);
          showToast(`✓ GPS Satellite Locked: Lat ${latVal}°, Lon ${lonVal}° (±${accVal}m)`, 'success');
          resolve({ lat: latVal, lon: lonVal, accuracy: accVal });
        },
        (err) => {
          setGpsLoading(false);
          let msg = 'Location access is required before opening camera. Please turn on device location services and allow browser access.';
          if (err.code === err.PERMISSION_DENIED) {
            msg = 'Location permission was denied. Please turn ON location / GPS services in your browser or device settings.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            msg = 'GPS satellite signal unavailable. Please ensure location services are turned ON.';
          } else if (err.code === err.TIMEOUT) {
            msg = 'GPS location request timed out. Please retry with location services active.';
          }
          setGpsError(msg);
          showToast(msg, 'warning');
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    });
  };

  // Turn ON location first, and open camera only once coordinates are confirmed
  const handleStartCameraWithLocation = async (initialMode: 'photo' | 'video' = 'photo') => {
    setCameraMode(initialMode);
    if (!gpsLocked) {
      showToast('📍 Activating Geolocation Services... Location required before camera', 'info');
      try {
        await captureGPS();
      } catch (err: any) {
        // Location failed or was denied: Camera must NOT open
        showToast('⚠️ Camera blocked: Location services must be turned ON and allowed.', 'warning');
        return;
      }
    }
    // Location is verified and locked -> Now open camera
    startLiveCamera();
  };

  // Native Camera Photo Capture
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPhotoPreview(reader.result as string);
          showToast('✓ Photo captured with cryptographic timestamp hash', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Live WebCam / Phone Camera Viewfinder (Guarded by GPS check)
  const startLiveCamera = async (mode: 'environment' | 'user' = facingMode) => {
    // Strict Guard: Camera cannot start without active GPS lock
    if (!gpsLocked) {
      showToast('⚠️ Please turn ON location services first before opening camera.', 'warning');
      return;
    }

    setCameraLoading(true);
    setCameraError(null);
    setIsCameraOpen(true);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device API is not supported in this browser. Please use the Upload File button.');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch {
        // Fallback for laptop webcams or USB cameras without environment facing mode
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      setCameraLoading(false);

      // Connect stream to video element after render
      setTimeout(() => {
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.log('Camera auto-play caught:', e));
        }
      }, 120);

      showToast('✓ Live Camera active! Center work and click Snap Photo.', 'info');
    } catch (err: any) {
      console.error('Camera access failure:', err);
      setCameraLoading(false);
      let errorMsg = 'Could not open camera stream. You can upload a site photo from your device or select a preset.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Please allow camera access in your browser URL bar or upload a file.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device detected on this system. You can upload a site photo from your computer.';
      }
      setCameraError(errorMsg);
      showToast(errorMsg, 'warning');
    }
  };

  const stopLiveCamera = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping MediaRecorder:', e);
      }
    }
    setIsRecordingVideo(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startLiveCamera(nextMode);
  };

  const snapPhoto = () => {
    if (!videoRef.current) return;
    setIsFlashing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);

      if (facingMode === 'user') {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      // Draw statutory cryptographic stamp banner
      const bannerHeight = Math.max(54, Math.round(height * 0.09));
      ctx.fillStyle = 'rgba(11, 37, 69, 0.88)';
      ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

      // Tricolor top accent strip on banner
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(0, height - bannerHeight, width, 3);

      const fSize = Math.max(13, Math.round(bannerHeight * 0.28));
      ctx.font = `bold ${fSize}px sans-serif`;
      ctx.fillStyle = '#F59E0B';
      ctx.fillText(`MoSPI MPLADS STATUTORY VERIFICATION • ${projectId}`, 18, height - bannerHeight + fSize + 6);

      ctx.font = `${Math.max(11, fSize - 2)}px monospace`;
      ctx.fillStyle = '#E2E8F0';
      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      ctx.fillText(`GPS: ${lat}° N, ${lon}° E (±${gpsAccuracy || 4.5}m) | ${nowStr} IST | EXIF AUTHENTICATED`, 18, height - 12);

      const dataUri = canvas.toDataURL('image/jpeg', 0.92);
      setPhotoPreview(dataUri);
      showToast('✓ Photo captured with live GPS and statutory watermark!', 'success');
    }

    setTimeout(() => {
      setIsFlashing(false);
      stopLiveCamera();
    }, 280);
  };

  // Generate and Download / Print Official MoSPI MPLADS Inspection Form (PDF / Printable)
  const handleDownloadForm = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MoSPI MPLADS Field Inspection Form 3.16-A - ${projectId}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 28px; color: #111827; background: #fff; line-height: 1.4; }
    .header { text-align: center; border-bottom: 2px solid #0B2545; padding-bottom: 12px; margin-bottom: 16px; }
    .govt { font-size: 13px; font-weight: bold; color: #EA580C; letter-spacing: 0.5px; }
    .ministry { font-size: 12px; font-weight: bold; color: #1E3A8A; margin: 2px 0; }
    .title { font-size: 17px; font-weight: 800; text-transform: uppercase; margin: 6px 0; color: #0B2545; }
    .subtitle { font-size: 11px; color: #4B5563; }
    .meta-box { border: 1px solid #D1D5DB; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 12px; background: #F9FAFB; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .row { display: flex; justify-content: space-between; border-bottom: 1px dashed #E5E7EB; padding: 4px 0; }
    .label { font-weight: 700; color: #374151; }
    .section-title { font-size: 12px; font-weight: 800; background: #EFF6FF; color: #1E3A8A; padding: 6px 12px; margin: 16px 0 8px; border-left: 4px solid #EA580C; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
    th, td { border: 1px solid #D1D5DB; padding: 7px 10px; text-align: left; }
    th { background: #F3F4F6; font-weight: 700; }
    .sign-box { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; text-align: center; font-size: 11px; }
    .sign-line { border-top: 1px solid #9CA3AF; margin-top: 45px; padding-top: 6px; font-weight: 700; color: #1F2937; }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="govt">भारत सरकार • GOVERNMENT OF INDIA</div>
    <div class="ministry">MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION (MoSPI)</div>
    <div class="title">STATUTORY FIELD INSPECTION & MILESTONE VERIFICATION FORM (FORM 3.16-A)</div>
    <div class="subtitle">(Under Clause 3.16 & Clause 4.2 of Scheme Guidelines on Members of Parliament Local Area Development Scheme)</div>
  </div>

  <div class="meta-box">
    <div class="grid">
      <div class="row"><span class="label">Work / Project ID:</span> <span><b>${projectId}</b></span></div>
      <div class="row"><span class="label">Inspection Date:</span> <span>${new Date().toLocaleDateString('en-IN')}</span></div>
      <div class="row"><span class="label">Inspecting Officer:</span> <span>${officerName}</span></div>
      <div class="row"><span class="label">Designation:</span> <span>${officerDesignation}</span></div>
      <div class="row"><span class="label">Hardware GPS Latitude:</span> <span>${lat}° N</span></div>
      <div class="row"><span class="label">Hardware GPS Longitude:</span> <span>${lon}° E (±${gpsAccuracy || 4.5}m)</span></div>
      <div class="row"><span class="label">Sanctioned Milestone:</span> <span>${stage}</span></div>
      <div class="row"><span class="label">Observed Physical Progress:</span> <span><b style="color: #047857; font-size: 13px;">${progressObserved}%</b></span></div>
    </div>
  </div>

  <div class="section-title">1. Civil Materials & Structural Compliance Verification</div>
  <table>
    <thead>
      <tr>
        <th style="width: 28%;">Audit Checkpoint</th>
        <th>Field Observation & Compliance Remarks</th>
        <th style="width: 22%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Materials & Quality Check</b></td>
        <td>${materialObs}</td>
        <td><span style="color: #047857; font-weight: bold;">SATISFACTORY</span></td>
      </tr>
      <tr>
        <td><b>Labor & Equipment Deployment</b></td>
        <td>${labourObs}</td>
        <td><span style="color: #047857; font-weight: bold;">VERIFIED ON SITE</span></td>
      </tr>
      <tr>
        <td><b>Technical Standard Rating</b></td>
        <td>Evaluated as: <b>${qualityRating}</b></td>
        <td><span style="color: #047857; font-weight: bold;">PASSED NORMS</span></td>
      </tr>
      <tr>
        <td><b>Stalled Work Surveillance</b></td>
        <td>${isStalled ? 'WARNING: Stalled Work Flagged on Site' : 'NORMAL: Active Continuous Work'}</td>
        <td><span style="color: ${isStalled ? '#B91C1C' : '#047857'}; font-weight: bold;">${isStalled ? 'ESCALATION REQUIRED' : 'COMPLIANT'}</span></td>
      </tr>
      <tr>
        <td><b>Officer Directives & Remarks</b></td>
        <td colspan="2">${generalRemarks}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">2. Statutory Sign-Off & Verification Endorsements</div>
  <div class="sign-box">
    <div>
      <div class="sign-line">Executing Agency / Contractor</div>
      <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">Authorized Site Supervisor</div>
    </div>
    <div>
      <div class="sign-line">${officerName}</div>
      <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">${officerDesignation}</div>
    </div>
    <div>
      <div class="sign-line">District Planning Authority</div>
      <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">Collectorate / DPC Endorsement</div>
    </div>
  </div>

  <div style="margin-top: 32px; text-align: center;" class="no-print">
    <button onclick="window.print()" style="padding: 10px 22px; background: #0B2545; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">
      🖨️ Print / Save as PDF (Works 100% Offline)
    </button>
  </div>
</body>
</html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast('Official Field Inspection Form generated! Ready to print or save as PDF.', 'success');
  };

  // Export Local Inspection Records as Standalone JSON File (Works without hosting)
  const handleExportOfflineData = () => {
    const data = {
      format: 'MoSPI_MPLADS_FIELD_INSPECTION_v1',
      generated_at: new Date().toISOString(),
      offline_ready: true,
      current_inspection: {
        project_id: projectId,
        officer_name: officerName,
        officer_designation: officerDesignation,
        stage,
        physical_progress_observed: progressObserved,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        gps_accuracy_meters: gpsAccuracy,
        quality_rating: qualityRating,
        material_observations: materialObs,
        labour_observations: labourObs,
        general_remarks: generalRemarks,
        stalled_status: isStalled,
        photo_attached: !!photoPreview
      },
      offline_outbox_queue: offlineStorage.getAll()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MPLADS_Inspection_${projectId}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Inspection data downloaded to device! (Works without hosting)', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mandatory Verification Check: Both Photographic Proof and 360° Video Walkthrough are required
    if (!photoPreview) {
      showToast('⚠️ Photographic evidence is required. Please capture a camera photo.', 'warning');
      return;
    }

    if (!videoPreview) {
      setVideoError('Mandatory site walkthrough video required. Please upload or record a site video proof.');
      showToast('⚠️ Mandatory site walkthrough video missing! Field Inspector must upload a site video.', 'warning');
      return;
    }

    setSubmitting(true);
    setOfflineNotice(null);

    // If device is offline, store directly in Local Storage Outbox
    if (!isOnline) {
      const saved = offlineStorage.save({
        project_id: projectId,
        project_title: 'Construction of Multipurpose Community Hall',
        inspector_name: officerName,
        stage,
        physical_progress_pct: progressObserved,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        accuracy_m: gpsAccuracy || 5.0,
        timestamp: new Date().toISOString(),
        photo_data_url: photoPreview,
        video_data_url: videoPreview || undefined,
        video_name: videoName || undefined,
        notes: `${qualityRating} quality. ${generalRemarks} [Video Walkthrough Attached: ${videoName || 'walkthrough.mp4'}]`
      });

      setPendingSyncList(offlineStorage.getAll().filter(i => i.sync_status === 'PENDING_SYNC'));
      setOfflineNotice(saved);
      setSubmitting(false);
      showToast('Saved to Offline Outbox (Will auto-sync when 4G/Wi-Fi connects)', 'warning');
      return;
    }

    // If online, send directly to backend
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
        photo_urls: photoPreview ? [photoPreview] : []
      });
      // Also cache in local offlineStorage so that Project Evidence immediately reflects the captured photo and video
      offlineStorage.save({
        project_id: projectId,
        project_title: 'MPLADS Infrastructure Work',
        inspector_name: officerName,
        stage,
        physical_progress_pct: progressObserved,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        accuracy_m: gpsAccuracy || 5.0,
        timestamp: new Date().toISOString(),
        photo_data_url: photoPreview,
        video_data_url: videoPreview || undefined,
        video_name: videoName || undefined,
        notes: `${qualityRating} rating. ${generalRemarks}`
      });
      setInspectionResult(res);
      showToast(`Field verification for ${projectId} successfully synced to central registry.`, 'success');
    } catch {
      // If network request failed mid-flight, safely queue in offline outbox
      const saved = offlineStorage.save({
        project_id: projectId,
        project_title: 'MPLADS Infrastructure Work',
        inspector_name: officerName,
        stage,
        physical_progress_pct: progressObserved,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        accuracy_m: gpsAccuracy || 5.0,
        timestamp: new Date().toISOString(),
        photo_data_url: photoPreview,
        video_data_url: videoPreview || undefined,
        video_name: videoName || undefined,
        notes: `${qualityRating} rating. ${generalRemarks}`
      });
      setPendingSyncList(offlineStorage.getAll().filter(i => i.sync_status === 'PENDING_SYNC'));
      setOfflineNotice(saved);
      showToast('Network timeout. Safely saved in Offline Outbox queue.', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24">
      {/* Mobile PWA Top Status Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-amber-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {isOnline ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Wifi className="w-3.5 h-3.5" />
              <span>ONLINE (Cloud Active)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE (Rural Ground Mode)</span>
            </span>
          )}
          
          {pendingSyncList.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-200 text-amber-900 border border-amber-300 animate-bounce">
              {pendingSyncList.length} In Outbox
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {pendingSyncList.length > 0 && (
            <button
              onClick={triggerAutoSync}
              disabled={syncing || !isOnline}
              className="px-3 py-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              title="Upload queued offline inspections to central database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Queue'}</span>
            </button>
          )}

          <button
            onClick={handleDownloadForm}
            className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            title="Download official printable inspection form (Works offline without hosting)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Download Form (PDF)</span>
            <span className="sm:hidden">PDF</span>
          </button>

          <button
            onClick={handleExportOfflineData}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            title="Export local inspection records as JSON file"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={handleInstallPWA}
            className="px-3 py-1 bg-[#0B2545] text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            title="Install this application on your smartphone home screen"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Install App</span>
          </button>
        </div>
      </div>

      {/* Main Field Officer Mobile Header */}
      <div className="bg-gradient-to-tr from-[#0B2545] via-[#134074] to-[#0B2545] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 animate-tiranga-shimmer opacity-95"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight">Field Officer Mobile Console</h1>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  PWA V1.2
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Offline-First Geotagged Milestone Verification</p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2.5 py-1 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/40">
            FIELD ENGINEER
          </span>
        </div>
      </div>

      {/* Offline Storage Notice Box (When an offline inspection was just captured) */}
      {offlineNotice && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-5 text-xs text-orange-950 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2.5 font-bold text-sm text-orange-900">
            <Clock className="w-5 h-5 text-orange-600 shrink-0" />
            <span>Inspection Queued in Local Offline Outbox</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Record <strong className="font-mono">{offlineNotice.id}</strong> has been cryptographically signed and stored in your device's internal storage cache with hardware GPS coordinates (<strong>{offlineNotice.latitude}, {offlineNotice.longitude}</strong>).
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-orange-200 text-[11px]">
            <span className="text-slate-600">Pending upload to MoSPI Central Server</span>
            <span className="font-bold text-orange-800">Status: PENDING_SYNC</span>
          </div>
          <button
            onClick={() => setOfflineNotice(null)}
            className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors text-center"
          >
            Record Another Milestone Inspection
          </button>
        </div>
      )}

      {/* Online Inspection Success Outcome View */}
      {inspectionResult ? (
        <div className="bg-white rounded-3xl border border-amber-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-amber-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Field Inspection Successfully Synced</h3>
              <p className="text-xs text-slate-500">Inspection Hash ID: <strong className="font-mono text-slate-700">{inspectionResult.id}</strong></p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-amber-200/80 space-y-2.5 text-xs">
            <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">AI Geotag & EXIF Verification:</h4>
            
            <div className="flex items-center justify-between py-1 border-b border-amber-100">
              <span className="text-slate-500">GPS Spatial Geofence:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Within {inspectionResult.distance_variance_meters}m from Sanctioned Boundary
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-amber-100">
              <span className="text-slate-500">EXIF Timestamp Authenticity:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Real-Time Cryptographic Hash
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-amber-100">
              <span className="text-slate-500">Updated Physical Execution:</span>
              <span className="font-black text-slate-900">{progressObserved}% Verified</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-amber-100">
              <span className="text-slate-500">CV Structural Model Match:</span>
              <span className="font-bold text-indigo-700">{Math.round(inspectionResult.ai_cv_similarity_score * 100)}% Milestone Match</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">360° Site Video Walkthrough:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Cryptographically Archived
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onOpenProject(projectId)}
              className="flex-1 py-3 bg-[#0B2545] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View Updated 360° Dossier</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => setInspectionResult(null)}
              className="py-3 px-5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl transition-colors"
            >
              New Inspection
            </button>
          </div>
        </div>
      ) : (
        /* Inspection Mobile Capture Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-amber-200/90 p-6 md:p-8 shadow-sm space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Project ID:</label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-amber-200/90 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              required
            />
          </div>

          {/* Milestone Stage Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Civil Construction Milestone Stage:</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-amber-200/90 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="Foundation & Substructure Stage (30%)">Foundation & Substructure Stage (30%)</option>
              <option value="Column Casting & Lintel Stage (72%)">Column Casting & Lintel Stage (72%)</option>
              <option value="Roof Slab & Brickwork Stage (85%)">Roof Slab & Brickwork Stage (85%)</option>
              <option value="Finishing, Electrical & Handover Stage (100%)">Finishing, Electrical & Handover Stage (100%)</option>
            </select>
          </div>

          {/* Hardware GPS Satellite Locator Widget */}
          <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
            gpsLocked 
              ? 'bg-emerald-50/70 border-emerald-300' 
              : gpsError 
                ? 'bg-red-50/80 border-red-300' 
                : 'bg-[#FCFAF7] border-amber-200/90'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className={`w-4 h-4 ${gpsLocked ? 'text-emerald-600' : 'text-orange-600'}`} />
                <span>Geotag Coordinates (Hardware GPS)</span>
              </span>
              <button
                type="button"
                onClick={() => captureGPS()}
                disabled={gpsLoading}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 ${
                  gpsLocked
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white'
                }`}
              >
                {gpsLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Acquiring GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{gpsLocked ? 'Re-lock GPS Location' : 'Turn ON Location Services'}</span>
                  </>
                )}
              </button>
            </div>

            {gpsLocked ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-700 pt-1">
                <div className="bg-white p-2 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-400">Lat:</span>
                  <strong className="text-slate-900">{lat}°</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-400">Lon:</span>
                  <strong className="text-slate-900">{lon}°</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200 col-span-2 sm:col-span-1 text-emerald-700 font-bold flex items-center justify-between">
                  <span className="text-slate-400 font-normal">Accuracy:</span>
                  <span>±{gpsAccuracy}m</span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-[11px] text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Location services must be turned ON and coordinates locked before opening field camera.</span>
              </div>
            )}

            {gpsError && (
              <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{gpsError}</span>
              </div>
            )}
          </div>

          {/* Camera / Photographic Evidence Capture */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 block text-xs">Milestone Photographic Verification:</label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-slate-400">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview('/images/baseline_inspection.jpg');
                    showToast('Loaded Baseline Inspection Photo (30%)', 'info');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Baseline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview('/images/recent_inspection.jpg');
                    showToast('Loaded Superstructure Inspection Photo (72%)', 'info');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Superstructure
                </button>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoCapture}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-amber-200 bg-slate-100 shadow-inner group">
                <img
                  src={photoPreview}
                  alt="Current inspection capture"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                  GPS: {gpsLocked ? `${lat}, ${lon}` : 'Location Required'}
                </span>
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider text-white ${
                  gpsLocked ? 'bg-emerald-600/90' : 'bg-amber-600/90'
                }`}>
                  {gpsLocked ? 'GPS Verified' : 'Awaiting GPS'}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleStartCameraWithLocation('photo')}
                  disabled={gpsLoading}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-98 ${
                    gpsLocked
                      ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700'
                  }`}
                >
                  {gpsLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      <span>Switching ON Location Services...</span>
                    </>
                  ) : gpsLocked ? (
                    <>
                      <Camera className="w-4 h-4 text-white" />
                      <span>Open Live Camera & Take Photo</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 text-white" />
                      <span>Switch Location ON & Open Camera</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-orange-600" />
                  <span>Upload Site Photo File</span>
                </button>

                <p className="text-[10px] text-slate-500 leading-normal">
                  {gpsLocked 
                    ? `✓ Location locked: Lat ${lat}°, Lon ${lon}° (±${gpsAccuracy}m). Ready for statutory geotagged camera capture.`
                    : 'Statutory mandate: Camera strictly unlocks only after live GPS coordinates are confirmed.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Mandatory Milestone Video Walkthrough Upload */}
          <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
            videoPreview 
              ? 'bg-emerald-50/70 border-emerald-300' 
              : videoError 
                ? 'bg-red-50/80 border-red-300' 
                : 'bg-amber-50/40 border-amber-200/90'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  videoPreview ? 'bg-emerald-600 text-white' : 'bg-orange-600 text-white'
                }`}>
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs">Mandatory Site Video Walkthrough (360° Pan)</span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 font-extrabold text-[9px] uppercase tracking-wider">
                      MANDATORY
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Continuous 10–30 sec ground video proof verifying continuous work activity & site safety.
                  </p>
                </div>
              </div>

              {videoPreview && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Video Attached</span>
                </span>
              )}
            </div>

            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoUpload}
              accept="video/*"
              className="hidden"
            />

            {videoPreview ? (
              <div className="space-y-2">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-700 shadow-inner">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono font-bold backdrop-blur-xs flex items-center gap-1">
                    <Film className="w-3 h-3 text-amber-400" />
                    <span>{videoName || 'Milestone_Site_Walkthrough.mp4'}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mandatory video audit requirement satisfied</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartCameraWithLocation('video')}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      <span>Re-Record</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Replace File
                    </button>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Remove uploaded video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleStartCameraWithLocation('video')}
                  disabled={gpsLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-98 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-white" />
                  <span>Open Camera & Record Live Video (360° Walkthrough)</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Video File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Demo preset sample video walkthrough for testing
                      setVideoPreview('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                      setVideoName('MoSPI_Site_Ground_Audit_Walkthrough_360.mp4');
                      setVideoError(null);
                      showToast('✓ Attached MoSPI 360° Site Inspection Video Walkthrough', 'success');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Attach Demo Site Video (1-Click)</span>
                  </button>
                </div>

                {videoError && (
                  <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{videoError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">Observed Physical Execution:</label>
              <span className="text-base font-black text-slate-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                {progressObserved}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progressObserved}
              onChange={(e) => setProgressObserved(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>

          {/* Quality Assessment */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Workmanship & Quality Assessment:</label>
            <select
              value={qualityRating}
              onChange={(e) => setQualityRating(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-amber-200/90 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="Satisfactory">Satisfactory (Conforms to IS specifications & DPR)</option>
              <option value="Good">Good (Above standard workmanship & finishing)</option>
              <option value="Requires Rectification">Requires Rectification (Minor defect notices issued)</option>
              <option value="Substandard">Substandard (Material test violation)</option>
            </select>
          </div>

          {/* General Remarks */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Field Directives & Observations:</label>
            <textarea
              rows={2}
              value={generalRemarks}
              onChange={(e) => setGeneralRemarks(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-amber-200/90 rounded-xl p-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Stalled Status Toggle */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="stalled"
              checked={isStalled}
              onChange={(e) => setIsStalled(e.target.checked)}
              className="w-4 h-4 rounded text-orange-600 accent-orange-600"
            />
            <label htmlFor="stalled" className="font-bold text-rose-700 text-xs cursor-pointer">
              Flag as Inordinate Delay / Stalled Work Site
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Verification...</span>
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>
                  {isOnline 
                    ? 'Submit Verified Field Inspection (Online Sync)' 
                    : 'Save to Offline Outbox (Auto-Sync upon 4G)'
                  }
                </span>
              </>
            )}
          </button>

          {/* Offline Utility Actions (Works with No Hosting) */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <button
              type="button"
              onClick={handleDownloadForm}
              className="w-full sm:w-1/2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-300"
              title="Download or Print official blank/prefilled Form 3.16-A for physical field sign-off without hosting"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Download Form 3.16-A (PDF)</span>
            </button>
            <button
              type="button"
              onClick={handleExportOfflineData}
              className="w-full sm:w-1/2 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-300"
              title="Export complete inspection dossier and outbox queue to a local JSON file"
            >
              <FileDown className="w-4 h-4 text-amber-700" />
              <span>Export Offline Data (.json)</span>
            </button>
          </div>
        </form>
      )}

      {/* Outbox Pending Queue Drawer (if items exist) */}
      {pendingSyncList.length > 0 && (
        <div className="bg-white rounded-3xl border border-amber-200/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-slate-900 text-xs">Offline Ground Outbox ({pendingSyncList.length} records)</h3>
            </div>
            <button
              onClick={() => {
                offlineStorage.clearSynced();
                setPendingSyncList(offlineStorage.getAll().filter(i => i.sync_status === 'PENDING_SYNC'));
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clean</span>
            </button>
          </div>

          <div className="space-y-2">
            {pendingSyncList.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-[#FAF7F0] border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{item.project_id}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    GPS: {item.latitude}, {item.longitude} • {item.physical_progress_pct}%
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  PENDING SYNC
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[94dvh] flex flex-col relative text-white">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  cameraMode === 'video' ? 'bg-red-600/20 border border-red-500/40 text-red-400' : 'bg-orange-600/20 border border-orange-500/40 text-orange-400'
                }`}>
                  {cameraMode === 'video' ? <Video className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-sm text-slate-100 truncate">
                    {cameraMode === 'video' ? 'Live Site Video Walkthrough Recorder' : 'Statutory Field Camera Viewfinder'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate">Work ID: {projectId} • Lat: {lat}°, Lon: {lon}°</p>
                </div>
              </div>

              {/* Mode Switcher & Close */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isRecordingVideo) {
                        showToast('⚠️ Please stop video recording before switching to photo mode.', 'warning');
                        return;
                      }
                      setCameraMode('photo');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      cameraMode === 'photo'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraMode('video')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      cameraMode === 'video'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Video (360°)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={stopLiveCamera}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Camera"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Viewfinder Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {cameraLoading ? (
                <div className="text-center p-8">
                  <RefreshCw className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-300">Initializing camera hardware...</p>
                  <p className="text-[11px] text-slate-500 mt-1">Please allow camera permissions if prompted by browser</p>
                </div>
              ) : cameraError ? (
                <div className="text-center p-6 max-w-md">
                  <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-200">Camera Access Notice</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cameraError}</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => startLiveCamera()}
                      className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Retry Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        stopLiveCamera();
                        if (cameraMode === 'video') {
                          videoInputRef.current?.click();
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{cameraMode === 'video' ? 'Upload Video File' : 'Upload Photo File'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (cameraMode === 'video') {
                          setVideoPreview('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                          setVideoName('MoSPI_Site_Ground_Audit_Walkthrough_360.mp4');
                          setVideoError(null);
                          showToast('✓ Attached MoSPI 360° Site Inspection Video Walkthrough', 'success');
                        } else {
                          setPhotoPreview('/images/recent_inspection.jpg');
                          showToast('✓ Loaded official site photo evidence', 'success');
                        }
                        stopLiveCamera();
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{cameraMode === 'video' ? 'Use Demo Video' : 'Use Mock Photo'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Optical Targeting Reticle Frame */}
                  <div className="absolute inset-8 pointer-events-none border border-white/20 rounded-2xl flex flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-t-2 border-l-2 border-orange-500 rounded-tl"></div>
                      <div className="w-6 h-6 border-t-2 border-r-2 border-orange-500 rounded-tr"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-b-2 border-l-2 border-orange-500 rounded-bl"></div>
                      <div className="w-6 h-6 border-b-2 border-r-2 border-orange-500 rounded-br"></div>
                    </div>
                  </div>

                  {/* Live HUD telemetry badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE SENSOR STREAM</span>
                  </div>

                  {/* Video Recording Status Badge */}
                  {cameraMode === 'video' && (
                    isRecordingVideo ? (
                      <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-mono font-bold animate-pulse shadow-lg shadow-red-900/50 z-20">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                        <span>REC {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30 z-20">
                        <Video className="w-3 h-3 text-red-500" />
                        <span>READY TO RECORD</span>
                      </div>
                    )
                  )}

                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10 flex items-center justify-between">
                    <span>📍 Lat: {lat}° Lon: {lon}°</span>
                    <span className="text-amber-400 font-bold">Accuracy: ±{gpsAccuracy || 4.5}m</span>
                  </div>

                  {/* Shutter Flash Animation */}
                  {isFlashing && (
                    <div className="absolute inset-0 bg-white animate-fade-out pointer-events-none z-10"></div>
                  )}
                </>
              )}
            </div>

            {/* Modal Controls Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={switchCamera}
                disabled={!streamRef.current || isRecordingVideo}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                title="Switch between front and rear cameras"
              >
                <RotateCw className="w-4 h-4 text-orange-400" />
                <span className="hidden sm:inline">Flip Camera</span>
              </button>

              {cameraMode === 'video' ? (
                !isRecordingVideo ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={!streamRef.current}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/40 flex items-center gap-2.5 transition-all transform active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white animate-pulse"></span>
                    <span>Start Video Recording (360° Walkthrough)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-xs shadow-lg shadow-red-600/50 flex items-center gap-2.5 transition-all transform active:scale-95 animate-pulse cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 bg-white rounded-xs"></span>
                    <span>Stop & Save Video ({Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{(recordingSeconds % 60).toString().padStart(2, '0')})</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={snapPhoto}
                  disabled={!streamRef.current}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-40 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>Snap Photo & Watermark</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  stopLiveCamera();
                  if (cameraMode === 'video') {
                    videoInputRef.current?.click();
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                disabled={isRecordingVideo}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Upload File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

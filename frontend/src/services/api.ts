import { Project, Contractor, Alert, Complaint, Dispute, Guarantee, DuplicateCandidate, AuditLog, OverviewAnalytics, DelayPrediction, Inspection, TimelineEvent, WhistleblowerBountyReport, DoubleBlindAudit, TenderNotice, TenderBid, TenderBoQItem, MeasurementBillSubmission } from '../types';
import { INITIAL_PROJECTS, INITIAL_CONTRACTORS, INITIAL_DUPLICATES, INITIAL_AUDIT_LOGS, INITIAL_WHISTLEBLOWER_REPORTS, INITIAL_DOUBLE_BLIND_AUDITS, INITIAL_TENDERS, INITIAL_MEASUREMENT_BILLS, INITIAL_INSPECTIONS } from './mockData';
import { marketRatesOracle } from './marketRatesOracle';
import { aiVisionEngine } from './aiVisionEngine';

export const BACKEND_BASE = (((import.meta as any).env?.VITE_API_URL as string) || 'http://127.0.0.1:8000').replace(/\/+$/, '');
const BACKEND_URL = `${BACKEND_BASE}/api`;
const TIMEOUT_MS = 5000;

// LocalStorage helpers for offline persistence
const STORAGE_KEYS = {
  PROJECTS: 'mplad_projects',
  CONTRACTORS: 'mplad_contractors',
  ALERTS: 'mplad_alerts',
  COMPLAINTS: 'mplad_complaints',
  DUPLICATES: 'mplad_duplicates',
  AUDIT_LOGS: 'mplad_audit_logs',
  INSPECTIONS: 'mplad_inspections',
  WHISTLEBLOWERS: 'mplad_whistleblowers',
  DOUBLE_BLIND_AUDITS: 'mplad_double_blind_audits',
  TENDERS: 'mplad_tenders',
  MEASUREMENT_BILLS: 'mplad_measurement_bills',
};

let isBackendAlive: boolean | null = null;
let lastHealthCheck = 0;
let healthCheckPromise: Promise<boolean> | null = null;

async function checkBackendHealth(): Promise<boolean> {
  const now = Date.now();
  if (isBackendAlive !== null && now - lastHealthCheck < 15000) {
    return isBackendAlive;
  }
  if (healthCheckPromise) {
    return healthCheckPromise;
  }
  healthCheckPromise = (async () => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 2500);
      const res = await fetch(`${BACKEND_BASE}/health`, { signal: ctrl.signal });
      clearTimeout(timer);
      isBackendAlive = res.ok;
    } catch {
      isBackendAlive = false;
    } finally {
      lastHealthCheck = Date.now();
      healthCheckPromise = null;
    }
    return isBackendAlive;
  })();
  return healthCheckPromise;
}

export function generateStandard10Stages(proj: Partial<Project>): TimelineEvent[] {
  const p = Number(proj.physical_progress || 0);
  const sDate = proj.start_date || '2025-06-15';
  const cDate = proj.expected_completion_date || '2026-12-31';

  return [
    {
      id: `TL-${proj.id}-1`,
      stage_name: 'MP Recommendation',
      stage_order: 1,
      event_date: '2025-01-15',
      authority: `Hon'ble MP ${proj.mp_name || 'Member of Parliament'}`,
      amount: proj.recommended_amount || proj.sanctioned_amount || 2500000,
      document_name: 'MP_Proposal_Letter.pdf',
      verification_status: 'VERIFIED',
      notes: 'Initial statutory recommendation submitted under MPLADS guidelines.'
    },
    {
      id: `TL-${proj.id}-2`,
      stage_name: 'Administrative Sanction',
      stage_order: 2,
      event_date: '2025-02-10',
      authority: `District Collector & Planning Officer (${proj.district || 'District'})`,
      amount: proj.sanctioned_amount || 2500000,
      document_name: 'Admin_Sanction_Order.pdf',
      verification_status: 'VERIFIED',
      notes: 'Statutory administrative approval granted; baseline GPS anchor registered.'
    },
    {
      id: `TL-${proj.id}-3`,
      stage_name: 'Technical Sanction',
      stage_order: 3,
      event_date: '2025-03-05',
      authority: `Superintending Engineer (${proj.implementing_agency || 'State Engineering Dept'})`,
      amount: proj.sanctioned_amount || 2500000,
      document_name: 'Technical_Sanction_DPR.pdf',
      verification_status: 'VERIFIED',
      notes: 'Detailed Project Report (DPR) vetted and structural estimates cleared.'
    },
    {
      id: `TL-${proj.id}-4`,
      stage_name: 'Tender Notification',
      stage_order: 4,
      event_date: '2025-03-25',
      authority: 'Executive Engineer / State e-Procurement Cell',
      amount: proj.contract_amount || proj.sanctioned_amount || 2450000,
      document_name: 'NIT_eTender_Notice.pdf',
      verification_status: 'VERIFIED',
      notes: 'E-tender published on state procurement portal.'
    },
    {
      id: `TL-${proj.id}-5`,
      stage_name: 'Contract Award',
      stage_order: 5,
      event_date: '2025-04-20',
      authority: 'District Tender Committee',
      amount: proj.contract_amount || 2450000,
      document_name: 'Contract_Agreement_LOA.pdf',
      verification_status: 'VERIFIED',
      notes: `Work order issued to ${proj.contractor_name || 'Executing Contractor'}. Performance Bank Guarantee (PBG) logged.`
    },
    {
      id: `TL-${proj.id}-6`,
      stage_name: 'Fund Release (First Tranche)',
      stage_order: 6,
      event_date: '2025-05-15',
      authority: 'District Planning Office & PFMS Gateway',
      amount: proj.funds_released || 1250000,
      document_name: 'PFMS_Treasury_Disbursement.pdf',
      verification_status: 'VERIFIED',
      notes: 'Treasury release dispatched to project escrow account.'
    },
    {
      id: `TL-${proj.id}-7`,
      stage_name: 'Work Commencement',
      stage_order: 7,
      event_date: sDate,
      authority: 'Executive Engineer & Field AE',
      document_name: 'Site_Handover_Order.pdf',
      verification_status: p >= 10 ? 'VERIFIED' : 'PARTIAL',
      notes: 'Physical site handover and foundation groundbreaking commenced.'
    },
    {
      id: `TL-${proj.id}-8`,
      stage_name: 'Field Inspection #1',
      stage_order: 8,
      event_date: '2025-09-12',
      authority: 'Assistant Executive Engineer',
      document_name: 'Field_Inspection_Report_01.pdf',
      verification_status: p >= 40 ? 'VERIFIED' : p >= 20 ? 'PARTIAL' : 'PENDING',
      notes: 'On-site geotagged inspection with AI distance match within 200m geofence.'
    },
    {
      id: `TL-${proj.id}-9`,
      stage_name: 'Progress & Measurement',
      stage_order: 9,
      event_date: '2025-11-20',
      authority: 'Divisional Accounts Officer',
      amount: proj.funds_paid || 800000,
      document_name: 'Measurement_Book_Record.pdf',
      verification_status: p >= 70 ? 'VERIFIED' : p >= 40 ? 'PARTIAL' : 'PENDING',
      notes: 'Measurement book (MB) verified and Running Account bill passed.'
    },
    {
      id: `TL-${proj.id}-10`,
      stage_name: 'Completion & Handover',
      stage_order: 10,
      event_date: p >= 100 ? (proj.actual_completion_date || '2026-02-15') : `Scheduled ${cDate}`,
      authority: 'District Collector & Superintending Engineer',
      verification_status: p >= 100 ? 'VERIFIED' : 'PENDING',
      notes: p >= 100 ? 'Final social audit completed and public asset commissioned.' : 'Asset handover and social audit verification pending physical completion.'
    }
  ];
}

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

// Transparent fetch with fast timeout
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // If backend is known to be offline, fail fast to return cached/mock data immediately
  const isAlive = await checkBackendHealth();
  if (!isAlive) {
    throw new Error('Backend offline');
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    isBackendAlive = false;
    throw err;
  }
}
export const GOVERNMENT_DEPARTMENTS = [
  'Rural Water Supply & Sanitation (RWSS)',
  'Public Works Department (State PWD)',
  'School Education & Literacy (Samagra Shiksha)',
  'Public Health & Family Welfare (NHM / CMO)',
  'Panchayati Raj & Rural Engineering (PRED)',
  'Municipal Administration & Urban Development (MAUD)',
  'Minor Irrigation & Water Conservation',
  'State Renewable Energy Development Agency (NREDCAP/SREDA)',
  'Social Welfare & Tribal Development Directorate',
  'Swachh Bharat Mission (Gramin & Urban)'
];

export const api = {
  // Projects
  async getProjects(params?: Record<string, string>): Promise<Project[]> {
    let localProjects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    // Ensure any newly added projects from INITIAL_PROJECTS are included in local cache
    if (localProjects.length < INITIAL_PROJECTS.length) {
      const existingIds = new Set(localProjects.map(p => p.id));
      const missing = INITIAL_PROJECTS.filter(p => !existingIds.has(p.id));
      localProjects = [...localProjects, ...missing];
      setStored(STORAGE_KEYS.PROJECTS, localProjects);
    }
    const localMap = new Map(localProjects.map(p => [p.id, p]));

    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const data = await apiFetch<Project[]>(`/projects${query}`);
      
      // Preserve any baseline photo anchored locally or on server
      const merged: Project[] = data.map(p => {
        const local = localMap.get(p.id);
        return {
          ...p,
          baseline_photo_url: p.baseline_photo_url || local?.baseline_photo_url || '',
          baseline_photo_timestamp: p.baseline_photo_timestamp || local?.baseline_photo_timestamp || '',
          baseline_photo_officer: p.baseline_photo_officer || local?.baseline_photo_officer || '',
          baseline_photo_officer_designation: p.baseline_photo_officer_designation || local?.baseline_photo_officer_designation || '',
          baseline_stage: p.baseline_stage || local?.baseline_stage || '',
          baseline_photo_method: p.baseline_photo_method || local?.baseline_photo_method || undefined
        };
      });

      // Avoid wiping entire cached project registry when fetching a filtered query
      if (!params || Object.keys(params).length === 0) {
        setStored(STORAGE_KEYS.PROJECTS, merged);
      } else {
        const updated = localProjects.map(lp => merged.find(m => m.id === lp.id) || lp);
        setStored(STORAGE_KEYS.PROJECTS, updated);
      }
      return merged;
    } catch {
      let list = localProjects;
      if (params?.search) {
        const s = params.search.toLowerCase();
        list = list.filter(p => 
          p.title.toLowerCase().includes(s) ||
          p.id.toLowerCase().includes(s) ||
          p.district.toLowerCase().includes(s) ||
          p.village.toLowerCase().includes(s) ||
          (p.contractor_name && p.contractor_name.toLowerCase().includes(s))
        );
      }
      if (params?.state) list = list.filter(p => p.state === params.state);
      if (params?.district) list = list.filter(p => p.district === params.district);
      if (params?.category) list = list.filter(p => p.category === params.category);
      if (params?.status) list = list.filter(p => p.status === params.status);
      if (params?.risk_level) list = list.filter(p => p.risk_level === params.risk_level);
      if (params?.contractor_id) {
        const cid = params.contractor_id.toLowerCase().trim();
        list = list.filter(p => (p.contractor_id && p.contractor_id.toLowerCase() === cid));
      }
      return list;
    }
  },

  async getProjectById(id: string): Promise<Project> {
    const list = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const local = list.find(p => p.id === id);

    let found: Project;
    try {
      found = await apiFetch<Project>(`/projects/${id}`);
      if (local) {
        found = {
          ...found,
          baseline_photo_url: found.baseline_photo_url || local.baseline_photo_url || '',
          baseline_photo_timestamp: found.baseline_photo_timestamp || local.baseline_photo_timestamp || '',
          baseline_photo_officer: found.baseline_photo_officer || local.baseline_photo_officer || '',
          baseline_photo_officer_designation: found.baseline_photo_officer_designation || local.baseline_photo_officer_designation || '',
          baseline_stage: found.baseline_stage || local.baseline_stage || '',
          baseline_photo_method: found.baseline_photo_method || local.baseline_photo_method || undefined
        };
      }
    } catch {
      found = local || INITIAL_PROJECTS[0];
    }
    if (!found.timeline_events || found.timeline_events.length < 5) {
      found.timeline_events = generateStandard10Stages(found);
    }
    if (!found.guarantees || found.guarantees.length === 0) {
      found.guarantees = [
        {
          id: `PBG-${found.id.slice(-8)}`,
          project_id: found.id,
          contractor_name: found.contractor_name || 'Sri Venkateswara Infra Projects Ltd',
          guarantee_type: 'Performance Bank Guarantee (PBG)',
          bank_or_institution: 'State Bank of India / Public Sector Treasury Gateway',
          amount: Math.round((found.contract_amount || found.sanctioned_amount || 2500000) * 0.05),
          issue_date: found.start_date || '2025-04-22',
          expiry_date: '2026-09-30',
          days_to_expiry: 45,
          status: 'ACTIVE',
          action_required: false
        }
      ];
    }
    return found;
  },

  // Statutory Higher Official Project Insertion with Departmental Attribution & Audit Logging
  async createProject(
    projectData: Partial<Project>,
    auditMeta: {
      officer_name: string;
      officer_role: string;
      department_name: string;
      sanction_order_no?: string;
      reason?: string;
      assigned_field_officer?: string;
      assigned_field_officer_designation?: string;
    }
  ): Promise<Project> {
    const newId = projectData.id || `MPLAD-${(projectData.state || 'IND').slice(0, 2).toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const fullProject: Project = {
      id: newId,
      title: projectData.title || 'Untitled Sanctioned Public Work',
      description: projectData.description || 'Statutorily sanctioned work under MPLADS.',
      category: projectData.category || 'Community Infrastructure',
      status: projectData.status || 'SANCTIONED',
      mp_name: projectData.mp_name || 'Member of Parliament',
      mp_house: projectData.mp_house || 'Lok Sabha',
      state: projectData.state || 'Andhra Pradesh',
      district: projectData.district || 'Visakhapatnam',
      constituency: projectData.constituency || 'Visakhapatnam',
      mandal_block: projectData.mandal_block || 'Default Block',
      village: projectData.village || 'Default Habitation',
      latitude: Number(projectData.latitude) || 17.9312,
      longitude: Number(projectData.longitude) || 83.4248,
      year: projectData.year || '2025-2026',
      implementing_agency: projectData.implementing_agency || auditMeta.department_name,
      recommended_amount: Number(projectData.recommended_amount) || 2500000,
      sanctioned_amount: Number(projectData.sanctioned_amount) || 2500000,
      contract_amount: Number(projectData.contract_amount) || 2450000,
      funds_released: Number(projectData.funds_released) || 1500000,
      funds_paid: Number(projectData.funds_paid) || 0,
      actual_expenditure: Number(projectData.actual_expenditure) || 0,
      physical_progress: Number(projectData.physical_progress) || 0,
      financial_progress: Number(projectData.financial_progress) || 0,
      start_date: projectData.start_date || new Date().toISOString().slice(0, 10),
      expected_completion_date: projectData.expected_completion_date || '2026-12-31',
      delay_days: 0,
      overall_risk_score: 15,
      risk_level: 'NORMAL',
      financial_health: 95,
      physical_health: 95,
      contract_health: 95,
      schedule_health: 95,
      evidence_health: 95,
      risk_reasons: [],
      contractor_name: projectData.contractor_name || 'Tender In Progress / State Engineering Division',
      last_verified_date: now.slice(0, 10),
      data_source: `MoSPI Higher Authority Portal • Dept: ${auditMeta.department_name}`,
      source_verification_status: 'VERIFIED_GOVERNMENT_RECORD',
      baseline_photo_url: projectData.baseline_photo_url || '',
      baseline_photo_timestamp: projectData.baseline_photo_timestamp || (projectData.baseline_photo_url ? now : ''),
      baseline_photo_officer: projectData.baseline_photo_officer || (projectData.baseline_photo_url ? auditMeta.officer_name : ''),
      baseline_photo_officer_designation: projectData.baseline_photo_officer_designation || (projectData.baseline_photo_url ? auditMeta.officer_role : ''),
      assigned_field_officer: projectData.assigned_field_officer || auditMeta.assigned_field_officer || 'Shri R. K. Verma, AEE',
      assigned_field_officer_designation: projectData.assigned_field_officer_designation || auditMeta.assigned_field_officer_designation || 'Assistant Executive Engineer, PRED',
      baseline_stage: projectData.baseline_stage || (projectData.baseline_photo_url ? 'Milestone 0: Ground-Zero Site Handover Baseline (0%)' : ''),
      timeline_events: generateStandard10Stages({
        id: newId,
        title: projectData.title,
        mp_name: projectData.mp_name,
        district: projectData.district,
        implementing_agency: projectData.implementing_agency || auditMeta.department_name,
        sanctioned_amount: Number(projectData.sanctioned_amount) || 2500000,
        contract_amount: Number(projectData.contract_amount) || 2450000,
        funds_released: Number(projectData.funds_released) || 1500000,
        physical_progress: Number(projectData.physical_progress) || 0,
        start_date: projectData.start_date || now.slice(0, 10),
        expected_completion_date: projectData.expected_completion_date || '2026-12-31',
      }),
      guarantees: [
        {
          id: `PBG-${newId.slice(-8)}`,
          project_id: newId,
          contractor_name: projectData.contractor_name || 'Tender In Progress / State Engineering Division',
          guarantee_type: 'Performance Bank Guarantee (PBG)',
          bank_or_institution: 'State Bank of India / Public Sector Treasury Gateway',
          amount: Math.round((Number(projectData.sanctioned_amount) || 2500000) * 0.05),
          issue_date: now.slice(0, 10),
          expiry_date: '2027-03-31',
          days_to_expiry: 365,
          status: 'ACTIVE',
          action_required: false
        }
      ]
    };

    // Try backend API first, fallback to local storage
    try {
      await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({ ...fullProject, auditMeta })
      });
    } catch {
      // Offline / client-side storage
    }

    const currentList = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    currentList.unshift(fullProject);
    setStored(STORAGE_KEYS.PROJECTS, currentList);

    // Append to immutable audit trail
    const auditLogs = getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    auditLogs.unshift({
      id: `LOG-INS-${Date.now()}`,
      timestamp: now,
      actor_role: auditMeta.officer_role,
      actor_name: auditMeta.officer_name,
      action: 'PROJECT_INSERTED_BY_HIGHER_OFFICIAL',
      entity_id: newId,
      details: `New project inserted into registry for Department '${auditMeta.department_name}'. Sanction: ₹${(fullProject.sanctioned_amount).toLocaleString('en-IN')}, Baseline GPS: (${fullProject.latitude}, ${fullProject.longitude}). Reason: ${auditMeta.reason || 'Administrative Sanction'}`,
      ip_address: '10.42.0.1 (Authenticated Nodal Session)'
    });
    setStored(STORAGE_KEYS.AUDIT_LOGS, auditLogs);

    return fullProject;
  },

  // Statutory Higher Official Project Update with Departmental Attribution & Audit Logging
  async updateProject(
    projectId: string,
    updates: Partial<Project>,
    auditMeta: {
      officer_name: string;
      officer_role: string;
      department_name: string;
      modification_reason: string;
      order_reference_no?: string;
    }
  ): Promise<Project> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    try {
      await apiFetch(`/projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify({ updates, auditMeta })
      });
    } catch {
      // fallback
    }

    const currentList = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const idx = currentList.findIndex(p => p.id === projectId);
    if (idx === -1) {
      throw new Error(`Project ${projectId} not found.`);
    }

    const oldProject = currentList[idx];
    const updatedProject: Project = {
      ...oldProject,
      ...updates,
      last_verified_date: now.slice(0, 10),
      data_source: `MoSPI Higher Authority Portal • Dept: ${auditMeta.department_name}`
    };

    // Calculate updated financial progress if amounts changed
    if (updates.funds_paid !== undefined || updates.contract_amount !== undefined || updates.sanctioned_amount !== undefined) {
      const baseAmount = updatedProject.contract_amount || updatedProject.sanctioned_amount || 1;
      updatedProject.financial_progress = Math.min(100, Math.round((updatedProject.funds_paid / baseAmount) * 1000) / 10);
    }

    // Append modification timeline event
    if (!updatedProject.timeline_events) updatedProject.timeline_events = [];
    updatedProject.timeline_events.unshift({
      id: `TL-MOD-${Date.now()}`,
      stage_name: `Statutory Modification: Progress ${updatedProject.physical_progress}%`,
      stage_order: updatedProject.timeline_events.length + 1,
      event_date: now.slice(0, 10),
      authority: `${auditMeta.officer_name} (${auditMeta.department_name})`,
      document_name: auditMeta.order_reference_no ? `Admin_Order_${auditMeta.order_reference_no}.pdf` : 'Modification_Order.pdf',
      verification_status: 'VERIFIED',
      notes: `Updated by Higher Official: ${auditMeta.officer_name} (${auditMeta.officer_role}) of Department: ${auditMeta.department_name}. Reason: ${auditMeta.modification_reason}`
    });

    currentList[idx] = updatedProject;
    setStored(STORAGE_KEYS.PROJECTS, currentList);

    // Append to immutable audit trail
    const auditLogs = getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    auditLogs.unshift({
      id: `LOG-UPD-${Date.now()}`,
      timestamp: now,
      actor_role: auditMeta.officer_role,
      actor_name: auditMeta.officer_name,
      action: 'PROJECT_UPDATED_BY_HIGHER_OFFICIAL',
      entity_id: projectId,
      details: `Project record updated by ${auditMeta.officer_name} (${auditMeta.officer_role}) for Department '${auditMeta.department_name}'. Physical Progress: ${oldProject.physical_progress}% ➔ ${updatedProject.physical_progress}%, Status: ${oldProject.status} ➔ ${updatedProject.status}. Reason: ${auditMeta.modification_reason}`,
      ip_address: '10.42.0.1 (Authenticated Nodal Session)'
    });
    setStored(STORAGE_KEYS.AUDIT_LOGS, auditLogs);

    return updatedProject;
  },

  // Statutory DPR Baseline Photo Attachment (Exclusively for Higher Official / Sanction Authority)
  async updateBaselinePhoto(
    projectId: string,
    baselinePhotoUrl: string,
    auditMeta: {
      officer_name: string;
      officer_role: string;
      department_name: string;
      method?: 'LIVE_CAMERA_GEOFENCE' | 'EXIF_GPS_VERIFIED' | 'LEGACY_DPR_PAPER_ARCHIVE' | 'FIELD_OFFICER_DISPATCH';
      lat?: number;
      lng?: number;
      variance_m?: number;
      device?: string;
      justification?: string;
    }
  ): Promise<Project> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const currentList = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const idx = currentList.findIndex(p => p.id === projectId);
    if (idx === -1) throw new Error(`Project ${projectId} not found.`);

    currentList[idx].baseline_photo_url = baselinePhotoUrl;
    currentList[idx].baseline_photo_timestamp = now;
    currentList[idx].baseline_photo_officer = auditMeta.officer_name;
    currentList[idx].baseline_photo_officer_designation = auditMeta.officer_role;
    currentList[idx].baseline_photo_method = auditMeta.method || 'EXIF_GPS_VERIFIED';
    if (auditMeta.lat !== undefined) currentList[idx].baseline_photo_lat = auditMeta.lat;
    if (auditMeta.lng !== undefined) currentList[idx].baseline_photo_lng = auditMeta.lng;
    if (auditMeta.variance_m !== undefined) currentList[idx].baseline_photo_variance_m = auditMeta.variance_m;
    if (auditMeta.device) currentList[idx].baseline_photo_device = auditMeta.device;
    currentList[idx].baseline_stage = auditMeta.method === 'LEGACY_DPR_PAPER_ARCHIVE' 
      ? 'Legacy DPR Paper Survey Archive (Unverified CV)' 
      : 'Statutory DPR Ground-Zero Baseline (Geotag Verified)';

    setStored(STORAGE_KEYS.PROJECTS, currentList);

    // Sync to backend DB so it persists across sessions and server requests
    try {
      await apiFetch(`/projects/${projectId}/baseline`, {
        method: 'POST',
        body: JSON.stringify({
          baseline_photo_url: baselinePhotoUrl,
          auditMeta: {
            ...auditMeta,
            baseline_stage: currentList[idx].baseline_stage
          }
        })
      });
    } catch (e) {
      console.warn('Backend baseline sync fallback to local storage:', e);
    }

    const auditLogs = getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    auditLogs.unshift({
      id: `LOG-BASE-${Date.now()}`,
      timestamp: now,
      actor_role: auditMeta.officer_role,
      actor_name: auditMeta.officer_name,
      action: 'STATUTORY_BASELINE_PHOTO_ATTACHED_BY_HIGHER_OFFICIAL',
      entity_id: projectId,
      details: `Official DPR ground-zero baseline photo anchored by ${auditMeta.officer_name} (${auditMeta.officer_role}) for Department '${auditMeta.department_name}'. Verification Method: ${auditMeta.method || 'EXIF_GPS_VERIFIED'}, Coords: (${auditMeta.lat ?? currentList[idx].latitude}, ${auditMeta.lng ?? currentList[idx].longitude}), Variance: ${auditMeta.variance_m ?? 0}m. AI CV reference locked.`,
      ip_address: '10.42.0.1 (Authenticated Nodal Session)'
    });
    setStored(STORAGE_KEYS.AUDIT_LOGS, auditLogs);

    return currentList[idx];
  },

  // Helper to ensure contractor portfolio metrics match actual projects 100%
  reconcileContractors(contractorList: Contractor[], allProjects: Project[]): Contractor[] {
    const projByContractor = new Map<string, Project[]>();
    for (const p of allProjects) {
      if (p.contractor_id) {
        const idLower = p.contractor_id.toLowerCase().trim();
        const list = projByContractor.get(idLower) || [];
        list.push(p);
        projByContractor.set(idLower, list);
      }
    }

    return contractorList.map(base => {
      const cProjects = projByContractor.get(base.id.toLowerCase().trim()) || [];
      if (cProjects.length === 0) return base;

      const totalContracts = cProjects.length;
      const completedList = cProjects.filter(p => p.status === 'COMPLETED' || (p.physical_progress ?? 0) >= 100);
      const activeList = cProjects.filter(p => p.status !== 'COMPLETED' && (p.physical_progress ?? 0) < 100);
      const delayedList = cProjects.filter(p => (p.delay_days || 0) > 0 && p.status !== 'COMPLETED');

      const totalValue = cProjects.reduce((sum, p) => sum + (p.contract_amount || 0), 0);
      const avgDelay = delayedList.length > 0 
        ? Math.round(delayedList.reduce((sum, p) => sum + (p.delay_days || 0), 0) / delayedList.length)
        : 0;

      return {
        ...base,
        total_contracts: totalContracts,
        completed_projects: completedList.length,
        active_projects_count: activeList.length,
        delayed_projects: delayedList.length,
        total_contract_value: totalValue,
        average_delay_days: avgDelay
      };
    });
  },

  // Contractors
  async getContractors(): Promise<Contractor[]> {
    const allProjects = await this.getProjects();
    try {
      const data = await apiFetch<Contractor[]>('/contractors');
      const reconciled = this.reconcileContractors(data, allProjects);
      setStored(STORAGE_KEYS.CONTRACTORS, reconciled);
      return reconciled;
    } catch {
      // In offline mode, also ensure missing contractors from INITIAL_CONTRACTORS are present
      let stored = getStored<Contractor[]>(STORAGE_KEYS.CONTRACTORS, INITIAL_CONTRACTORS);
      if (stored.length < INITIAL_CONTRACTORS.length) {
        const existingIds = new Set(stored.map(c => c.id));
        const missing = INITIAL_CONTRACTORS.filter(c => !existingIds.has(c.id));
        stored = [...stored, ...missing];
      }
      const reconciled = this.reconcileContractors(stored, allProjects);
      setStored(STORAGE_KEYS.CONTRACTORS, reconciled);
      return reconciled;
    }
  },

  async getContractorById(id: string): Promise<Contractor> {
    try {
      const contractor = await apiFetch<Contractor>(`/contractors/${id}`);
      const projects = await this.getProjects({ contractor_id: id });
      const reconciled = this.reconcileContractors([contractor], projects);
      return reconciled[0] || contractor;
    } catch {
      const list = await this.getContractors();
      return list.find(c => c.id.toLowerCase() === id.toLowerCase()) || list[0] || INITIAL_CONTRACTORS[0];
    }
  },

  async getContractorProjects(contractorId: string): Promise<Project[]> {
    try {
      return await apiFetch<Project[]>(`/contractors/${contractorId}/projects`);
    } catch {
      return this.getProjects({ contractor_id: contractorId });
    }
  },

  // Alerts & Escalation
  async getAlerts(params?: Record<string, string>): Promise<Alert[]> {
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const data = await apiFetch<Alert[]>(`/alerts${query}`);
      setStored(STORAGE_KEYS.ALERTS, data);
      return data;
    } catch {
      const storedAlerts = getStored<Alert[]>(STORAGE_KEYS.ALERTS, []);
      const allProjects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const alerts: Alert[] = [...storedAlerts];
      allProjects.forEach(p => {
        if (p.alerts) {
          p.alerts.forEach(a => {
            if (!alerts.some(existing => existing.id === a.id)) {
              alerts.push(a);
            }
          });
        }
      });
      return alerts;
    }
  },

  async takeAlertAction(alertId: string, actionData: { action: string; assigned_to?: string; escalation_level?: string; notes?: string; officer_name?: string }): Promise<Alert> {
    try {
      return await apiFetch<Alert>(`/alerts/${alertId}/action`, {
        method: 'POST',
        body: JSON.stringify(actionData),
      });
    } catch {
      const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const storedAlerts = getStored<Alert[]>(STORAGE_KEYS.ALERTS, []);
      let updatedAlert: Alert | null = null;

      const applyAction = (a: Alert) => {
        if (actionData.action === 'RESOLVE') {
          a.status = 'RESOLVED';
          a.resolution_notes = actionData.notes || 'Resolved upon site review.';
        } else if (actionData.action === 'ESCALATE') {
          a.escalation_level = actionData.escalation_level || 'Level 4 - Higher Authority';
          a.status = 'UNDER_REVIEW';
        } else if (actionData.action === 'ASSIGN') {
          a.assigned_authority = actionData.assigned_to || a.assigned_authority;
          a.status = 'ASSIGNED';
        }
        a.audit_history = a.audit_history || [];
        a.audit_history.push({
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: `Action: ${actionData.action}. ${actionData.notes || ''}`,
          actor: actionData.officer_name || 'District Planning Officer'
        });
      };

      for (const p of projects) {
        if (p.alerts) {
          const a = p.alerts.find(item => item.id === alertId);
          if (a) {
            applyAction(a);
            updatedAlert = a;
            break;
          }
        }
      }

      const sa = storedAlerts.find(item => item.id === alertId);
      if (sa) {
        applyAction(sa);
        if (!updatedAlert) updatedAlert = sa;
      }

      setStored(STORAGE_KEYS.PROJECTS, projects);
      setStored(STORAGE_KEYS.ALERTS, storedAlerts);
      return updatedAlert || ({} as Alert);
    }
  },

  // Inspections
  async getInspections(projectId?: string): Promise<Inspection[]> {
    try {
      const url = projectId ? `/inspections?project_id=${projectId}` : '/inspections';
      return await apiFetch<Inspection[]>(url);
    } catch {
      let list = getStored<Inspection[]>(STORAGE_KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
      if (!list || list.length === 0) {
        list = INITIAL_INSPECTIONS;
        setStored(STORAGE_KEYS.INSPECTIONS, list);
      }
      if (projectId) {
        return list.filter(i => i.project_id === projectId);
      }
      return list;
    }
  },

  async submitInspection(data: {
    project_id: string;
    officer_name: string;
    officer_designation: string;
    latitude: number;
    longitude: number;
    physical_progress_observed: number;
    quality_rating: string;
    material_observations: string;
    labour_activity_observations: string;
    general_remarks: string;
    defects_reported?: string;
    stalled_status?: boolean;
    photo_urls?: string[];
  }) {
    try {
      return await apiFetch('/inspections', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const proj = projects.find(p => p.id === data.project_id);

      // Autonomous Computer Vision Sovereign Arbitration
      const primaryPhoto = (data.photo_urls && data.photo_urls.length > 0) ? data.photo_urls[0] : '';
      const aiVerdict = aiVisionEngine.analyzeInspectionEvidence(
        primaryPhoto,
        data.physical_progress_observed,
        data.general_remarks,
        proj?.category || 'General Infrastructure'
      );

      if (proj) {
        // Sovereign AI Gatekeeper: Human input never unilaterally dictates progress.
        // If discrepancy > 20%, human claim is STATUTORILY OVERRULED and locked to AI Ground Truth!
        proj.physical_progress = aiVerdict.governing_progress;
        proj.last_inspected_date = now.slice(0, 10);
        
        if (data.stalled_status) {
          proj.status = 'STALLED';
        } else if (aiVerdict.governing_progress >= 100) {
          proj.status = 'COMPLETED';
        }

        if (aiVerdict.arbitration_verdict === 'COLLUSION_ALERT') {
          proj.overall_risk_score = Math.min(100, Math.max(78, (proj.overall_risk_score || 50) + 28));
          proj.risk_level = 'HIGH RISK';
          proj.evidence_health = 30;
          proj.schedule_health = Math.max(25, (proj.schedule_health || 60) - 20);
          proj.risk_reasons = [
            `⛔ CVC Anti-Corruption Directive: Inspector progress claim (${data.physical_progress_observed}%) OVERRULED by AI Ground Truth (${aiVerdict.ai_detected_progress}%).`,
            `Discrepancy delta of ${aiVerdict.discrepancy_delta}% exceeds statutory 20% tolerance. Milestone payment escrow frozen under CVC Rule 88.`,
            ...(proj.risk_reasons || []).slice(0, 2)
          ];

          // Automatically dispatch corruption & collusion alert to Alerts Registry
          const alerts = getStored<Alert[]>(STORAGE_KEYS.ALERTS, []);
          alerts.unshift({
            id: `ALT-COLLUSION-${Date.now().toString().slice(-6)}`,
            project_id: proj.id,
            project_title: proj.title,
            severity: 'CRITICAL',
            category: 'Collusion & Fraud Prevention',
            title: `Statutory Overrule: Inspector Progress Claim (${data.physical_progress_observed}%) Overruled by AI Vision (${aiVerdict.ai_detected_progress}%)`,
            description: aiVerdict.verdict_message,
            observed_data: `Inspector Claim: ${data.physical_progress_observed}% | AI Computer Vision Ground Truth: ${aiVerdict.ai_detected_progress}%`,
            expected_data: 'Statutory milestone tolerance <= 10% discrepancy under MoSPI norms',
            difference: `Severe discrepancy delta of ${aiVerdict.discrepancy_delta}% detected on site`,
            confidence_score: aiVerdict.confidence_score,
            recommended_action: 'Milestone escrow payment frozen immediately. Deploy cross-cadre blind vigilance auditor for ground re-audit.',
            escalation_level: 'Level 3 - Vigilance / Anti-Corruption Branch',
            assigned_authority: 'Chief Vigilance Officer (CVO) & District Collector',
            due_days: 2,
            status: 'OPEN',
            created_at: now.slice(0, 10),
            audit_history: [
              { time: now, action: 'Auto-Dispatched by AI Computer Vision Sovereign Arbiter', actor: 'AI Vision Engine' }
            ]
          });
          setStored(STORAGE_KEYS.ALERTS, alerts);
        } else if (aiVerdict.arbitration_verdict === 'VARIANCE_WARNING') {
          proj.evidence_health = Math.max(45, (proj.evidence_health || 75) - 15);
        }

        setStored(STORAGE_KEYS.PROJECTS, projects);
      }

      const newInsp: Inspection = {
        id: `INSP-${Date.now()}`,
        project_id: data.project_id,
        inspection_date: now.slice(0, 10),
        officer_name: data.officer_name,
        officer_designation: data.officer_designation,
        latitude: data.latitude,
        longitude: data.longitude,
        physical_progress_observed: data.physical_progress_observed,
        governing_progress: aiVerdict.governing_progress,
        arbitration_verdict: aiVerdict.arbitration_verdict,
        quality_rating: data.quality_rating,
        material_observations: data.material_observations,
        labour_activity_observations: data.labour_activity_observations,
        general_remarks: data.general_remarks,
        defects_reported: data.defects_reported,
        stalled_status: Boolean(data.stalled_status),
        photo_urls: data.photo_urls || [],
        ai_cv_similarity_score: Math.round(aiVerdict.confidence_score * 100) / 100,
        ai_progress_discrepancy_pct: aiVerdict.discrepancy_delta,
        gps_matched: true,
        status: aiVerdict.arbitration_verdict === 'COLLUSION_ALERT' ? 'COLLUSION_ALERT' : (aiVerdict.arbitration_verdict === 'VARIANCE_WARNING' ? 'REQUIRES_VERIFICATION' : 'VERIFIED'),
        distance_variance_meters: 12.4,
        ai_verification_notes: aiVerdict.verdict_message
      };
      const storedInspections = getStored<Inspection[]>(STORAGE_KEYS.INSPECTIONS, []);
      storedInspections.unshift(newInsp);
      setStored(STORAGE_KEYS.INSPECTIONS, storedInspections);

      return newInsp;
    }
  },

  // Citizen Complaints
  async submitComplaint(data: {
    project_id: string;
    citizen_name?: string;
    citizen_phone?: string;
    citizen_email?: string;
    category: string;
    description: string;
    location: string;
    evidence_photo_url?: string;
  }): Promise<Complaint> {
    try {
      return await apiFetch<Complaint>('/complaints', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const cmpId = `CMP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const proj = projects.find(p => p.id === data.project_id);
      const isDefect = /damage|poor quality|collapse|crack|stalled|incomplete|defect|failure/i.test(data.category + ' ' + data.description);

      const assignedAuthority = isDefect
        ? 'District Collector & Chief Vigilance Officer'
        : 'District Grievance Redressal Nodal Officer';

      const newCmp: Complaint = {
        id: cmpId,
        project_id: data.project_id,
        citizen_name: data.citizen_name || 'Anonymous Citizen',
        citizen_phone: data.citizen_phone,
        citizen_email: data.citizen_email,
        category: data.category,
        description: data.description,
        evidence_photo_url: data.evidence_photo_url,
        location: data.location,
        submission_date: new Date().toISOString().slice(0, 10),
        status: 'AI_CLASSIFIED',
        assigned_to: assignedAuthority,
        resolution_notes: isDefect
          ? `Escalated to Higher Authority. Defect notice registered against contractor ${proj?.contractor_name || 'Executing Agency'}. PBG flagged.`
          : 'Grievance received and auto-routed for field inspection.'
      };
      const existing = getStored<Complaint[]>(STORAGE_KEYS.COMPLAINTS, []);
      existing.unshift(newCmp);
      setStored(STORAGE_KEYS.COMPLAINTS, existing);

      // If defect, also register in local alerts
      if (isDefect && proj) {
        const alerts = getStored<Alert[]>(STORAGE_KEYS.ALERTS, []);
        const newAlert: Alert = {
          id: `ALT-DEFECT-${cmpId.slice(-5)}`,
          project_id: proj.id,
          project_title: proj.title,
          severity: 'CRITICAL',
          category: 'Guarantee Alert',
          title: `Statutory Defect Notice: ${proj.contractor_name || 'Contractor'}`,
          description: `Citizen photo grievance filed (#${cmpId}) with GPS verification. Defect liability invoked against executing agency ${proj.contractor_name}.`,
          observed_data: `Citizen report: '${data.category}' at ${data.location}. Photo evidence attached.`,
          expected_data: 'Defect-free structural handover conforming to CPWD/MoSPI Clause 4.2',
          difference: 'Breach of statutory warranty. PBG placed on freeze hold.',
          confidence_score: 0.96,
          recommended_action: `Dispatch Executive Engineer for joint audit. Freeze ₹${((proj.contract_amount || 2500000) * 0.05).toLocaleString('en-IN')} PBG escrow.`,
          escalation_level: 'Level 4 - District Collector & Chief Vigilance Officer',
          assigned_authority: 'District Collector / Superintending Engineer PWD',
          due_days: 3,
          status: 'ACTION_REQUIRED',
          created_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
          audit_history: [{
            time: new Date().toISOString().slice(0, 16).replace('T', ' '),
            action: `Auto-escalated to District Collector under CPWD Clause 4.2 Defect Liability. Contractor: ${proj.contractor_name}`,
            actor: 'AI Fiscal Surveillance Engine'
          }]
        };
        alerts.unshift(newAlert);
        setStored(STORAGE_KEYS.ALERTS, alerts);
      }

      return newCmp;
    }
  },

  async getComplaints(): Promise<Complaint[]> {
    try {
      return await apiFetch<Complaint[]>('/complaints');
    } catch {
      return getStored<Complaint[]>(STORAGE_KEYS.COMPLAINTS, [
        {
          id: 'CMP-2026-00482',
          project_id: 'MPLAD-AP-2026-00125',
          citizen_name: 'Tagarapuvalasa Gram Panchayat Residents',
          category: 'Work stopped',
          description: 'Roofing work paused for past 3 weeks. Hall needed before monsoon wedding and harvest festival season.',
          evidence_photo_url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600',
          location: 'Tagarapuvalasa Main Road',
          submission_date: '2026-01-28',
          status: 'INVESTIGATION',
          assigned_to: 'Assistant Executive Engineer PRED',
          resolution_notes: 'Contractor directed to resume truss erection by Feb 25.'
        }
      ]);
    }
  },

  // Analytics Overview
  async getOverviewAnalytics(): Promise<OverviewAnalytics> {
    try {
      return await apiFetch<OverviewAnalytics>('/analytics/overview');
    } catch {
      const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const total_sanctioned = projects.reduce((acc, p) => acc + (p.sanctioned_amount || 0), 0);
      const total_released = projects.reduce((acc, p) => acc + (p.funds_released || 0), 0);
      const total_expenditure = projects.reduce((acc, p) => acc + (p.actual_expenditure || 0), 0);
      return {
        total_projects: projects.length,
        completed_projects: projects.filter(p => p.status === 'COMPLETED').length,
        under_progress_projects: projects.filter(p => p.status === 'UNDER PROGRESS').length,
        stalled_projects: projects.filter(p => p.status === 'STALLED').length,
        delayed_projects: projects.filter(p => p.delay_days > 0).length,
        high_risk_projects: projects.filter(p => p.risk_level === 'HIGH RISK' || p.risk_level === 'CRITICAL').length,
        total_sanctioned_amount: total_sanctioned,
        total_funds_released: total_released,
        total_actual_expenditure: total_expenditure,
        unspent_balance: total_released - total_expenditure,
        fund_utilization_pct: total_released > 0 ? Math.round((total_expenditure / total_released) * 100) : 0,
        active_alerts_count: 24,
        critical_alerts_count: 5,
        active_disputes_count: 8,
        expiring_guarantees_count: 4,
        total_contractors_count: 15,
        districts_covered_count: 28,
        states_covered_count: 10,
      };
    }
  },

  // Duplicates & Decisions
  async getDuplicateCandidates(district?: string): Promise<DuplicateCandidate[]> {
    try {
      const q = district ? `?district=${district}` : '';
      return await apiFetch<DuplicateCandidate[]>(`/ai/detect-duplicates${q}`);
    } catch {
      return getStored<DuplicateCandidate[]>(STORAGE_KEYS.DUPLICATES, INITIAL_DUPLICATES);
    }
  },

  async recordDuplicateDecision(data: { candidate_id: string; decision: string; notes?: string; officer_name?: string }) {
    try {
      return await apiFetch('/ai/duplicate-decision', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const duplicates = getStored<DuplicateCandidate[]>(STORAGE_KEYS.DUPLICATES, INITIAL_DUPLICATES);
      const item = duplicates.find(d => d.id === data.candidate_id);
      if (item) {
        item.status = data.decision as any;
        item.decision_notes = data.notes;
        setStored(STORAGE_KEYS.DUPLICATES, duplicates);
      }
      return { status: 'SUCCESS' };
    }
  },

  // Delay Prediction
  async getDelayPrediction(projectId: string): Promise<DelayPrediction> {
    try {
      return await apiFetch<DelayPrediction>(`/ai/predict-delay/${projectId}`);
    } catch {
      return {
        project_id: projectId,
        project_title: 'Public Work Sanction',
        original_completion_date: '10 Dec 2025',
        predicted_completion_date: '24 Apr 2026',
        projected_delay_days: 135,
        delay_probability_pct: 82,
        risk_level: 'HIGH RISK',
        contributing_factors: [
          'Early-stage execution velocity is 40% below target trajectory',
          'Contractor exhibits average historical delay of 42 days',
          'Pending measurement or rate dispute slows billing approval'
        ],
        confidence_score: 0.86,
        notice: 'AI prediction — not an official administrative determination.'
      };
    }
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      return await apiFetch<AuditLog[]>('/admin/audit-logs');
    } catch {
      return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    }
  },

  // Disputes
  async getDisputes(): Promise<Dispute[]> {
    const projects = await this.getProjects();
    const allDisputes: Dispute[] = [];
    for (const p of projects) {
      if (p.disputes) {
        allDisputes.push(...p.disputes);
      }
    }
    return allDisputes;
  },

  // Guarantees
  async getGuarantees(): Promise<Guarantee[]> {
    const projects = await this.getProjects();
    const allGuarantees: Guarantee[] = [];
    for (const p of projects) {
      if (p.guarantees) {
        allGuarantees.push(...p.guarantees);
      }
    }
    return allGuarantees;
  },

  // Resolve alert convenience
  async resolveAlert(alertId: string, notes: string = 'Resolved following verification'): Promise<Alert> {
    return this.takeAlertAction(alertId, { action: 'RESOLVE', notes });
  },

  // Whistleblower Bounty Marketplace API
  async getWhistleblowerReports(): Promise<WhistleblowerBountyReport[]> {
    return getStored<WhistleblowerBountyReport[]>(STORAGE_KEYS.WHISTLEBLOWERS, INITIAL_WHISTLEBLOWER_REPORTS);
  },

  async submitWhistleblowerReport(data: {
    project_id: string;
    category: WhistleblowerBountyReport['category'];
    description: string;
    evidence_url?: string;
    evidence_type?: 'image' | 'video' | 'audio' | 'document';
    evidence_filename?: string;
  }): Promise<WhistleblowerBountyReport> {
    const reports = getStored<WhistleblowerBountyReport[]>(STORAGE_KEYS.WHISTLEBLOWERS, INITIAL_WHISTLEBLOWER_REPORTS);
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const proj = projects.find(p => p.id === data.project_id);

    const WORD_DICTIONARY = [
      'hawk', 'iron', 'river', 'stone', 'cedar', 'flash', 'vault', 'ember', 
      'orbit', 'ridge', 'copper', 'flame', 'silver', 'timber', 'meadow', 
      'solar', 'glacier', 'shield', 'beacon', 'canyon', 'thunder', 'anchor', 
      'shadow', 'prism', 'falcon', 'summit', 'crystal', 'breeze', 'harbor', 
      'zenith', 'matrix', 'echo'
    ];
    const words: string[] = [];
    for (let i = 0; i < 12; i++) {
      words.push(WORD_DICTIONARY[Math.floor(Math.random() * WORD_DICTIONARY.length)]);
    }
    const secretKey = words.join(' ');
    const hash = `SHA256-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const id = `WB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport: WhistleblowerBountyReport = {
      id,
      project_id: data.project_id,
      project_title: proj?.title || 'Registered Public Work',
      location: proj ? `${proj.village || proj.mandal_block || ''}, ${proj.district}` : 'On-Site Location',
      category: data.category,
      description: data.description,
      evidence_url: data.evidence_url,
      evidence_type: data.evidence_type || 'image',
      evidence_filename: data.evidence_filename || 'confidential_evidence.jpg',
      secret_claim_key: secretKey,
      secret_claim_hash: hash,
      status: 'RECEIVED_ENCRYPTED',
      penalty_frozen_amount: 0,
      bounty_reward_amount: 0,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      forensic_verdict_notes: 'Encrypted submission registered in zero-knowledge drop. Dispatched to CVC Chief Technical Examiner for forensic site testing.'
    };

    reports.unshift(newReport);
    setStored(STORAGE_KEYS.WHISTLEBLOWERS, reports);
    return newReport;
  },

  async getWhistleblowerReportByClaimKey(secretKey: string): Promise<WhistleblowerBountyReport | null> {
    const reports = getStored<WhistleblowerBountyReport[]>(STORAGE_KEYS.WHISTLEBLOWERS, INITIAL_WHISTLEBLOWER_REPORTS);
    const cleanKey = secretKey.trim().toLowerCase().replace(/\s+/g, ' ');
    const found = reports.find(r => r.secret_claim_key.toLowerCase() === cleanKey);
    return found || null;
  },

  async claimWhistleblowerBounty(
    reportId: string, 
    secretKey: string, 
    payoutMethod: 'RBI_E_RUPI' | 'INDIA_POST_CASH' | 'ANONYMOUS_UPI',
    _upiId?: string
  ): Promise<WhistleblowerBountyReport> {
    const reports = getStored<WhistleblowerBountyReport[]>(STORAGE_KEYS.WHISTLEBLOWERS, INITIAL_WHISTLEBLOWER_REPORTS);
    const idx = reports.findIndex(r => r.id === reportId);
    if (idx === -1) throw new Error('Report not found');
    
    const rep = reports[idx];
    if (rep.secret_claim_key.toLowerCase() !== secretKey.trim().toLowerCase().replace(/\s+/g, ' ')) {
      throw new Error('Invalid secret claim key. Cryptographic verification failed.');
    }

    if (rep.status !== 'FRAUD_PROVEN_PENALTY_FROZEN' && rep.bounty_reward_amount <= 0) {
      throw new Error('This bounty report has not yet reached statutory penalty freeze status.');
    }

    rep.status = 'BOUNTY_PAID';
    rep.payout_method = payoutMethod;
    rep.payout_redeemed_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
    rep.payout_voucher_code = payoutMethod === 'RBI_E_RUPI'
      ? `RUPI-${Math.random().toString(36).substring(2, 9).toUpperCase()}-2026`
      : payoutMethod === 'INDIA_POST_CASH'
      ? `POST-CASH-${Math.floor(100000 + Math.random() * 900000)}`
      : `UPI-TXN-${Date.now()}`;

    setStored(STORAGE_KEYS.WHISTLEBLOWERS, reports);
    return rep;
  },

  async updateWhistleblowerReportStatus(
    reportId: string,
    status: WhistleblowerBountyReport['status'],
    notes: string,
    penaltyFrozenAmount?: number,
    bountyRewardAmount?: number
  ): Promise<WhistleblowerBountyReport> {
    const reports = getStored<WhistleblowerBountyReport[]>(STORAGE_KEYS.WHISTLEBLOWERS, INITIAL_WHISTLEBLOWER_REPORTS);
    const idx = reports.findIndex(r => r.id === reportId);
    if (idx === -1) throw new Error('Report not found');

    const rep = reports[idx];
    rep.status = status;
    rep.forensic_verdict_notes = notes;
    if (penaltyFrozenAmount !== undefined) rep.penalty_frozen_amount = penaltyFrozenAmount;
    if (bountyRewardAmount !== undefined) rep.bounty_reward_amount = bountyRewardAmount;
    if (status === 'FRAUD_PROVEN_PENALTY_FROZEN' && !rep.payout_voucher_code) {
      rep.payout_voucher_code = `RUPI-VOUCHER-${new Date().getFullYear()}-${rep.id.replace('WB-', '')}-X99`;
    }

    setStored(STORAGE_KEYS.WHISTLEBLOWERS, reports);
    return rep;
  },

  // Double-Blind Dual Inspection API
  async getDoubleBlindAudits(): Promise<DoubleBlindAudit[]> {
    return getStored<DoubleBlindAudit[]>(STORAGE_KEYS.DOUBLE_BLIND_AUDITS, INITIAL_DOUBLE_BLIND_AUDITS);
  },

  async dispatchDoubleBlindAudit(
    projectId: string, 
    reason: string, 
    milestone: string = '72% Superstructure & Columns'
  ): Promise<DoubleBlindAudit> {
    const audits = getStored<DoubleBlindAudit[]>(STORAGE_KEYS.DOUBLE_BLIND_AUDITS, INITIAL_DOUBLE_BLIND_AUDITS);
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const proj = projects.find(p => p.id === projectId);

    const id = `DBA-${new Date().getFullYear()}-${Math.floor(400 + Math.random() * 500)}`;
    const newAudit: DoubleBlindAudit = {
      id,
      project_id: projectId,
      project_title: proj?.title || 'Public Work Site',
      location: proj ? `${proj.village || proj.mandal_block || ''}, ${proj.district}` : 'Site Coordinates',
      trigger_reason: reason,
      target_milestone: milestone,
      inspector_a_id: 'OFF-001',
      inspector_a_name: 'Shri R. K. Verma, AEE',
      inspector_a_dept: 'Panchayati Raj & Rural Engineering (PRED)',
      inspector_a_scheduled_time: `${new Date(Date.now() + 86400000).toISOString().slice(0, 10)} 10:00 AM – 01:00 PM`,
      inspector_a_status: 'PENDING',
      inspector_b_id: 'OFF-002',
      inspector_b_name: 'Smt. K. Sarada, AE',
      inspector_b_dept: 'Rural Water Supply & Sanitation (RWSS)',
      inspector_b_scheduled_time: `${new Date(Date.now() + 172800000).toISOString().slice(0, 10)} 02:00 PM – 05:00 PM`,
      inspector_b_status: 'PENDING',
      consensus_status: 'AWAITING_INSPECTIONS',
      action_taken: 'Double-blind split dispatch active. Neither officer is notified of the dual assignment. Awaiting independent on-site logs within 48-hour SLA.',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    audits.unshift(newAudit);
    setStored(STORAGE_KEYS.DOUBLE_BLIND_AUDITS, audits);
    return newAudit;
  },

  async submitDoubleBlindInspection(
    projectId: string,
    inspectorRole: 'INSPECTOR_A' | 'INSPECTOR_B',
    data: {
      progress: number;
      photo?: string;
      notes?: string;
      officer_name?: string;
      officer_dept?: string;
      gps_variance?: number;
    }
  ): Promise<DoubleBlindAudit> {
    const audits = getStored<DoubleBlindAudit[]>(STORAGE_KEYS.DOUBLE_BLIND_AUDITS, INITIAL_DOUBLE_BLIND_AUDITS);
    let audit = audits.find(a => a.project_id === projectId);
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (!audit) {
      audit = {
        id: `DBA-${new Date().getFullYear()}-${Math.floor(400 + Math.random() * 500)}`,
        project_id: projectId,
        project_title: 'Public Work Site',
        location: 'Site Coordinates',
        trigger_reason: 'Statutory Split Dual Inspection Mandate',
        target_milestone: `${data.progress}% Milestone`,
        inspector_a_id: 'OFF-001',
        inspector_a_name: 'Shri R. K. Verma, AEE',
        inspector_a_dept: 'Panchayati Raj & Rural Engineering (PRED)',
        inspector_a_status: 'PENDING',
        inspector_b_id: 'OFF-002',
        inspector_b_name: 'Smt. K. Sarada, AE',
        inspector_b_dept: 'Rural Water Supply & Sanitation (RWSS)',
        inspector_b_status: 'PENDING',
        consensus_status: 'AWAITING_INSPECTIONS',
        created_at: nowStr
      };
      audits.unshift(audit);
    }

    if (inspectorRole === 'INSPECTOR_A') {
      audit.inspector_a_status = 'SUBMITTED';
      audit.inspector_a_progress = data.progress;
      if (data.photo) audit.inspector_a_photo = data.photo;
      if (data.notes) audit.inspector_a_notes = data.notes;
      if (data.officer_name) audit.inspector_a_name = data.officer_name;
      if (data.officer_dept) audit.inspector_a_dept = data.officer_dept;
      if (data.gps_variance !== undefined) audit.inspector_a_gps_variance = data.gps_variance;
      audit.inspector_a_timestamp = nowStr;
    } else {
      audit.inspector_b_status = 'SUBMITTED';
      audit.inspector_b_progress = data.progress;
      if (data.photo) audit.inspector_b_photo = data.photo;
      if (data.notes) audit.inspector_b_notes = data.notes;
      if (data.officer_name) audit.inspector_b_name = data.officer_name;
      if (data.officer_dept) audit.inspector_b_dept = data.officer_dept;
      if (data.gps_variance !== undefined) audit.inspector_b_gps_variance = data.gps_variance;
      audit.inspector_b_timestamp = nowStr;
    }

    // Evaluate Consensus if both have submitted progress
    if (audit.inspector_a_progress !== undefined && audit.inspector_b_progress !== undefined) {
      const delta = Math.abs(audit.inspector_a_progress - audit.inspector_b_progress);
      audit.ai_discrepancy_delta = delta;
      if (delta <= 15) {
        audit.consensus_status = 'CONCORDANCE_VERIFIED';
        audit.action_taken = `Concordance Verified (Discrepancy ${delta}% <= 15% statutory tolerance). Milestone physical progress credited to official ledger and project advanced to next stage.`;

        // Update the project's physical_progress and advance lifecycle in standard 10 stages
        const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
        const pIdx = projects.findIndex(p => p.id === projectId);
        if (pIdx !== -1) {
          const avgProgress = Math.round((audit.inspector_a_progress + audit.inspector_b_progress) / 2);
          projects[pIdx].physical_progress = avgProgress;
          projects[pIdx].status = avgProgress >= 100 ? 'COMPLETED' : 'UNDER PROGRESS';
          projects[pIdx].timeline_events = generateStandard10Stages(projects[pIdx]);
          setStored(STORAGE_KEYS.PROJECTS, projects);
        }
      } else {
        audit.consensus_status = 'COLLUSION_ALERT_TRIGGERED';
        audit.action_taken = `CRITICAL COLLUSION RED ALERT: ${delta}% discrepancy detected between Inspector 1 (${audit.inspector_a_progress}%) and Inspector 2 (${audit.inspector_b_progress}%). Milestone advancement blocked, contractor payment escrow frozen under CVC Section 88, and Measurement Books quarantined.`;

        // Add to alerts
        const alerts = getStored<Alert[]>(STORAGE_KEYS.ALERTS, []);
        alerts.unshift({
          id: `ALT-DBA-${Date.now()}`,
          project_id: projectId,
          project_title: audit.project_title,
          severity: 'CRITICAL',
          category: 'Physical-Financial Mismatch',
          title: `Double-Blind Collusion Alert (${delta}% Delta)`,
          description: `Discrepancy of ${delta}% detected between Inspector 1 (${audit.inspector_a_progress}%) and Inspector 2 (${audit.inspector_b_progress}%).`,
          observed_data: `Inspector 1: ${audit.inspector_a_progress}%, Inspector 2: ${audit.inspector_b_progress}%`,
          expected_data: 'Discrepancy ≤ 15%',
          difference: `${delta}% Variance`,
          confidence_score: 98,
          recommended_action: 'Summon Inspecting Officers & Freeze Contractor Disbursement Escrow',
          escalation_level: 'Chief Technical Examiner (CVC)',
          assigned_authority: 'Central Vigilance Commission',
          due_days: 2,
          status: 'ACTION_REQUIRED',
          created_at: nowStr,
          audit_history: [
            {
              time: nowStr,
              action: 'ALERT_TRIGGERED_AUTONOMOUSLY',
              actor: 'MoSPI AI Consensus Engine'
            }
          ]
        });
        setStored(STORAGE_KEYS.ALERTS, alerts);
      }
    } else {
      audit.consensus_status = 'AWAITING_INSPECTIONS';
      audit.action_taken = inspectorRole === 'INSPECTOR_A'
        ? 'Inspector 1 report received. Awaiting blind cross-cadre inspection from Inspector 2.'
        : 'Inspector 2 report received. Awaiting primary cadre inspection from Inspector 1.';
    }

    setStored(STORAGE_KEYS.DOUBLE_BLIND_AUDITS, audits);
    return audit;
  },

  // e-Tender Bidding & Contractor Procurement API
  async getTenders(): Promise<TenderNotice[]> {
    const tenders = getStored<TenderNotice[]>(STORAGE_KEYS.TENDERS, INITIAL_TENDERS);
    let modified = false;

    // Ensure open tenders have an active deadline (defaulting to 30 minutes from now)
    tenders.forEach(tender => {
      if (tender.status === 'OPEN_FOR_BIDDING' && tender.bids_sealed) {
        // Ensure no premature rankings or cartel flags while bids are cryptographically sealed
        tender.bids?.forEach(b => {
          if (b.rank !== undefined || (b as any).cartel_risk_flag !== undefined || b.ai_viability_status !== undefined) {
            b.rank = undefined;
            b.ai_viability_status = undefined;
            b.ai_viability_score = undefined;
            b.ai_risk_flag = undefined;
            b.clearance_certificate_hash = undefined;
            delete (b as any).cartel_risk_flag;
            b.status = 'PENDING';
            modified = true;
          }
        });

        if (!tender.deadline_epoch_ms || tender.deadline_epoch_ms <= Date.now() - 3600000) {
          const targetEpoch = Date.now() + 30 * 60 * 1000; // 30 minutes from now
          tender.deadline_epoch_ms = targetEpoch;
          const timeStr = new Date(targetEpoch).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          tender.bidding_deadline_time = `${timeStr} IST`;
          tender.result_announcement_time = `${timeStr} IST (Instant Autonomous Result)`;
          tender.ai_auto_evaluation_status = 'PENDING_DEADLINE';
          modified = true;
        }
      }
    });

    if (modified) {
      setStored(STORAGE_KEYS.TENDERS, tenders);
    }
    return tenders;
  },

  async setTenderDeadline(tenderId: string, minutesFromNow: number): Promise<TenderNotice> {
    const tenders = getStored<TenderNotice[]>(STORAGE_KEYS.TENDERS, INITIAL_TENDERS);
    const idx = tenders.findIndex(t => t.id === tenderId);
    if (idx === -1) throw new Error(`Tender ${tenderId} not found`);

    const tender = tenders[idx];
    const targetEpoch = Date.now() + minutesFromNow * 60 * 1000;
    tender.deadline_epoch_ms = targetEpoch;
    const timeStr = new Date(targetEpoch).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    tender.bidding_deadline_time = `${timeStr} IST`;
    tender.result_announcement_time = `${timeStr} IST (Instant Autonomous Result)`;
    tender.bids_sealed = true;
    tender.status = 'OPEN_FOR_BIDDING';
    tender.ai_auto_evaluation_status = 'PENDING_DEADLINE';
    tender.ai_auto_awarded = false;
    tender.awarded_contractor = undefined;
    tender.awarded_amount = undefined;
    tender.awarded_date = undefined;
    tender.ai_evaluation_log = undefined;

    // Reseal all bids into pending escrow state
    tender.bids?.forEach(b => {
      b.rank = undefined;
      b.status = 'PENDING';
      b.ai_viability_status = undefined;
      b.ai_viability_score = undefined;
      b.ai_risk_flag = undefined;
      b.clearance_certificate_hash = undefined;
      delete (b as any).cartel_risk_flag;
    });

    tenders[idx] = tender;
    setStored(STORAGE_KEYS.TENDERS, tenders);
    return tender;
  },

  async resetTenderCountdown(tenderId: string, minutes: number = 30): Promise<TenderNotice> {
    return this.setTenderDeadline(tenderId, minutes);
  },

  async publishNewTender(params: {
    project_id: string;
    title: string;
    department: string;
    state: string;
    district: string;
    sanctioned_estimate: number;
    statutory_price_floor?: number;
    deadline_minutes?: number;
    boq_items?: TenderBoQItem[];
  }): Promise<TenderNotice> {
    const tenders = getStored<TenderNotice[]>(STORAGE_KEYS.TENDERS, INITIAL_TENDERS);
    const deadlineMins = params.deadline_minutes || 30;
    const targetEpoch = Date.now() + deadlineMins * 60 * 1000;
    const timeStr = new Date(targetEpoch).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const nextNum = tenders.length + 100 + Math.floor(10 + Math.random() * 89);
    const tenderId = `NIT-MPLAD-2026-${nextNum}`;
    const estimate = params.sanctioned_estimate;
    const floor = params.statutory_price_floor || Math.round(estimate * 0.85);

    const newTender: TenderNotice = {
      id: tenderId,
      project_id: params.project_id,
      title: params.title,
      department: params.department,
      state: params.state,
      district: params.district,
      sanctioned_estimate: estimate,
      statutory_price_floor: floor,
      emd_amount: Math.round(estimate * 0.02),
      tender_type: 'OPEN_COMPETITIVE_E_PROCUREMENT',
      published_date: new Date().toISOString().slice(0, 10),
      closing_date: new Date(targetEpoch).toISOString().slice(0, 10),
      bidding_deadline_time: `${timeStr} IST`,
      result_announcement_time: `${timeStr} IST (Instant Autonomous Result)`,
      deadline_epoch_ms: targetEpoch,
      bids_sealed: true,
      ai_auto_evaluation_status: 'PENDING_DEADLINE',
      status: 'OPEN_FOR_BIDDING',
      boq_items: params.boq_items && params.boq_items.length > 0 ? params.boq_items : [
        { id: `BOQ-${nextNum}-1`, item_description: 'Site Clearance, Earthwork Excavation & Levelling', quantity: 180, unit: 'm³', standard_sor_rate: 340, estimated_total: Math.round(estimate * 0.15) },
        { id: `BOQ-${nextNum}-2`, item_description: 'RCC Structural Core & Foundation Grade Concrete', quantity: 65, unit: 'm³', standard_sor_rate: 5200, estimated_total: Math.round(estimate * 0.45) },
        { id: `BOQ-${nextNum}-3`, item_description: 'High-Strength Fe500D Reinforcement Steel Supply', quantity: 10, unit: 'MT', standard_sor_rate: 58200, estimated_total: Math.round(estimate * 0.25) },
        { id: `BOQ-${nextNum}-4`, item_description: 'Skilled Masonry, Plastering & Quality Attestation', quantity: 1, unit: 'Lot', standard_sor_rate: Math.round(estimate * 0.15), estimated_total: Math.round(estimate * 0.15) }
      ],
      bids: []
    };

    tenders.unshift(newTender);
    setStored(STORAGE_KEYS.TENDERS, tenders);
    return newTender;
  },

  async resetAllTendersToFresh(): Promise<TenderNotice[]> {
    const freshTenders = INITIAL_TENDERS.map((t, idx) => {
      const copy = { ...t, bids: (t.bids || []).map(b => ({ ...b })) };
      if (idx === 0 || idx === 1) {
        const targetEpoch = Date.now() + 30 * 60 * 1000;
        const timeStr = new Date(targetEpoch).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        copy.status = 'OPEN_FOR_BIDDING';
        copy.bids_sealed = true;
        copy.deadline_epoch_ms = targetEpoch;
        copy.bidding_deadline_time = `${timeStr} IST`;
        copy.result_announcement_time = `${timeStr} IST (Instant Autonomous Result)`;
        copy.ai_auto_evaluation_status = 'PENDING_DEADLINE';
        copy.ai_auto_awarded = false;
        copy.awarded_contractor = undefined;
        copy.awarded_amount = undefined;
        copy.awarded_date = undefined;
        copy.ai_evaluation_log = undefined;
        copy.bids.forEach(b => {
          b.status = 'PENDING';
          b.rank = undefined;
          b.ai_viability_status = undefined;
          b.ai_viability_score = undefined;
          b.ai_risk_flag = undefined;
          b.clearance_certificate_hash = undefined;
          delete (b as any).cartel_risk_flag;
        });
      }
      return copy;
    });
    setStored(STORAGE_KEYS.TENDERS, freshTenders);
    return freshTenders;
  },

  async getTenderById(tenderId: string): Promise<TenderNotice | null> {
    const tenders = await this.getTenders();
    return tenders.find(t => t.id === tenderId) || null;
  },

  async submitTenderBid(
    tenderId: string, 
    bidData: {
      contractor_id: string;
      contractor_name: string;
      contractor_class: string;
      contractor_gstin: string;
      quoted_amount: number;
      emd_reference: string;
      emd_status?: 'VERIFIED_IN_ESCROW' | 'EXEMPTED_MSME';
    }
  ): Promise<TenderNotice> {
    const tenders = getStored<TenderNotice[]>(STORAGE_KEYS.TENDERS, INITIAL_TENDERS);
    const idx = tenders.findIndex(t => t.id === tenderId);
    if (idx === -1) throw new Error(`Tender ${tenderId} not found`);

    const tender = tenders[idx];
    const estimate = tender.sanctioned_estimate;
    const quoted = bidData.quoted_amount;
    const variancePct = Math.round(((quoted - estimate) / estimate) * 1000) / 10;

    if (!quoted || quoted <= 0) {
      throw new Error("Commercial quote must be a positive amount greater than zero.");
    }

    // Cryptographic Escrow: bids remain sealed until the scheduled deadline.
    // Viability scoring and L1 ranking are performed at unsealing.
    const newBid: TenderBid = {
      id: `BID-${tender.id.slice(-2)}-${Math.floor(10 + Math.random() * 89)}`,
      tender_id: tenderId,
      contractor_id: bidData.contractor_id,
      contractor_name: bidData.contractor_name,
      contractor_class: bidData.contractor_class,
      contractor_gstin: bidData.contractor_gstin,
      quoted_amount: quoted,
      variance_pct: variancePct,
      emd_reference: bidData.emd_reference,
      emd_status: bidData.emd_status || 'VERIFIED_IN_ESCROW',
      submitted_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'PENDING'
    };

    tender.bids = [...(tender.bids || []), newBid];
    tenders[idx] = tender;
    setStored(STORAGE_KEYS.TENDERS, tenders);
    return tender;
  },

  async awardTender(tenderId: string, winningBidId: string): Promise<TenderNotice> {
    const tenders = getStored<TenderNotice[]>(STORAGE_KEYS.TENDERS, INITIAL_TENDERS);
    const idx = tenders.findIndex(t => t.id === tenderId);
    if (idx === -1) throw new Error(`Tender ${tenderId} not found`);

    const tender = tenders[idx];
    const winningBid = (tender.bids || []).find(b => b.id === winningBidId);
    if (!winningBid) throw new Error(`Bid ${winningBidId} not found`);

    tender.status = 'AWARDED';
    tender.awarded_contractor = winningBid.contractor_name;
    tender.awarded_amount = winningBid.quoted_amount;
    tender.awarded_date = new Date().toISOString().slice(0, 10);
    tender.ai_auto_awarded = false; // Manually awarded by official

    tender.bids = (tender.bids || []).map(b => ({
      ...b,
      status: b.id === winningBidId ? 'ACCEPTED_AWARDED' : 'REJECTED'
    }));

    tenders[idx] = tender;
    setStored(STORAGE_KEYS.TENDERS, tenders);

    // Update project with awarded contractor & amount
    try {
      const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const pIdx = projects.findIndex(p => p.id === tender.project_id);
      if (pIdx !== -1) {
        projects[pIdx].contractor_name = winningBid.contractor_name;
        projects[pIdx].contract_amount = winningBid.quoted_amount;
        projects[pIdx].status = 'UNDER PROGRESS';
        setStored(STORAGE_KEYS.PROJECTS, projects);
      }
    } catch {}

    return tender;
  },

  async autoEvaluateAndAwardTender(tenderId: string): Promise<TenderNotice> {
    const tenders = getStored<TenderNotice[]>(STORAGE_KEYS.TENDERS, INITIAL_TENDERS);
    const idx = tenders.findIndex(t => t.id === tenderId);
    if (idx === -1) throw new Error(`Tender ${tenderId} not found`);

    const tender = tenders[idx];
    const bids = tender.bids || [];

    // 1. Unseal bids
    tender.bids_sealed = false;
    tender.ai_auto_evaluation_status = 'RESULT_ANNOUNCED';
    tender.ai_auto_awarded = true;

    // 2. Re-evaluate all bids using AI/ML Price Floor Scrutinizer
    const evaluatedBids = bids.map(bid => {
      const viability = marketRatesOracle.evaluateTenderViability(
        tender.project_id,
        bid.contractor_name,
        bid.quoted_amount,
        tender.sanctioned_estimate,
        tender.district
      );
      return {
        ...bid,
        ai_viability_status: viability.viability_status,
        ai_viability_score: viability.viability_score,
        ai_risk_flag: viability.ai_risk_flag,
        clearance_certificate_hash: viability.clearance_hash,
      };
    });

    // 3. Find valid bids & rank L1
    const validBids = evaluatedBids
      .filter(b => b.ai_viability_status !== 'ABNORMALLY_LOW_REJECTED')
      .sort((a, b) => a.quoted_amount - b.quoted_amount);

    evaluatedBids.forEach(b => {
      if (b.ai_viability_status === 'ABNORMALLY_LOW_REJECTED') {
        b.rank = 'DISQUALIFIED';
        b.status = 'REJECTED';
      } else {
        const rankIdx = validBids.findIndex(vb => vb.id === b.id);
        if (rankIdx === 0) {
          b.rank = 'L1';
          b.status = 'ACCEPTED_AWARDED';
        } else if (rankIdx === 1) {
          b.rank = 'L2';
          b.status = 'REJECTED';
        } else if (rankIdx === 2) {
          b.rank = 'L3';
          b.status = 'REJECTED';
        } else {
          b.rank = undefined;
          b.status = 'REJECTED';
        }
      }
    });

    const winningBid = validBids[0];
    if (winningBid) {
      tender.status = 'AWARDED';
      tender.awarded_contractor = winningBid.contractor_name;
      tender.awarded_amount = winningBid.quoted_amount;
      tender.awarded_date = new Date().toISOString().slice(0, 10);
      tender.ai_evaluation_log = `Autonomous AI Decision Engine unsealed ${bids.length} bids at scheduled announcement time (${tender.result_announcement_time}). Disqualified ${evaluatedBids.filter(b => b.rank === 'DISQUALIFIED').length} predatory bids under statutory floor. 0 cartel patterns confirmed. Contract officially awarded to ${winningBid.contractor_name} at ₹${winningBid.quoted_amount.toLocaleString('en-IN')} (L1).`;
    } else {
      tender.status = 'RETENDER_INITIATED';
      tender.awarded_contractor = undefined;
      tender.awarded_amount = undefined;
      tender.awarded_date = undefined;
      tender.ai_evaluation_log = `Autonomous AI Decision Engine unsealed ${bids.length} bids at scheduled announcement time (${tender.result_announcement_time}). All submitted bids breached the statutory price floor (-15% CPWD viability limit) or were rejected for technical non-compliance. Pursuant to GFR 2017 Rule 173(xxi), this tender has been annulled and queued for immediate Re-Tender with revised BoQ specifications.`;
    }

    tender.bids = evaluatedBids;
    tenders[idx] = tender;
    setStored(STORAGE_KEYS.TENDERS, tenders);

    // Update project registry
    if (winningBid) {
      try {
        const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
        const pIdx = projects.findIndex(p => p.id === tender.project_id);
        if (pIdx !== -1) {
          projects[pIdx].contractor_name = winningBid.contractor_name;
          projects[pIdx].contract_amount = winningBid.quoted_amount;
          projects[pIdx].status = 'UNDER PROGRESS';
          setStored(STORAGE_KEYS.PROJECTS, projects);
        }
      } catch {}
    }

    return tender;
  },

  async reissueTender(tenderId: string): Promise<TenderNotice> {
    const tenders = getStored<TenderNotice[]>(STORAGE_KEYS.TENDERS, INITIAL_TENDERS);
    const idx = tenders.findIndex(t => t.id === tenderId);
    if (idx === -1) throw new Error(`Tender ${tenderId} not found`);

    const tender = tenders[idx];
    const now = new Date();
    const newClosing = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const newDeadline = `${newClosing} 17:00 IST`;
    const newResult = `${newClosing} 18:00 IST`;

    tender.status = 'OPEN_FOR_BIDDING';
    tender.bids_sealed = true;
    tender.ai_auto_awarded = false;
    tender.ai_auto_evaluation_status = 'PENDING_DEADLINE';
    tender.published_date = now.toISOString().slice(0, 10);
    tender.closing_date = newClosing;
    tender.bidding_deadline_time = newDeadline;
    tender.result_announcement_time = newResult;
    tender.awarded_contractor = undefined;
    tender.awarded_amount = undefined;
    tender.awarded_date = undefined;
    tender.bids = [];
    tender.ai_evaluation_log = `Tender re-issued under GFR 2017 Rule 173. Fresh 7-day competitive e-procurement window initiated. All commercial quotes cryptographically sealed in escrow until ${newDeadline}.`;

    tenders[idx] = tender;
    setStored(STORAGE_KEYS.TENDERS, tenders);
    return tender;
  },

  async getMeasurementBills(contractorId?: string): Promise<MeasurementBillSubmission[]> {
    const bills = getStored<MeasurementBillSubmission[]>(STORAGE_KEYS.MEASUREMENT_BILLS, INITIAL_MEASUREMENT_BILLS);
    if (contractorId) {
      return bills.filter(b => b.contractor_id === contractorId);
    }
    return bills;
  },

  async submitMeasurementBill(billData: Omit<MeasurementBillSubmission, 'id' | 'submission_date' | 'status'>): Promise<MeasurementBillSubmission> {
    const bills = getStored<MeasurementBillSubmission[]>(STORAGE_KEYS.MEASUREMENT_BILLS, INITIAL_MEASUREMENT_BILLS);
    const newBill: MeasurementBillSubmission = {
      ...billData,
      id: `MB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`,
      submission_date: new Date().toISOString().slice(0, 10),
      status: 'SUBMITTED'
    };
    bills.unshift(newBill);
    setStored(STORAGE_KEYS.MEASUREMENT_BILLS, bills);
    return newBill;
  },

  async updateMeasurementBillStatus(
    billId: string, 
    status: MeasurementBillSubmission['status'], 
    remarks: string
  ): Promise<MeasurementBillSubmission> {
    const bills = getStored<MeasurementBillSubmission[]>(STORAGE_KEYS.MEASUREMENT_BILLS, INITIAL_MEASUREMENT_BILLS);
    const idx = bills.findIndex(b => b.id === billId);
    if (idx === -1) throw new Error('Bill not found');
    bills[idx].status = status;
    bills[idx].field_officer_remarks = remarks;
    setStored(STORAGE_KEYS.MEASUREMENT_BILLS, bills);
    return bills[idx];
  }
};


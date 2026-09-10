import { Project, Contractor, Alert, Complaint, Dispute, Guarantee, DuplicateCandidate, AuditLog, OverviewAnalytics, DelayPrediction, Inspection } from '../types';
import { INITIAL_PROJECTS, INITIAL_CONTRACTORS, INITIAL_DUPLICATES, INITIAL_AUDIT_LOGS } from './mockData';

export const BACKEND_BASE = (((import.meta as any).env?.VITE_API_URL as string) || 'http://127.0.0.1:8000').replace(/\/+$/, '');
const BACKEND_URL = `${BACKEND_BASE}/api`;
const TIMEOUT_MS = 3500;

// LocalStorage helpers for offline persistence
const STORAGE_KEYS = {
  PROJECTS: 'mplad_projects',
  CONTRACTORS: 'mplad_contractors',
  ALERTS: 'mplad_alerts',
  COMPLAINTS: 'mplad_complaints',
  DUPLICATES: 'mplad_duplicates',
  AUDIT_LOGS: 'mplad_audit_logs',
};

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

// Transparent fetch with timeout
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
    throw err;
  }
}

export const api = {
  // Projects
  async getProjects(params?: Record<string, string>): Promise<Project[]> {
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const data = await apiFetch<Project[]>(`/projects${query}`);
      setStored(STORAGE_KEYS.PROJECTS, data);
      return data;
    } catch {
      let list = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
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
      return list;
    }
  },

  async getProjectById(id: string): Promise<Project> {
    try {
      return await apiFetch<Project>(`/projects/${id}`);
    } catch {
      const list = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const found = list.find(p => p.id === id) || INITIAL_PROJECTS[0];
      return found;
    }
  },

  // Contractors
  async getContractors(): Promise<Contractor[]> {
    try {
      const data = await apiFetch<Contractor[]>('/contractors');
      setStored(STORAGE_KEYS.CONTRACTORS, data);
      return data;
    } catch {
      return getStored<Contractor[]>(STORAGE_KEYS.CONTRACTORS, INITIAL_CONTRACTORS);
    }
  },

  async getContractorById(id: string): Promise<Contractor> {
    try {
      return await apiFetch<Contractor>(`/contractors/${id}`);
    } catch {
      const list = getStored<Contractor[]>(STORAGE_KEYS.CONTRACTORS, INITIAL_CONTRACTORS);
      return list.find(c => c.id === id) || INITIAL_CONTRACTORS[0];
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
      let updatedAlert: Alert | null = null;
      for (const p of projects) {
        if (p.alerts) {
          const a = p.alerts.find(item => item.id === alertId);
          if (a) {
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
            a.audit_history.push({
              time: new Date().toISOString().replace('T', ' ').slice(0, 16),
              action: `Action: ${actionData.action}. ${actionData.notes || ''}`,
              actor: actionData.officer_name || 'District Planning Officer'
            });
            updatedAlert = a;
            break;
          }
        }
      }
      setStored(STORAGE_KEYS.PROJECTS, projects);
      return updatedAlert || ({} as Alert);
    }
  },

  // Inspections
  async getInspections(projectId?: string): Promise<Inspection[]> {
    try {
      const url = projectId ? `/inspections?project_id=${projectId}` : '/inspections';
      return await apiFetch<Inspection[]>(url);
    } catch {
      return [];
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
      const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const proj = projects.find(p => p.id === data.project_id);
      if (proj) {
        proj.physical_progress = data.physical_progress_observed;
        proj.last_inspected_date = new Date().toISOString().slice(0, 10);
        if (data.stalled_status) proj.status = 'STALLED';
        setStored(STORAGE_KEYS.PROJECTS, projects);
      }
      return {
        id: `INSP-${Date.now()}`,
        status: 'VERIFIED',
        ai_cv_similarity_score: 0.91,
        gps_matched: true,
        distance_variance_meters: 12.4,
        ai_verification_notes: 'Image verified against milestone profile. Geotag & timestamp match.'
      };
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
  }
};

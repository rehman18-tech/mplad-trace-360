export type UserRole = 'CITIZEN' | 'FIELD_OFFICER' | 'DISTRICT_AUTHORITY' | 'ADMIN';

export type RiskLevel = 'NORMAL' | 'WATCH' | 'HIGH RISK' | 'CRITICAL';

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'bn' | 'mr' | 'kn';

export interface TimelineEvent {
  id: string;
  stage_name: string;
  stage_order: number;
  event_date: string;
  authority: string;
  amount?: number;
  document_name?: string;
  document_url?: string;
  verification_status: 'VERIFIED' | 'PARTIAL' | 'PENDING' | 'INCONSISTENT';
  notes?: string;
}

export interface FundFlow {
  id: string;
  stage: string;
  amount: number;
  transaction_date: string;
  reference_no: string;
  source_agency: string;
  destination_agency: string;
  verification_status: string;
}

export interface Inspection {
  id: string;
  project_id: string;
  officer_name: string;
  officer_designation: string;
  inspection_date: string;
  latitude: number;
  longitude: number;
  gps_matched: boolean;
  distance_variance_meters: number;
  physical_progress_observed: number;
  quality_rating: string;
  material_observations: string;
  labour_activity_observations: string;
  general_remarks: string;
  defects_reported?: string;
  stalled_status: boolean;
  photo_urls: string[];
  ai_cv_similarity_score: number;
  ai_progress_discrepancy_pct: number;
  ai_verification_notes: string;
  status: string;
}

export interface Complaint {
  id: string;
  project_id: string;
  citizen_name: string;
  citizen_phone?: string;
  citizen_email?: string;
  category: string;
  description: string;
  evidence_photo_url?: string;
  location: string;
  submission_date: string;
  status: 'SUBMITTED' | 'AI_CLASSIFIED' | 'ASSIGNED' | 'INSPECTION' | 'INVESTIGATION' | 'RESOLVED';
  assigned_to: string;
  resolution_notes?: string;
  resolved_date?: string;
}

export interface Dispute {
  id: string;
  project_id: string;
  dispute_type: string;
  claimant: string;
  contractor_claim_progress?: number;
  officer_inspected_progress?: number;
  financial_progress_record?: number;
  ai_evidence_consistency: string;
  claimed_amount?: number;
  description: string;
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'ESCALATED' | 'RESOLVED';
  resolution_summary?: string;
}

export interface Guarantee {
  id: string;
  project_id: string;
  contractor_name: string;
  guarantee_type: string;
  bank_or_institution: string;
  amount: number;
  issue_date: string;
  expiry_date: string;
  days_to_expiry: number;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'INVOKED' | 'RELEASED';
  action_required: boolean;
  defects_logged?: string;
  contractor_response?: string;
}

export interface Alert {
  id: string;
  project_id: string;
  project_title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  observed_data: string;
  expected_data: string;
  difference: string;
  confidence_score: number;
  recommended_action: string;
  escalation_level: string;
  assigned_authority: string;
  due_days: number;
  status: 'OPEN' | 'ASSIGNED' | 'UNDER_REVIEW' | 'INSPECTION_SCHEDULED' | 'ACTION_REQUIRED' | 'RESOLVED';
  created_at: string;
  resolution_notes?: string;
  audit_history: Array<{ time: string; action: string; actor: string }>;
}

export interface Contractor {
  id: string;
  name: string;
  registration_no: string;
  category_class: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  state: string;
  total_contracts: number;
  total_contract_value: number;
  completed_projects: number;
  delayed_projects: number;
  disputed_projects: number;
  terminated_projects: number;
  average_delay_days: number;
  average_cost_variation_pct: number;
  defect_reports_count: number;
  active_projects_count: number;
  performance_score: number;
  risk_level: 'LOW RISK' | 'ATTENTION' | 'HIGH RISK' | 'CRITICAL';
  risk_notes: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'RECOMMENDED' | 'SANCTIONED' | 'TENDERED' | 'UNDER PROGRESS' | 'COMPLETED' | 'STALLED';
  mp_name: string;
  mp_house: string;
  state: string;
  district: string;
  constituency: string;
  mandal_block: string;
  village: string;
  latitude: number;
  longitude: number;
  year: string;
  implementing_agency: string;
  recommended_amount: number;
  sanctioned_amount: number;
  contract_amount: number;
  funds_released: number;
  funds_paid: number;
  actual_expenditure: number;
  physical_progress: number;
  financial_progress: number;
  start_date: string;
  expected_completion_date: string;
  actual_completion_date?: string;
  delay_days: number;
  overall_risk_score: number;
  risk_level: RiskLevel;
  financial_health: number;
  physical_health: number;
  contract_health: number;
  schedule_health: number;
  evidence_health: number;
  risk_reasons: string[];
  contractor_id?: string;
  contractor_name?: string;
  last_inspected_date?: string;
  last_verified_date?: string;
  data_source: string;
  source_verification_status: string;
  timeline_events?: TimelineEvent[];
  fund_flows?: FundFlow[];
  inspections?: Inspection[];
  complaints?: Complaint[];
  disputes?: Dispute[];
  guarantees?: Guarantee[];
  alerts?: Alert[];
}

export interface DuplicateCandidate {
  id: string;
  project_a_id: string;
  project_a_title: string;
  project_b_id: string;
  project_b_title: string;
  similarity_score: number;
  matched_factors: string[];
  district: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED_DUPLICATE' | 'NOT_DUPLICATE' | 'NEEDS_REVIEW';
  decision_notes?: string;
}

export interface DelayPrediction {
  project_id: string;
  project_title: string;
  original_completion_date: string;
  predicted_completion_date: string;
  projected_delay_days: number;
  delay_probability_pct: number;
  risk_level: string;
  contributing_factors: string[];
  confidence_score: number;
  notice: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor_role: string;
  actor_name: string;
  action: string;
  entity_id: string;
  details: string;
  ip_address: string;
}

export interface OverviewAnalytics {
  total_projects: number;
  completed_projects: number;
  under_progress_projects: number;
  stalled_projects: number;
  delayed_projects: number;
  high_risk_projects: number;
  total_sanctioned_amount: number;
  total_funds_released: number;
  total_actual_expenditure: number;
  unspent_balance: number;
  fund_utilization_pct: number;
  active_alerts_count: number;
  critical_alerts_count: number;
  active_disputes_count: number;
  expiring_guarantees_count: number;
  total_contractors_count: number;
  districts_covered_count: number;
  states_covered_count: number;
}

export type UserRole = 'CITIZEN' | 'FIELD_OFFICER' | 'DISTRICT_AUTHORITY' | 'ADMIN' | 'VIGILANCE_AUDITOR' | 'CONTRACTOR';

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
  governing_progress?: number;
  arbitration_verdict?: 'CONCORDANT' | 'VARIANCE_WARNING' | 'COLLUSION_ALERT' | string;
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
  baseline_photo_url?: string;
  baseline_photo_timestamp?: string;
  baseline_photo_officer?: string;
  baseline_photo_officer_designation?: string;
  baseline_photo_method?: 'LIVE_CAMERA_GEOFENCE' | 'EXIF_GPS_VERIFIED' | 'LEGACY_DPR_PAPER_ARCHIVE' | 'FIELD_OFFICER_DISPATCH';
  baseline_photo_lat?: number;
  baseline_photo_lng?: number;
  baseline_photo_variance_m?: number;
  baseline_photo_device?: string;
  assigned_field_officer?: string;
  assigned_field_officer_designation?: string;
  baseline_stage?: string;
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

export interface MarketCommodityRate {
  id: string;
  commodity_name: string;
  specification: string;
  unit: string;
  district_benchmark_rate: number;
  statutory_price_floor: number;
  source_feed: string;
  source_type: 'CPWD_DSR' | 'MOSPI_WPI' | 'GEM_PROCUREMENT' | 'COMMODITY_EXCHANGE';
  last_updated: string;
  change_pct_7d: number;
  bis_standard_norm: string;
}

export interface TenderViabilityResult {
  project_id: string;
  contractor_name: string;
  quoted_amount: number;
  baseline_estimate_amount: number;
  minimum_viable_material_cost: number;
  statutory_price_floor: number;
  variance_from_baseline_pct: number;
  viability_status: 'VIABLE' | 'ABNORMALLY_LOW_REJECTED' | 'INFLATED_REVIEW_REQUIRED' | 'REQUIRES_PERFORMANCE_BOND';
  viability_score: number; // 0 to 100
  ai_risk_flag: string;
  clearance_certificate_issued: boolean;
  clearance_hash?: string;
}

export interface CrossCadreOfficer {
  id: string;
  name: string;
  designation: string;
  parent_department: 'Panchayati Raj (PRED)' | 'Roads & Buildings (R&B)' | 'Irrigation & Water' | 'Rural Water Supply (RWS)' | 'Municipal Engineering (ULB)';
  specialization: string;
  active_subdivision: string;
  blind_dispatch_status: 'AVAILABLE' | 'DISPATCHED' | 'STANDBY';
  assigned_inspection_id?: string;
  dispatched_at?: string;
}

export interface WhistleblowerBountyReport {
  id: string;
  project_id: string;
  project_title: string;
  location: string;
  category: 'ADULTERATED_MATERIALS' | 'GHOST_WORK_THICKNESS' | 'KICKBACK_EXTORTION' | 'FAKE_MUSTER_ROLL' | 'SUBSTANDARD_REBAR';
  description: string;
  evidence_url?: string;
  evidence_type?: 'image' | 'video' | 'audio' | 'document';
  evidence_filename?: string;
  secret_claim_key: string; // 12-word seed phrase
  secret_claim_hash: string;
  status: 'RECEIVED_ENCRYPTED' | 'UNDER_FORENSIC_AUDIT' | 'FRAUD_PROVEN_PENALTY_FROZEN' | 'BOUNTY_PAID' | 'DISMISSED';
  penalty_frozen_amount: number;
  bounty_reward_amount: number; // 10% of penalty
  payout_method?: 'RBI_E_RUPI' | 'INDIA_POST_CASH' | 'ANONYMOUS_UPI';
  payout_voucher_code?: string;
  payout_redeemed_at?: string;
  created_at: string;
  forensic_verdict_notes?: string;
}

export interface DoubleBlindAudit {
  id: string;
  project_id: string;
  project_title: string;
  location: string;
  trigger_reason: string;
  target_milestone: string;
  inspector_a_id: string;
  inspector_a_name: string;
  inspector_a_dept: string;
  inspector_a_scheduled_time?: string;
  inspector_a_progress?: number;
  inspector_a_status: 'PENDING' | 'SUBMITTED';
  inspector_a_notes?: string;
  inspector_a_timestamp?: string;
  inspector_a_photo?: string;
  inspector_a_gps_variance?: number;
  inspector_b_id: string;
  inspector_b_name: string;
  inspector_b_dept: string;
  inspector_b_scheduled_time?: string;
  inspector_b_progress?: number;
  inspector_b_status: 'PENDING' | 'SUBMITTED';
  inspector_b_notes?: string;
  inspector_b_timestamp?: string;
  inspector_b_photo?: string;
  inspector_b_gps_variance?: number;
  ai_discrepancy_delta?: number;
  consensus_status: 'AWAITING_INSPECTIONS' | 'CONCORDANCE_VERIFIED' | 'COLLUSION_ALERT_TRIGGERED';
  action_taken?: string;
  created_at: string;
}

export interface TenderBoQItem {
  id: string;
  item_description: string;
  quantity: number;
  unit: string;
  standard_sor_rate: number;
  estimated_total: number;
}

export interface TenderBid {
  id: string;
  tender_id: string;
  contractor_id: string;
  contractor_name: string;
  contractor_class: string;
  contractor_gstin: string;
  quoted_amount: number;
  variance_pct: number;
  emd_reference: string;
  emd_status: 'VERIFIED_IN_ESCROW' | 'EXEMPTED_MSME';
  ai_viability_status?: 'VIABLE' | 'ABNORMALLY_LOW_REJECTED' | 'REQUIRES_PERFORMANCE_BOND' | 'INFLATED_REVIEW_REQUIRED';
  ai_viability_score?: number;
  ai_risk_flag?: string;
  clearance_certificate_hash?: string;
  cartel_risk_flag?: string;
  rank?: 'L1' | 'L2' | 'L3' | 'DISQUALIFIED';
  submitted_at: string;
  status: 'PENDING' | 'ACCEPTED_AWARDED' | 'REJECTED';
}

export interface TenderNotice {
  id: string; // e.g. "NIT-MPLAD-2026-081"
  project_id: string;
  title: string;
  department: string;
  state: string;
  district: string;
  sanctioned_estimate: number;
  statutory_price_floor: number;
  emd_amount: number; // 2% of sanctioned
  tender_type: 'OPEN_COMPETITIVE_E_PROCUREMENT';
  published_date: string;
  closing_date: string;
  bidding_deadline_time: string; // e.g. "2026-03-25 17:00 IST"
  result_announcement_time: string; // e.g. "2026-03-25 18:00 IST"
  deadline_epoch_ms?: number; // Epoch timestamp for real-time 30-min countdown
  bids_sealed: boolean; // true while bidding window is open
  ai_auto_evaluation_status?: 'PENDING_DEADLINE' | 'EVALUATING' | 'RESULT_ANNOUNCED';
  ai_auto_awarded?: boolean;
  ai_evaluation_log?: string;
  status: 'OPEN_FOR_BIDDING' | 'UNDER_TECHNICAL_EVALUATION' | 'AWARDED' | 'CANCELLED' | 'RETENDER_INITIATED';
  awarded_contractor?: string;
  awarded_amount?: number;
  awarded_date?: string;
  boq_items: TenderBoQItem[];
  bids: TenderBid[];
}

export interface MeasurementBillSubmission {
  id: string;
  project_id: string;
  contractor_id: string;
  contractor_name: string;
  bill_number: string;
  stage_milestone: string;
  claimed_amount: number;
  physical_progress_claimed: number;
  site_photo_url?: string;
  invoice_pdf_url?: string;
  submission_date: string;
  status: 'SUBMITTED' | 'FIELD_VERIFIED' | 'PASSED_FOR_PAYMENT' | 'REJECTED';
  field_officer_remarks?: string;
}

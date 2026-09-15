from typing import List, Optional, Any
from pydantic import BaseModel

class TimelineEventSchema(BaseModel):
    id: str
    stage_name: str
    stage_order: int
    event_date: str
    authority: str
    amount: Optional[float] = None
    document_name: Optional[str] = None
    document_url: Optional[str] = None
    verification_status: str
    notes: Optional[str] = None

class FundFlowSchema(BaseModel):
    id: str
    stage: str
    amount: float
    transaction_date: str
    reference_no: str
    source_agency: str
    destination_agency: str
    verification_status: str

class InspectionSchema(BaseModel):
    id: str
    project_id: str
    officer_name: str
    officer_designation: str
    inspection_date: str
    latitude: float
    longitude: float
    gps_matched: bool
    distance_variance_meters: float
    physical_progress_observed: float
    quality_rating: str
    material_observations: str
    labour_activity_observations: str
    general_remarks: str
    defects_reported: Optional[str] = None
    stalled_status: bool
    photo_urls: List[str] = []
    ai_cv_similarity_score: float
    ai_progress_discrepancy_pct: float
    ai_verification_notes: str
    status: str

class InspectionCreate(BaseModel):
    project_id: str
    officer_name: str
    officer_designation: str
    latitude: float
    longitude: float
    physical_progress_observed: float
    quality_rating: str
    material_observations: str
    labour_activity_observations: str
    general_remarks: str
    defects_reported: Optional[str] = None
    stalled_status: bool = False
    photo_urls: List[str] = []

class ComplaintSchema(BaseModel):
    id: str
    project_id: str
    citizen_name: str
    citizen_phone: Optional[str] = None
    citizen_email: Optional[str] = None
    category: str
    description: str
    evidence_photo_url: Optional[str] = None
    location: str
    submission_date: str
    status: str
    assigned_to: str
    resolution_notes: Optional[str] = None
    resolved_date: Optional[str] = None

class ComplaintCreate(BaseModel):
    project_id: str
    citizen_name: str = "Anonymous Citizen"
    citizen_phone: Optional[str] = None
    citizen_email: Optional[str] = None
    category: str
    description: str
    evidence_photo_url: Optional[str] = None
    location: str

class DisputeSchema(BaseModel):
    id: str
    project_id: str
    dispute_type: str
    claimant: str
    contractor_claim_progress: Optional[float] = None
    officer_inspected_progress: Optional[float] = None
    financial_progress_record: Optional[float] = None
    ai_evidence_consistency: str
    claimed_amount: Optional[float] = None
    description: str
    status: str
    resolution_summary: Optional[str] = None

class GuaranteeSchema(BaseModel):
    id: str
    project_id: str
    contractor_name: str
    guarantee_type: str
    bank_or_institution: str
    amount: float
    issue_date: str
    expiry_date: str
    days_to_expiry: int
    status: str
    action_required: bool
    defects_logged: Optional[str] = None
    contractor_response: Optional[str] = None

class AlertSchema(BaseModel):
    id: str
    project_id: str
    project_title: str
    severity: str
    category: str
    title: str
    description: str
    observed_data: str
    expected_data: str
    difference: str
    confidence_score: float
    recommended_action: str
    escalation_level: str
    assigned_authority: str
    due_days: int
    status: str
    created_at: str
    resolution_notes: Optional[str] = None
    audit_history: List[Any] = []

class AlertActionRequest(BaseModel):
    action: str # "ASSIGN", "ESCALATE", "RESOLVE", "ADD_NOTE"
    assigned_to: Optional[str] = None
    escalation_level: Optional[str] = None
    notes: Optional[str] = None
    officer_name: str = "District Planning Officer"

class ContractorSchema(BaseModel):
    id: str
    name: str
    registration_no: str
    category_class: str
    contact_person: str
    contact_phone: str
    contact_email: str
    address: str
    state: str
    total_contracts: int
    total_contract_value: float
    completed_projects: int
    delayed_projects: int
    disputed_projects: int
    terminated_projects: int
    average_delay_days: float
    average_cost_variation_pct: float
    defect_reports_count: int
    active_projects_count: int
    performance_score: int
    risk_level: str
    risk_notes: str

class ProjectSummarySchema(BaseModel):
    id: str
    title: str
    category: str
    status: str
    mp_name: str
    state: str
    district: str
    constituency: str
    sanctioned_amount: float
    contract_amount: float
    actual_expenditure: float
    funds_released: Optional[float] = None
    funds_paid: Optional[float] = None
    start_date: Optional[str] = None
    expected_completion_date: Optional[str] = None
    physical_progress: float
    financial_progress: float
    delay_days: int
    overall_risk_score: int
    risk_level: str
    contractor_id: Optional[str] = None
    contractor_name: Optional[str] = None
    last_inspected_date: Optional[str] = None
    latitude: float
    longitude: float
    baseline_photo_url: Optional[str] = None
    baseline_photo_timestamp: Optional[str] = None
    baseline_photo_officer: Optional[str] = None
    baseline_photo_officer_designation: Optional[str] = None
    baseline_photo_method: Optional[str] = None
    baseline_stage: Optional[str] = None

class ProjectDetailSchema(ProjectSummarySchema):
    description: Optional[str] = None
    mp_house: str
    mandal_block: str
    village: str
    year: str
    implementing_agency: str
    recommended_amount: float
    funds_released: float
    funds_paid: float
    start_date: str
    expected_completion_date: str
    actual_completion_date: Optional[str] = None
    financial_health: int
    physical_health: int
    contract_health: int
    schedule_health: int
    evidence_health: int
    risk_reasons: List[str] = []
    contractor_id: Optional[str] = None
    last_verified_date: Optional[str] = None
    data_source: str
    source_verification_status: str
    timeline_events: List[TimelineEventSchema] = []
    fund_flows: List[FundFlowSchema] = []
    inspections: List[InspectionSchema] = []
    complaints: List[ComplaintSchema] = []
    disputes: List[DisputeSchema] = []
    guarantees: List[GuaranteeSchema] = []
    alerts: List[AlertSchema] = []

class DuplicateCandidateSchema(BaseModel):
    id: str
    project_a_id: str
    project_a_title: str
    project_b_id: str
    project_b_title: str
    similarity_score: int # percentage e.g. 93
    matched_factors: List[str]
    district: str
    status: str # "PENDING_REVIEW", "CONFIRMED_DUPLICATE", "NOT_DUPLICATE"
    decision_notes: Optional[str] = None

class DelayPredictionResponse(BaseModel):
    project_id: str
    project_title: str
    original_completion_date: str
    predicted_completion_date: str
    projected_delay_days: int
    delay_probability_pct: int
    risk_level: str
    contributing_factors: List[str]
    confidence_score: float
    notice: str = "AI prediction — not an official administrative determination."

class AuditLogSchema(BaseModel):
    id: str
    timestamp: str
    actor_role: str
    actor_name: str
    action: str
    entity_id: str
    details: str
    ip_address: str

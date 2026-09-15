from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True) # e.g. "MPLAD-AP-2026-00125"
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, index=True) # e.g. "Community Infrastructure", "Roads & Bridges", "Drinking Water", "Education", "Healthcare", "Sanitation"
    status = Column(String, index=True, default="UNDER PROGRESS") # "RECOMMENDED", "SANCTIONED", "TENDERED", "UNDER PROGRESS", "COMPLETED", "STALLED"
    
    # Administrative & Political details
    mp_name = Column(String, index=True)
    mp_house = Column(String, default="Lok Sabha") # Lok Sabha / Rajya Sabha
    state = Column(String, index=True)
    district = Column(String, index=True)
    constituency = Column(String, index=True)
    mandal_block = Column(String)
    village = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    year = Column(String, default="2025-2026")
    implementing_agency = Column(String)

    # Financial details (in INR)
    recommended_amount = Column(Float, default=0.0)
    sanctioned_amount = Column(Float, default=0.0)
    contract_amount = Column(Float, default=0.0)
    funds_released = Column(Float, default=0.0)
    funds_paid = Column(Float, default=0.0)
    actual_expenditure = Column(Float, default=0.0)
    
    # Progress & Schedule
    physical_progress = Column(Float, default=0.0) # 0 to 100%
    financial_progress = Column(Float, default=0.0) # 0 to 100%
    start_date = Column(String)
    expected_completion_date = Column(String)
    actual_completion_date = Column(String, nullable=True)
    delay_days = Column(Integer, default=0)
    
    # Risk & Health Scores (0 to 100)
    overall_risk_score = Column(Integer, default=15) # 0-100
    risk_level = Column(String, default="NORMAL") # "NORMAL", "WATCH", "HIGH RISK", "CRITICAL"
    financial_health = Column(Integer, default=90)
    physical_health = Column(Integer, default=90)
    contract_health = Column(Integer, default=90)
    schedule_health = Column(Integer, default=90)
    evidence_health = Column(Integer, default=90)
    risk_reasons = Column(JSON, default=list) # List of explanations

    # Contractor Link
    contractor_id = Column(String, ForeignKey("contractors.id"), nullable=True)
    contractor_name = Column(String, nullable=True)

    # Metadata
    last_inspected_date = Column(String, nullable=True)
    last_verified_date = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    data_source = Column(String, default="MPLADS Official Portal (e-SAKSHI API)")
    source_verification_status = Column(String, default="VERIFIED_GOVERNMENT_RECORD")

    # Statutory DPR Baseline Photo Fields (Higher Official Anchor)
    baseline_photo_url = Column(Text, nullable=True)
    baseline_photo_timestamp = Column(String, nullable=True)
    baseline_photo_officer = Column(String, nullable=True)
    baseline_photo_officer_designation = Column(String, nullable=True)
    baseline_photo_method = Column(String, nullable=True)
    baseline_stage = Column(String, nullable=True)

    # Relationships
    contractor = relationship("Contractor", back_populates="projects")
    timeline_events = relationship("TimelineEvent", back_populates="project", cascade="all, delete-orphan")
    fund_flows = relationship("FundFlow", back_populates="project", cascade="all, delete-orphan")
    inspections = relationship("Inspection", back_populates="project", cascade="all, delete-orphan")
    complaints = relationship("Complaint", back_populates="project", cascade="all, delete-orphan")
    disputes = relationship("Dispute", back_populates="project", cascade="all, delete-orphan")
    guarantees = relationship("Guarantee", back_populates="project", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="project", cascade="all, delete-orphan")


class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(String, primary_key=True, index=True) # e.g. "CON-AP-042"
    name = Column(String, index=True, nullable=False)
    registration_no = Column(String, unique=True)
    category_class = Column(String, default="Class 1 Infrastructure")
    contact_person = Column(String)
    contact_phone = Column(String)
    contact_email = Column(String)
    address = Column(String)
    state = Column(String)
    
    # Intelligence Metrics
    total_contracts = Column(Integer, default=0)
    total_contract_value = Column(Float, default=0.0)
    completed_projects = Column(Integer, default=0)
    delayed_projects = Column(Integer, default=0)
    disputed_projects = Column(Integer, default=0)
    terminated_projects = Column(Integer, default=0)
    average_delay_days = Column(Float, default=0.0)
    average_cost_variation_pct = Column(Float, default=0.0)
    defect_reports_count = Column(Integer, default=0)
    active_projects_count = Column(Integer, default=0)
    
    # Performance Risk Indicator
    performance_score = Column(Integer, default=85) # 0 to 100
    risk_level = Column(String, default="LOW RISK") # "LOW RISK", "ATTENTION", "HIGH RISK", "CRITICAL"
    risk_notes = Column(Text, default="Indicators require official verification.")

    projects = relationship("Project", back_populates="contractor")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    stage_name = Column(String) # "MP Recommendation", "Admin Sanction", "Technical Sanction", "Tender", "Contract Award", "Fund Release", "Work Started", "Inspection", "Progress Review", "Completion"
    stage_order = Column(Integer)
    event_date = Column(String)
    authority = Column(String)
    amount = Column(Float, nullable=True)
    document_name = Column(String, nullable=True)
    document_url = Column(String, nullable=True)
    verification_status = Column(String, default="VERIFIED") # "VERIFIED", "PARTIAL", "PENDING", "INCONSISTENT"
    notes = Column(Text, nullable=True)

    project = relationship("Project", back_populates="timeline_events")


class FundFlow(Base):
    __tablename__ = "fund_flows"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    stage = Column(String) # "Funds Available", "Sanctioned", "Contracted", "Released", "Paid", "Expenditure"
    amount = Column(Float)
    transaction_date = Column(String)
    reference_no = Column(String)
    source_agency = Column(String)
    destination_agency = Column(String)
    verification_status = Column(String, default="VERIFIED_GOVERNMENT_RECORD")

    project = relationship("Project", back_populates="fund_flows")


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String, primary_key=True) # e.g. "INSP-2026-0038"
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    officer_name = Column(String)
    officer_designation = Column(String)
    inspection_date = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    gps_matched = Column(Boolean, default=True)
    distance_variance_meters = Column(Float, default=12.0)
    
    physical_progress_observed = Column(Float)
    quality_rating = Column(String) # "Satisfactory", "Good", "Requires Rectification", "Substandard"
    material_observations = Column(Text)
    labour_activity_observations = Column(Text)
    general_remarks = Column(Text)
    defects_reported = Column(Text, nullable=True)
    stalled_status = Column(Boolean, default=False)
    
    photo_urls = Column(JSON, default=list)
    ai_cv_similarity_score = Column(Float, default=0.88)
    ai_progress_discrepancy_pct = Column(Float, default=0.0)
    ai_verification_notes = Column(Text, default="Image verified against milestone profile. Geotag & timestamp match.")
    status = Column(String, default="SUBMITTED") # "SUBMITTED", "VERIFIED", "REJECTED"

    project = relationship("Project", back_populates="inspections")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True) # e.g. "CMP-2026-00482"
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    citizen_name = Column(String, default="Citizen (Identity Protected)")
    citizen_phone = Column(String, nullable=True)
    citizen_email = Column(String, nullable=True)
    category = Column(String) # "Poor quality", "Work stopped", "No work visible", "Incomplete work", "Damage", "Possible duplicate", "Safety issue", "Other"
    description = Column(Text)
    evidence_photo_url = Column(String, nullable=True)
    location = Column(String)
    submission_date = Column(String)
    status = Column(String, default="SUBMITTED") # "SUBMITTED", "AI_CLASSIFIED", "ASSIGNED", "INSPECTION", "INVESTIGATION", "RESOLVED"
    assigned_to = Column(String, default="District Nodal Officer")
    resolution_notes = Column(Text, nullable=True)
    resolved_date = Column(String, nullable=True)

    project = relationship("Project", back_populates="complaints")


class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    dispute_type = Column(String) # "Progress dispute", "Payment dispute", "Quality dispute", "Delay dispute", "Variation claim", "Defect claim"
    claimant = Column(String) # "Contractor", "Citizen", "Officer"
    contractor_claim_progress = Column(Float, nullable=True)
    officer_inspected_progress = Column(Float, nullable=True)
    financial_progress_record = Column(Float, nullable=True)
    ai_evidence_consistency = Column(String, default="Medium")
    claimed_amount = Column(Float, nullable=True)
    description = Column(Text)
    status = Column(String, default="UNDER_INVESTIGATION") # "OPEN", "UNDER_INVESTIGATION", "ESCALATED", "RESOLVED"
    resolution_summary = Column(Text, nullable=True)

    project = relationship("Project", back_populates="disputes")


class Guarantee(Base):
    __tablename__ = "guarantees"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    contractor_name = Column(String)
    guarantee_type = Column(String) # "Performance Guarantee", "Security Deposit", "Defect Liability", "Equipment Warranty"
    bank_or_institution = Column(String)
    amount = Column(Float)
    issue_date = Column(String)
    expiry_date = Column(String)
    days_to_expiry = Column(Integer)
    status = Column(String, default="ACTIVE") # "ACTIVE", "EXPIRING_SOON", "EXPIRED", "INVOKED", "RELEASED"
    action_required = Column(Boolean, default=False)
    defects_logged = Column(Text, nullable=True)
    contractor_response = Column(Text, nullable=True)

    project = relationship("Project", back_populates="guarantees")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True) # e.g. "ALT-2026-019"
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    project_title = Column(String)
    severity = Column(String, default="HIGH") # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    category = Column(String) # "Cost Anomaly", "Schedule Delay", "Fund Mismatch", "Duplicate Work", "Contract Dispute", "Guarantee Alert"
    title = Column(String)
    description = Column(Text)
    observed_data = Column(String)
    expected_data = Column(String)
    difference = Column(String)
    confidence_score = Column(Float, default=0.88)
    recommended_action = Column(Text)
    escalation_level = Column(String, default="Level 3 - District Authority")
    assigned_authority = Column(String, default="District Planning Officer")
    due_days = Column(Integer, default=7)
    status = Column(String, default="OPEN") # "OPEN", "ASSIGNED", "UNDER_REVIEW", "INSPECTION_SCHEDULED", "ACTION_REQUIRED", "RESOLVED"
    created_at = Column(String)
    resolution_notes = Column(Text, nullable=True)
    audit_history = Column(JSON, default=list)

    project = relationship("Project", back_populates="alerts")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True)
    timestamp = Column(String)
    actor_role = Column(String) # "Citizen", "Field Officer", "District Authority", "Higher Authority / Admin", "System AI"
    actor_name = Column(String)
    action = Column(String) # "PROJECT_VIEWED", "INSPECTION_SUBMITTED", "AI_ANOMALY_GENERATED", "ALERT_ESCALATED", "RESOLUTION_RECORDED", "DATA_IMPORTED"
    entity_id = Column(String) # Project ID or Alert ID
    details = Column(Text)
    ip_address = Column(String, default="127.0.0.1")

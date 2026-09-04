from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schema import Inspection, Project, AuditLog
from ..schemas.schemas import InspectionSchema, InspectionCreate
from ..services.cv_verifier import verify_inspection_evidence
from ..services.risk_engine import calculate_project_risk

router = APIRouter(prefix="/inspections", tags=["inspections"])

@router.get("", response_model=List[InspectionSchema])
def list_inspections(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Inspection)
    if project_id:
        query = query.filter(Inspection.project_id == project_id)
    return query.order_by(Inspection.inspection_date.desc()).all()

@router.post("", response_model=InspectionSchema)
def submit_inspection(data: InspectionCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Referenced project not found")

    # Run AI Evidence & GPS verification
    verification = verify_inspection_evidence(
        project_lat=project.latitude,
        project_lon=project.longitude,
        inspection_lat=data.latitude,
        inspection_lon=data.longitude,
        claimed_progress=project.financial_progress,
        observed_progress=data.physical_progress_observed,
        photo_urls=data.photo_urls
    )

    insp_id = f"INSP-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    inspection = Inspection(
        id=insp_id,
        project_id=data.project_id,
        officer_name=data.officer_name,
        officer_designation=data.officer_designation,
        inspection_date=datetime.utcnow().strftime("%Y-%m-%d"),
        latitude=data.latitude,
        longitude=data.longitude,
        gps_matched=verification["gps_matched"],
        distance_variance_meters=verification["distance_variance_meters"],
        physical_progress_observed=data.physical_progress_observed,
        quality_rating=data.quality_rating,
        material_observations=data.material_observations,
        labour_activity_observations=data.labour_activity_observations,
        general_remarks=data.general_remarks,
        defects_reported=data.defects_reported,
        stalled_status=data.stalled_status,
        photo_urls=data.photo_urls,
        ai_cv_similarity_score=verification["cv_similarity_score"],
        ai_progress_discrepancy_pct=verification["progress_discrepancy_pct"],
        ai_verification_notes=verification["verification_notes"],
        status="VERIFIED" if verification["gps_matched"] else "REQUIRES_VERIFICATION"
    )
    db.add(inspection)

    # Update project state
    project.physical_progress = data.physical_progress_observed
    project.last_inspected_date = datetime.utcnow().strftime("%Y-%m-%d")
    if data.stalled_status:
        project.status = "STALLED"
    elif data.physical_progress_observed >= 100.0:
        project.status = "COMPLETED"

    # Recalculate Risk
    risk_result = calculate_project_risk(
        sanctioned_amount=project.sanctioned_amount,
        actual_expenditure=project.actual_expenditure,
        contract_amount=project.contract_amount,
        delay_days=project.delay_days,
        physical_progress=project.physical_progress,
        financial_progress=project.financial_progress,
        complaint_count=len(project.complaints or []),
        has_disputes=len(project.disputes or []) > 0
    )
    project.overall_risk_score = risk_result["overall_risk_score"]
    project.risk_level = risk_result["risk_level"]
    project.financial_health = risk_result["financial_health"]
    project.physical_health = risk_result["physical_health"]
    project.contract_health = risk_result["contract_health"]
    project.schedule_health = risk_result["schedule_health"]
    project.evidence_health = risk_result["evidence_health"]
    project.risk_reasons = risk_result["risk_reasons"]

    # Audit log
    audit_entry = AuditLog(
        id=f"LOG-{datetime.utcnow().strftime('%H%M%S')}-{project.id[-5:]}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        actor_role="Field Officer",
        actor_name=data.officer_name,
        action="INSPECTION_SUBMITTED",
        entity_id=insp_id,
        details=f"Submitted physical progress: {data.physical_progress_observed}%. Geotag match: {verification['gps_matched']} ({verification['distance_variance_meters']}m).",
        ip_address="127.0.0.1"
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(inspection)
    return inspection

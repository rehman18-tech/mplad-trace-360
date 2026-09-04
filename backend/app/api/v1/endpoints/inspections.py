from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Inspection, AuditLog, Project
from ....schemas.schemas import InspectionSchema, InspectionCreate
import datetime

router = APIRouter(prefix="/inspections", tags=["inspections-v1"])

@router.get("", response_model=List[InspectionSchema])
def list_inspections_v1(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Inspection)
    if project_id:
        q = q.filter(Inspection.project_id == project_id)
    return q.all()

@router.post("", response_model=InspectionSchema)
def submit_inspection_v1(payload: InspectionCreate, db: Session = Depends(get_db)):
    insp_id = f"INSP-V1-{int(datetime.datetime.now().timestamp())}"
    inspection = Inspection(
        id=insp_id,
        project_id=payload.project_id,
        officer_name=payload.officer_name,
        officer_designation=payload.officer_designation,
        inspection_date=payload.inspection_date or datetime.date.today().strftime("%Y-%m-%d"),
        stage_observed=payload.stage_observed,
        physical_progress_observed=payload.physical_progress_observed,
        quality_rating=payload.quality_rating,
        gps_latitude=payload.gps_latitude,
        gps_longitude=payload.gps_longitude,
        gps_accuracy_meters=payload.gps_accuracy_meters,
        geofence_verified=payload.geofence_verified,
        remarks=payload.remarks,
        verification_status="PENDING_REVIEW",
        photo_urls="[]"
    )
    db.add(inspection)
    p = db.query(Project).filter(Project.id == payload.project_id).first()
    if p:
        p.physical_progress = payload.physical_progress_observed
        p.last_inspected_at = datetime.datetime.now().strftime("%Y-%m-%d")

    audit = AuditLog(
        entity_type="INSPECTION",
        entity_id=insp_id,
        action="SUBMITTED",
        actor=payload.officer_name,
        details=f"Inspection logged for {payload.project_id} at {payload.physical_progress_observed}% observed progress."
    )
    db.add(audit)
    db.commit()
    db.refresh(inspection)
    return inspection

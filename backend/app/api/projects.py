import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schema import Project, TimelineEvent, FundFlow, Inspection, Complaint, Dispute, Guarantee, Alert, AuditLog
from ..schemas.schemas import ProjectSummarySchema, ProjectDetailSchema, TimelineEventSchema, FundFlowSchema, InspectionSchema

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("", response_model=List[ProjectSummarySchema])
def list_projects(
    search: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    mp_name: Optional[str] = None,
    contractor_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Project.id.ilike(s)) |
            (Project.title.ilike(s)) |
            (Project.village.ilike(s)) |
            (Project.district.ilike(s)) |
            (Project.contractor_name.ilike(s)) |
            (Project.mp_name.ilike(s))
        )
    if state:
        query = query.filter(Project.state == state)
    if district:
        query = query.filter(Project.district == district)
    if category:
        query = query.filter(Project.category == category)
    if status:
        query = query.filter(Project.status == status)
    if risk_level:
        query = query.filter(Project.risk_level == risk_level)
    if mp_name:
        query = query.filter(Project.mp_name.ilike(f"%{mp_name}%"))
    if contractor_id:
        query = query.filter(Project.contractor_id == contractor_id)

    return query.all()

@router.get("/{project_id}", response_model=ProjectDetailSchema)
def get_project_detail(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project record not found in MPLAD-TRACE 360 repository")
    return project

@router.get("/{project_id}/timeline", response_model=List[TimelineEventSchema])
def get_project_timeline(project_id: str, db: Session = Depends(get_db)):
    events = db.query(TimelineEvent).filter(TimelineEvent.project_id == project_id).order_by(TimelineEvent.stage_order).all()
    return events

@router.get("/{project_id}/funds", response_model=List[FundFlowSchema])
def get_project_funds(project_id: str, db: Session = Depends(get_db)):
    funds = db.query(FundFlow).filter(FundFlow.project_id == project_id).all()
    return funds

@router.get("/{project_id}/inspections", response_model=List[InspectionSchema])
def get_project_inspections(project_id: str, db: Session = Depends(get_db)):
    inspections = db.query(Inspection).filter(Inspection.project_id == project_id).order_by(Inspection.inspection_date.desc()).all()
    return inspections

@router.post("")
async def create_project(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    audit_meta = data.get("auditMeta", {})
    now = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    proj_id = data.get("id") or f"MPLAD-IND-2026-{int(datetime.datetime.utcnow().timestamp())}"
    
    new_proj = Project(
        id=proj_id,
        title=data.get("title", "Untitled Sanctioned Project"),
        category=data.get("category", "Community Infrastructure"),
        status=data.get("status", "SANCTIONED"),
        mp_name=data.get("mp_name", "Member of Parliament"),
        mp_house=data.get("mp_house", "Lok Sabha"),
        state=data.get("state", "Andhra Pradesh"),
        district=data.get("district", "Visakhapatnam"),
        constituency=data.get("constituency", "Visakhapatnam"),
        mandal_block=data.get("mandal_block", "Default Block"),
        village=data.get("village", "Default Village"),
        latitude=float(data.get("latitude", 17.9312)),
        longitude=float(data.get("longitude", 83.4248)),
        year=data.get("year", "2025-2026"),
        implementing_agency=data.get("implementing_agency", audit_meta.get("department_name", "State Engineering Division")),
        recommended_amount=float(data.get("recommended_amount", 2500000)),
        sanctioned_amount=float(data.get("sanctioned_amount", 2500000)),
        contract_amount=float(data.get("contract_amount", 2500000)),
        funds_released=float(data.get("funds_released", 1250000)),
        funds_paid=float(data.get("funds_paid", 0)),
        actual_expenditure=float(data.get("actual_expenditure", 0)),
        physical_progress=float(data.get("physical_progress", 0)),
        financial_progress=float(data.get("financial_progress", 0)),
        start_date=data.get("start_date", now[:10]),
        expected_completion_date=data.get("expected_completion_date", "2026-12-31"),
        delay_days=0,
        overall_risk_score=15,
        risk_level="NORMAL",
        data_source=f"MoSPI Higher Authority Portal • Dept: {audit_meta.get('department_name', 'State Admin')}"
    )
    db.add(new_proj)
    
    audit_entry = AuditLog(
        id=f"LOG-INS-{int(datetime.datetime.utcnow().timestamp())}",
        timestamp=now,
        actor_role=audit_meta.get("officer_role", "DISTRICT_AUTHORITY"),
        actor_name=audit_meta.get("officer_name", "Higher Official"),
        action="PROJECT_INSERTED_BY_HIGHER_OFFICIAL",
        entity_id=proj_id,
        details=f"New project inserted for Dept '{audit_meta.get('department_name')}'. Sanction: ₹{new_proj.sanctioned_amount:,.2f}. Reason: {audit_meta.get('reason')}",
        ip_address="10.42.0.1"
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(new_proj)
    return {"status": "success", "project": proj_id}

@router.patch("/{project_id}")
async def update_project(project_id: str, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    updates = data.get("updates", {})
    audit_meta = data.get("auditMeta", {})
    now = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    for key, value in updates.items():
        if hasattr(project, key):
            setattr(project, key, value)
            
    project.data_source = f"MoSPI Higher Authority Portal • Dept: {audit_meta.get('department_name', 'State Admin')}"
    
    audit_entry = AuditLog(
        id=f"LOG-UPD-{int(datetime.datetime.utcnow().timestamp())}",
        timestamp=now,
        actor_role=audit_meta.get("officer_role", "DISTRICT_AUTHORITY"),
        actor_name=audit_meta.get("officer_name", "Higher Official"),
        action="PROJECT_UPDATED_BY_HIGHER_OFFICIAL",
        entity_id=project_id,
        details=f"Physical progress updated to {project.physical_progress}% by Dept '{audit_meta.get('department_name')}'. Reason: {audit_meta.get('modification_reason')}. Ref: {audit_meta.get('order_reference_no')}",
        ip_address="10.42.0.1"
    )
    db.add(audit_entry)
    db.commit()
    return {"status": "success", "project": project_id}

@router.post("/{project_id}/baseline")
async def attach_baseline(project_id: str, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    baseline_photo_url = data.get("baseline_photo_url", "")
    audit_meta = data.get("auditMeta", {})
    now = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.baseline_photo_url = baseline_photo_url
    project.baseline_photo_timestamp = now
    project.baseline_photo_officer = audit_meta.get("officer_name", "Higher Official")
    project.baseline_photo_officer_designation = audit_meta.get("officer_role", "District Authority")
    project.baseline_photo_method = audit_meta.get("method", "EXIF_GPS_VERIFIED")
    project.baseline_stage = audit_meta.get("baseline_stage", "Statutory DPR Ground-Zero Baseline (Geotag Verified)")

    audit_entry = AuditLog(
        id=f"LOG-BASE-{int(datetime.datetime.utcnow().timestamp())}",
        timestamp=now,
        actor_role=audit_meta.get("officer_role", "DISTRICT_AUTHORITY"),
        actor_name=audit_meta.get("officer_name", "Higher Official"),
        action="STATUTORY_BASELINE_PHOTO_ATTACHED_BY_HIGHER_OFFICIAL",
        entity_id=project_id,
        details=f"Official baseline photo anchored for {project_id}. Method: {project.baseline_photo_method}.",
        ip_address="10.42.0.1"
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(project)
    return {"status": "success", "baseline_photo_url": project.baseline_photo_url}



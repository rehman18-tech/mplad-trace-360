from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Project, TimelineEvent, FundFlow, Inspection
from ....schemas.schemas import ProjectSummarySchema, ProjectDetailSchema, TimelineEventSchema, FundFlowSchema, InspectionSchema

router = APIRouter(prefix="/projects", tags=["projects-v1"])

@router.get("", response_model=List[ProjectSummarySchema])
def list_projects_v1(
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
def get_project_detail_v1(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project record not found in MPLAD-TRACE 360 repository")
    return project

@router.get("/{project_id}/timeline", response_model=List[TimelineEventSchema])
def get_project_timeline_v1(project_id: str, db: Session = Depends(get_db)):
    return db.query(TimelineEvent).filter(TimelineEvent.project_id == project_id).order_by(TimelineEvent.stage_order).all()

@router.get("/{project_id}/funds", response_model=List[FundFlowSchema])
def get_project_funds_v1(project_id: str, db: Session = Depends(get_db)):
    return db.query(FundFlow).filter(FundFlow.project_id == project_id).all()

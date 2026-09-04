from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Complaint, AuditLog
from ....schemas.schemas import ComplaintSchema, ComplaintCreate
import datetime

router = APIRouter(prefix="/complaints", tags=["complaints-v1"])

@router.get("", response_model=List[ComplaintSchema])
def list_complaints_v1(project_id: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Complaint)
    if project_id:
        q = q.filter(Complaint.project_id == project_id)
    if status:
        q = q.filter(Complaint.status == status)
    return q.all()

@router.post("", response_model=ComplaintSchema)
def submit_complaint_v1(payload: ComplaintCreate, db: Session = Depends(get_db)):
    comp_id = f"GRV-V1-{int(datetime.datetime.now().timestamp())}"
    complaint = Complaint(
        id=comp_id,
        project_id=payload.project_id,
        citizen_name=payload.citizen_name or "Concerned Citizen",
        category=payload.category,
        description=payload.description,
        status="UNDER_INVESTIGATION",
        created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(complaint)
    audit = AuditLog(
        entity_type="COMPLAINT",
        entity_id=comp_id,
        action="LODGED",
        actor=payload.citizen_name or "Citizen",
        details=f"Public grievance lodged for project {payload.project_id}"
    )
    db.add(audit)
    db.commit()
    db.refresh(complaint)
    return complaint

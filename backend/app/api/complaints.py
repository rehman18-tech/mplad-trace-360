from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schema import Complaint, Project, AuditLog
from ..schemas.schemas import ComplaintSchema, ComplaintCreate

router = APIRouter(prefix="/complaints", tags=["complaints"])

@router.get("", response_model=List[ComplaintSchema])
def list_complaints(project_id: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Complaint)
    if project_id:
        query = query.filter(Complaint.project_id == project_id)
    if status:
        query = query.filter(Complaint.status == status)
    return query.order_by(Complaint.submission_date.desc()).all()

@router.post("", response_model=ComplaintSchema)
def submit_complaint(data: ComplaintCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    import random
    cmp_num = random.randint(10000, 99999)
    cmp_id = f"CMP-2026-{cmp_num}"

    complaint = Complaint(
        id=cmp_id,
        project_id=data.project_id,
        citizen_name=data.citizen_name,
        citizen_phone=data.citizen_phone,
        citizen_email=data.citizen_email,
        category=data.category,
        description=data.description,
        evidence_photo_url=data.evidence_photo_url,
        location=data.location,
        submission_date=datetime.utcnow().strftime("%Y-%m-%d"),
        status="AI_CLASSIFIED",
        assigned_to="District Grievance Redressal Nodal Officer",
        resolution_notes="Grievance received and auto-routed for field inspection."
    )
    db.add(complaint)

    # Audit log
    audit_entry = AuditLog(
        id=f"LOG-{datetime.utcnow().strftime('%H%M%S')}-{cmp_id[-5:]}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        actor_role="Citizen",
        actor_name=data.citizen_name,
        action="COMPLAINT_FILED",
        entity_id=cmp_id,
        details=f"Citizen filed complaint for {data.project_id} under category '{data.category}'.",
        ip_address="127.0.0.1"
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(complaint)
    return complaint

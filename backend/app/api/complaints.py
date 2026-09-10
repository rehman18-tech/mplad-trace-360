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

    # Automated Defect Liability & Contractor Guarantee Escalation
    # If citizen reports quality failure, structural collapse, or damage, auto-escalate against the contractor
    is_defect_report = any(w in data.category.lower() or w in data.description.lower() for w in ['damage', 'poor quality', 'collapse', 'crack', 'stalled', 'incomplete'])
    if is_defect_report and project.contractor_name:
        from ..models.schema import Alert, Guarantee
        alert_id = f"ALT-DEFECT-{cmp_id[-5:]}"
        
        # Check active guarantee
        guarantee = db.query(Guarantee).filter(Guarantee.project_id == project.id).first()
        pbg_info = f"PBG ₹{guarantee.amount:,.0f} ({guarantee.bank_or_institution})" if guarantee else "5% Statutory Security Deposit"
        if guarantee:
            guarantee.action_required = True
            guarantee.defects_logged = f"Citizen Grievance #{cmp_id}: {data.description[:120]}"

        defect_alert = Alert(
            id=alert_id,
            project_id=project.id,
            project_title=project.title,
            severity="CRITICAL",
            category="Guarantee Alert",
            title=f"Statutory Defect Notice: {project.contractor_name}",
            description=f"Automated grievance #{cmp_id} filed with photographic evidence. Defect liability invoked against executing agency {project.contractor_name}.",
            observed_data=f"Reported issue: '{data.category}' at {data.location}. Photo evidence attached.",
            expected_data="Defect-free structural handover conforming to CPWD/MoSPI Clause 4.2",
            difference=f"Breach of statutory warranty. {pbg_info} placed on hold.",
            confidence_score=0.94,
            recommended_action=f"Dispatch Executive Engineer for immediate joint audit. Hold release of {pbg_info} in escrow.",
            escalation_level="Level 4 - District Collector & Chief Vigilance Officer",
            assigned_authority="District Collector / Superintending Engineer PWD",
            due_days=3,
            status="ACTION_REQUIRED",
            created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            audit_history=[{
                "time": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
                "action": f"Auto-escalated to District Collector under CPWD Clause 4.2 Defect Liability. Contractor: {project.contractor_name}",
                "actor": "AI Fiscal Surveillance Engine"
            }]
        )
        db.add(defect_alert)
        complaint.assigned_to = "District Collector & Chief Vigilance Officer"
        complaint.resolution_notes = f"Escalated to Higher Authority. Defect Notice issued to contractor {project.contractor_name}. Bank guarantee tagged."

    # Audit log
    audit_entry = AuditLog(
        id=f"LOG-{datetime.utcnow().strftime('%H%M%S')}-{cmp_id[-5:]}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        actor_role="Citizen",
        actor_name=data.citizen_name,
        action="COMPLAINT_FILED",
        entity_id=cmp_id,
        details=f"Citizen filed grievance for {data.project_id} (Contractor: {project.contractor_name or 'N/A'}) under category '{data.category}'.",
        ip_address="127.0.0.1"
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(complaint)
    return complaint

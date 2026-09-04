from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schema import Project, Contractor, AuditLog
from ..schemas.schemas import DelayPredictionResponse, DuplicateCandidateSchema
from ..services.risk_engine import calculate_project_risk
from ..services.duplicate_engine import detect_duplicates
from ..services.delay_predictor import predict_completion_and_delay

router = APIRouter(prefix="/ai", tags=["ai"])

# In-memory store for duplicate decisions during session
DUPLICATE_DECISIONS: Dict[str, Dict[str, Any]] = {}

class DuplicateDecisionRequest(BaseModel):
    candidate_id: str
    decision: str # "CONFIRMED_DUPLICATE", "NOT_DUPLICATE", "NEEDS_REVIEW"
    notes: Optional[str] = None
    officer_name: str = "District Planning Officer"

@router.post("/analyze-project/{project_id}")
def analyze_project_risk(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    res = calculate_project_risk(
        sanctioned_amount=project.sanctioned_amount,
        actual_expenditure=project.actual_expenditure,
        contract_amount=project.contract_amount,
        delay_days=project.delay_days,
        physical_progress=project.physical_progress,
        financial_progress=project.financial_progress,
        complaint_count=len(project.complaints or []),
        has_disputes=len(project.disputes or []) > 0
    )
    return res

@router.get("/detect-duplicates", response_model=List[DuplicateCandidateSchema])
def get_duplicate_candidates(district: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Project)
    if district:
        query = query.filter(Project.district == district)
    projects = query.all()

    # Convert to dicts
    proj_dicts = [
        {
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "district": p.district,
            "mandal_block": p.mandal_block,
            "village": p.village,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "sanctioned_amount": p.sanctioned_amount
        }
        for p in projects
    ]

    candidates = detect_duplicates(proj_dicts)
    
    # Inject any decisions made
    for c in candidates:
        if c["id"] in DUPLICATE_DECISIONS:
            c["status"] = DUPLICATE_DECISIONS[c["id"]]["decision"]
            c["decision_notes"] = DUPLICATE_DECISIONS[c["id"]]["notes"]

    return candidates

@router.post("/duplicate-decision")
def record_duplicate_decision(req: DuplicateDecisionRequest, db: Session = Depends(get_db)):
    DUPLICATE_DECISIONS[req.candidate_id] = {
        "decision": req.decision,
        "notes": req.notes,
        "officer": req.officer_name
    }

    # Audit log
    audit_entry = AuditLog(
        id=f"LOG-DUP-{req.candidate_id[-6:]}",
        timestamp="2026-02-28 10:30",
        actor_role="District Authority",
        actor_name=req.officer_name,
        action="DUPLICATE_REVIEW_DECISION",
        entity_id=req.candidate_id,
        details=f"Decision: {req.decision}. Notes: {req.notes or 'No remarks'}",
        ip_address="127.0.0.1"
    )
    db.add(audit_entry)
    db.commit()

    return {"status": "SUCCESS", "candidate_id": req.candidate_id, "decision": req.decision}

@router.get("/predict-delay/{project_id}", response_model=DelayPredictionResponse)
def get_delay_prediction(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    con_delay = 25.0
    if project.contractor:
        con_delay = project.contractor.average_delay_days

    prediction = predict_completion_and_delay(
        project_id=project.id,
        title=project.title,
        start_date_str=project.start_date or "2025-06-01",
        original_completion_date_str=project.expected_completion_date or "2026-01-31",
        physical_progress=project.physical_progress,
        financial_progress=project.financial_progress,
        delay_days=project.delay_days,
        contractor_avg_delay=con_delay,
        has_disputes=len(project.disputes or []) > 0
    )
    return prediction

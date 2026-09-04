from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Project
from ....ai.risk_engine import assess_project_risk
from ....ai.anomaly_service import detect_anomalies
from ....ai.duplicate_service import detect_duplicates
from ....ai.delay_prediction import predict_project_delay
from ....ai.document_service import verify_document_completeness
from ....ai.image_verification import verify_inspection_photo

router = APIRouter(prefix="/ai", tags=["ai-v1"])

class RiskAssessmentRequest(BaseModel):
    project_id: str

class AnomalyRequest(BaseModel):
    sanctioned_amount: float
    actual_expenditure: float
    physical_progress: float
    financial_progress: float
    delay_days: int = 0

class DelayPredictionRequest(BaseModel):
    target_completion_date: str
    physical_progress: float
    elapsed_days: int = 120

class ImageVerifyRequest(BaseModel):
    project_id: str
    photo_lat: float
    photo_lon: float
    claimed_stage: str
    ai_detected_stage: Optional[str] = None

@router.post("/risk-assessment")
def assess_risk(req: RiskAssessmentRequest, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == req.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    result = assess_project_risk(
        sanctioned_amount=project.sanctioned_amount,
        actual_expenditure=project.actual_expenditure,
        contract_amount=project.contract_amount,
        delay_days=project.delay_days,
        physical_progress=project.physical_progress,
        financial_progress=project.financial_progress,
        contractor_delayed_pct=40.0 if project.contractor and project.contractor.risk_level in ["HIGH RISK", "CRITICAL"] else 10.0,
        has_disputes=len(project.disputes) > 0,
        complaint_count=len(project.complaints),
        document_verified=True
    )
    return result

@router.post("/anomaly-detection")
def run_anomaly_detection(req: AnomalyRequest):
    return detect_anomalies(
        sanctioned_amount=req.sanctioned_amount,
        actual_expenditure=req.actual_expenditure,
        physical_progress=req.physical_progress,
        financial_progress=req.financial_progress,
        delay_days=req.delay_days
    )

@router.post("/duplicate-check")
def check_duplicates(project_id: str, db: Session = Depends(get_db)):
    target = db.query(Project).filter(Project.id == project_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Project not found")

    candidates = db.query(Project).filter(Project.state == target.state).all()
    candidate_dicts = [
        {"id": c.id, "title": c.title, "latitude": c.latitude, "longitude": c.longitude}
        for c in candidates
    ]
    target_dict = {"id": target.id, "title": target.title, "latitude": target.latitude, "longitude": target.longitude}
    return detect_duplicates(target_dict, candidate_dicts)

@router.post("/delay-prediction")
def predict_delay(req: DelayPredictionRequest):
    return predict_project_delay(
        target_completion_date_str=req.target_completion_date,
        physical_progress=req.physical_progress,
        elapsed_days=req.elapsed_days
    )

@router.post("/image-verify")
def verify_image(req: ImageVerifyRequest, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == req.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return verify_inspection_photo(
        site_lat=project.latitude,
        site_lon=project.longitude,
        photo_lat=req.photo_lat,
        photo_lon=req.photo_lon,
        claimed_stage=req.claimed_stage,
        ai_detected_stage=req.ai_detected_stage
    )

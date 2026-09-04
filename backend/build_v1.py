import pathlib

def run():
    files = {}
    
    files['backend/app/auth/dependencies.py'] = """from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any, List
from .jwt import decode_access_token

security = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Dict[str, Any]:
    if not credentials:
        return {
            "sub": "demo_citizen",
            "name": "Public Citizen",
            "role": "citizen",
            "is_authenticated": False
        }
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload["is_authenticated"] = True
    return payload

def require_roles(allowed_roles: List[str]):
    def role_checker(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_role = user.get("role", "citizen")
        if user_role not in allowed_roles and not user.get("is_super_admin", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {', '.join(allowed_roles)}"
            )
        return user
    return role_checker
"""

    files['backend/app/ai/risk_engine.py'] = """from typing import Dict, Any, List
from ..services.risk_engine import calculate_project_risk as legacy_calculate

def assess_project_risk(
    sanctioned_amount: float,
    actual_expenditure: float,
    contract_amount: float,
    delay_days: int,
    physical_progress: float,
    financial_progress: float,
    contractor_delayed_pct: float = 0.0,
    has_disputes: bool = False,
    complaint_count: int = 0,
    document_verified: bool = True
) -> Dict[str, Any]:
    res = legacy_calculate(
        sanctioned_amount=sanctioned_amount,
        actual_expenditure=actual_expenditure,
        contract_amount=contract_amount,
        delay_days=delay_days,
        physical_progress=physical_progress,
        financial_progress=financial_progress,
        contractor_delayed_pct=contractor_delayed_pct,
        has_disputes=has_disputes,
        complaint_count=complaint_count,
        document_verified=document_verified
    )
    score = float(res["overall_risk_score"])
    if score >= 75:
        rec = "Conduct immediate joint physical audit by Executive Engineer and District Collector representative within 7 days."
        confidence = 0.94
    elif score >= 50:
        rec = "Depute Assistant Engineer for milestone reconciliation and issue Performance Risk Notice to executing agency."
        confidence = 0.89
    elif score >= 30:
        rec = "Maintain periodic monthly review and ensure contractor expedites pending physical milestones."
        confidence = 0.85
    else:
        rec = "Work execution conforms to sanctioned schedule. Continue standard bi-monthly measurement reporting."
        confidence = 0.96

    return {
        "signals": res["risk_reasons"],
        "score": score,
        "confidence": confidence,
        "recommendation": rec,
        "risk_level": res["risk_level"],
        "breakdown": {
            "financial_health": res["financial_health"],
            "physical_health": res["physical_health"],
            "contract_health": res["contract_health"],
            "schedule_health": res["schedule_health"],
            "evidence_health": res["evidence_health"]
        }
    }
"""

    files['backend/app/ai/anomaly_service.py'] = """from typing import Dict, Any, List

def detect_anomalies(
    sanctioned_amount: float,
    actual_expenditure: float,
    physical_progress: float,
    financial_progress: float,
    delay_days: int
) -> Dict[str, Any]:
    signals = []
    anomaly_score = 0.0

    divergence = financial_progress - physical_progress
    if divergence > 20:
        severity = "High" if divergence > 35 else "Moderate"
        signals.append({
            "type": "PROGRESS_DIVERGENCE",
            "indicator": "Performance Risk Indicator",
            "severity": severity,
            "message": f"Fund utilization ({financial_progress}%) exceeds verified physical progress ({physical_progress}%) by {round(divergence, 1)}%",
            "requires_action": "Physical MB Verification"
        })
        anomaly_score += 35.0 if divergence > 35 else 20.0

    if actual_expenditure > sanctioned_amount * 1.05:
        excess = actual_expenditure - sanctioned_amount
        signals.append({
            "type": "COST_OVERRUN",
            "indicator": "Potential Cost Discrepancy / Requires Verification",
            "severity": "High",
            "message": f"Actual expenditure exceeds administrative sanction by ₹{round(excess/100000, 2)} Lakhs",
            "requires_action": "Revised Administrative Approval Check"
        })
        anomaly_score += 30.0

    if delay_days > 60 and physical_progress < 50:
        signals.append({
            "type": "CHRONIC_DELAY",
            "indicator": "Execution Stagnation / Requires Verification",
            "severity": "High",
            "message": f"Project stalled at {physical_progress}% progress with {delay_days} days schedule overrun",
            "requires_action": "Contractor Default Notice Evaluation"
        })
        anomaly_score += 25.0

    score = min(100.0, anomaly_score)
    confidence = 0.91 if len(signals) > 0 else 0.97
    
    if score >= 60:
        rec = "Issue verification notice to Implementing Agency to provide physical MB extracts and audit expenditure vouchers within 14 days."
    elif score >= 25:
        rec = "Flag for quarterly monitoring committee review and schedule field engineer spot inspection."
    else:
        rec = "Financial and physical progress align within standard public works threshold parameters."

    return {
        "signals": signals,
        "score": round(score, 1),
        "confidence": confidence,
        "recommendation": rec
    }
"""

    files['backend/app/ai/duplicate_service.py'] = """import math
from typing import Dict, Any, List

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def token_similarity(title1: str, title2: str) -> float:
    t1 = set(w.lower() for w in title1.split() if len(w) > 2)
    t2 = set(w.lower() for w in title2.split() if len(w) > 2)
    if not t1 or not t2:
        return 0.0
    return len(t1 & t2) / len(t1 | t2)

def detect_duplicates(target_project: Dict[str, Any], candidate_projects: List[Dict[str, Any]]) -> Dict[str, Any]:
    signals = []
    max_duplicate_score = 0.0
    matches = []

    t_lat = target_project.get("latitude")
    t_lon = target_project.get("longitude")
    t_title = target_project.get("title", "")
    t_id = target_project.get("id")

    for cand in candidate_projects:
        c_id = cand.get("id")
        if c_id == t_id:
            continue
        c_lat = cand.get("latitude")
        c_lon = cand.get("longitude")
        c_title = cand.get("title", "")

        dist_m = 999999
        if t_lat and t_lon and c_lat and c_lon:
            dist_m = haversine_distance(t_lat, t_lon, c_lat, c_lon)

        text_sim = token_similarity(t_title, c_title)

        if dist_m <= 300 and text_sim > 0.4:
            overlap_score = min(100.0, (text_sim * 60) + (max(0, 300 - dist_m) / 300 * 40))
            max_duplicate_score = max(max_duplicate_score, overlap_score)
            matches.append({
                "matched_project_id": c_id,
                "matched_title": c_title,
                "distance_meters": round(dist_m, 1),
                "text_similarity_score": round(text_sim * 100, 1)
            })
            signals.append(
                f"Potential Geospatial Duplicate / Requires Verification: Project '{c_title}' (ID: {c_id}) is situated {round(dist_m)}m away with {round(text_sim*100)}% descriptive alignment."
            )

    confidence = 0.93 if len(matches) > 0 else 0.98
    if max_duplicate_score > 60:
        rec = "Conduct GIS cadastral cross-verification and convene District Vigilance review to ensure non-duplication of MPLADS/State infrastructure fund allocations."
    elif max_duplicate_score > 30:
        rec = "Review GPS geo-coordinates against municipal asset register before approving next financial tranche."
    else:
        rec = "No proximate duplicate work recommendations detected within 500m geofence radius."

    return {
        "signals": signals,
        "score": round(max_duplicate_score, 1),
        "confidence": confidence,
        "recommendation": rec,
        "matched_works": matches
    }
"""

    files['backend/app/ai/delay_prediction.py'] = """from typing import Dict, Any, List
from datetime import datetime, timedelta

def predict_project_delay(
    target_completion_date_str: str,
    physical_progress: float,
    elapsed_days: int,
    contractor_speed_index: float = 1.0,
    past_district_weather_factor: float = 1.0
) -> Dict[str, Any]:
    signals = []
    if physical_progress <= 0:
        actual_daily_progress = 0.05
    else:
        actual_daily_progress = physical_progress / max(1, elapsed_days)

    remaining_progress = max(0.0, 100.0 - physical_progress)
    adjusted_daily_progress = actual_daily_progress * contractor_speed_index * past_district_weather_factor
    projected_days_needed = remaining_progress / max(0.01, adjusted_daily_progress)

    try:
        target_date = datetime.strptime(target_completion_date_str, "%Y-%m-%d")
    except Exception:
        target_date = datetime.now() + timedelta(days=90)

    now = datetime.now()
    days_left_to_target = (target_date - now).days
    slippage_days = int(projected_days_needed - max(0, days_left_to_target))
    
    if slippage_days > 60:
        delay_score = min(100.0, 50.0 + (slippage_days / 3.0))
        signals.append(f"High risk of schedule slippage: Forecast indicates {slippage_days} days delay beyond contractual completion.")
    elif slippage_days > 15:
        delay_score = min(70.0, 30.0 + slippage_days)
        signals.append(f"Moderate delay predicted: Projected finish date requires additional {slippage_days} days at current execution velocity.")
    elif slippage_days > 0:
        delay_score = 25.0
        signals.append(f"Marginal schedule variance of {slippage_days} days anticipated.")
    else:
        delay_score = 5.0
        signals.append("Project milestone velocity conforms to completion timetable.")

    projected_finish = now + timedelta(days=int(projected_days_needed))
    confidence = 0.88

    if delay_score >= 60:
        rec = "Convene tripartite review with Contractor and Superintending Engineer; mandate deployment of additional shifts or machinery."
    elif delay_score >= 30:
        rec = "Issue progress advisory letter requiring revised PERT/CPM chart submission within 10 working days."
    else:
        rec = "Maintain periodic monthly monitoring and verify intermediate milestone billing."

    return {
        "signals": signals,
        "score": round(delay_score, 1),
        "confidence": confidence,
        "recommendation": rec,
        "predicted_slippage_days": max(0, slippage_days),
        "projected_completion_date": projected_finish.strftime("%Y-%m-%d")
    }
"""

    files['backend/app/ai/document_service.py'] = """from typing import Dict, Any, List

def verify_document_completeness(
    documents: List[Dict[str, Any]],
    physical_progress: float,
    financial_progress: float
) -> Dict[str, Any]:
    mandatory_docs = ["Administrative Approval", "Technical Sanction", "Work Order", "Measurement Book"]
    if physical_progress >= 100:
        mandatory_docs.extend(["Completion Certificate", "Utilization Certificate"])

    present_types = {d.get("doc_type", "").lower() for d in documents}
    missing = [doc for doc in mandatory_docs if not any(doc.lower() in p for p in present_types)]

    signals = []
    if missing:
        for m in missing:
            signals.append(f"Statutory Document Missing: {m} is not uploaded in system repository.")
        risk_score = min(80.0, len(missing) * 20.0)
    else:
        signals.append("All requisite statutory and technical approvals are cataloged.")
        risk_score = 0.0

    confidence = 0.95
    if risk_score > 40:
        rec = f"Withhold subsequent financial tranche disbursements until missing records ({', '.join(missing)}) are reconciled and digitally signed."
    else:
        rec = "Statutory documentation meets CVC/MPLADS compliance standards."

    return {
        "signals": signals,
        "score": round(risk_score, 1),
        "confidence": confidence,
        "recommendation": rec,
        "missing_documents": missing,
        "total_documents_cataloged": len(documents)
    }
"""

    files['backend/app/ai/image_verification.py'] = """import math
from typing import Dict, Any, List

def verify_inspection_photo(
    site_lat: float,
    site_lon: float,
    photo_lat: float,
    photo_lon: float,
    claimed_stage: str,
    ai_detected_stage: str = None
) -> Dict[str, Any]:
    dlat = math.radians(photo_lat - site_lat)
    dlon = math.radians(photo_lon - site_lon)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(site_lat)) * math.cos(math.radians(photo_lat)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    dist_meters = 6371000 * c

    signals = []
    anomaly_score = 0.0

    if dist_meters > 500:
        anomaly_score += 60.0
        signals.append(f"Geofence Alert: Inspection photo captured {round(dist_meters)}m away from registered site coordinates.")
    elif dist_meters > 200:
        anomaly_score += 25.0
        signals.append(f"Borderline Location: Photo captured {round(dist_meters)}m from sanction centroid.")
    else:
        signals.append(f"Geofence Verified: Image coordinates match site perimeter within {round(dist_meters)}m.")

    if ai_detected_stage and ai_detected_stage.lower() != claimed_stage.lower():
        anomaly_score += 35.0
        signals.append(f"Visual Stage Discrepancy: AI visual analysis suggests '{ai_detected_stage}' while claimed milestone is '{claimed_stage}'.")
    elif ai_detected_stage:
        signals.append(f"Visual Stage Concurrence: Visual features corroborate claimed milestone '{claimed_stage}'.")

    score = min(100.0, anomaly_score)
    confidence = 0.92

    if score >= 50:
        rec = "Reject automatic inspection validation. Mandate Assistant Engineer re-survey with live GPS tamper-proof timestamping."
    elif score >= 20:
        rec = "Accept inspection with caveat; cross-check with contractor's MB billing entry."
    else:
        rec = "Inspection evidence validated. Update physical milestone completion register."

    return {
        "signals": signals,
        "score": round(score, 1),
        "confidence": confidence,
        "recommendation": rec,
        "distance_meters": round(dist_meters, 1),
        "geofence_passed": dist_meters <= 200
    }
"""

    files['backend/app/api/v1/endpoints/auth.py'] = """from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from ....auth.jwt import create_access_token
from ....auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    role: str
    username: str = "demo_user"

@router.post("/token")
def generate_token(req: LoginRequest) -> Dict[str, Any]:
    valid_roles = ["citizen", "field_officer", "district_authority", "admin"]
    role = req.role if req.role in valid_roles else "citizen"
    payload = {
        "sub": req.username,
        "name": f"Government User ({role.replace('_', ' ').title()})",
        "role": role,
        "is_super_admin": role == "admin"
    }
    token = create_access_token(payload)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role,
        "user": payload
    }

@router.get("/me")
def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    return user
"""

    files['backend/app/api/v1/endpoints/projects.py'] = """from typing import List, Optional
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
"""

    files['backend/app/api/v1/endpoints/contractors.py'] = """from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Contractor
from ....schemas.schemas import ContractorSchema

router = APIRouter(prefix="/contractors", tags=["contractors-v1"])

@router.get("", response_model=List[ContractorSchema])
def list_contractors_v1(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Contractor)
    if search:
        s = f"%{search}%"
        query = query.filter((Contractor.name.ilike(s)) | (Contractor.id.ilike(s)))
    return query.all()

@router.get("/{contractor_id}", response_model=ContractorSchema)
def get_contractor_detail_v1(contractor_id: str, db: Session = Depends(get_db)):
    c = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return c
"""

    files['backend/app/api/v1/endpoints/alerts.py'] = """from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Alert, AuditLog
from ....schemas.schemas import AlertSchema

router = APIRouter(prefix="/alerts", tags=["alerts-v1"])

@router.get("", response_model=List[AlertSchema])
def list_alerts_v1(status: Optional[str] = None, severity: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Alert)
    if status:
        query = query.filter(Alert.status == status)
    if severity:
        query = query.filter(Alert.severity == severity)
    return query.all()

@router.patch("/{alert_id}/resolve")
def resolve_alert_v1(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "RESOLVED"
    audit = AuditLog(
        entity_type="ALERT",
        entity_id=alert_id,
        action="RESOLVED",
        actor="DISTRICT_AUTHORITY",
        details="Alert marked resolved following verification."
    )
    db.add(audit)
    db.commit()
    return {"status": "SUCCESS", "alert_id": alert_id, "state": "RESOLVED"}
"""

    files['backend/app/api/v1/endpoints/inspections.py'] = """from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Inspection, AuditLog, Project
from ....schemas.schemas import InspectionSchema, InspectionCreateSchema
import datetime

router = APIRouter(prefix="/inspections", tags=["inspections-v1"])

@router.get("", response_model=List[InspectionSchema])
def list_inspections_v1(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Inspection)
    if project_id:
        q = q.filter(Inspection.project_id == project_id)
    return q.all()

@router.post("", response_model=InspectionSchema)
def submit_inspection_v1(payload: InspectionCreateSchema, db: Session = Depends(get_db)):
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
"""

    files['backend/app/api/v1/endpoints/complaints.py'] = """from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Complaint, AuditLog
from ....schemas.schemas import ComplaintSchema, ComplaintCreateSchema
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
def submit_complaint_v1(payload: ComplaintCreateSchema, db: Session = Depends(get_db)):
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
"""

    files['backend/app/api/v1/endpoints/documents.py'] = """from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....database import get_db
from ....models.schema import Project

router = APIRouter(prefix="/documents", tags=["documents-v1"])

@router.get("/{project_id}")
def get_project_documents_v1(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    docs = [
        {
            "id": f"DOC-{project.id}-AA",
            "doc_type": "Administrative Approval",
            "title": f"Administrative Approval - {project.title}",
            "ref_number": f"GO/MPLADS/{project.id[:8]}/2024",
            "issued_date": "2024-02-15",
            "is_verified": True,
            "file_size_kb": 1240,
            "url": f"/documents/{project.id}_AA.pdf"
        },
        {
            "id": f"DOC-{project.id}-TS",
            "doc_type": "Technical Sanction",
            "title": f"Technical Sanction Order - {project.sector}",
            "ref_number": f"EE/PWD/TS/{project.id[:8]}",
            "issued_date": "2024-03-01",
            "is_verified": True,
            "file_size_kb": 3480,
            "url": f"/documents/{project.id}_TS.pdf"
        },
        {
            "id": f"DOC-{project.id}-MB",
            "doc_type": "Measurement Book",
            "title": f"Measurement Book Record (MB #{project.id[-4:]})",
            "ref_number": f"MB-VOL-IV-P{project.id[-3:]}",
            "issued_date": "2024-07-10",
            "is_verified": project.physical_progress > 30,
            "file_size_kb": 4120,
            "url": f"/documents/{project.id}_MB.pdf"
        }
    ]
    return docs
"""

    files['backend/app/api/v1/endpoints/ai.py'] = """from typing import Dict, Any, List, Optional
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
"""

    files['backend/app/api/v1/endpoints/analytics.py'] = """from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ....database import get_db
from ....models.schema import Project, Contractor, Alert

router = APIRouter(prefix="/analytics", tags=["analytics-v1"])

@router.get("/summary")
def get_national_summary(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_projects = db.query(Project).count()
    total_sanctioned = db.query(func.sum(Project.sanctioned_amount)).scalar() or 0.0
    total_spent = db.query(func.sum(Project.actual_expenditure)).scalar() or 0.0
    avg_physical = db.query(func.avg(Project.physical_progress)).scalar() or 0.0
    critical_alerts = db.query(Alert).filter(Alert.severity == "CRITICAL", Alert.status != "RESOLVED").count()
    active_contractors = db.query(Contractor).count()

    return {
        "total_projects": total_projects,
        "total_sanctioned_inr": total_sanctioned,
        "total_spent_inr": total_spent,
        "utilization_rate_pct": round((total_spent / max(1.0, total_sanctioned)) * 100, 1),
        "avg_physical_progress_pct": round(avg_physical, 1),
        "critical_active_alerts": critical_alerts,
        "active_contractors_tracked": active_contractors,
        "compliance_benchmark": "MoSPI MPLADS 2023-24 Norms"
    }
"""

    files['backend/app/api/v1/router.py'] = """from fastapi import APIRouter
from .endpoints.auth import router as auth_router
from .endpoints.projects import router as projects_router
from .endpoints.contractors import router as contractors_router
from .endpoints.alerts import router as alerts_router
from .endpoints.inspections import router as inspections_router
from .endpoints.complaints import router as complaints_router
from .endpoints.documents import router as documents_router
from .endpoints.ai import router as ai_router
from .endpoints.analytics import router as analytics_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(projects_router)
api_v1_router.include_router(contractors_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(inspections_router)
api_v1_router.include_router(complaints_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(analytics_router)
"""

    for path_str, content in files.items():
        p = pathlib.Path(path_str)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
        print(f"Generated: {path_str}")

if __name__ == "__main__":
    run()

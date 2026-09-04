from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.schema import Project, Contractor, Alert, Complaint, Guarantee, Dispute

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/overview")
def get_overview_analytics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_projects = db.query(Project).count()
    completed_projects = db.query(Project).filter(Project.status == "COMPLETED").count()
    under_progress = db.query(Project).filter(Project.status == "UNDER PROGRESS").count()
    stalled = db.query(Project).filter(Project.status == "STALLED").count()
    delayed = db.query(Project).filter(Project.delay_days > 0).count()
    high_risk = db.query(Project).filter(Project.risk_level.in_(["HIGH RISK", "CRITICAL"])).count()
    
    total_sanctioned = db.query(func.sum(Project.sanctioned_amount)).scalar() or 0.0
    total_released = db.query(func.sum(Project.funds_released)).scalar() or 0.0
    total_expenditure = db.query(func.sum(Project.actual_expenditure)).scalar() or 0.0

    active_alerts = db.query(Alert).filter(Alert.status.in_(["OPEN", "ASSIGNED", "UNDER_REVIEW"])).count()
    critical_alerts = db.query(Alert).filter(Alert.severity == "CRITICAL", Alert.status != "RESOLVED").count()
    active_disputes = db.query(Dispute).filter(Dispute.status != "RESOLVED").count()
    expiring_guarantees = db.query(Guarantee).filter(Guarantee.days_to_expiry <= 30).count()
    total_contractors = db.query(Contractor).count()

    # Calculate overall utilization
    fund_utilization_pct = round((total_expenditure / total_released * 100), 1) if total_released > 0 else 0.0

    return {
        "total_projects": total_projects,
        "completed_projects": completed_projects,
        "under_progress_projects": under_progress,
        "stalled_projects": stalled,
        "delayed_projects": delayed,
        "high_risk_projects": high_risk,
        "total_sanctioned_amount": total_sanctioned,
        "total_funds_released": total_released,
        "total_actual_expenditure": total_expenditure,
        "unspent_balance": total_released - total_expenditure,
        "fund_utilization_pct": fund_utilization_pct,
        "active_alerts_count": active_alerts,
        "critical_alerts_count": critical_alerts,
        "active_disputes_count": active_disputes,
        "expiring_guarantees_count": expiring_guarantees,
        "total_contractors_count": total_contractors,
        "districts_covered_count": 28,
        "states_covered_count": 10
    }

@router.get("/district")
def get_district_analytics(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    results = db.query(
        Project.state,
        Project.district,
        func.count(Project.id).label("total_projects"),
        func.sum(Project.sanctioned_amount).label("total_sanctioned"),
        func.sum(Project.actual_expenditure).label("total_expenditure"),
        func.avg(Project.physical_progress).label("avg_physical_progress"),
        func.avg(Project.overall_risk_score).label("avg_risk_score")
    ).group_by(Project.state, Project.district).all()

    return [
        {
            "state": r.state,
            "district": r.district,
            "total_projects": r.total_projects,
            "total_sanctioned": round(r.total_sanctioned or 0, -3),
            "total_expenditure": round(r.total_expenditure or 0, -3),
            "avg_physical_progress": round(r.avg_physical_progress or 0, 1),
            "avg_risk_score": int(r.avg_risk_score or 0)
        }
        for r in results
    ]

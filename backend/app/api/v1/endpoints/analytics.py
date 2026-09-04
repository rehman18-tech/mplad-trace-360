from typing import Dict, Any, List
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

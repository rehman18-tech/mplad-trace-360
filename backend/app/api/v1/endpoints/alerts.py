from typing import List, Optional
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

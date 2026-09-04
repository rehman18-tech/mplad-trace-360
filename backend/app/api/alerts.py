from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schema import Alert, AuditLog
from ..schemas.schemas import AlertSchema, AlertActionRequest

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=List[AlertSchema])
def list_alerts(
    severity: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    project_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if severity:
        query = query.filter(Alert.severity == severity)
    if category:
        query = query.filter(Alert.category == category)
    if status:
        query = query.filter(Alert.status == status)
    if project_id:
        query = query.filter(Alert.project_id == project_id)
    return query.order_by(Alert.due_days.asc()).all()

@router.get("/{alert_id}", response_model=AlertSchema)
def get_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert record not found")
    return alert

@router.post("/{alert_id}/action", response_model=AlertSchema)
def take_alert_action(alert_id: str, req: AlertActionRequest, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert record not found")

    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    history = list(alert.audit_history or [])
    
    if req.action == "ASSIGN":
        alert.assigned_authority = req.assigned_to or alert.assigned_authority
        alert.status = "ASSIGNED"
        history.append({
            "time": now_str,
            "action": f"Assigned to {alert.assigned_authority}",
            "actor": req.officer_name
        })
    elif req.action == "ESCALATE":
        alert.escalation_level = req.escalation_level or "Level 4 - Higher Authority"
        alert.status = "UNDER_REVIEW"
        history.append({
            "time": now_str,
            "action": f"Escalated to {alert.escalation_level}. Notice: {req.notes or 'Urgent attention mandated'}",
            "actor": req.officer_name
        })
    elif req.action == "RESOLVE":
        alert.status = "RESOLVED"
        alert.resolution_notes = req.notes or "Official site verification completed. Rectification verified."
        history.append({
            "time": now_str,
            "action": "Marked Resolved following official field review",
            "actor": req.officer_name
        })
    elif req.action == "ADD_NOTE":
        history.append({
            "time": now_str,
            "action": f"Note: {req.notes}",
            "actor": req.officer_name
        })
        
    alert.audit_history = history
    
    # Also log to central AuditLog
    audit_entry = AuditLog(
        id=f"LOG-{datetime.utcnow().strftime('%H%M%S')}-{alert.id[-5:]}",
        timestamp=now_str,
        actor_role="District Authority",
        actor_name=req.officer_name,
        action=f"ALERT_{req.action}",
        entity_id=alert.id,
        details=f"Action on {alert.id} ({alert.title}): {req.notes or req.action}",
        ip_address="127.0.0.1"
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(alert)
    return alert

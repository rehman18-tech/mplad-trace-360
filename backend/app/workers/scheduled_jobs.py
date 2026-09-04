import datetime
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.schema import PerformanceGuarantee, Project, Alert, AuditLog

def check_guarantee_deadlines():
    "
    Daily job: Scans all active performance bank guarantees (PBGs).
    Generates high-priority Alert if expiry date is within 30 days.
    "
    db: Session = SessionLocal()
    try:
        now = datetime.date.today()
        threshold_date = now + datetime.timedelta(days=30)
        
        guarantees = db.query(PerformanceGuarantee).filter(
            PerformanceGuarantee.status == ACTIVE
        ).all()

        alerts_created = 0
        for g in guarantees:
            try:
                exp_date = datetime.datetime.strptime(g.expiry_date, %Y-%m-%d).date()
                if exp_date <= threshold_date:
                    days_left = (exp_date - now).days
                    existing_alert = db.query(Alert).filter(
                        Alert.project_id == g.project_id,
                        Alert.alert_type == GUARANTEE_EXPIRY
                    ).first()
                    
                    if not existing_alert:
                        new_alert = Alert(
                            project_id=g.project_id,
                            severity=CRITICAL if days_left <= 15 else HIGH,
                            alert_type=GUARANTEE_EXPIRY,
                            title=fBank Guarantee Expiring in {days_left} Days,
                            description=fPBG {g.bg_number} issued by {g.issuing_bank} of value ₹{round(g.amount/100000, 2)}L expires on {g.expiry_date}. Demand renewal or encashment.,
                            status=OPEN,
                            confidence_score=0.99,
                            created_at=datetime.datetime.now().strftime(%Y-%m-%d %H:%M:%S)
                        )
                        db.add(new_alert)
                        alerts_created += 1
            except Exception:
                continue

        if alerts_created > 0:
            audit = AuditLog(
                entity_type=SYSTEM_WORKER,
                entity_id=JOB_GUARANTEE_SCAN,
                action=SCAN_COMPLETED,
                actor=SYSTEM,
                details=fGenerated {alerts_created} guarantee expiry warning alerts.
            )
            db.add(audit)
            db.commit()
            
        return {status: SUCCESS, alerts_created: alerts_created}
    finally:
        db.close()

def check_project_deadlines():
    "
    Daily job: Checks if ongoing projects have passed target completion dates.
    "
    db: Session = SessionLocal()
    try:
        now = datetime.date.today()
        ongoing = db.query(Project).filter(
            Project.status.in_([IN_PROGRESS, TENDERED, SANCTIONED])
        ).all()

        delayed_count = 0
        for p in ongoing:
            try:
                target_date = datetime.datetime.strptime(p.target_completion_date, %Y-%m-%d).date()
                if target_date < now and p.physical_progress < 100:
                    delay_days = (now - target_date).days
                    if delay_days != p.delay_days:
                        p.delay_days = delay_days
                        delayed_count += 1
            except Exception:
                continue

        if delayed_count > 0:
            db.commit()
        return {status: SUCCESS, delayed_projects_updated: delayed_count}
    finally:
        db.close()

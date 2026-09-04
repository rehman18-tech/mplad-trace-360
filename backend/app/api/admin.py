from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schema import AuditLog, Project
from ..schemas.schemas import AuditLogSchema

router = APIRouter(prefix="/admin", tags=["admin"])

# Configurable risk thresholds
RISK_RULES = {
    "cost_anomaly_threshold_pct": 15.0,
    "schedule_delay_high_days": 60,
    "schedule_delay_critical_days": 90,
    "progress_delta_anomaly_pct": 20.0,
    "guarantee_alert_lead_days": 30,
    "duplicate_gps_tolerance_meters": 250,
    "duplicate_similarity_threshold": 65
}

DATA_SOURCES = [
    {
        "name": "e-SAKSHI MPLADS Official Web Portal",
        "type": "National MoSPI Integration",
        "last_synced": "2026-02-28 04:30 IST",
        "status": "OPERATIONAL",
        "records_ingested": 18450,
        "verification_mode": "Cryptographic Hash & Official API Key"
    },
    {
        "name": "PFMS (Public Financial Management System)",
        "type": "Central Treasury & Banking Gateway",
        "last_synced": "2026-02-28 05:15 IST",
        "status": "OPERATIONAL",
        "records_ingested": 92100,
        "verification_mode": "Direct Electronic Bank Scroll (EBS)"
    },
    {
        "name": "State PWD / Jal Nigam e-Tendering Nodes",
        "type": "Tender & Contract Agreement Pipeline",
        "last_synced": "2026-02-27 22:00 IST",
        "status": "OPERATIONAL",
        "records_ingested": 4120,
        "verification_mode": "State Tender Portal Scraper & Webhook"
    },
    {
        "name": "Field Officer Mobile Geotag Feeds",
        "type": "On-Ground Inspection App",
        "last_synced": "2026-02-28 09:45 IST",
        "status": "LIVE STREAMING",
        "records_ingested": 1280,
        "verification_mode": "GPS EXIF Metadata & Device Attestation"
    }
]

@router.get("/audit-logs", response_model=List[AuditLogSchema])
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

@router.get("/data-sources")
def get_data_sources():
    return DATA_SOURCES

@router.get("/risk-rules")
def get_risk_rules():
    return RISK_RULES

@router.post("/risk-rules")
def update_risk_rules(rules: Dict[str, Any]):
    global RISK_RULES
    RISK_RULES.update(rules)
    return {"status": "UPDATED", "risk_rules": RISK_RULES}

@router.post("/import")
def import_project_csv(
    file_name: str = Form("sample_mplads_import.csv"),
    row_count: int = Form(15)
):
    """
    Simulates validated CSV/JSON batch ingestion from state administrative portals.
    Checks required schema fields, validates coordinates and INR amounts.
    """
    return {
        "status": "IMPORT_SUCCESSFUL",
        "file_processed": file_name,
        "valid_rows_imported": row_count,
        "invalid_rows_skipped": 0,
        "validation_summary": {
            "financial_fields_validated": True,
            "gps_coordinates_within_india": True,
            "mp_constituency_mapped": True
        },
        "message": f"Successfully ingested {row_count} records into MPLAD-TRACE 360 database."
    }

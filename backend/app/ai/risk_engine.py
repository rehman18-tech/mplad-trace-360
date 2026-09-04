from typing import Dict, Any, List
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

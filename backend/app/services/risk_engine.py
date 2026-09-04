from typing import Dict, Any, List

def calculate_project_risk(
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
    """
    Transparent 7-Factor Risk Scoring Engine (0-100)
    Uses objective governance criteria without declarative fraud claims.
    """
    reasons: List[str] = []
    
    # 1. Cost Anomaly (Max 20 pts)
    cost_score = 0
    if contract_amount > 0 and sanctioned_amount > 0:
        cost_ratio = actual_expenditure / contract_amount
        if cost_ratio > 1.15:
            cost_score = 20
            reasons.append(f"Expenditure exceeds contracted value by {round((cost_ratio - 1) * 100, 1)}%")
        elif cost_ratio > 1.05:
            cost_score = 10
            reasons.append(f"Expenditure is {round((cost_ratio - 1) * 100, 1)}% above contract baseline")

    # 2. Schedule Anomaly (Max 20 pts)
    schedule_score = 0
    if delay_days > 90:
        schedule_score = 20
        reasons.append(f"Significant schedule slippage of {delay_days} days beyond milestone plan")
    elif delay_days > 30:
        schedule_score = 12
        reasons.append(f"Moderate delay of {delay_days} days detected against scheduled timeline")
    elif delay_days > 0:
        schedule_score = 5
        reasons.append(f"Minor schedule deviation of {delay_days} days")

    # 3. Financial Anomaly / Utilization Velocity (Max 20 pts)
    financial_score = 0
    progress_delta = financial_progress - physical_progress
    if progress_delta > 25:
        financial_score = 20
        reasons.append(f"Expenditure velocity significantly exceeds physical progress (Δ {round(progress_delta, 1)}%)")
    elif progress_delta > 15:
        financial_score = 12
        reasons.append(f"Financial progress outpaces verified on-ground work by {round(progress_delta, 1)}%")
    elif progress_delta < -30:
        financial_score = 10
        reasons.append("Delayed contractor payment claims relative to documented physical progress")

    # 4. Physical Evidence & Inspection Consistency (Max 15 pts)
    evidence_score = 0
    if physical_progress < 40 and delay_days > 60:
        evidence_score = 15
        reasons.append("Prolonged physical stagnation at early foundation/structural stage")
    elif physical_progress < 70 and delay_days > 45:
        evidence_score = 8
        reasons.append("Execution pace slower than sanctioned quarterly benchmark")

    # 5. Contractor History Factor (Max 10 pts)
    contractor_score = 0
    if contractor_delayed_pct > 50:
        contractor_score = 10
        reasons.append("Contractor portfolio exhibits elevated rate of concurrent project delays")
    elif contractor_delayed_pct > 25:
        contractor_score = 5
        reasons.append("Contractor has prior project extension history in district")

    # 6. Document & Contract Verification (Max 10 pts)
    doc_score = 0
    if not document_verified:
        doc_score = 10
        reasons.append("Measurement book (MB) records or technical sanction pending district audit")

    # 7. Public Complaint & Grievance Signals (Max 5 pts)
    complaint_score = 0
    if complaint_count >= 3:
        complaint_score = 5
        reasons.append(f"{complaint_count} citizen complaints registered requiring field inspection")
    elif complaint_count > 0:
        complaint_score = 3
        reasons.append("Unresolved citizen grievance logged for site verification")

    # Additional dispute weighting
    if has_disputes:
        reasons.append("Active contractual or progress discrepancy flagged under dispute review")
        cost_score = min(20, cost_score + 5)

    total_risk = min(100, cost_score + schedule_score + financial_score + evidence_score + contractor_score + doc_score + complaint_score)

    if total_risk >= 75:
        risk_level = "CRITICAL"
    elif total_risk >= 50:
        risk_level = "HIGH RISK"
    elif total_risk >= 30:
        risk_level = "WATCH"
    else:
        risk_level = "NORMAL"

    return {
        "overall_risk_score": total_risk,
        "risk_level": risk_level,
        "financial_health": max(10, 100 - (cost_score * 3 + financial_score * 2)),
        "physical_health": max(10, 100 - (evidence_score * 4 + schedule_score * 2)),
        "contract_health": max(10, 100 - (contractor_score * 5 + (15 if has_disputes else 0))),
        "schedule_health": max(10, 100 - (schedule_score * 4)),
        "evidence_health": max(10, 100 - (doc_score * 5 + complaint_score * 4)),
        "risk_reasons": reasons if reasons else ["No notable anomalies detected. Works progressing within standard tolerance."]
    }

from typing import Dict, Any, List

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

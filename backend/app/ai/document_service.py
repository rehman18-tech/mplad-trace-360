from typing import Dict, Any, List

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

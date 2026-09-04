import math
from typing import Dict, Any, List

def verify_inspection_photo(
    site_lat: float,
    site_lon: float,
    photo_lat: float,
    photo_lon: float,
    claimed_stage: str,
    ai_detected_stage: str = None
) -> Dict[str, Any]:
    dlat = math.radians(photo_lat - site_lat)
    dlon = math.radians(photo_lon - site_lon)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(site_lat)) * math.cos(math.radians(photo_lat)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    dist_meters = 6371000 * c

    signals = []
    anomaly_score = 0.0

    if dist_meters > 500:
        anomaly_score += 60.0
        signals.append(f"Geofence Alert: Inspection photo captured {round(dist_meters)}m away from registered site coordinates.")
    elif dist_meters > 200:
        anomaly_score += 25.0
        signals.append(f"Borderline Location: Photo captured {round(dist_meters)}m from sanction centroid.")
    else:
        signals.append(f"Geofence Verified: Image coordinates match site perimeter within {round(dist_meters)}m.")

    if ai_detected_stage and ai_detected_stage.lower() != claimed_stage.lower():
        anomaly_score += 35.0
        signals.append(f"Visual Stage Discrepancy: AI visual analysis suggests '{ai_detected_stage}' while claimed milestone is '{claimed_stage}'.")
    elif ai_detected_stage:
        signals.append(f"Visual Stage Concurrence: Visual features corroborate claimed milestone '{claimed_stage}'.")

    score = min(100.0, anomaly_score)
    confidence = 0.92

    if score >= 50:
        rec = "Reject automatic inspection validation. Mandate Assistant Engineer re-survey with live GPS tamper-proof timestamping."
    elif score >= 20:
        rec = "Accept inspection with caveat; cross-check with contractor's MB billing entry."
    else:
        rec = "Inspection evidence validated. Update physical milestone completion register."

    return {
        "signals": signals,
        "score": round(score, 1),
        "confidence": confidence,
        "recommendation": rec,
        "distance_meters": round(dist_meters, 1),
        "geofence_passed": dist_meters <= 200
    }

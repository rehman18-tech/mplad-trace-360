import math
from typing import Dict, Any, List

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def token_similarity(title1: str, title2: str) -> float:
    t1 = set(w.lower() for w in title1.split() if len(w) > 2)
    t2 = set(w.lower() for w in title2.split() if len(w) > 2)
    if not t1 or not t2:
        return 0.0
    return len(t1 & t2) / len(t1 | t2)

def detect_duplicates(target_project: Dict[str, Any], candidate_projects: List[Dict[str, Any]]) -> Dict[str, Any]:
    signals = []
    max_duplicate_score = 0.0
    matches = []

    t_lat = target_project.get("latitude")
    t_lon = target_project.get("longitude")
    t_title = target_project.get("title", "")
    t_id = target_project.get("id")

    for cand in candidate_projects:
        c_id = cand.get("id")
        if c_id == t_id:
            continue
        c_lat = cand.get("latitude")
        c_lon = cand.get("longitude")
        c_title = cand.get("title", "")

        dist_m = 999999
        if t_lat and t_lon and c_lat and c_lon:
            dist_m = haversine_distance(t_lat, t_lon, c_lat, c_lon)

        text_sim = token_similarity(t_title, c_title)

        if dist_m <= 300 and text_sim > 0.4:
            overlap_score = min(100.0, (text_sim * 60) + (max(0, 300 - dist_m) / 300 * 40))
            max_duplicate_score = max(max_duplicate_score, overlap_score)
            matches.append({
                "matched_project_id": c_id,
                "matched_title": c_title,
                "distance_meters": round(dist_m, 1),
                "text_similarity_score": round(text_sim * 100, 1)
            })
            signals.append(
                f"Potential Geospatial Duplicate / Requires Verification: Project '{c_title}' (ID: {c_id}) is situated {round(dist_m)}m away with {round(text_sim*100)}% descriptive alignment."
            )

    confidence = 0.93 if len(matches) > 0 else 0.98
    if max_duplicate_score > 60:
        rec = "Conduct GIS cadastral cross-verification and convene District Vigilance review to ensure non-duplication of MPLADS/State infrastructure fund allocations."
    elif max_duplicate_score > 30:
        rec = "Review GPS geo-coordinates against municipal asset register before approving next financial tranche."
    else:
        rec = "No proximate duplicate work recommendations detected within 500m geofence radius."

    return {
        "signals": signals,
        "score": round(max_duplicate_score, 1),
        "confidence": confidence,
        "recommendation": rec,
        "matched_works": matches
    }

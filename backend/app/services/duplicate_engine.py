import math
from typing import List, Dict, Any

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0 # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def token_similarity(str1: str, str2: str) -> float:
    """Jaccard similarity on lower-case tokens."""
    tokens1 = set(str1.lower().replace("-", " ").replace(",", " ").split())
    tokens2 = set(str2.lower().replace("-", " ").replace(",", " ").split())
    if not tokens1 or not tokens2:
        return 0.0
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)
    return len(intersection) / len(union)

def detect_duplicates(projects: List[Dict[str, Any]], threshold: float = 0.65) -> List[Dict[str, Any]]:
    """
    Detects potential duplicate or overlapping works across different sanction years,
    departments, or schemes within nearby geographic coordinates.
    """
    candidates = []
    n = len(projects)
    for i in range(n):
        for j in range(i + 1, n):
            p1 = projects[i]
            p2 = projects[j]
            
            # Skip different districts to keep comparison localized
            if p1.get("district") != p2.get("district"):
                continue

            factors = []
            score_pts = 0

            # 1. Category match
            if p1.get("category") == p2.get("category"):
                score_pts += 25
                factors.append(f"Identical Category: {p1.get('category')}")

            # 2. Village / Mandal match
            if p1.get("village") and p2.get("village") and p1.get("village").lower() == p2.get("village").lower():
                score_pts += 30
                factors.append(f"Same Village: {p1.get('village')}")
            elif p1.get("mandal_block") and p2.get("mandal_block") and p1.get("mandal_block").lower() == p2.get("mandal_block").lower():
                score_pts += 15
                factors.append(f"Same Block/Mandal: {p1.get('mandal_block')}")

            # 3. GPS Proximity
            if p1.get("latitude") and p2.get("latitude"):
                dist_km = haversine_distance_km(p1["latitude"], p1["longitude"], p2["latitude"], p2["longitude"])
                if dist_km < 0.15: # within 150m
                    score_pts += 30
                    factors.append(f"GPS Proximity: ~{int(dist_km * 1000)} meters apart")
                elif dist_km < 0.8: # within 800m
                    score_pts += 15
                    factors.append(f"Nearby Site: {round(dist_km, 2)} km apart")

            # 4. Text title similarity
            title_sim = token_similarity(p1.get("title", ""), p2.get("title", ""))
            if title_sim > 0.4:
                score_pts += int(title_sim * 25)
                factors.append(f"Title Overlap ({int(title_sim * 100)}% keyword match)")

            # 5. Sanction Amount Proximity (within 20%)
            a1 = p1.get("sanctioned_amount", 0)
            a2 = p2.get("sanctioned_amount", 0)
            if a1 > 0 and a2 > 0:
                diff_pct = abs(a1 - a2) / max(a1, a2)
                if diff_pct < 0.15:
                    score_pts += 10
                    factors.append(f"Comparable Sanction Value (₹{a1:,.0f} vs ₹{a2:,.0f})")

            final_similarity = min(98, score_pts)
            if final_similarity >= 65:
                candidates.append({
                    "id": f"DUP-{p1.get('id', '')[-5:]}-{p2.get('id', '')[-5:]}",
                    "project_a_id": p1.get("id"),
                    "project_a_title": p1.get("title"),
                    "project_b_id": p2.get("id"),
                    "project_b_title": p2.get("title"),
                    "similarity_score": final_similarity,
                    "matched_factors": factors,
                    "district": p1.get("district"),
                    "status": "PENDING_REVIEW",
                    "decision_notes": None
                })
    return candidates

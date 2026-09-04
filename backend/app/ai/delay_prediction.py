from typing import Dict, Any, List
from datetime import datetime, timedelta

def predict_project_delay(
    target_completion_date_str: str,
    physical_progress: float,
    elapsed_days: int,
    contractor_speed_index: float = 1.0,
    past_district_weather_factor: float = 1.0
) -> Dict[str, Any]:
    signals = []
    if physical_progress <= 0:
        actual_daily_progress = 0.05
    else:
        actual_daily_progress = physical_progress / max(1, elapsed_days)

    remaining_progress = max(0.0, 100.0 - physical_progress)
    adjusted_daily_progress = actual_daily_progress * contractor_speed_index * past_district_weather_factor
    projected_days_needed = remaining_progress / max(0.01, adjusted_daily_progress)

    try:
        target_date = datetime.strptime(target_completion_date_str, "%Y-%m-%d")
    except Exception:
        target_date = datetime.now() + timedelta(days=90)

    now = datetime.now()
    days_left_to_target = (target_date - now).days
    slippage_days = int(projected_days_needed - max(0, days_left_to_target))
    
    if slippage_days > 60:
        delay_score = min(100.0, 50.0 + (slippage_days / 3.0))
        signals.append(f"High risk of schedule slippage: Forecast indicates {slippage_days} days delay beyond contractual completion.")
    elif slippage_days > 15:
        delay_score = min(70.0, 30.0 + slippage_days)
        signals.append(f"Moderate delay predicted: Projected finish date requires additional {slippage_days} days at current execution velocity.")
    elif slippage_days > 0:
        delay_score = 25.0
        signals.append(f"Marginal schedule variance of {slippage_days} days anticipated.")
    else:
        delay_score = 5.0
        signals.append("Project milestone velocity conforms to completion timetable.")

    projected_finish = now + timedelta(days=int(projected_days_needed))
    confidence = 0.88

    if delay_score >= 60:
        rec = "Convene tripartite review with Contractor and Superintending Engineer; mandate deployment of additional shifts or machinery."
    elif delay_score >= 30:
        rec = "Issue progress advisory letter requiring revised PERT/CPM chart submission within 10 working days."
    else:
        rec = "Maintain periodic monthly monitoring and verify intermediate milestone billing."

    return {
        "signals": signals,
        "score": round(delay_score, 1),
        "confidence": confidence,
        "recommendation": rec,
        "predicted_slippage_days": max(0, slippage_days),
        "projected_completion_date": projected_finish.strftime("%Y-%m-%d")
    }

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_v1_projects_list():
    res = client.get("/api/v1/projects")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_v1_auth_token():
    res = client.post("/api/v1/auth/token", json={"role": "district_authority", "username": "collector_varanasi"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "district_authority"
    assert data["token_type"] == "bearer"

def test_v1_contractors_list():
    res = client.get("/api/v1/contractors")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_v1_alerts_list():
    res = client.get("/api/v1/alerts")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_v1_analytics_summary():
    res = client.get("/api/v1/analytics/summary")
    assert res.status_code == 200
    data = res.json()
    assert "total_projects" in data
    assert data["total_projects"] > 0
    assert "utilization_rate_pct" in data

def test_v1_ai_anomaly_detection():
    payload = {
        "sanctioned_amount": 5000000.0,
        "actual_expenditure": 6200000.0,
        "physical_progress": 40.0,
        "financial_progress": 85.0,
        "delay_days": 75
    }
    res = client.post("/api/v1/ai/anomaly-detection", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "signals" in data
    assert "score" in data
    assert "confidence" in data
    assert "recommendation" in data
    assert data["score"] > 50

def test_v1_ai_delay_prediction():
    payload = {
        "target_completion_date": "2024-12-31",
        "physical_progress": 35.0,
        "elapsed_days": 180
    }
    res = client.post("/api/v1/ai/delay-prediction", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "signals" in data
    assert "score" in data
    assert "confidence" in data
    assert "recommendation" in data
    assert "projected_completion_date" in data

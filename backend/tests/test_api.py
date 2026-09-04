from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "MPLAD-TRACE 360" in response.json()["platform"]

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_projects_list():
    response = client.get("/api/projects")
    assert response.status_code == 200
    projects = response.json()
    assert len(projects) >= 50
    # Check flagship project
    flagship = next((p for p in projects if p["id"] == "MPLAD-AP-2026-00125"), None)
    assert flagship is not None
    assert flagship["district"] == "Visakhapatnam"

def test_project_detail_and_timeline():
    response = client.get("/api/projects/MPLAD-AP-2026-00125")
    assert response.status_code == 200
    data = response.json()
    assert data["sanctioned_amount"] == 2950000.0
    assert len(data["timeline_events"]) >= 10
    assert len(data["fund_flows"]) >= 6

def test_analytics_overview():
    response = client.get("/api/analytics/overview")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_projects"] >= 50
    assert stats["total_sanctioned_amount"] > 0
    assert stats["fund_utilization_pct"] > 0

def test_duplicate_detection():
    response = client.get("/api/ai/detect-duplicates?district=Mysuru")
    assert response.status_code == 200
    duplicates = response.json()
    assert len(duplicates) > 0
    assert duplicates[0]["similarity_score"] >= 65

def test_delay_prediction():
    response = client.get("/api/ai/predict-delay/MPLAD-AP-2026-00125")
    assert response.status_code == 200
    pred = response.json()
    assert "predicted_completion_date" in pred
    assert pred["delay_probability_pct"] > 0

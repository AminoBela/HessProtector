from fastapi.testclient import TestClient
from datetime import date

def get_auth_headers(client: TestClient):
    # Register and login to get token
    client.post(
        "/auth/register",
        json={"username": "testuser_analytics", "password": "password123", "email": "analytics@example.com"}
    )
    response = client.post(
        "/auth/login",
        data={"username": "testuser_analytics", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_get_monthly_analytics(client: TestClient):
    headers = get_auth_headers(client)
    
    # Add income and expense
    client.post(
        "/api/transactions",
        json={"label": "Salary", "amount": 3000.0, "type": "income", "category": "Job", "date": "2024-05-01"},
        headers=headers
    )
    client.post(
        "/api/transactions",
        json={"label": "Rent", "amount": 1000.0, "type": "expense", "category": "Housing", "date": "2024-05-05"},
        headers=headers
    )
    
    # Get analytics for May 2024
    response = client.get("/api/analytics/monthly?year=2024&month=5", headers=headers)
    assert response.status_code == 200
    data = response.json()
    
    assert "stats" in data
    assert data["stats"]["income"] == 3000.0
    assert data["stats"]["expense"] == 1000.0
    assert data["stats"]["net"] == 2000.0

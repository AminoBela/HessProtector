from fastapi.testclient import TestClient

def get_auth_headers(client: TestClient):
    # Register and login to get token
    client.post(
        "/auth/register",
        json={"username": "testuser", "password": "password123", "email": "test@example.com"}
    )
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_add_transaction(client: TestClient):
    headers = get_auth_headers(client)
    response = client.post(
        "/api/transactions",
        json={
            "label": "Groceries",
            "amount": 50.0,
            "type": "expense",
            "category": "Food",
            "date": "2024-01-01"
        },
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "created"

def test_get_dashboard_transactions(client: TestClient):
    headers = get_auth_headers(client)
    
    # Add a transaction
    client.post(
        "/api/transactions",
        json={
            "label": "Salary",
            "amount": 2000.0,
            "type": "income",
            "category": "Job",
            "date": "2024-01-01"
        },
        headers=headers
    )
    
    # Get dashboard
    response = client.get("/api/dashboard", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "latest_transactions" in data
    assert len(data["latest_transactions"]) == 1
    assert data["latest_transactions"][0]["label"] == "Salary"

def test_delete_transaction(client: TestClient):
    headers = get_auth_headers(client)
    
    # Add a transaction
    client.post(
        "/api/transactions",
        json={
            "label": "Mistake",
            "amount": 10.0,
            "type": "expense",
            "category": "Misc",
            "date": "2024-01-01"
        },
        headers=headers
    )
    
    # We need to find the ID. Since it's the first one, ID should be 1.
    response = client.delete("/api/transactions/1", headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "deleted"

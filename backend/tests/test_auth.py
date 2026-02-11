from fastapi.testclient import TestClient

def test_register_user(client: TestClient):
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "password": "password123", "email": "test@example.com"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_register_duplicate_user(client: TestClient):
    # Register once
    client.post(
        "/auth/register",
        json={"username": "testuser", "password": "password123", "email": "test@example.com"}
    )
    # Register again
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "password": "password123", "email": "other@example.com"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already registered"

def test_login_user(client: TestClient):
    # Register
    client.post(
        "/auth/register",
        json={"username": "testuser", "password": "password123", "email": "test@example.com"}
    )
    
    # Login
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials(client: TestClient):
    response = client.post(
        "/auth/login",
        data={"username": "nonexistent", "password": "password123"}
    )
    assert response.status_code == 401

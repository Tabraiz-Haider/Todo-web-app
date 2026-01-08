from fastapi.testclient import TestClient


def register_user(client: TestClient, email: str, password: str) -> None:
    response = client.post(
        "/api/auth/register",
        json={"email": email, "password": password},
    )
    assert response.status_code == 201


def login_user(client: TestClient, email: str, password: str) -> dict:
    response = client.post(
        "/api/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    return response.json()


def test_user_registration_and_login_flow(client: TestClient):
    email = "user@example.com"
    password = "password123"

    register_user(client, email, password)
    login_data = login_user(client, email, password)

    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"


def test_duplicate_registration(client: TestClient):
    email = "duplicate@example.com"
    password = "password123"

    register_user(client, email, password)
    response = client.post(
        "/api/auth/register",
        json={"email": email, "password": password},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_with_invalid_credentials(client: TestClient):
    email = "invalid@example.com"
    password = "password123"

    response = client.post(
        "/api/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_access_protected_route_without_token(client: TestClient):
    response = client.get("/api/tasks")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_access_protected_route_with_invalid_token(client: TestClient):
    response = client.get(
        "/api/tasks",
        headers={"Authorization": "Bearer invalidtoken"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"

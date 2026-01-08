from fastapi.testclient import TestClient


def create_user_and_get_token(client: TestClient, email: str) -> str:
    response = client.post(
        "/api/auth/register",
        json={"email": email, "password": "password123"},
    )
    assert response.status_code == 201

    response = client.post(
        "/api/auth/login",
        data={"username": email, "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_task_crud_flow(client: TestClient):
    token = create_user_and_get_token(client, "task@example.com")
    headers = auth_headers(token)

    response = client.post(
        "/api/tasks",
        json={"title": "Write tests", "description": "Cover all scenarios"},
        headers=headers,
    )
    assert response.status_code == 201
    task = response.json()
    task_id = task["id"]

    response = client.get("/api/tasks", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1

    response = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Write more tests", "description": "Add additional coverage"},
        headers=headers,
    )
    assert response.status_code == 200
    updated_task = response.json()
    assert updated_task["title"] == "Write more tests"

    response = client.patch(
        f"/api/tasks/{task_id}/complete",
        headers=headers,
    )
    assert response.status_code == 200
    completed_task = response.json()
    assert completed_task["is_completed"] is True

    response = client.delete(f"/api/tasks/{task_id}", headers=headers)
    assert response.status_code == 204

    response = client.get("/api/tasks", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 0


def test_tasks_require_authentication(client: TestClient):
    response = client.get("/api/tasks")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

    response = client.post("/api/tasks", json={"title": "Unauthorized"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_user_isolation(client: TestClient):
    token_user1 = create_user_and_get_token(client, "user1@example.com")
    token_user2 = create_user_and_get_token(client, "user2@example.com")

    response = client.post(
        "/api/tasks",
        json={"title": "User 1 task"},
        headers=auth_headers(token_user1),
    )
    assert response.status_code == 201

    response = client.get("/api/tasks", headers=auth_headers(token_user2))
    assert response.status_code == 200
    tasks = response.json()
    assert tasks == []


def test_update_nonexistent_task(client: TestClient):
    token = create_user_and_get_token(client, "user3@example.com")
    response = client.put(
        "/api/tasks/999",
        json={"title": "Does not exist"},
        headers=auth_headers(token),
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_delete_nonexistent_task(client: TestClient):
    token = create_user_and_get_token(client, "user4@example.com")
    response = client.delete(
        "/api/tasks/999",
        headers=auth_headers(token),
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_complete_nonexistent_task(client: TestClient):
    token = create_user_and_get_token(client, "user5@example.com")
    response = client.patch(
        "/api/tasks/999/complete",
        headers=auth_headers(token),
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_partial_update_task(client: TestClient):
    token = create_user_and_get_token(client, "user6@example.com")
    headers = auth_headers(token)

    response = client.post("/api/tasks", json={"title": "Partial"}, headers=headers)
    task_id = response.json()["id"]

    response = client.put(
        f"/api/tasks/{task_id}",
        json={"is_completed": True},
        headers=headers,
    )
    assert response.status_code == 200
    updated_task = response.json()
    assert updated_task["is_completed"] is True


def test_multiple_tasks_completion_stats(client: TestClient):
    token = create_user_and_get_token(client, "user7@example.com")
    headers = auth_headers(token)

    client.post("/api/tasks", json={"title": "Task 1"}, headers=headers)
    response = client.post("/api/tasks", json={"title": "Task 2"}, headers=headers)
    task2_id = response.json()["id"]

    client.patch(f"/api/tasks/{task2_id}/complete", headers=headers)

    response = client.get("/api/tasks", headers=headers)
    tasks = response.json()
    assert len(tasks) == 2
    assert sum(1 for task in tasks if task["is_completed"]) == 1

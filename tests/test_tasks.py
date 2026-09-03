def _create_project(client, auth_headers, name="Default Project"):
    resp = client.post("/api/projects", json={"name": name}, headers=auth_headers)
    return resp.json()["id"]


def test_create_task(client, auth_headers):
    project_id = _create_project(client, auth_headers)
    resp = client.post(
        "/api/tasks",
        json={"title": "Design homepage", "project_id": project_id, "priority": "high"},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Design homepage"
    assert data["status"] == "todo"


def test_task_requires_valid_project(client, auth_headers):
    resp = client.post(
        "/api/tasks",
        json={"title": "Orphan task", "project_id": 9999},
        headers=auth_headers,
    )
    assert resp.status_code == 404


def test_update_task_status_sets_completed_at(client, auth_headers):
    project_id = _create_project(client, auth_headers)
    create = client.post(
        "/api/tasks", json={"title": "Ship feature", "project_id": project_id}, headers=auth_headers
    )
    task_id = create.json()["id"]

    resp = client.patch(f"/api/tasks/{task_id}", json={"status": "done"}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "done"
    assert resp.json()["completed_at"] is not None


def test_filter_tasks_by_status(client, auth_headers):
    project_id = _create_project(client, auth_headers)
    client.post("/api/tasks", json={"title": "Task 1", "project_id": project_id}, headers=auth_headers)
    t2 = client.post(
        "/api/tasks", json={"title": "Task 2", "project_id": project_id}, headers=auth_headers
    ).json()
    client.patch(f"/api/tasks/{t2['id']}", json={"status": "done"}, headers=auth_headers)

    resp = client.get("/api/tasks?status=done", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["title"] == "Task 2"


def test_delete_task(client, auth_headers):
    project_id = _create_project(client, auth_headers)
    create = client.post(
        "/api/tasks", json={"title": "Temp task", "project_id": project_id}, headers=auth_headers
    )
    task_id = create.json()["id"]
    resp = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
    assert resp.status_code == 204

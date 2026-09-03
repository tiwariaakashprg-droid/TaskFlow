def test_create_project(client, auth_headers):
    resp = client.post(
        "/api/projects",
        json={"name": "Marketing Site", "description": "New landing page", "color": "#EC4899"},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Marketing Site"
    assert data["task_count"] == 0


def test_list_projects(client, auth_headers):
    client.post("/api/projects", json={"name": "Project A"}, headers=auth_headers)
    client.post("/api/projects", json={"name": "Project B"}, headers=auth_headers)
    resp = client.get("/api/projects", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_update_project(client, auth_headers):
    create = client.post("/api/projects", json={"name": "Old Name"}, headers=auth_headers)
    project_id = create.json()["id"]
    resp = client.patch(
        f"/api/projects/{project_id}", json={"name": "New Name"}, headers=auth_headers
    )
    assert resp.status_code == 200
    assert resp.json()["name"] == "New Name"


def test_delete_project(client, auth_headers):
    create = client.post("/api/projects", json={"name": "To Delete"}, headers=auth_headers)
    project_id = create.json()["id"]
    resp = client.delete(f"/api/projects/{project_id}", headers=auth_headers)
    assert resp.status_code == 204
    resp2 = client.get("/api/projects", headers=auth_headers)
    assert len(resp2.json()) == 0


def test_projects_require_auth(client):
    resp = client.get("/api/projects")
    assert resp.status_code == 401

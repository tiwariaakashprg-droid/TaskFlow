def test_dashboard_stats_empty(client, auth_headers):
    resp = client.get("/api/dashboard/stats", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_tasks"] == 0
    assert data["completion_rate"] == 0.0
    assert len(data["trend"]) == 7


def test_dashboard_stats_with_data(client, auth_headers):
    project = client.post("/api/projects", json={"name": "Sprint 1"}, headers=auth_headers).json()
    client.post(
        "/api/tasks", json={"title": "Task A", "project_id": project["id"]}, headers=auth_headers
    )
    t2 = client.post(
        "/api/tasks", json={"title": "Task B", "project_id": project["id"]}, headers=auth_headers
    ).json()
    client.patch(f"/api/tasks/{t2['id']}", json={"status": "done"}, headers=auth_headers)

    resp = client.get("/api/dashboard/stats", headers=auth_headers)
    data = resp.json()
    assert data["total_tasks"] == 2
    assert data["completed_tasks"] == 1
    assert data["completion_rate"] == 50.0

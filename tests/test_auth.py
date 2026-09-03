def test_register_user(client):
    resp = client.post(
        "/api/auth/register",
        json={"name": "Alice", "email": "alice@example.com", "password": "password123"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["user"]["email"] == "alice@example.com"
    assert "access_token" in data


def test_register_duplicate_email(client):
    payload = {"name": "Bob", "email": "bob@example.com", "password": "password123"}
    client.post("/api/auth/register", json=payload)
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 400


def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={"name": "Carol", "email": "carol@example.com", "password": "password123"},
    )
    resp = client.post(
        "/api/auth/login", json={"email": "carol@example.com", "password": "password123"}
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"name": "Dan", "email": "dan@example.com", "password": "password123"},
    )
    resp = client.post(
        "/api/auth/login", json={"email": "dan@example.com", "password": "wrongpass"}
    )
    assert resp.status_code == 401

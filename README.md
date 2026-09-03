# TaskFlow

TaskFlow is a full-stack task & project management application with a FastAPI backend, a Celery background worker, and a React dashboard.

## Features

- 🔐 JWT authentication (register / login)
- 📁 Projects with color tags and progress tracking
- ✅ Tasks with status (todo / in progress / done), priority, and due dates
- 📊 Dashboard with live stats, a 7-day activity trend chart, and a status breakdown pie chart
- 🗂️ Kanban-style task board with filtering and search
- ⏰ Background worker that flags overdue tasks and generates a daily activity report
- 🐳 One-command startup with Docker Compose (Postgres + Redis + API + worker + frontend)

## Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Backend    | FastAPI, SQLAlchemy, Pydantic, JWT (python-jose) |
| Worker     | Celery + Redis (periodic tasks via Celery beat) |
| Database   | PostgreSQL (SQLite for local dev)             |
| Frontend   | React + Vite, React Router, Recharts, Axios, lucide-react |
| Tests      | Pytest + FastAPI TestClient                   |

## Project Structure

```
TaskFlow/
├── backend/
│   ├── api/          # FastAPI routers (auth, projects, tasks, dashboard)
│   ├── models/        # SQLAlchemy ORM models
│   ├── services/       # Business logic
│   ├── database/       # DB session/engine setup
│   └── main.py         # App entrypoint
├── worker/
│   ├── tasks/           # Celery tasks (notifications, reports)
│   └── worker.py        # Celery app + beat schedule
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios client
│   │   ├── components/    # Reusable UI components
│   │   └── pages/         # Dashboard, Tasks, Projects, Login
│   └── ...
├── tests/               # Pytest suite (16 tests covering auth/projects/tasks/dashboard)
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Quick Start (Docker — recommended)

```bash
docker compose up --build
```

This spins up Postgres, Redis, the FastAPI backend, the Celery worker, and the Vite dev server.

- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs

## Quick Start (Manual / local dev)

### 1. Backend

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # defaults to SQLite, no extra setup needed
uvicorn backend.main:app --reload
```

The API will be live at http://localhost:8000 (interactive docs at `/docs`).

### 2. Worker (optional — requires Redis running locally)

```bash
celery -A worker.worker:celery_app worker --beat --loglevel=info
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173, create an account, and start creating projects and tasks.

## Running Tests

```bash
pip install -r requirements.txt
pytest tests/ -v
```

All 16 tests (auth, projects, tasks, dashboard stats) pass out of the box using an isolated SQLite test database.

## API Overview

| Method | Endpoint                | Description                     |
|--------|--------------------------|----------------------------------|
| POST   | `/api/auth/register`     | Create an account               |
| POST   | `/api/auth/login`        | Log in, receive a JWT           |
| GET    | `/api/auth/me`           | Current user profile            |
| GET    | `/api/projects`          | List projects                   |
| POST   | `/api/projects`          | Create a project                |
| PATCH  | `/api/projects/{id}`     | Update a project                |
| DELETE | `/api/projects/{id}`     | Delete a project                |
| GET    | `/api/tasks`             | List tasks (filter by status/project/priority/search) |
| POST   | `/api/tasks`             | Create a task                   |
| PATCH  | `/api/tasks/{id}`        | Update a task                   |
| DELETE | `/api/tasks/{id}`        | Delete a task                   |
| GET    | `/api/dashboard/stats`   | Aggregated dashboard statistics |

## Notes

- Default local dev database is SQLite for zero-setup; Docker Compose uses Postgres.
- Change `SECRET_KEY` in `.env` before deploying anywhere real.
- The worker logs its findings to stdout (overdue-task checks, daily reports) — wire in real email/push delivery in `worker/tasks/notifications.py` and `reports.py` for production use.

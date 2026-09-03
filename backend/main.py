from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database.database import Base, engine
from backend.models import models  # noqa: F401  -- ensures models are registered
from backend.api import auth, projects, tasks, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="TaskFlow API — a modern task & project management backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}


@app.get("/", tags=["health"])
def root():
    return {"message": "Welcome to the TaskFlow API. See /docs for API documentation."}

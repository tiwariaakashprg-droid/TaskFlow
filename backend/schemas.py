from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field

from backend.models.models import TaskStatus, TaskPriority


# ---------- Auth ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    avatar_color: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Project ----------
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    color: Optional[str] = "#6366F1"


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    archived: Optional[bool] = None


class ProjectOut(BaseModel):
    id: int
    name: str
    description: str
    color: str
    archived: bool
    created_at: datetime
    task_count: int = 0
    completed_count: int = 0

    class Config:
        from_attributes = True


# ---------- Task ----------
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    status: Optional[TaskStatus] = TaskStatus.todo
    priority: Optional[TaskPriority] = TaskPriority.medium
    due_date: Optional[datetime] = None
    project_id: int
    assignee_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    project_id: Optional[int] = None
    assignee_id: Optional[int] = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    project_id: int
    assignee_id: Optional[int]

    class Config:
        from_attributes = True


# ---------- Dashboard ----------
class StatusBreakdown(BaseModel):
    status: str
    count: int


class PriorityBreakdown(BaseModel):
    priority: str
    count: int


class TrendPoint(BaseModel):
    date: str
    completed: int
    created: int


class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    total_projects: int
    completion_rate: float
    status_breakdown: List[StatusBreakdown]
    priority_breakdown: List[PriorityBreakdown]
    trend: List[TrendPoint]
    recent_tasks: List[TaskOut]

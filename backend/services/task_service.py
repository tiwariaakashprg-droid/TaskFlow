from typing import Optional
from sqlalchemy.orm import Session, joinedload
from datetime import datetime

from backend.models.models import Task, Project, TaskStatus
from backend.schemas import TaskCreate, TaskUpdate


def list_tasks(
    db: Session,
    owner_id: int,
    status: Optional[TaskStatus] = None,
    project_id: Optional[int] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
):
    query = db.query(Task).join(Project).filter(Project.owner_id == owner_id)
    if status:
        query = query.filter(Task.status == status)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if priority:
        query = query.filter(Task.priority == priority)
    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))
    return query.order_by(Task.created_at.desc()).all()


def get_task(db: Session, task_id: int, owner_id: int):
    return (
        db.query(Task)
        .join(Project)
        .filter(Task.id == task_id, Project.owner_id == owner_id)
        .first()
    )


def create_task(db: Session, data: TaskCreate) -> Task:
    task = Task(**data.dict())
    if task.status == TaskStatus.done:
        task.completed_at = datetime.utcnow()
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, data: TaskUpdate) -> Task:
    update_data = data.dict(exclude_unset=True)
    previous_status = task.status
    for field, value in update_data.items():
        setattr(task, field, value)

    if "status" in update_data:
        if update_data["status"] == TaskStatus.done and previous_status != TaskStatus.done:
            task.completed_at = datetime.utcnow()
        elif update_data["status"] != TaskStatus.done:
            task.completed_at = None

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task):
    db.delete(task)
    db.commit()

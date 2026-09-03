from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.models.models import Project, Task, TaskStatus
from backend.schemas import ProjectCreate, ProjectUpdate


def list_projects(db: Session, owner_id: int, include_archived: bool = False):
    query = db.query(Project).filter(Project.owner_id == owner_id)
    if not include_archived:
        query = query.filter(Project.archived == False)  # noqa: E712
    projects = query.order_by(Project.created_at.desc()).all()

    results = []
    for p in projects:
        task_count = db.query(func.count(Task.id)).filter(Task.project_id == p.id).scalar()
        completed_count = db.query(func.count(Task.id)).filter(
            Task.project_id == p.id, Task.status == TaskStatus.done
        ).scalar()
        p.task_count = task_count or 0
        p.completed_count = completed_count or 0
        results.append(p)
    return results


def get_project(db: Session, project_id: int, owner_id: int):
    return db.query(Project).filter(Project.id == project_id, Project.owner_id == owner_id).first()


def create_project(db: Session, data: ProjectCreate, owner_id: int) -> Project:
    project = Project(**data.dict(), owner_id=owner_id)
    db.add(project)
    db.commit()
    db.refresh(project)
    project.task_count = 0
    project.completed_count = 0
    return project


def update_project(db: Session, project: Project, data: ProjectUpdate) -> Project:
    for field, value in data.dict(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project):
    db.delete(project)
    db.commit()

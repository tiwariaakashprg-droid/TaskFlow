from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.models.models import Task, Project, TaskStatus, TaskPriority


def get_dashboard_stats(db: Session, owner_id: int):
    base_query = db.query(Task).join(Project).filter(Project.owner_id == owner_id)

    total_tasks = base_query.count()
    completed_tasks = base_query.filter(Task.status == TaskStatus.done).count()
    pending_tasks = total_tasks - completed_tasks

    now = datetime.utcnow()
    overdue_tasks = base_query.filter(
        Task.due_date.isnot(None), Task.due_date < now, Task.status != TaskStatus.done
    ).count()

    total_projects = db.query(Project).filter(Project.owner_id == owner_id, Project.archived == False).count()  # noqa: E712

    completion_rate = round((completed_tasks / total_tasks) * 100, 1) if total_tasks else 0.0

    status_breakdown = [
        {"status": s.value, "count": base_query.filter(Task.status == s).count()}
        for s in TaskStatus
    ]

    priority_breakdown = [
        {"priority": p.value, "count": base_query.filter(Task.priority == p).count()}
        for p in TaskPriority
    ]

    # 7-day trend
    trend = []
    for i in range(6, -1, -1):
        day = (now - timedelta(days=i)).date()
        day_start = datetime.combine(day, datetime.min.time())
        day_end = day_start + timedelta(days=1)
        completed = base_query.filter(
            Task.completed_at.isnot(None), Task.completed_at >= day_start, Task.completed_at < day_end
        ).count()
        created = base_query.filter(Task.created_at >= day_start, Task.created_at < day_end).count()
        trend.append({"date": day.strftime("%b %d"), "completed": completed, "created": created})

    recent_tasks = base_query.order_by(Task.updated_at.desc()).limit(5).all()

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "overdue_tasks": overdue_tasks,
        "total_projects": total_projects,
        "completion_rate": completion_rate,
        "status_breakdown": status_breakdown,
        "priority_breakdown": priority_breakdown,
        "trend": trend,
        "recent_tasks": recent_tasks,
    }

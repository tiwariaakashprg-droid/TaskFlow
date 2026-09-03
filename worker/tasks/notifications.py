from datetime import datetime

from worker.worker import celery_app
from backend.database.database import SessionLocal
from backend.models.models import Task, TaskStatus


@celery_app.task(name="worker.tasks.notifications.check_overdue_tasks")
def check_overdue_tasks():
    """Scan for tasks whose due date has passed and are not yet done.
    In a production system this would push an email / push notification;
    here we log it so it's easy to see the worker doing its job."""
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        overdue = (
            db.query(Task)
            .filter(Task.due_date.isnot(None), Task.due_date < now, Task.status != TaskStatus.done)
            .all()
        )
        for task in overdue:
            print(f"[notifications] Task '{task.title}' (id={task.id}) is overdue since {task.due_date}")
        return {"overdue_count": len(overdue)}
    finally:
        db.close()


@celery_app.task(name="worker.tasks.notifications.notify_task_assigned")
def notify_task_assigned(task_id: int):
    """Fired when a task is assigned to a user (call from the API if desired)."""
    db = SessionLocal()
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            print(f"[notifications] Task '{task.title}' was assigned to user {task.assignee_id}")
    finally:
        db.close()

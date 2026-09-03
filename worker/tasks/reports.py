from datetime import datetime, timedelta

from worker.worker import celery_app
from backend.database.database import SessionLocal
from backend.models.models import Task, TaskStatus


@celery_app.task(name="worker.tasks.reports.generate_daily_report")
def generate_daily_report():
    """Aggregate yesterday's task activity into a simple report."""
    db = SessionLocal()
    try:
        yesterday_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1)
        yesterday_end = yesterday_start + timedelta(days=1)

        completed = db.query(Task).filter(
            Task.completed_at >= yesterday_start, Task.completed_at < yesterday_end
        ).count()
        created = db.query(Task).filter(
            Task.created_at >= yesterday_start, Task.created_at < yesterday_end
        ).count()

        report = {
            "date": yesterday_start.strftime("%Y-%m-%d"),
            "tasks_created": created,
            "tasks_completed": completed,
        }
        print(f"[reports] Daily report: {report}")
        return report
    finally:
        db.close()

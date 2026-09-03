import os
import sys

# Allow importing backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from celery import Celery
from celery.schedules import crontab

from backend.config import settings

celery_app = Celery(
    "taskflow_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["worker.tasks.notifications", "worker.tasks.reports"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Periodic schedule: check overdue tasks every 30 min, daily report at 8am UTC
celery_app.conf.beat_schedule = {
    "check-overdue-tasks-every-30-minutes": {
        "task": "worker.tasks.notifications.check_overdue_tasks",
        "schedule": 1800.0,
    },
    "send-daily-report": {
        "task": "worker.tasks.reports.generate_daily_report",
        "schedule": crontab(hour=8, minute=0),
    },
}

if __name__ == "__main__":
    celery_app.start()

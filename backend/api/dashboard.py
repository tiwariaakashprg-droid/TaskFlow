from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.models.models import User
from backend.schemas import DashboardStats
from backend.auth_utils import get_current_user
from backend.services import stats_service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return stats_service.get_dashboard_stats(db, current_user.id)

from fastapi import APIRouter, Depends
from app.models import User
from app.auth_utils import get_current_user
from app.core.dependencies import get_dashboard_service
from app.services import DashboardService
from datetime import date

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(
    current_user: User = Depends(get_current_user),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):

    return dashboard_service.get_dashboard_data(current_user["id"])

@router.get("/ai-export")
def get_ai(
    current_user: User = Depends(get_current_user),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):

    d = dashboard_service.get_dashboard_data(current_user["id"])
    return {
        "role": "Coach",
        "profile": d["profile"],
        "balance": d["balance"],
        "pantry": d["pantry"],
    }

@router.get("/dashboard/years")
def get_years(
    current_user: User = Depends(get_current_user),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):

    data = dashboard_service.get_dashboard_data(current_user["id"])
    transactions = data["transactions"]

    years = list(set(t["date"][:4] for t in transactions if t.get("date")))
    years.sort(reverse=True)

    if not years:
        years = [str(date.today().year)]

    return years

@router.get("/dashboard/stats")
def get_stats(
    year: str = str(date.today().year),
    current_user: User = Depends(get_current_user),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):

    return dashboard_service.get_stats_by_year(year, current_user["id"])

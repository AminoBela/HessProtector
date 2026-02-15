from fastapi import APIRouter, Depends
from app.models import PromptRequest, PlanItem, User
from app.auth_utils import get_current_user
from app.core.dependencies import (
    get_coach_service,
    get_plans_repository,
    get_dashboard_service,
)
from app.services import CoachService, DashboardService
from app.repositories import PlansRepository

router = APIRouter()


@router.post("/smart-prompt")
def generate_smart_prompt(
    req: PromptRequest,
    current_user: User = Depends(get_current_user),
    coach_service: CoachService = Depends(get_coach_service),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
):
    dashboard_data = dashboard_service.get_dashboard_data(current_user["id"])

    context = {
        "profile": dashboard_data.get("profile"),
        "pantry": dashboard_data.get("pantry", []),
        "goals": dashboard_data.get("goals", []),
        "transactions": dashboard_data.get("transactions", []),
        "recurring": dashboard_data.get("recurring", []),
    }

    return coach_service.generate_prompt(req, context)


@router.get("/plans")
def get_plans(
    current_user: User = Depends(get_current_user),
    plans_repo: PlansRepository = Depends(get_plans_repository),
):
    return plans_repo.get_all(current_user["id"])


@router.post("/plans")
def save_plan(
    p: PlanItem,
    current_user: User = Depends(get_current_user),
    plans_repo: PlansRepository = Depends(get_plans_repository),
):
    plans_repo.create(p.name, p.content, current_user["id"])
    return {"status": "saved"}


@router.delete("/plans/{id}")
def del_plan(
    id: int,
    current_user: User = Depends(get_current_user),
    plans_repo: PlansRepository = Depends(get_plans_repository),
):
    plans_repo.delete(id, current_user["id"])
    return {"status": "ok"}

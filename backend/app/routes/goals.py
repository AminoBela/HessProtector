from fastapi import APIRouter, Depends
from app.models import GoalItem, User
from app.routes.auth import get_current_user
from app.core.dependencies import get_goals_repository
from app.repositories import GoalsRepository

router = APIRouter()


@router.post("/api/goals")
def add_goal(
    goal: GoalItem,
    current_user: User = Depends(get_current_user),
    repo: GoalsRepository = Depends(get_goals_repository),
):
    """Add a financial goal"""
    repo.create(goal, current_user["id"])
    return {"status": "added"}


@router.delete("/api/goals/{id}")
def delete_goal(
    id: int,
    current_user: User = Depends(get_current_user),
    repo: GoalsRepository = Depends(get_goals_repository),
):
    """Delete a financial goal"""
    success = repo.delete(id, current_user["id"])
    return {"status": "deleted" if success else "not_found"}

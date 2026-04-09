from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.models import GoalItem, User
from app.auth_utils import get_current_user
from app.core.dependencies import get_goals_repository
from app.repositories import GoalsRepository

router = APIRouter()


class GoalPatch(BaseModel):
    label: Optional[str] = None
    target: Optional[float] = None
    saved: Optional[float] = None
    deadline: Optional[str] = None
    priority: Optional[str] = None


@router.post("/goals")
def add_goal(
    goal: GoalItem,
    current_user: User = Depends(get_current_user),
    repo: GoalsRepository = Depends(get_goals_repository),
):

    repo.create(goal, current_user["id"])
    return {"status": "added"}

@router.delete("/goals/{id}")
def delete_goal(
    id: int,
    current_user: User = Depends(get_current_user),
    repo: GoalsRepository = Depends(get_goals_repository),
):

    success = repo.delete(id, current_user["id"])
    return {"status": "deleted" if success else "not_found"}

@router.put("/goals/{id}")
def update_goal(
    id: int,
    goal: GoalItem,
    current_user: User = Depends(get_current_user),
    repo: GoalsRepository = Depends(get_goals_repository),
):

    success = repo.update(id, goal, current_user["id"])
    return {"status": "updated" if success else "not_found"}

@router.patch("/goals/{id}")
def patch_goal(
    id: int,
    patch: GoalPatch,
    current_user: User = Depends(get_current_user),
    repo: GoalsRepository = Depends(get_goals_repository),
):
    success = repo.patch(id, patch.model_dump(exclude_none=True), current_user["id"])
    return {"status": "updated" if success else "not_found"}

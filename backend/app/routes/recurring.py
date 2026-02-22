from fastapi import APIRouter, Depends
from app.models import RecurringItem, User
from app.auth_utils import get_current_user
from app.core.dependencies import get_recurring_repository
from app.repositories import RecurringRepository

router = APIRouter()

@router.post("/recurring")
def add_recurring(
    rec: RecurringItem,
    current_user: User = Depends(get_current_user),
    repo: RecurringRepository = Depends(get_recurring_repository),
):

    repo.create(rec, current_user["id"])
    return {"status": "added"}

@router.delete("/recurring/{id}")
def delete_recurring(
    id: int,
    current_user: User = Depends(get_current_user),
    repo: RecurringRepository = Depends(get_recurring_repository),
):

    success = repo.delete(id, current_user["id"])
    return {"status": "deleted" if success else "not_found"}

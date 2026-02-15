from fastapi import APIRouter, Depends
from app.models import SetupData, ProfileUpdate, BudgetLimit, User
from app.auth_utils import get_current_user
from app.core.dependencies import (
    get_profile_repository,
    get_recurring_repository,
    get_budget_repository,
    get_transaction_repository,
)
from app.repositories import (
    ProfileRepository,
    RecurringRepository,
    BudgetRepository,
    TransactionRepository,
)

router = APIRouter()


@router.post("/setup")
def setup(
    data: SetupData,
    current_user: User = Depends(get_current_user),
    profile_repo: ProfileRepository = Depends(get_profile_repository),
    recurring_repo: RecurringRepository = Depends(get_recurring_repository),
    tx_repo: TransactionRepository = Depends(get_transaction_repository),
):
    """Initial setup for new user"""

    profile_data = {
        "supermarket": data.supermarket,
        "diet": data.diet,
        "balance": data.balance,
    }
    profile_repo.create(profile_data, current_user["id"])

    for bill in data.bills:
        recurring_repo.create(bill, current_user["id"])

    from app.models import Transaction

    initial_tx = Transaction(
        label="Solde initial", amount=data.balance, type="revenu", category="Initial"
    )
    tx_repo.create(initial_tx, current_user["id"])

    return {"status": "setup_complete"}


@router.put("/profile")
def update_profile(
    profile: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    profile_repo: ProfileRepository = Depends(get_profile_repository),
):
    """Update user profile"""
    success = profile_repo.update(profile, current_user["id"])
    return {"status": "updated" if success else "failed"}


@router.post("/budget-limits")
def set_budget_limit(
    limit: BudgetLimit,
    current_user: User = Depends(get_current_user),
    budget_repo: BudgetRepository = Depends(get_budget_repository),
):
    """Set a budget limit for a category"""

    existing = budget_repo.get_by_category(limit.category, current_user["id"])

    if existing:
        budget_repo.update(existing["id"], limit, current_user["id"])
    else:
        budget_repo.create(limit, current_user["id"])

    return {"status": "saved"}


@router.get("/budget-limits")
def get_budget_limits(
    current_user: User = Depends(get_current_user),
    budget_repo: BudgetRepository = Depends(get_budget_repository),
):
    """Get all budget limits"""
    return budget_repo.get_all(current_user["id"])


@router.delete("/budget-limits/{id}")
def delete_budget_limit(
    id: int,
    current_user: User = Depends(get_current_user),
    budget_repo: BudgetRepository = Depends(get_budget_repository),
):
    """Delete a budget limit"""
    success = budget_repo.delete(id, current_user["id"])
    return {"status": "deleted" if success else "not_found"}

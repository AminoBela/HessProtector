from fastapi import APIRouter, Depends
from app.models import Transaction, User
from app.auth_utils import get_current_user
from app.core.dependencies import get_transaction_repository
from app.repositories import TransactionRepository

router = APIRouter()

@router.post("/transactions")
def add_transaction(
    tx: Transaction,
    current_user: User = Depends(get_current_user),
    repo: TransactionRepository = Depends(get_transaction_repository),
):

    repo.create(tx, current_user["id"])
    return {"status": "created"}

@router.delete("/transactions/{id}")
def delete_transaction(
    id: int,
    current_user: User = Depends(get_current_user),
    repo: TransactionRepository = Depends(get_transaction_repository),
):

    success = repo.delete(id, current_user["id"])
    return {"status": "deleted" if success else "not_found"}

@router.put("/transactions/{id}")
def update_transaction(
    id: int,
    tx: Transaction,
    current_user: User = Depends(get_current_user),
    repo: TransactionRepository = Depends(get_transaction_repository),
):

    success = repo.update(id, tx, current_user["id"])
    return {"status": "updated" if success else "not_found"}

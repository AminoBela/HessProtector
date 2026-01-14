from fastapi import APIRouter, Depends
from app.models import Transaction, User
from app.routes.auth import get_current_user
from app.core.dependencies import get_transaction_repository
from app.repositories import TransactionRepository

router = APIRouter()


@router.post("/api/transactions")
def add_transaction(
    tx: Transaction,
    current_user: User = Depends(get_current_user),
    repo: TransactionRepository = Depends(get_transaction_repository)
):
    """Add a new transaction"""
    repo.create(tx, current_user['id'])
    return {"status": "created"}


@router.delete("/api/transactions/{id}")
def delete_transaction(
    id: int,
    current_user: User = Depends(get_current_user),
    repo: TransactionRepository = Depends(get_transaction_repository)
):
    """Delete a transaction"""
    success = repo.delete(id, current_user['id'])
    return {"status": "deleted" if success else "not_found"}


@router.put("/api/transactions/{id}")
def update_transaction(
    id: int,
    tx: Transaction,
    current_user: User = Depends(get_current_user),
    repo: TransactionRepository = Depends(get_transaction_repository)
):
    """Update a transaction"""
    success = repo.update(id, tx, current_user['id'])
    return {"status": "updated" if success else "not_found"}

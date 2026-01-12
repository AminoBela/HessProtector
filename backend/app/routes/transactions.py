from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db_connection
from app.models import Transaction, User
from app.routes.auth import get_current_user
from app.repositories.transaction_repo import TransactionRepository

router = APIRouter()

def get_transaction_repo():
    conn = get_db_connection()
    try:
        yield TransactionRepository(conn)
    finally:
        conn.close()

@router.post("/api/transaction")
def add_tx(tx: Transaction, 
           current_user: User = Depends(get_current_user),
           repo: TransactionRepository = Depends(get_transaction_repo)):
    repo.create(tx, current_user['id'])
    return {"status": "ok"}

@router.delete("/api/transaction/{id}")
def del_tx(id: int, 
           current_user: User = Depends(get_current_user),
           repo: TransactionRepository = Depends(get_transaction_repo)):
    success = repo.delete(id, current_user['id'])
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"status": "ok"}

@router.put("/api/transaction/{id}")
def update_tx(id: int, 
              tx: Transaction, 
              current_user: User = Depends(get_current_user),
              repo: TransactionRepository = Depends(get_transaction_repo)):
    success = repo.update(id, tx, current_user['id'])
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"status": "ok"}


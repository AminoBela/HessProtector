from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db_connection
from app.models import RecurringItem, User
from app.routes.auth import get_current_user
from app.repositories.common_repos import RecurringRepository

router = APIRouter()

def get_recurring_repo():
    conn = get_db_connection()
    try:
        yield RecurringRepository(conn)
    finally:
        conn.close()

@router.post("/api/recurring")
def add_rec(rec: RecurringItem, 
            current_user: User = Depends(get_current_user),
            repo: RecurringRepository = Depends(get_recurring_repo)):
    repo.add(rec, current_user['id'])
    return {"status": "ok"}

@router.delete("/api/recurring/{id}")
def del_rec(id: int, 
            current_user: User = Depends(get_current_user),
            repo: RecurringRepository = Depends(get_recurring_repo)):
    success = repo.delete(id, current_user['id'])
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"status": "ok"}


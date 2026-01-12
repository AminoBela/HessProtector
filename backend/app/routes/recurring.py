from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.models import RecurringItem, User
from app.routes.auth import get_current_user

router = APIRouter()

@router.post("/api/recurring")
def add_rec(rec: RecurringItem, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO recurring (label, amount, day, type, user_id) VALUES (?, ?, ?, ?, ?)", 
              (rec.label, rec.amount, rec.day, rec.type, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/api/recurring/{id}")
def del_rec(id: int, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM recurring WHERE id=? AND user_id=?", (id, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

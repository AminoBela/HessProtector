from fastapi import APIRouter
from app.database import get_db_connection
from app.models import RecurringItem

router = APIRouter()

@router.post("/api/recurring")
def add_rec(r: RecurringItem):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO recurring (label, amount, day, type) VALUES (?, ?, ?, ?)", (r.label, r.amount, r.day, r.type))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/api/recurring/{id}")
def del_rec(id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM recurring WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return {"status": "ok"}

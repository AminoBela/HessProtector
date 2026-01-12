from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.models import Transaction, User
from app.routes.auth import get_current_user

router = APIRouter()

@router.post("/api/transaction")
def add_tx(tx: Transaction, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO transactions (label, amount, type, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)", 
              (tx.label, tx.amount, tx.type, tx.category, tx.date, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/api/transaction/{id}")
def del_tx(id: int, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM transactions WHERE id=? AND user_id=?", (id, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.put("/api/transaction/{id}")
def update_tx(id: int, tx: Transaction, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("UPDATE transactions SET label=?, amount=?, type=?, category=?, date=? WHERE id=? AND user_id=?", 
              (tx.label, tx.amount, tx.type, tx.category, tx.date, id, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

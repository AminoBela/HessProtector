from fastapi import APIRouter
from app.database import get_db_connection
from app.models import Transaction

router = APIRouter()

@router.post("/api/transaction")
def add_tx(tx: Transaction):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO transactions (label, amount, type, category, date) VALUES (?, ?, ?, ?, ?)", (tx.label, tx.amount, tx.type, tx.category, tx.date))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/api/transaction/{id}")
def del_tx(id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM transactions WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return {"status": "ok"}

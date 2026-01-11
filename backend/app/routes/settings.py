from fastapi import APIRouter
from app.database import get_db_connection
from app.models import SetupData, ProfileUpdate
from datetime import date

router = APIRouter()

@router.post("/api/setup")
def setup_app(data: SetupData):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM transactions")
    c.execute("DELETE FROM recurring")
    c.execute("DELETE FROM profile")
    c.execute("INSERT INTO profile (supermarket, diet, initial_balance) VALUES (?, ?, ?)", (data.supermarket, data.diet, data.balance))
    c.execute("INSERT INTO transactions (label, amount, type, category, date) VALUES (?, ?, ?, ?, ?)", ("Solde Initial", data.balance, "revenu", "Initial", str(date.today())))
    for bill in data.bills:
        c.execute("INSERT INTO recurring (label, amount, day, type) VALUES (?, ?, ?, ?)", (bill.label, bill.amount, bill.day, bill.type))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.put("/api/profile")
def update_profile(p: ProfileUpdate):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("UPDATE profile SET supermarket = ?, diet = ?", (p.supermarket, p.diet))
    conn.commit()
    conn.close()
    return {"status": "updated"}

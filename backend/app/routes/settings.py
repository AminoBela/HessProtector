from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.models import SetupData, ProfileUpdate, User
from app.routes.auth import get_current_user
from datetime import date

router = APIRouter()

@router.post("/api/setup")
def setup_app(data: SetupData, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    # Reset existing data for THIS user only
    c.execute("DELETE FROM transactions WHERE user_id=?", (current_user['id'],))
    c.execute("DELETE FROM recurring WHERE user_id=?", (current_user['id'],))
    c.execute("DELETE FROM profile WHERE user_id=?", (current_user['id'],))
    
    c.execute("INSERT INTO profile (supermarket, diet, initial_balance, user_id) VALUES (?, ?, ?, ?)", 
              (data.supermarket, data.diet, data.balance, current_user['id']))
    
    c.execute("INSERT INTO transactions (label, amount, type, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)", 
              ("Solde Initial", data.balance, "revenu", "Initial", str(date.today()), current_user['id']))
    
    for bill in data.bills:
        c.execute("INSERT INTO recurring (label, amount, day, type, user_id) VALUES (?, ?, ?, ?, ?)", 
                  (bill.label, bill.amount, bill.day, bill.type, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.put("/api/profile")
def update_profile(p: ProfileUpdate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("UPDATE profile SET supermarket = ?, diet = ? WHERE user_id=?", (p.supermarket, p.diet, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "updated"}

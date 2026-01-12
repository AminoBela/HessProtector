from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.models import GoalItem, User
from app.routes.auth import get_current_user

router = APIRouter()

@router.post("/api/goals")
def add_goal(g: GoalItem, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO goals (label, target, saved, deadline, priority, user_id) VALUES (?, ?, ?, ?, ?, ?)", 
              (g.label, g.target, g.saved, g.deadline, g.priority, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/api/goals/{id}")
def del_goal(id: int, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM goals WHERE id=? AND user_id=?", (id, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

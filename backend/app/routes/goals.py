from fastapi import APIRouter
from app.database import get_db_connection
from app.models import GoalItem

router = APIRouter()

@router.post("/api/goals")
def add_goal(g: GoalItem):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO goals (label, target, saved, deadline, priority) VALUES (?, ?, ?, ?, ?)", (g.label, g.target, g.saved, g.deadline, g.priority))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/api/goals/{id}")
def del_goal(id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM goals WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return {"status": "ok"}

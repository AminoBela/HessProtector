from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db_connection
from app.models import GoalItem, User
from app.routes.auth import get_current_user
from app.repositories.common_repos import GoalsRepository

router = APIRouter()

def get_goals_repo():
    conn = get_db_connection()
    try:
        yield GoalsRepository(conn)
    finally:
        conn.close()

@router.post("/api/goals")
def add_goal(g: GoalItem, 
             current_user: User = Depends(get_current_user),
             repo: GoalsRepository = Depends(get_goals_repo)):
    repo.add(g, current_user['id'])
    return {"status": "ok"}

@router.delete("/api/goals/{id}")
def del_goal(id: int, 
             current_user: User = Depends(get_current_user),
             repo: GoalsRepository = Depends(get_goals_repo)):
    success = repo.delete(id, current_user['id'])
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"status": "ok"}


from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from app.database import get_db_connection
from app.routes.auth import get_current_user
from app.auth_utils import verify_password, get_password_hash
import json

router = APIRouter(prefix="/api/account", tags=["account"])

class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str

@router.get("/export")
async def export_data(current_user=Depends(get_current_user)):
    user_id = current_user['id']
    conn = get_db_connection()
    

    def fetch_table(table_name):
        rows = conn.execute(f"SELECT * FROM {table_name} WHERE user_id = ?", (user_id,)).fetchall()
        return [dict(row) for row in rows]

    data = {
        "user": {k: v for k, v in dict(current_user).items() if k != "hashed_password"},
        "profile": fetch_table("profile"),
        "transactions": fetch_table("transactions"),
        "pantry": fetch_table("pantry"),
        "recurring": fetch_table("recurring"),
        "goals": fetch_table("goals"),
        "plans": fetch_table("plans")
    }
    conn.close()
    
    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    return Response(content=json_str, media_type="application/json", headers={
        "Content-Disposition": f"attachment; filename=hess_data_{current_user['username']}.json"
    })

@router.delete("/me")
async def delete_account(current_user=Depends(get_current_user)):
    user_id = current_user['id']
    conn = get_db_connection()
    try:

        tables = ["transactions", "pantry", "recurring", "goals", "profile", "plans"]
        for table in tables:
            conn.execute(f"DELETE FROM {table} WHERE user_id = ?", (user_id,))
            

        conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
        
    return {"message": "Account and all data permanently deleted"}

@router.put("/password")
async def change_password(req: PasswordChangeRequest, current_user=Depends(get_current_user)):
    user_id = current_user['id']

    if not verify_password(req.old_password, current_user['hashed_password']):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    new_hash = get_password_hash(req.new_password)
    
    conn = get_db_connection()
    conn.execute("UPDATE users SET hashed_password = ? WHERE id = ?", (new_hash, user_id))
    conn.commit()
    conn.close()
    
    return {"message": "Password updated successfully"}

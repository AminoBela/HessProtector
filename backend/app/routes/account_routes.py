from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from app.database import get_session
from sqlmodel import Session, select
from app.auth_utils import verify_password, get_password_hash, get_current_user
from app.models.domain import User, Profile, Transaction, PantryItem, RecurringItem, Goal, Plan, BudgetLimit, UserTheme
import json

router = APIRouter(prefix="/account", tags=["account"])

class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str

@router.get("/export")
async def export_data(current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    user_id = current_user["id"]

    def fetch_table(model_class):
        try:
            rows = session.exec(select(model_class).where(model_class.user_id == user_id)).all()
            return [row.model_dump() for row in rows]
        except Exception:
            return []

    data = {
        "user": {k: v for k, v in dict(current_user).items() if k != "hashed_password"},
        "profile": fetch_table(Profile),
        "transactions": fetch_table(Transaction),
        "pantry": fetch_table(PantryItem),
        "recurring": fetch_table(RecurringItem),
        "goals": fetch_table(Goal),
        "plans": fetch_table(Plan),
    }

    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    return Response(
        content=json_str,
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename=hess_data_{current_user['username']}.json"
        },
    )

@router.delete("/me")
async def delete_account(current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    user_id = current_user["id"]
    try:
        models = [
            Transaction,
            PantryItem,
            RecurringItem,
            Goal,
            Profile,
            Plan,
            BudgetLimit,
            UserTheme,
        ]
        for model in models:
            items = session.exec(select(model).where(model.user_id == user_id)).all()
            for item in items:
                session.delete(item)

        user = session.exec(select(User).where(User.id == user_id)).first()
        if user:
            session.delete(user)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Account and all data permanently deleted"}

@router.put("/password")
async def change_password(
    req: PasswordChangeRequest, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)
):
    user_id = current_user["id"]

    if not verify_password(req.old_password, current_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect old password")

    new_hash = get_password_hash(req.new_password)

    user = session.exec(select(User).where(User.id == user_id)).first()
    if user:
        user.hashed_password = new_hash
        session.add(user)
        session.commit()

    return {"message": "Password updated successfully"}

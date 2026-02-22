from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth_utils import get_current_user
from app.database import get_session
from sqlmodel import Session, select
from app.models.domain import Transaction, Goal, Profile, UserTheme
from app.services.gamification_service import GamificationService
from app.core.dependencies import get_gamification_service

router = APIRouter()

class MarketItemRequest(BaseModel):
    id: str
    price: int = 0

@router.post("/market/buy")
def buy_item(
    item: MarketItemRequest,
    current_user: dict = Depends(get_current_user),
    gamification_service: GamificationService = Depends(get_gamification_service),
    session: Session = Depends(get_session),
):
    item_id = item.id
    price = item.price

    try:
        transactions = session.exec(select(Transaction).where(Transaction.user_id == current_user["id"])).all()
        goals = session.exec(select(Goal).where(Goal.user_id == current_user["id"])).all()

        balance = sum(
            t.amount if t.type == "revenu" else -t.amount for t in transactions
        )

        goals_completed = len([g for g in goals if g.saved >= g.target])
        current_xp = gamification_service.calculate_xp(balance, goals_completed)

        if current_xp < price:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient XP (have {current_xp}, need {price})",
            )

        profile = session.exec(select(Profile).where(Profile.user_id == current_user["id"])).first()
        unlocked = (
            profile.unlocked_themes.split(",")
            if profile and profile.unlocked_themes
            else ["default"]
        )

        if item_id in unlocked:
            raise HTTPException(status_code=400, detail="Already owned")

        unlocked.append(item_id)
        if profile:
            profile.unlocked_themes = ",".join(unlocked)
            session.add(profile)

        user_theme = session.exec(select(UserTheme).where(UserTheme.user_id == current_user["id"], UserTheme.theme_id == item_id)).first()
        if not user_theme:
            session.add(UserTheme(user_id=current_user["id"], theme_id=item_id))

        session.commit()

        return {"status": "purchased", "item_id": item_id, "new_xp": current_xp}
    except Exception as e:
        session.rollback()
        raise e

@router.post("/market/equip")
def equip_item(item: MarketItemRequest, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    item_id = item.id

    try:
        if item_id != "default":
            profile = session.exec(select(Profile).where(Profile.user_id == current_user["id"])).first()
            unlocked = (
                profile.unlocked_themes.split(",")
                if profile and profile.unlocked_themes
                else ["default"]
            )

            if item_id not in unlocked:
                raise HTTPException(status_code=400, detail="Theme not owned")

        profile = session.exec(select(Profile).where(Profile.user_id == current_user["id"])).first()
        if profile:
            profile.active_theme = item_id
            session.add(profile)

        session.commit()
        return {"status": "equipped", "item_id": item_id}
    except Exception as e:
        session.rollback()
        raise e

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.routes.auth import get_current_user
from app.models import User
from app.database import get_db_connection
from app.services.gamification_service import GamificationService
from app.core.dependencies import get_gamification_service

router = APIRouter()

class MarketItemRequest(BaseModel):
    id: str
    price: int = 0

@router.post("/api/market/buy")
def buy_item(
    item: MarketItemRequest,
    current_user: User = Depends(get_current_user),
    gamification_service: GamificationService = Depends(get_gamification_service)
):
    """Buy a market item"""
    item_id = item.id
    price = item.price
    
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        # Get user's balance and goals for XP calculation
        c.execute("SELECT * FROM transactions WHERE user_id = ?", (current_user['id'],))
        transactions = [dict(row) for row in c.fetchall()]
        
        c.execute("SELECT * FROM goals WHERE user_id = ?", (current_user['id'],))
        goals = [dict(row) for row in c.fetchall()]
        
        # Calculate balance
        balance = sum(
            t['amount'] if t['type'] == 'revenu' else -t['amount']
            for t in transactions
        )
        
        # Calculate XP using gamification service
        goals_completed = len([g for g in goals if g['saved'] >= g['target']])
        current_xp = gamification_service.calculate_xp(balance, goals_completed)
        
        # Check if user has enough XP
        if current_xp < price:
            raise HTTPException(status_code=400, detail=f"Insufficient XP (have {current_xp}, need {price})")
        
        # Check if already owned via profile.unlocked_themes
        c.execute("SELECT unlocked_themes FROM profile WHERE user_id = ?", (current_user['id'],))
        profile_row = c.fetchone()
        unlocked = profile_row['unlocked_themes'].split(',') if profile_row and profile_row['unlocked_themes'] else ['default']
        
        if item_id in unlocked:
            raise HTTPException(status_code=400, detail="Already owned")
        
        # Unlock the theme in profile.unlocked_themes
        unlocked.append(item_id)
        c.execute("UPDATE profile SET unlocked_themes = ? WHERE user_id = ?",
                  (','.join(unlocked), current_user['id']))
        
        # Also insert into user_themes for consistency
        c.execute("INSERT OR IGNORE INTO user_themes (user_id, theme_id) VALUES (?, ?)", 
                 (current_user['id'], item_id))
        
        conn.commit()
        
        return {"status": "purchased", "item_id": item_id, "new_xp": current_xp}
    finally:
        conn.close()


@router.post("/api/market/equip")
def equip_item(
    item: MarketItemRequest,
    current_user: User = Depends(get_current_user)
):
    """Equip a market item"""
    item_id = item.id
    
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        # Check if user owns this theme (via profile.unlocked_themes)
        if item_id != 'default':
            c.execute("SELECT unlocked_themes FROM profile WHERE user_id = ?", (current_user['id'],))
            profile_row = c.fetchone()
            unlocked = profile_row['unlocked_themes'].split(',') if profile_row and profile_row['unlocked_themes'] else ['default']
            
            if item_id not in unlocked:
                raise HTTPException(status_code=400, detail="Theme not owned")
        
        # Equip theme
        c.execute("UPDATE profile SET active_theme = ? WHERE user_id = ?", 
                 (item_id, current_user['id']))
        
        conn.commit()
        return {"status": "equipped", "item_id": item_id}
    finally:
        conn.close()

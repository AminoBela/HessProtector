from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import Session, select
from datetime import datetime
import json

from app.database import get_session
from app.auth_utils import get_current_user
from app.models.domain import User, SportProfile, SportPlan, SportLog
from app.models.sport import SportProfileUpdate, SportPlanGenerateRequest, SportPlanCreate, SportLogCreate
from app.models.coach import PromptRequest
from app.services.coach_service import CoachService

router = APIRouter(prefix="/sport", tags=["Sport AI Coach"])
coach_service = CoachService()

@router.get("/profile")
def get_sport_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    profile = db.exec(select(SportProfile).where(SportProfile.user_id == current_user["id"])).first()
    if not profile:
        profile = SportProfile(user_id=current_user["id"])
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.post("/profile")
def update_sport_profile(
    update_data: SportProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    profile = db.exec(select(SportProfile).where(SportProfile.user_id == current_user["id"])).first()
    if not profile:
        profile = SportProfile(user_id=current_user["id"])
        db.add(profile)
    
    if update_data.height_cm is not None:
        profile.height_cm = update_data.height_cm
    if update_data.weight_kg is not None:
        profile.weight_kg = update_data.weight_kg
    if update_data.fitness_goal is not None:
        profile.fitness_goal = update_data.fitness_goal
    if update_data.preferred_sports is not None:
        profile.preferred_sports = update_data.preferred_sports
    if update_data.experience_level is not None:
        profile.experience_level = update_data.experience_level
    if update_data.injuries is not None:
        profile.injuries = update_data.injuries
    if update_data.equipment is not None:
        profile.equipment = update_data.equipment

    db.commit()
    db.refresh(profile)
    return {"message": "Profile updated successfully", "profile": profile}

@router.post("/generate")
def generate_sport_plan(
    req: SportPlanGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    profile = db.exec(select(SportProfile).where(SportProfile.user_id == current_user["id"])).first()
    # Let's remove current_user.__class__ queries because current_user is a dict
    user_profile = None
    
    # Optional language from generic profile
    language = "fr"
    # Wait, the profile has active_theme and generic stuff, no direct language unless we fetch user preferences?
    # We will pass what we have
    
    context = {}
    if profile:
        context["sport_profile"] = profile.model_dump()
        
    context["mode"] = req.mode
    context["weeks_duration"] = req.weeks_duration
    if req.mode == "readapt":
        context["current_plan"] = req.current_plan_json
        context["latest_checkin_notes"] = req.latest_checkin_notes
        
    prompt_req = PromptRequest(type="sport_plan", current_plan=req.current_plan_json or "")
    prompt_req.days = req.weeks_duration  # reusing this property for duration

    result = coach_service.generate_prompt(prompt_req, context)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return {"plan": result["prompt"]}

@router.get("/checkins")
def get_checkins(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    profile = db.exec(select(SportProfile).where(SportProfile.user_id == current_user["id"])).first()
    if not profile:
        return []
    logs = db.exec(select(SportLog).where(SportLog.sport_profile_id == profile.id).order_by(SportLog.date.desc())).all()
    return logs

@router.post("/checkin")
def create_checkin(
    log_data: SportLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    profile = db.exec(select(SportProfile).where(SportProfile.user_id == current_user["id"])).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Profile introuvable")
        
    # Also update profile weight directly
    if log_data.weight_kg_recorded is not None:
        profile.weight_kg = log_data.weight_kg_recorded
        
    new_log = SportLog(
        date=datetime.utcnow().isoformat(),
        weight_kg_recorded=log_data.weight_kg_recorded,
        fatigue_level=log_data.fatigue_level,
        notes=log_data.notes,
        sport_profile_id=profile.id
    )
    db.add(new_log)
    db.commit()
    return {"message": "Check-in recorded"}

@router.get("/plans")
def get_sport_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    plans = db.exec(select(SportPlan).where(SportPlan.user_id == current_user["id"]).order_by(SportPlan.created_at.desc())).all()
    return plans

@router.post("/plans")
def create_sport_plan(
    plan: SportPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    new_plan = SportPlan(
        name=plan.name,
        content_json=plan.content_json,
        created_at=datetime.utcnow().isoformat(),
        user_id=current_user["id"]
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan

@router.delete("/plans/{plan_id}")
def delete_sport_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    plan = db.exec(select(SportPlan).where(SportPlan.id == plan_id, SportPlan.user_id == current_user["id"])).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted"}

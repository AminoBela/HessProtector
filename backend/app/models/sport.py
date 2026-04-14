from pydantic import BaseModel
from typing import Optional

class SportProfileUpdate(BaseModel):
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    fitness_goal: Optional[str] = None
    preferred_sports: Optional[str] = None
    experience_level: Optional[str] = None
    injuries: Optional[str] = None
    equipment: Optional[str] = None

class SportPlanGenerateRequest(BaseModel):
    # Depending on mode: "new", "readapt"
    mode: str = "new"  
    weeks_duration: int = 4
    current_plan_json: Optional[str] = None  # To pass back when mode="readapt"
    latest_checkin_notes: Optional[str] = None

class SportLogCreate(BaseModel):
    weight_kg_recorded: Optional[float] = None
    fatigue_level: int = 5
    notes: Optional[str] = None

class SportPlanCreate(BaseModel):
    name: str
    content_json: str

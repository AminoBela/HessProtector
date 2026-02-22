from pydantic import BaseModel
from typing import List, Optional
from .recurring import RecurringItem

class ProfileUpdate(BaseModel):
    supermarket: str
    diet: str
    active_theme: Optional[str] = "default"

class SetupData(BaseModel):
    balance: float
    bills: List[RecurringItem]
    supermarket: str
    diet: str

from pydantic import BaseModel
from typing import List, Optional

class PromptRequest(BaseModel):
    type: str
    budget: Optional[float] = 0.0
    days: int = 3
    meals: List[str] = ["lunch", "dinner"]
    language: str = "fr"
    current_plan: Optional[str] = None

class PlanItem(BaseModel):
    name: str
    content: str

from pydantic import BaseModel

class GoalItem(BaseModel):
    label: str
    target: float
    saved: float
    deadline: str = ""
    priority: str = "Moyenne"

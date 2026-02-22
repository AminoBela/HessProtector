from pydantic import BaseModel

class RecurringItem(BaseModel):
    label: str
    amount: float
    day: int
    type: str = "Fixe"

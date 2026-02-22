from pydantic import BaseModel

class BudgetLimit(BaseModel):
    category: str
    amount: float

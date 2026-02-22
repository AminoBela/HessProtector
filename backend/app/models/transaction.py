from pydantic import BaseModel
from datetime import date

class Transaction(BaseModel):
    label: str
    amount: float
    type: str
    category: str = "Autre"
    date: str = str(date.today())

from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class User(BaseModel):
    username: str
    email: str | None = None

class UserCreate(User):
    password: str
    
class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class Transaction(BaseModel):
    label: str
    amount: float
    type: str
    category: str = "Autre"
    date: str = str(date.today())
    
class PantryItem(BaseModel):
    item: str
    qty: str
    category: str = "Autre"
    expiry: str = ""
    
class RecurringItem(BaseModel):
    label: str
    amount: float
    day: int
    type: str = "Fixe"
    
class GoalItem(BaseModel):
    label: str
    target: float
    saved: float
    deadline: str = ""
    priority: str = "Moyenne"
    
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
    
class SetupData(BaseModel):
    balance: float
    bills: List[RecurringItem]
    supermarket: str
    diet: str
    
class ProfileUpdate(BaseModel):
    supermarket: str
    diet: str

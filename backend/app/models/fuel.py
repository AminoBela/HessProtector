from pydantic import BaseModel
from typing import Optional

class FuelEntryCreate(BaseModel):
    date: str
    liters: float
    total_cost: float
    odometer: float
    fuel_type: str = "diesel"
    station: Optional[str] = None
    is_full_tank: bool = True
    note: Optional[str] = None

from pydantic import BaseModel


class PantryItem(BaseModel):
    item: str
    qty: str
    category: str = "Autre"
    expiry: str = ""

from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str

    transactions: List["Transaction"] = Relationship(back_populates="user")
    pantry_items: List["PantryItem"] = Relationship(back_populates="user")
    recurring_items: List["RecurringItem"] = Relationship(back_populates="user")
    goals: List["Goal"] = Relationship(back_populates="user")
    profile: Optional["Profile"] = Relationship(back_populates="user")
    plans: List["Plan"] = Relationship(back_populates="user")
    budget_limits: List["BudgetLimit"] = Relationship(back_populates="user")
    themes: List["UserTheme"] = Relationship(back_populates="user")
    fuel_entries: List["FuelEntry"] = Relationship(back_populates="user")
    sport_profile: Optional["SportProfile"] = Relationship(back_populates="user")
    sport_plans: List["SportPlan"] = Relationship(back_populates="user")

class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"
    id: Optional[int] = Field(default=None, primary_key=True)
    label: str
    amount: float
    type: str
    category: str
    date: str
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="transactions")

class PantryItem(SQLModel, table=True):
    __tablename__ = "pantry"
    id: Optional[int] = Field(default=None, primary_key=True)
    item: str
    qty: str
    category: str
    expiry: Optional[str] = None
    added_date: str
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="pantry_items")

class RecurringItem(SQLModel, table=True):
    __tablename__ = "recurring"
    id: Optional[int] = Field(default=None, primary_key=True)
    label: str
    amount: float
    day: int
    type: str
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="recurring_items")

class Goal(SQLModel, table=True):
    __tablename__ = "goals"
    id: Optional[int] = Field(default=None, primary_key=True)
    label: str
    target: float
    saved: float
    deadline: str
    priority: str
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="goals")

class Profile(SQLModel, table=True):
    __tablename__ = "profile"
    id: Optional[int] = Field(default=None, primary_key=True)
    supermarket: Optional[str] = None
    diet: Optional[str] = None
    initial_balance: float = 0.0
    active_theme: str = Field(default="default")
    unlocked_themes: str = Field(default="default")
    xp_spent: int = Field(default=0)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", unique=True)

    user: Optional[User] = Relationship(back_populates="profile")

class Plan(SQLModel, table=True):
    __tablename__ = "plans"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    content_json: str
    created_at: str
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="plans")

class BudgetLimit(SQLModel, table=True):
    __tablename__ = "budget_limits"
    id: Optional[int] = Field(default=None, primary_key=True)
    category: str
    amount: float
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="budget_limits")

class UserTheme(SQLModel, table=True):
    __tablename__ = "user_themes"
    id: Optional[int] = Field(default=None, primary_key=True)
    theme_id: str
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="themes")

class FuelEntry(SQLModel, table=True):
    __tablename__ = "fuel_entries"
    id: Optional[int] = Field(default=None, primary_key=True)
    date: str
    liters: float
    total_cost: float
    odometer: Optional[float] = None
    fuel_type: str = Field(default="diesel")
    station: Optional[str] = None
    is_full_tank: bool = Field(default=True)
    note: Optional[str] = None
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="fuel_entries")

class SportProfile(SQLModel, table=True):
    __tablename__ = "sport_profile"
    id: Optional[int] = Field(default=None, primary_key=True)
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    fitness_goal: str = Field(default="maintain")
    preferred_sports: str = Field(default="Salles de sport")
    experience_level: str = Field(default="intermediaire")
    injuries: Optional[str] = None
    equipment: Optional[str] = None
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", unique=True)

    user: Optional[User] = Relationship(back_populates="sport_profile")
    logs: list["SportLog"] = Relationship(back_populates="profile")

class SportLog(SQLModel, table=True):
    __tablename__ = "sport_logs"
    id: Optional[int] = Field(default=None, primary_key=True)
    date: str
    weight_kg_recorded: Optional[float] = None
    fatigue_level: int = Field(default=5)  # 1 to 10
    notes: Optional[str] = None
    sport_profile_id: Optional[int] = Field(default=None, foreign_key="sport_profile.id")

    profile: Optional[SportProfile] = Relationship(back_populates="logs")

class SportPlan(SQLModel, table=True):
    __tablename__ = "sport_plans"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    content_json: str
    created_at: str
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")

    user: Optional[User] = Relationship(back_populates="sport_plans")

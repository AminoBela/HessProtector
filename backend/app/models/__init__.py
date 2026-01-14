"""
Models module - Domain models organized by feature
"""

# User models
from .user import User, UserCreate, UserInDB

# Auth models
from .auth import Token, TokenData

# Transaction models
from .transaction import Transaction

# Pantry models
from .pantry import PantryItem

# Recurring models
from .recurring import RecurringItem

# Goal models
from .goal import GoalItem

# Coach models
from .coach import PromptRequest, PlanItem

# Profile models
from .profile import ProfileUpdate, SetupData

# Budget models
from .budget import BudgetLimit

__all__ = [
    # User
    "User",
    "UserCreate",
    "UserInDB",
    # Auth
    "Token",
    "TokenData",
    # Transaction
    "Transaction",
    # Pantry
    "PantryItem",
    # Recurring
    "RecurringItem",
    # Goal
    "GoalItem",
    # Coach
    "PromptRequest",
    "PlanItem",
    # Profile
    "ProfileUpdate",
    "SetupData",
    # Budget
    "BudgetLimit",
]

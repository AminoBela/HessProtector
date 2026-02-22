from fastapi import Depends
from app.database import get_session
from sqlmodel import Session
from app.core.factories import ServiceFactory
from app.repositories import (
    TransactionRepository,
    PantryRepository,
    RecurringRepository,
    GoalsRepository,
    ProfileRepository,
    PlansRepository,
    BudgetRepository,
)

def get_transaction_repository(session: Session = Depends(get_session)):
    return TransactionRepository(session)

def get_pantry_repository(session: Session = Depends(get_session)):
    return PantryRepository(session)

def get_recurring_repository(session: Session = Depends(get_session)):
    return RecurringRepository(session)

def get_goals_repository(session: Session = Depends(get_session)):
    return GoalsRepository(session)

def get_profile_repository(session: Session = Depends(get_session)):
    return ProfileRepository(session)

def get_plans_repository(session: Session = Depends(get_session)):
    return PlansRepository(session)

def get_budget_repository(session: Session = Depends(get_session)):
    return BudgetRepository(session)

def get_dashboard_service(session: Session = Depends(get_session)):
    service = ServiceFactory.create_dashboard_service(session)
    return service

def get_coach_service():
    return ServiceFactory.create_coach_service()

def get_gamification_service():
    return ServiceFactory.create_gamification_service()

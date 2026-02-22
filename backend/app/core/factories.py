from sqlmodel import Session
from app.repositories import (
    TransactionRepository,
    PantryRepository,
    RecurringRepository,
    GoalsRepository,
    ProfileRepository,
    PlansRepository,
    BudgetRepository,
    UserRepository,
)
from app.services import (
    GamificationService,
    PredictionService,
    DashboardService,
    CoachService,
)

class ServiceFactory:
    @staticmethod
    def create_dashboard_service(session: Session) -> DashboardService:
        transaction_repo = TransactionRepository(session)
        pantry_repo = PantryRepository(session)
        recurring_repo = RecurringRepository(session)
        goals_repo = GoalsRepository(session)
        profile_repo = ProfileRepository(session)

        gamification_service = GamificationService()
        prediction_service = PredictionService()

        return DashboardService(
            transaction_repo=transaction_repo,
            pantry_repo=pantry_repo,
            recurring_repo=recurring_repo,
            goals_repo=goals_repo,
            profile_repo=profile_repo,
            gamification_service=gamification_service,
            prediction_service=prediction_service,
        )

    @staticmethod
    def create_coach_service() -> CoachService:
        return CoachService()

    @staticmethod
    def create_gamification_service() -> GamificationService:
        return GamificationService()

    @staticmethod
    def create_prediction_service() -> PredictionService:
        return PredictionService()


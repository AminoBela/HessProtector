from app.database import get_db_connection
from app.repositories import (
    TransactionRepository,
    PantryRepository,
    RecurringRepository,
    GoalsRepository,
    ProfileRepository,
    PlansRepository,
    BudgetRepository,
    UserRepository
)
from app.services import (
    GamificationService,
    PredictionService,
    DashboardService,
    CoachService
)


class ServiceFactory:
    
    @staticmethod
    def create_dashboard_service() -> DashboardService:
        conn = get_db_connection()
        
        transaction_repo = TransactionRepository(conn)
        pantry_repo = PantryRepository(conn)
        recurring_repo = RecurringRepository(conn)
        goals_repo = GoalsRepository(conn)
        profile_repo = ProfileRepository(conn)
        
        gamification_service = GamificationService()
        prediction_service = PredictionService()
        
        return DashboardService(
            transaction_repo=transaction_repo,
            pantry_repo=pantry_repo,
            recurring_repo=recurring_repo,
            goals_repo=goals_repo,
            profile_repo=profile_repo,
            gamification_service=gamification_service,
            prediction_service=prediction_service
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


class RepositoryFactory:
    
    @staticmethod
    def create_transaction_repository():
        return TransactionRepository(get_db_connection())
    
    @staticmethod
    def create_pantry_repository():
        return PantryRepository(get_db_connection())
    
    @staticmethod
    def create_recurring_repository():
        return RecurringRepository(get_db_connection())
    
    @staticmethod
    def create_goals_repository():
        return GoalsRepository(get_db_connection())
    
    @staticmethod
    def create_profile_repository():
        return ProfileRepository(get_db_connection())
    
    @staticmethod
    def create_plans_repository():
        return PlansRepository(get_db_connection())
    
    @staticmethod
    def create_budget_repository():
        return BudgetRepository(get_db_connection())
    
    @staticmethod
    def create_user_repository():
        return UserRepository(get_db_connection())

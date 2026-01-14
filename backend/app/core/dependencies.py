from app.core.factories import ServiceFactory, RepositoryFactory


def get_dashboard_service():
    return ServiceFactory.create_dashboard_service()


def get_coach_service():
    return ServiceFactory.create_coach_service()


def get_transaction_repository():
    return RepositoryFactory.create_transaction_repository()


def get_pantry_repository():
    return RepositoryFactory.create_pantry_repository()


def get_recurring_repository():
    return RepositoryFactory.create_recurring_repository()


def get_goals_repository():
    return RepositoryFactory.create_goals_repository()


def get_profile_repository():
    return RepositoryFactory.create_profile_repository()


def get_plans_repository():
    return RepositoryFactory.create_plans_repository()


def get_budget_repository():
    return RepositoryFactory.create_budget_repository()

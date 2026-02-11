from app.core.factories import ServiceFactory, RepositoryFactory


def get_dashboard_service():
    service = ServiceFactory.create_dashboard_service()
    try:
        yield service
    finally:
        service.transaction_repo.close()
        service.pantry_repo.close()
        service.recurring_repo.close()
        service.goals_repo.close()
        service.profile_repo.close()


def get_coach_service():
    return ServiceFactory.create_coach_service()


def get_transaction_repository():
    repo = RepositoryFactory.create_transaction_repository()
    try:
        yield repo
    finally:
        repo.close()


def get_pantry_repository():
    repo = RepositoryFactory.create_pantry_repository()
    try:
        yield repo
    finally:
        repo.close()


def get_recurring_repository():
    repo = RepositoryFactory.create_recurring_repository()
    try:
        yield repo
    finally:
        repo.close()


def get_goals_repository():
    repo = RepositoryFactory.create_goals_repository()
    try:
        yield repo
    finally:
        repo.close()


def get_profile_repository():
    repo = RepositoryFactory.create_profile_repository()
    try:
        yield repo
    finally:
        repo.close()


def get_plans_repository():
    repo = RepositoryFactory.create_plans_repository()
    try:
        yield repo
    finally:
        repo.close()


def get_budget_repository():
    repo = RepositoryFactory.create_budget_repository()
    try:
        yield repo
    finally:
        repo.close()


def get_gamification_service():
    return ServiceFactory.create_gamification_service()

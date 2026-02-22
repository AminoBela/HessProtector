from typing import Dict
from app.repositories import (
    TransactionRepository,
    PantryRepository,
    RecurringRepository,
    GoalsRepository,
    ProfileRepository,
)
from app.services.gamification_service import GamificationService
from app.services.prediction_service import PredictionService
from app.services.builders import DashboardDataBuilder
from app.core.decorators import timed

class DashboardService:
    def __init__(
        self,
        transaction_repo: TransactionRepository,
        pantry_repo: PantryRepository,
        recurring_repo: RecurringRepository,
        goals_repo: GoalsRepository,
        profile_repo: ProfileRepository,
        gamification_service: GamificationService,
        prediction_service: PredictionService,
    ):
        self.transaction_repo = transaction_repo
        self.pantry_repo = pantry_repo
        self.recurring_repo = recurring_repo
        self.goals_repo = goals_repo
        self.profile_repo = profile_repo
        self.gamification_service = gamification_service
        self.prediction_service = prediction_service

    @timed
    def get_dashboard_data(self, user_id: int) -> Dict:
        transactions = self.transaction_repo.get_all(user_id)
        pantry = self.pantry_repo.get_all(user_id)
        recurring = self.recurring_repo.get_all(user_id)
        goals = self.goals_repo.get_all(user_id)
        profile = self.profile_repo.get_by_user(user_id)

        builder = DashboardDataBuilder()

        builder.with_base_data(transactions, pantry, recurring, goals, profile)
        builder.with_balance(transactions)
        builder.with_upcoming_bills(recurring)
        builder.with_monthly_data(transactions, recurring)
        builder.with_categories(transactions)

        balance = sum(
            t["amount"] if t["type"] == "revenu" else -t["amount"] for t in transactions
        )
        monthly_burn = sum(r["amount"] for r in recurring)

        builder.with_gamification(self.gamification_service, balance, goals)
        builder.with_prediction(
            self.prediction_service, balance, recurring, transactions
        )

        prediction = self.prediction_service.predict_month_end(
            balance, recurring, transactions
        )
        builder.with_achievements(
            self.gamification_service, balance, monthly_burn, prediction, goals, pantry
        )

        return builder.build()

    @timed
    def get_stats_by_year(self, year: str, user_id: int) -> Dict:
        transactions = self.transaction_repo.get_by_year(year, user_id)

        total_income = sum(t["amount"] for t in transactions if t["type"] == "revenu")
        total_expense = sum(t["amount"] for t in transactions if t["type"] != "revenu")

        months = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ]
        monthly_data = []

        for m in months:
            month_txs = [t for t in transactions if t["date"][5:7] == m]
            inc = sum(t["amount"] for t in month_txs if t["type"] == "revenu")
            exp = sum(t["amount"] for t in month_txs if t["type"] != "revenu")
            monthly_data.append(
                {"month": m, "income": inc, "expense": exp, "net": inc - exp}
            )

        return {
            "year": year,
            "total_income": total_income,
            "total_expense": total_expense,
            "net_result": total_income - total_expense,
            "monthly_data": monthly_data,
        }

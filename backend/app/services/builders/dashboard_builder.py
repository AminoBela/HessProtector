

from typing import Dict, List
from datetime import date

class DashboardDataBuilder:

    def __init__(self):
        self._data = {}

    def with_base_data(
        self,
        transactions: List[Dict],
        pantry: List[Dict],
        recurring: List[Dict],
        goals: List[Dict],
        profile: Dict,
    ) -> "DashboardDataBuilder":

        self._data["transactions"] = transactions
        self._data["pantry"] = pantry
        self._data["recurring"] = recurring
        self._data["goals"] = goals
        self._data["profile"] = profile
        self._data["is_setup"] = profile is not None
        return self

    def with_balance(self, transactions: List[Dict]) -> "DashboardDataBuilder":

        balance = sum(
            t["amount"] if t["type"] == "revenu" else -t["amount"] for t in transactions
        )
        self._data["balance"] = balance
        return self

    def with_upcoming_bills(self, recurring: List[Dict]) -> "DashboardDataBuilder":

        today_day = date.today().day
        upcoming_bills = sum(r["amount"] for r in recurring if r["day"] > today_day)
        self._data["upcoming_bills"] = upcoming_bills
        self._data["safe_balance"] = self._data.get("balance", 0) - upcoming_bills
        return self

    def with_monthly_data(
        self, transactions: List[Dict], recurring: List[Dict]
    ) -> "DashboardDataBuilder":

        current_month = str(date.today())[:7]

        this_month_income = sum(
            t["amount"]
            for t in transactions
            if t["type"] == "revenu" and t["date"].startswith(current_month)
        )
        this_month_expenses = sum(
            t["amount"]
            for t in transactions
            if t["type"] != "revenu" and t["date"].startswith(current_month)
        )
        monthly_burn = sum(r["amount"] for r in recurring)

        self._data["income"] = this_month_income
        self._data["expense"] = this_month_expenses
        self._data["monthly_burn"] = monthly_burn
        return self

    def with_categories(self, transactions: List[Dict]) -> "DashboardDataBuilder":

        categories = {}
        for t in transactions:
            if t["type"] == "depense":
                categories[t["category"]] = (
                    categories.get(t["category"], 0) + t["amount"]
                )
        self._data["categories"] = categories
        return self

    def with_gamification(
        self, gamification_service, balance: float, goals: List[Dict]
    ) -> "DashboardDataBuilder":

        goals_completed = len([g for g in goals if g["saved"] >= g["target"]])
        total_xp = gamification_service.calculate_xp(balance, goals_completed)
        rank_name, next_rank_xp = gamification_service.get_rank(total_xp)

        self._data["xp"] = total_xp
        self._data["rank"] = rank_name
        self._data["next_rank_xp"] = next_rank_xp
        return self

    def with_prediction(
        self,
        prediction_service,
        balance: float,
        recurring: List[Dict],
        transactions: List[Dict],
    ) -> "DashboardDataBuilder":

        prediction = prediction_service.predict_month_end(
            balance, recurring, transactions
        )
        self._data["prediction"] = prediction
        return self

    def with_achievements(
        self,
        gamification_service,
        balance: float,
        monthly_burn: float,
        prediction: Dict,
        goals: List[Dict],
        pantry: List[Dict],
    ) -> "DashboardDataBuilder":

        achievements = gamification_service.get_achievements(
            {
                "balance": balance,
                "monthly_burn": monthly_burn,
                "prediction": prediction,
                "goals": goals,
                "pantry": pantry,
            }
        )
        self._data["achievements"] = achievements
        return self

    def build(self) -> Dict:

        return self._data

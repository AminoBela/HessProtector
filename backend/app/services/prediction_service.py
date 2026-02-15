import calendar
from datetime import date
from typing import List, Dict


class PredictionService:
    def predict_month_end(
        self, balance: float, recurring: List[Dict], transactions: List[Dict]
    ) -> Dict:
        today = date.today()
        days_in_month = calendar.monthrange(today.year, today.month)[1]
        days_passed = today.day
        days_left = days_in_month - days_passed

        current_month_str = str(today)[:7]
        this_month_expenses = sum(
            t["amount"]
            for t in transactions
            if t["type"] != "revenu" and t["date"].startswith(current_month_str)
        )

        avg_daily_burn = this_month_expenses / max(1, days_passed)

        upcoming_bills = sum(r["amount"] for r in recurring if r["day"] > today.day)

        projected_burn = avg_daily_burn * days_left
        final_projection = balance - upcoming_bills - projected_burn

        return {
            "days_left": days_left,
            "avg_daily_burn": round(avg_daily_burn, 2),
            "projected_end": round(final_projection, 2),
            "status": "safe" if final_projection > 0 else "danger",
            "upcoming_bills": upcoming_bills,
        }

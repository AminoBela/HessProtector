from typing import Dict, List
from app.core.singleton import Singleton


class GamificationService(metaclass=Singleton):
    def calculate_xp(self, balance: float, goals_completed: int) -> int:
        raw_xp = int(balance)
        bonus_xp = goals_completed * 100
        return max(0, raw_xp + bonus_xp)

    def get_rank(self, xp: int) -> tuple[str, int]:
        if xp < 500:
            return "La Hess", 500
        if xp < 2000:
            return "Débrouillard", 2000
        if xp < 5000:
            return "Économe", 5000
        if xp < 10000:
            return "Investisseur", 10000
        return "Rentier", 999999

    def get_achievements(self, data: Dict) -> List[Dict]:
        achievements = []

        balance = data.get("balance", 0)
        monthly_burn = data.get("monthly_burn", 0)
        prediction = data.get("prediction", {})
        goals = data.get("goals", [])
        pantry = data.get("pantry", [])

        savings_rate = (
            (balance - monthly_burn) / max(1, balance) * 100 if balance > 0 else 0
        )
        if savings_rate > 20:
            achievements.append(
                {
                    "id": "squirrel",
                    "icon": "squirrel",
                    "name": "L'Écureuil",
                    "desc": "Épargne > 20%",
                }
            )
        else:
            achievements.append(
                {
                    "id": "squirrel_locked",
                    "icon": "lock",
                    "name": "L'Écureuil",
                    "desc": "Épargne > 20%",
                    "locked": True,
                }
            )

        if prediction.get("status") == "safe":
            achievements.append(
                {
                    "id": "survivor",
                    "icon": "island",
                    "name": "Survivant",
                    "desc": "Fin de mois dans le vert",
                }
            )
        else:
            achievements.append(
                {
                    "id": "survivor_locked",
                    "icon": "lock",
                    "name": "Survivant",
                    "desc": "Fin de mois dans le vert",
                    "locked": True,
                }
            )

        if len(goals) >= 3:
            achievements.append(
                {
                    "id": "visionary",
                    "icon": "crystal",
                    "name": "Visionnaire",
                    "desc": "3 Objectifs définis",
                }
            )
        else:
            achievements.append(
                {
                    "id": "visionary_locked",
                    "icon": "lock",
                    "name": "Visionnaire",
                    "desc": "3 Objectifs définis",
                    "locked": True,
                }
            )

        if len(pantry) >= 5:
            achievements.append(
                {
                    "id": "chef",
                    "icon": "chef",
                    "name": "Chef",
                    "desc": "Frigo bien rempli",
                }
            )
        else:
            achievements.append(
                {
                    "id": "chef_locked",
                    "icon": "lock",
                    "name": "Chef",
                    "desc": "Frigo bien rempli",
                    "locked": True,
                }
            )

        return achievements

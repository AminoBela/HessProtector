from app.repositories.base import BaseRepository
from app.models.domain import BudgetLimit
from sqlmodel import select
from typing import List, Optional

class BudgetRepository(BaseRepository):
    def _do_create(self, budget_data, user_id: int) -> int:
        db_budget = BudgetLimit(
            category=budget_data.category,
            amount=budget_data.amount,
            user_id=user_id
        )
        self.session.add(db_budget)
        self.session.commit()
        self.session.refresh(db_budget)
        return db_budget.id

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        db_budget = self.session.exec(select(BudgetLimit).where(BudgetLimit.id == id, BudgetLimit.user_id == user_id)).first()
        return self._row_to_dict(db_budget)

    def get_all(self, user_id: int) -> List[dict]:
        db_budgets = self.session.exec(select(BudgetLimit).where(BudgetLimit.user_id == user_id)).all()
        return self._rows_to_dicts(db_budgets)

    def get_by_category(self, category: str, user_id: int) -> Optional[dict]:
        db_budget = self.session.exec(select(BudgetLimit).where(BudgetLimit.category == category, BudgetLimit.user_id == user_id)).first()
        return self._row_to_dict(db_budget)

    def update(self, id: int, budget, user_id: int) -> bool:
        db_budget = self.session.exec(select(BudgetLimit).where(BudgetLimit.id == id, BudgetLimit.user_id == user_id)).first()
        if not db_budget:
            return False
        db_budget.category = budget.category
        db_budget.amount = budget.amount
        self.session.add(db_budget)
        self.session.commit()
        return True

    def delete(self, id: int, user_id: int) -> bool:
        db_budget = self.session.exec(select(BudgetLimit).where(BudgetLimit.id == id, BudgetLimit.user_id == user_id)).first()
        if not db_budget:
            return False
        self.session.delete(db_budget)
        self.session.commit()
        return True

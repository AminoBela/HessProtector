from app.repositories.base import BaseRepository
from app.models import BudgetLimit
from typing import List, Optional


class BudgetRepository(BaseRepository):
    """Repository for budget limits"""

    def _do_create(self, budget, user_id: int) -> int:
        """Create a budget limit for a category"""
        c = self.conn.cursor()
        c.execute(
            "INSERT INTO budget_limits (user_id, category, amount) VALUES (?, ?, ?)",
            (user_id, budget.category, budget.amount),
        )
        self.conn.commit()
        return c.lastrowid

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        """Get a budget limit by ID"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM budget_limits WHERE id=? AND user_id=?", (id, user_id))
        return self._row_to_dict(c.fetchone())

    def get_all(self, user_id: int) -> List[dict]:
        """Get all budget limits for a user"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM budget_limits WHERE user_id=?", (user_id,))
        return self._rows_to_dicts(c.fetchall())

    def get_by_category(self, category: str, user_id: int) -> Optional[dict]:
        """Get budget limit for a specific category"""
        c = self.conn.cursor()
        c.execute(
            "SELECT * FROM budget_limits WHERE category=? AND user_id=?",
            (category, user_id),
        )
        return self._row_to_dict(c.fetchone())

    def update(self, id: int, budget: BudgetLimit, user_id: int) -> bool:
        """Update a budget limit"""
        c = self.conn.cursor()
        c.execute(
            "UPDATE budget_limits SET category=?, amount=? WHERE id=? AND user_id=?",
            (budget.category, budget.amount, id, user_id),
        )
        self.conn.commit()
        return c.rowcount > 0

    def delete(self, id: int, user_id: int) -> bool:
        """Delete a budget limit"""
        c = self.conn.cursor()
        c.execute("DELETE FROM budget_limits WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

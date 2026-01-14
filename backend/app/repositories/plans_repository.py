from app.repositories.base import BaseRepository
from typing import List, Optional


class PlansRepository(BaseRepository):
    """Repository for saved meal plans"""
    
    def _do_create(self, plan_data: dict, user_id: int) -> int:
        c = self.conn.cursor()
        c.execute(
            "INSERT INTO saved_plans (user_id, name, content, created_at) VALUES (?, ?, ?, datetime('now'))",
            (user_id, plan_data.get('name', ''), plan_data.get('content', ''))
        )
        self.conn.commit()
        return c.lastrowid

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        """Get a plan by ID"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM plans WHERE id=? AND user_id=?", (id, user_id))
        return self._row_to_dict(c.fetchone())

    def get_all(self, user_id: int) -> List[dict]:
        """Get all plans for a user"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM plans WHERE user_id=? ORDER BY id DESC", (user_id,))
        return self._rows_to_dicts(c.fetchall())

    def delete(self, id: int, user_id: int) -> bool:
        """Delete a plan"""
        c = self.conn.cursor()
        c.execute("DELETE FROM plans WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

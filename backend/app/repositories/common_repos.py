from app.repositories.base import BaseRepository
from typing import List, Optional


class PantryRepository(BaseRepository):
    
    def _do_create(self, item, user_id: int) -> int:
        c = self.conn.cursor()
        c.execute(
            "INSERT INTO pantry (item, qty, category, expiry, added_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
            (item.item, item.qty, item.category, item.expiry, item.added_date, user_id)
        )
        self.conn.commit()
        return c.lastrowid

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM pantry WHERE id=? AND user_id=?", (id, user_id))
        return self._row_to_dict(c.fetchone())

    def get_all(self, user_id: int) -> List[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM pantry WHERE user_id=? ORDER BY expiry ASC", (user_id,))
        return self._rows_to_dicts(c.fetchall())

    def delete(self, id: int, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("DELETE FROM pantry WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

    def update(self, id: int, item, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute(
            "UPDATE pantry SET item=?, qty=?, category=?, expiry=?, added_date=? WHERE id=? AND user_id=?",
            (item.item, item.qty, item.category, item.expiry, item.added_date, id, user_id)
        )
        self.conn.commit()
        return c.rowcount > 0


class RecurringRepository(BaseRepository):
    
    def _do_create(self, recurring, user_id: int) -> int:
        c = self.conn.cursor()
        c.execute(
            "INSERT INTO recurring (label, amount, day, type, user_id) VALUES (?, ?, ?, ?, ?)",
            (recurring.label, recurring.amount, recurring.day, recurring.type, user_id)
        )
        self.conn.commit()
        return c.lastrowid

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM recurring WHERE id=? AND user_id=?", (id, user_id))
        return self._row_to_dict(c.fetchone())

    def get_all(self, user_id: int) -> List[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM recurring WHERE user_id=? ORDER BY day ASC", (user_id,))
        return self._rows_to_dicts(c.fetchall())

    def delete(self, id: int, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("DELETE FROM recurring WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

    def update(self, id: int, recurring, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute(
            "UPDATE recurring SET label=?, amount=?, day=?, type=? WHERE id=? AND user_id=?",
            (recurring.label, recurring.amount, recurring.day, recurring.type, id, user_id)
        )
        self.conn.commit()
        return c.rowcount > 0


class GoalsRepository(BaseRepository):
    
    def _do_create(self, goal, user_id: int) -> int:
        c = self.conn.cursor()
        c.execute(
            "INSERT INTO goals (label, target, saved, deadline, user_id) VALUES (?, ?, ?, ?, ?)",
            (goal.label, goal.target, goal.saved, goal.deadline, user_id)
        )
        self.conn.commit()
        return c.lastrowid

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM goals WHERE id=? AND user_id=?", (id, user_id))
        return self._row_to_dict(c.fetchone())

    def get_all(self, user_id: int) -> List[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM goals WHERE user_id=? ORDER BY deadline ASC", (user_id,))
        return self._rows_to_dicts(c.fetchall())

    def delete(self, id: int, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("DELETE FROM goals WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

    def update(self, id: int, goal, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute(
            "UPDATE goals SET label=?, target=?, saved=?, deadline=? WHERE id=? AND user_id=?",
            (goal.label, goal.target, goal.saved, goal.deadline, id, user_id)
        )
        self.conn.commit()
        return c.rowcount > 0

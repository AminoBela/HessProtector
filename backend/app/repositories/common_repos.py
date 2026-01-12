from app.repositories.base import BaseRepository
from app.models import PantryItem, RecurringItem, GoalItem
from typing import List, Optional

class PantryRepository(BaseRepository):
    def add(self, item: PantryItem, user_id: int):
        c = self.conn.cursor()
        c.execute("INSERT INTO pantry (item, qty, category, expiry, added_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
                  (item.item, item.qty, item.category, item.expiry, item.added_date, user_id)) 

        self.conn.commit()

    def delete(self, id: int, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("DELETE FROM pantry WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

class RecurringRepository(BaseRepository):
    def add(self, rec: RecurringItem, user_id: int):
        c = self.conn.cursor()
        c.execute("INSERT INTO recurring (label, amount, day, type, user_id) VALUES (?, ?, ?, ?, ?)", 
                  (rec.label, rec.amount, rec.day, rec.type, user_id))
        self.conn.commit()

    def delete(self, id: int, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("DELETE FROM recurring WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

class GoalsRepository(BaseRepository):
    def add(self, g: GoalItem, user_id: int):
        c = self.conn.cursor()
        c.execute("INSERT INTO goals (label, target, saved, deadline, priority, user_id) VALUES (?, ?, ?, ?, ?, ?)", 
                  (g.label, g.target, g.saved, g.deadline, g.priority, user_id))
        self.conn.commit()

    def delete(self, id: int, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("DELETE FROM goals WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

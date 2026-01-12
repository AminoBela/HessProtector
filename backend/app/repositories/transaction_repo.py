from app.repositories.base import BaseRepository
from app.models import Transaction
from datetime import date
from typing import List, Optional

class TransactionRepository(BaseRepository):
    def create(self, tx: Transaction, user_id: int) -> None:
        c = self.conn.cursor()
        c.execute("INSERT INTO transactions (label, amount, type, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)", 
                  (tx.label, tx.amount, tx.type, tx.category, tx.date, user_id))
        self.conn.commit()

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM transactions WHERE id=? AND user_id=?", (id, user_id))
        row = c.fetchone()
        return dict(row) if row else None

    def delete(self, id: int, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("DELETE FROM transactions WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

    def update(self, id: int, tx: Transaction, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("UPDATE transactions SET label=?, amount=?, type=?, category=?, date=? WHERE id=? AND user_id=?", 
                  (tx.label, tx.amount, tx.type, tx.category, tx.date, id, user_id))
        self.conn.commit()
        return c.rowcount > 0

from app.repositories.base import BaseRepository
from app.models import Transaction
from typing import List, Optional


class TransactionRepository(BaseRepository):
    
    def _do_create(self, tx: Transaction, user_id: int) -> int:
        c = self.conn.cursor()
        c.execute(
            "INSERT INTO transactions (label, amount, type, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
            (tx.label, tx.amount, tx.type, tx.category, tx.date, user_id)
        )
        self.conn.commit()
        return c.lastrowid
    
    def _validate_before_create(self, tx: Transaction, user_id: int):
        if tx.amount <= 0:
            raise ValueError("Transaction amount must be positive")
        if not tx.label or not tx.label.strip():
            raise ValueError("Transaction label is required")
    
    def _after_create(self, entity_id: int, tx: Transaction, user_id: int):
        print(f"Transaction {entity_id} created for user {user_id}")

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM transactions WHERE id=? AND user_id=?", (id, user_id))
        return self._row_to_dict(c.fetchone())

    def get_all(self, user_id: int) -> List[dict]:
        c = self.conn.cursor()
        c.execute("SELECT * FROM transactions WHERE user_id=? ORDER BY date DESC, id DESC", (user_id,))
        return self._rows_to_dicts(c.fetchall())

    def delete(self, id: int, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute("DELETE FROM transactions WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

    def update(self, id: int, tx: Transaction, user_id: int) -> bool:
        c = self.conn.cursor()
        c.execute(
            "UPDATE transactions SET label=?, amount=?, type=?, category=?, date=? WHERE id=? AND user_id=?",
            (tx.label, tx.amount, tx.type, tx.category, tx.date, id, user_id)
        )
        self.conn.commit()
        return c.rowcount > 0

    def get_by_year(self, year: str, user_id: int) -> List[dict]:
        c = self.conn.cursor()
        c.execute(
            "SELECT * FROM transactions WHERE strftime('%Y', date) = ? AND user_id=? ORDER BY date DESC",
            (year, user_id)
        )
        return self._rows_to_dicts(c.fetchall())

    def get_by_date_range(self, start_date: str, end_date: str, user_id: int) -> List[dict]:
        c = self.conn.cursor()
        c.execute(
            "SELECT * FROM transactions WHERE date BETWEEN ? AND ? AND user_id=? ORDER BY date DESC",
            (start_date, end_date, user_id)
        )
        return self._rows_to_dicts(c.fetchall())

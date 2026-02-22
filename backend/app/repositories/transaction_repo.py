from app.repositories.base import BaseRepository
from app.models.domain import Transaction
from sqlmodel import select
from typing import List, Optional

class TransactionRepository(BaseRepository):
    def _do_create(self, tx_data, user_id: int) -> int:
        db_tx = Transaction(
            label=tx_data.label,
            amount=tx_data.amount,
            type=tx_data.type,
            category=tx_data.category,
            date=tx_data.date,
            user_id=user_id
        )
        self.session.add(db_tx)
        self.session.commit()
        self.session.refresh(db_tx)
        return db_tx.id

    def _validate_before_create(self, tx, user_id: int):
        if tx.amount <= 0:
            raise ValueError("Transaction amount must be positive")
        if not tx.label or not tx.label.strip():
            raise ValueError("Transaction label is required")

    def _after_create(self, entity_id: int, tx, user_id: int):
        print(f"Transaction {entity_id} created for user {user_id}")

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        db_tx = self.session.exec(select(Transaction).where(Transaction.id == id, Transaction.user_id == user_id)).first()
        return self._row_to_dict(db_tx)

    def get_all(self, user_id: int) -> List[dict]:
        db_txs = self.session.exec(select(Transaction).where(Transaction.user_id == user_id).order_by(Transaction.date.desc(), Transaction.id.desc())).all()
        return self._rows_to_dicts(db_txs)

    def delete(self, id: int, user_id: int) -> bool:
        db_tx = self.session.exec(select(Transaction).where(Transaction.id == id, Transaction.user_id == user_id)).first()
        if not db_tx:
            return False
        self.session.delete(db_tx)
        self.session.commit()
        return True

    def update(self, id: int, tx, user_id: int) -> bool:
        db_tx = self.session.exec(select(Transaction).where(Transaction.id == id, Transaction.user_id == user_id)).first()
        if not db_tx:
            return False
        db_tx.label = tx.label
        db_tx.amount = tx.amount
        db_tx.type = tx.type
        db_tx.category = tx.category
        db_tx.date = tx.date
        self.session.add(db_tx)
        self.session.commit()
        return True

    def get_by_year(self, year: str, user_id: int) -> List[dict]:
        db_txs = self.session.exec(select(Transaction).where(Transaction.date.startswith(year), Transaction.user_id == user_id).order_by(Transaction.date.desc())).all()
        return self._rows_to_dicts(db_txs)

    def get_by_date_range(self, start_date: str, end_date: str, user_id: int) -> List[dict]:
        db_txs = self.session.exec(select(Transaction).where(Transaction.date >= start_date, Transaction.date <= end_date, Transaction.user_id == user_id).order_by(Transaction.date.desc())).all()
        return self._rows_to_dicts(db_txs)

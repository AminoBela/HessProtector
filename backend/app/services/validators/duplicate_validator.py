from app.services.validators.transaction_validator import TransactionValidator
from datetime import datetime, timedelta

class DuplicateValidator(TransactionValidator):
    def __init__(self, transaction_repo, next_validator=None):
        super().__init__(next_validator)
        self.transaction_repo = transaction_repo

    def _check(self, transaction, user_id: int, context: dict) -> tuple[bool, str]:
        try:
            tx_date = datetime.strptime(transaction.date, "%Y-%m-%d")
        except Exception:
            return True, ""

        start_date = (tx_date - timedelta(days=7)).strftime("%Y-%m-%d")
        end_date = (tx_date + timedelta(days=1)).strftime("%Y-%m-%d")

        recent_txs = self.transaction_repo.get_by_date_range(
            start_date, end_date, user_id
        )

        for tx in recent_txs:
            if (
                tx["label"] == transaction.label
                and tx["amount"] == transaction.amount
                and tx["type"] == transaction.type
                and tx["date"] == transaction.date
            ):
                return (
                    False,
                    f"Duplicate transaction detected: {transaction.label} ({transaction.amount}€)",
                )

        return True, ""

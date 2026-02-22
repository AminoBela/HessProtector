from app.services.validators.transaction_validator import TransactionValidator

class AmountValidator(TransactionValidator):
    def _check(self, transaction, user_id: int, context: dict) -> tuple[bool, str]:
        if transaction.amount <= 0:
            return False, "Transaction amount must be positive"

        if transaction.amount > 1000000:
            return (
                False,
                f"Transaction amount seems too large: {transaction.amount}€. Please verify.",
            )

        return True, ""

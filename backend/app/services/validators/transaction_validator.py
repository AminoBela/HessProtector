from abc import ABC, abstractmethod
from typing import Optional

class TransactionValidator(ABC):
    def __init__(self, next_validator: Optional["TransactionValidator"] = None):
        self._next = next_validator

    def validate(
        self, transaction, user_id: int, context: dict = None
    ) -> tuple[bool, str]:
        is_valid, error = self._check(transaction, user_id, context or {})

        if not is_valid:
            return False, error

        if self._next:
            return self._next.validate(transaction, user_id, context)

        return True, ""

    @abstractmethod
    def _check(self, transaction, user_id: int, context: dict) -> tuple[bool, str]:
        pass

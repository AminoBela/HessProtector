from abc import ABC, abstractmethod
from sqlmodel import Session
from typing import List, Optional, Any

class BaseRepository(ABC):
    def __init__(self, session: Session):
        self.session = session

    def close(self):
        # Session should be managed by FastAPI Depends generator,
        # but if close() is called manually we can gracefully handle it
        if self.session:
            self.session.close()

    @abstractmethod
    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        pass

    @abstractmethod
    def get_all(self, user_id: int) -> List[dict]:
        pass

    def create(self, entity: Any, user_id: int) -> int:
        self._validate_before_create(entity, user_id)
        entity_id = self._do_create(entity, user_id)
        self._after_create(entity_id, entity, user_id)
        return entity_id

    @abstractmethod
    def _do_create(self, entity: Any, user_id: int) -> int:
        pass

    def _validate_before_create(self, entity: Any, user_id: int):
        pass

    def _after_create(self, entity_id: int, entity: Any, user_id: int):
        pass

    @abstractmethod
    def delete(self, id: int, user_id: int) -> bool:
        pass

    def _row_to_dict(self, row: Any) -> Optional[dict]:
        return row.model_dump() if row else None

    def _rows_to_dicts(self, rows: List[Any]) -> List[dict]:
        return [row.model_dump() for row in rows]

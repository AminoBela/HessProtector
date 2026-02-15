from abc import ABC, abstractmethod
from sqlite3 import Connection, Row
from typing import List, Optional, Any


class BaseRepository(ABC):
    def __init__(self, conn: Connection):
        self.conn = conn
        self.conn.row_factory = Row

    def close(self):
        """Close the database connection"""
        if self.conn:
            self.conn.close()

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

    def _row_to_dict(self, row: Optional[Row]) -> Optional[dict]:
        return dict(row) if row else None

    def _rows_to_dicts(self, rows: List[Row]) -> List[dict]:
        return [dict(row) for row in rows]

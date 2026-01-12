from abc import ABC, abstractmethod
from sqlite3 import Connection, Row
from typing import List, Optional, Any

class BaseRepository(ABC):
    def __init__(self, conn: Connection):
        self.conn = conn

    @abstractmethod
    def get_by_id(self, id: int, user_id: int) -> Optional[Row]:
        pass
    
    @abstractmethod
    def delete(self, id: int, user_id: int) -> bool:
        pass

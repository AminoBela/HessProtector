from app.repositories.base import BaseRepository
from app.models.domain import User
from sqlmodel import select
from typing import Optional, List

class UserRepository(BaseRepository):
    def _do_create(self, user, user_id: int = None) -> int:
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=user.hashed_password
        )
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        return db_user.id

    def get_by_id(self, id: int, user_id: int = None) -> Optional[dict]:
        db_user = self.session.exec(select(User).where(User.id == id)).first()
        return self._row_to_dict(db_user)

    def get_by_username(self, username: str) -> Optional[dict]:
        db_user = self.session.exec(select(User).where(User.username == username)).first()
        return self._row_to_dict(db_user)

    def get_by_email(self, email: str) -> Optional[dict]:
        db_user = self.session.exec(select(User).where(User.email == email)).first()
        return self._row_to_dict(db_user)

    def get_all(self, user_id: int = None) -> List[dict]:
        db_users = self.session.exec(select(User)).all()
        return self._rows_to_dicts(db_users)

    def update_password(self, user_id: int, hashed_password: str) -> bool:
        db_user = self.session.exec(select(User).where(User.id == user_id)).first()
        if not db_user:
            return False
        db_user.hashed_password = hashed_password
        self.session.add(db_user)
        self.session.commit()
        return True

    def delete(self, id: int, user_id: int = None) -> bool:
        db_user = self.session.exec(select(User).where(User.id == id)).first()
        if not db_user:
            return False
        self.session.delete(db_user)
        self.session.commit()
        return True

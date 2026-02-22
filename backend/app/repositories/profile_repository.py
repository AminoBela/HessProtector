from app.repositories.base import BaseRepository
from app.models.domain import Profile
from sqlmodel import select
from typing import Optional

class ProfileRepository(BaseRepository):
    def _do_create(self, profile_data: dict, user_id: int) -> int:
        db_profile = Profile(
            user_id=user_id,
            supermarket=profile_data.get("supermarket", ""),
            diet=profile_data.get("diet", ""),
            initial_balance=profile_data.get("initial_balance", 0)
        )
        self.session.add(db_profile)
        self.session.commit()
        self.session.refresh(db_profile)
        return db_profile.id

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        db_profile = self.session.exec(select(Profile).where(Profile.id == id, Profile.user_id == user_id)).first()
        return self._row_to_dict(db_profile)

    def get_all(self, user_id: int) -> list[dict]:
        db_profiles = self.session.exec(select(Profile).where(Profile.user_id == user_id)).all()
        return self._rows_to_dicts(db_profiles)

    def get_by_user(self, user_id: int) -> Optional[dict]:
        db_profile = self.session.exec(select(Profile).where(Profile.user_id == user_id)).first()
        return self._row_to_dict(db_profile)

    def update(self, profile, user_id: int) -> bool:
        db_profile = self.session.exec(select(Profile).where(Profile.user_id == user_id)).first()
        if not db_profile:
            return False
        db_profile.supermarket = profile.supermarket
        db_profile.diet = profile.diet
        db_profile.active_theme = profile.active_theme
        self.session.add(db_profile)
        self.session.commit()
        return True

    def update_theme(self, theme: str, user_id: int) -> bool:
        db_profile = self.session.exec(select(Profile).where(Profile.user_id == user_id)).first()
        if not db_profile:
            return False
        db_profile.active_theme = theme
        self.session.add(db_profile)
        self.session.commit()
        return True

    def unlock_theme(self, theme: str, user_id: int) -> bool:
        db_profile = self.session.exec(select(Profile).where(Profile.user_id == user_id)).first()
        if not db_profile:
            return False
        unlocked = db_profile.unlocked_themes.split(",") if db_profile.unlocked_themes else []
        if theme not in unlocked:
            unlocked.append(theme)
            db_profile.unlocked_themes = ",".join(unlocked)
            self.session.add(db_profile)
            self.session.commit()
            return True
        return False

    def delete(self, id: int, user_id: int) -> bool:
        db_profile = self.session.exec(select(Profile).where(Profile.id == id, Profile.user_id == user_id)).first()
        if not db_profile:
            return False
        self.session.delete(db_profile)
        self.session.commit()
        return True

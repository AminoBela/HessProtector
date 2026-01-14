from app.repositories.base import BaseRepository
from app.models import ProfileUpdate
from typing import Optional


class ProfileRepository(BaseRepository):
    """Repository for user profile operations"""
    
    def _do_create(self, profile_data: dict, user_id: int) -> int:
        c = self.conn.cursor()
        c.execute(
            "INSERT INTO profiles (user_id, supermarket, diet, initial_balance) VALUES (?, ?, ?, ?)",
            (user_id, profile_data.get('supermarket', ''), profile_data.get('diet', ''), profile_data.get('initial_balance', 0))
        )
        self.conn.commit()
        return c.lastrowid

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        """Get profile by ID"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM profile WHERE id=? AND user_id=?", (id, user_id))
        return self._row_to_dict(c.fetchone())

    def get_all(self, user_id: int) -> list[dict]:
        """Get all profiles for user (typically just one)"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM profile WHERE user_id=?", (user_id,))
        return self._rows_to_dicts(c.fetchall())

    def get_by_user(self, user_id: int) -> Optional[dict]:
        """Get user's profile"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM profile WHERE user_id=?", (user_id,))
        return self._row_to_dict(c.fetchone())

    def update(self, profile: ProfileUpdate, user_id: int) -> bool:
        """Update user profile"""
        c = self.conn.cursor()
        c.execute(
            "UPDATE profile SET supermarket=?, diet=?, active_theme=? WHERE user_id=?",
            (profile.supermarket, profile.diet, profile.active_theme, user_id)
        )
        self.conn.commit()
        return c.rowcount > 0

    def update_theme(self, theme: str, user_id: int) -> bool:
        """Update active theme"""
        c = self.conn.cursor()
        c.execute("UPDATE profile SET active_theme=? WHERE user_id=?", (theme, user_id))
        self.conn.commit()
        return c.rowcount > 0

    def unlock_theme(self, theme: str, user_id: int) -> bool:
        """Add a theme to unlocked themes"""
        c = self.conn.cursor()
        c.execute("SELECT unlocked_themes FROM profile WHERE user_id=?", (user_id,))
        row = c.fetchone()
        if row:
            unlocked = row[0].split(',') if row[0] else []
            if theme not in unlocked:
                unlocked.append(theme)
                c.execute("UPDATE profile SET unlocked_themes=? WHERE user_id=?", (','.join(unlocked), user_id))
                self.conn.commit()
                return True
        return False

    def delete(self, id: int, user_id: int) -> bool:
        """Delete profile (rarely used)"""
        c = self.conn.cursor()
        c.execute("DELETE FROM profile WHERE id=? AND user_id=?", (id, user_id))
        self.conn.commit()
        return c.rowcount > 0

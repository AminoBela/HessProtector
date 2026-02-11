from app.repositories.base import BaseRepository
from typing import Optional, List


class UserRepository(BaseRepository):
    """Repository for user operations"""

    def _do_create(self, user, user_id: int) -> int:
        c = self.conn.cursor()
        c.execute(
            "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)",
            (user.username, user.email, user.hashed_password),
        )
        self.conn.commit()
        return c.lastrowid

    def get_by_id(self, id: int, user_id: int = None) -> Optional[dict]:
        """Get user by ID (user_id param ignored for compatibility)"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM users WHERE id=?", (id,))
        return self._row_to_dict(c.fetchone())

    def get_by_username(self, username: str) -> Optional[dict]:
        """Get user by username"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM users WHERE username=?", (username,))
        return self._row_to_dict(c.fetchone())

    def get_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM users WHERE email=?", (email,))
        return self._row_to_dict(c.fetchone())

    def get_all(self, user_id: int = None) -> List[dict]:
        """Get all users (admin only - user_id param for compatibility)"""
        c = self.conn.cursor()
        c.execute("SELECT * FROM users")
        return self._rows_to_dicts(c.fetchall())

    def update_password(self, user_id: int, hashed_password: str) -> bool:
        """Update user password"""
        c = self.conn.cursor()
        c.execute(
            "UPDATE users SET hashed_password=? WHERE id=?", (hashed_password, user_id)
        )
        self.conn.commit()
        return c.rowcount > 0

    def delete(self, id: int, user_id: int = None) -> bool:
        """Delete a user (user_id param for compatibility)"""
        c = self.conn.cursor()
        c.execute("DELETE FROM users WHERE id=?", (id,))
        self.conn.commit()
        return c.rowcount > 0

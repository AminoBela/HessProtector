import pytest
import sqlite3
from fastapi.testclient import TestClient
from main import app
from app.database import get_db_connection
from app.auth_utils import get_password_hash

# Mock DB Connection
@pytest.fixture(scope="function")
def db_connection():
    connection = sqlite3.connect(":memory:", check_same_thread=False)
    connection.row_factory = sqlite3.Row
    
    # Init Schema
    c = connection.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, hashed_password TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, amount REAL, type TEXT, category TEXT, date TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    # Add other tables if needed for specific tests:
    c.execute('''CREATE TABLE IF NOT EXISTS pantry (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, qty TEXT, category TEXT, expiry TEXT, added_date TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS recurring (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, amount REAL, day INTEGER, type TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, target REAL, saved REAL, deadline TEXT, priority TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY AUTOINCREMENT, supermarket TEXT, diet TEXT, initial_balance REAL, active_theme TEXT DEFAULT 'default', unlocked_themes TEXT DEFAULT 'default', user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS plans (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, content_json TEXT, created_at TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS budget_limits (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, amount REAL, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS user_themes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, theme_id TEXT, FOREIGN KEY(user_id) REFERENCES users(id))''')

    connection.commit()
    
    yield connection
    connection.close()

# Override Dependency
@pytest.fixture(scope="function")
def client(db_connection):
    def override_get_db_connection():
        return db_connection

    app.dependency_overrides[get_db_connection] = override_get_db_connection
    
    # Also patch usage in auth.py where it might be imported directly
    # Ideally usage should be via dependency, but if it is direct import, we might need patch.
    # However, for simplicity, let's assume factories use app.database.get_db_connection
    # and we can patch it using unittest.mock if needed, but dependency override is cleaner for Depends().
    # For `auth.py` which calls `get_db_connection()` directly, we definitely need to patch it.
    
    import app.routes.auth
    import app.core.factories
    
    orig_auth_db = app.routes.auth.get_db_connection
    orig_factory_db = app.core.factories.get_db_connection
    
    app.routes.auth.get_db_connection = override_get_db_connection
    app.core.factories.get_db_connection = override_get_db_connection
    
    with TestClient(app) as c:
        yield c
        
    app.routes.auth.get_db_connection = orig_auth_db
    app.core.factories.get_db_connection = orig_factory_db
    app.dependency_overrides.clear()

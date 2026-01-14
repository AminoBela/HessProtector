import sqlite3


DB_FILE = "hess_protector.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, hashed_password TEXT)''')
    

    c.execute('''CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, amount REAL, type TEXT, category TEXT, date TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS pantry (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, qty TEXT, category TEXT, expiry TEXT, added_date TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS recurring (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, amount REAL, day INTEGER, type TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, target REAL, saved REAL, deadline TEXT, priority TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY AUTOINCREMENT, supermarket TEXT, diet TEXT, initial_balance REAL, active_theme TEXT DEFAULT 'default', unlocked_themes TEXT DEFAULT 'default', user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS plans (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, content_json TEXT, created_at TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS budget_limits (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, amount REAL, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    # Auto-Create Admin
    from app.auth_utils import get_password_hash
    admin = c.execute("SELECT * FROM users WHERE username='admin'").fetchone()
    if not admin:
        print("Creating default admin account (user: admin, pass: admin123)...")
        hashed = get_password_hash("admin123")
        c.execute("INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)", 
                  ("admin", "admin@hessprotector.com", hashed))

    conn.commit()
    conn.close()

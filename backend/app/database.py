import os
import sqlite3
from sqlmodel import SQLModel, create_engine, Session

# Priority:
# 1. DATABASE_URL
# 2. Vercel Postgres: POSTGRES_URL
db_url = os.getenv("DATABASE_URL", os.getenv("POSTGRES_URL"))

if db_url:
    # SQLAlchemy requires "postgresql://" instead of "postgres://"
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    engine_kwargs = {}
    if db_url.startswith("sqlite"):
         engine_kwargs = {"check_same_thread": False}
         
    engine = create_engine(db_url, echo=False, **engine_kwargs)
else:
    # Local SQLite fallback
    DB_FILE = os.getenv("SQLITE_DB_PATH", "hess_protector.db")
    if not DB_FILE.startswith("sqlite:///"):
        DB_FILE = f"sqlite:///{DB_FILE}"
        
    engine = create_engine(DB_FILE, echo=False, connect_args={"check_same_thread": False})

def _get_raw_db_path():
    if "sqlite" in str(engine.url):
        return str(engine.url).replace("sqlite:///", "")
    return None

def _migrate_columns():
    """Add missing columns to existing tables (SQLAlchemy create_all doesn't do this)."""
    db_path = _get_raw_db_path()
    if not db_path or not os.path.exists(db_path):
        return

    migrations = [
        ("profile", "xp_spent", "INTEGER DEFAULT 0"),
    ]

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    for table, column, col_type in migrations:
        cursor.execute(f"PRAGMA table_info({table})")
        existing = [row[1] for row in cursor.fetchall()]
        if column not in existing:
            try:
                cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}")
                print(f"[MIGRATION] Added column {table}.{column}")
            except Exception as e:
                print(f"[MIGRATION] Failed to add {table}.{column}: {e}")
    conn.commit()
    conn.close()

def init_db():
    import app.models.domain  # noqa: F401
    SQLModel.metadata.create_all(engine)
    _migrate_columns()

def get_session():
    with Session(engine) as session:
        yield session

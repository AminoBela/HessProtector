import os
from sqlmodel import SQLModel, create_engine, Session

DB_FILE = os.getenv("SQLITE_DB_PATH", os.getenv("DATABASE_URL", "hess_protector.db"))
if not DB_FILE.startswith("sqlite:///"):
    DB_FILE = f"sqlite:///{DB_FILE}"

engine = create_engine(DB_FILE, echo=False, connect_args={"check_same_thread": False})

def init_db():
    import app.models.domain  # noqa: F401
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

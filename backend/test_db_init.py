import os
import sys

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from app.database import init_db
print("Initializing database...")
init_db()
print("Database initialized successfully.")

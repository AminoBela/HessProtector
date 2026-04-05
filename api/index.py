import sys
import os

# Add the root directory to the python path so imports like "app.routes" work from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from main import app

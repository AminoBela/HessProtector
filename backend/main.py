import os
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import init_db
from app.routes import dashboard, transactions, pantry, recurring, goals, coach, settings

load_dotenv()

app = FastAPI()

# Gemini Config
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
else:
    print("WARNING: GEMINI_API_KEY not found in .env")

# Init Database
init_db()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(dashboard.router)
app.include_router(transactions.router)
app.include_router(pantry.router)
app.include_router(recurring.router)
app.include_router(goals.router)
app.include_router(coach.router)
app.include_router(settings.router)
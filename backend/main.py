import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import init_db
from app.routes import dashboard, transactions, pantry, recurring, goals, coach, settings, analytics, auth, account_routes

load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "HessProtector Backend is running"}

# Gemini Config


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
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(transactions.router)
app.include_router(pantry.router)
app.include_router(recurring.router)
app.include_router(goals.router)
app.include_router(coach.router)
app.include_router(settings.router)
app.include_router(analytics.router)
app.include_router(account_routes.router)
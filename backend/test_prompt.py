import os
import requests
import sqlite3
from passlib.context import CryptContext

# Get a valid token for 'aminobela'
from app.auth_utils import create_access_token
from app.database import engine
from sqlmodel import Session, select
from app.models import UserInDB

with Session(engine) as session:
    user = session.exec(select(UserInDB).where(UserInDB.username == "aminobela")).first()
    if user:
        access_token = create_access_token(data={"sub": user.username})
        print(f"Token: {access_token[:20]}...")
        
        try:
            res = requests.post(
                "http://localhost:8000/api/smart-prompt",
                json={"type": "emergency", "budget": 0, "days": 5},
                headers={"Authorization": f"Bearer {access_token}"}
            )
            print("Status:", res.status_code)
            print("Response:", res.text)
        except Exception as e:
            print("Request crashed:", e)
    else:
        print("User aminobela not found")

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db_connection
from app.models import UserCreate, Token
from app.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    if len(user.password) < 6:
        raise HTTPException(
            status_code=400, detail="Password must be at least 6 characters"
        )

    conn = get_db_connection()

    existing = conn.execute(
        "SELECT * FROM users WHERE username = ?", (user.username,)
    ).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_pw = get_password_hash(user.password)
    c = conn.cursor()
    c.execute(
        "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)",
        (user.username, user.email, hashed_pw),
    )
    conn.commit()
    conn.close()

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ?", (form_data.username,)
    ).fetchone()
    conn.close()

    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

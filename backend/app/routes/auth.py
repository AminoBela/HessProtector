from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_session
from sqlmodel import Session, select
from app.models.domain import User as DBUser
from app.models import UserCreate, Token
from app.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

from fastapi import Response

@router.post("/register")
async def register(user: UserCreate, response: Response, session: Session = Depends(get_session)):
    if len(user.password) < 6:
        raise HTTPException(
            status_code=400, detail="Password must be at least 6 characters"
        )

    existing = session.exec(select(DBUser).where(DBUser.username == user.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_pw = get_password_hash(user.password)
    db_user = DBUser(username=user.username, email=user.email, hashed_password=hashed_pw)
    session.add(db_user)
    session.commit()

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="hess_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False, # Set to True if testing explicitly over HTTPS
    )
    return {"message": "Successfully registered", "username": user.username}

@router.post("/login")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(DBUser).where(DBUser.username == form_data.username)).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="hess_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False, # Set to True if using HTTPS
    )
    return {"message": "Successfully logged in", "username": user.username}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("hess_token", samesite="lax")
    return {"message": "Successfully logged out"}

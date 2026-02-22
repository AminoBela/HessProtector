from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str | None = None

class UserCreate(User):
    password: str

class UserInDB(User):
    hashed_password: str

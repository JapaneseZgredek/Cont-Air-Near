from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from authlib.jose import jwt
from backend.database import get_db
from backend.models.user import User
from pydantic import BaseModel, EmailStr
from backend.logging_config import logger
from dotenv import load_dotenv
import bcrypt
import os

# Load SECRET_KEY from .env file generate it manually or replace it with some really strong key
# for example to create such enviornmental variable use:
# python -c "import secrets; print(secrets.token_hex(32))"
# then save it to the .env file in / of the project folder


load_dotenv()
# SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")  # alternative way
SECRET_KEY = os.getenv("SECRET_KEY", "default-fallback-key")
print(f"SECRET_KEY: {SECRET_KEY}")  # testing reasons



ALGORITHM = "HS256" #HMAC-SHA256 we can change to any tbh but it's good

router = APIRouter()

class UserCreate(BaseModel):
    logon_name: str
    password: str
    email: EmailStr

class UserRead(BaseModel):
    id_user: int
    logon_name: str
    email: EmailStr

class UserUpdate(BaseModel):
    logon_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    logonName: str
    password: str


    class Config:
        from_attributes = True

@router.post("/users", response_model=UserRead)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating user {user}")

    if db.query(User).filter((User.logon_name == user.logon_name) | (User.email == user.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db_user = User(logon_name=user.logon_name, password=hashed_password, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/users/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):

    if not user.logonName or not user.password:
        raise HTTPException(status_code=400, detail="Both Login and Password are required to login")

    db_user = db.query(User).filter(User.logon_name == user.logonName).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    try:
        header = {"alg": ALGORITHM}
        payload = {"sub": db_user.id_user, "logon_name": db_user.logon_name}
        token = jwt.encode(header, payload, SECRET_KEY)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate authentication token")

    return {"access_token": token, "token_type": "bearer"}






@router.put("/users/{id_user}", response_model=UserRead)
def update_user(id_user: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id_user == id_user).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Sorry, user not found")

    if db.query(User).filter((User.logon_name == user.logon_name) | (User.email == user.email)).filter(User.id_user != id_user).first():
        raise HTTPException(status_code=400, detail="You can't change username or email to that one that is existing. Username or email already exists")

    db_user.logon_name = user.logon_name
    db_user.email = user.email
    db_user.password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{id_user}", response_model=dict)
def delete_user(id_user: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id_user == id_user).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"message": f"User with ID {id_user} deleted successfully"}

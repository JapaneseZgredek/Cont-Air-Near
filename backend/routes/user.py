from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import bcrypt
import os
from backend.database import get_db
from backend.models.user import User, UserRole
from backend.logging_config import logger
from datetime import datetime, timedelta
from backend.utils.role_validation import check_user_role

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "default-fallback-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

class UserCreate(BaseModel):
    logon_name: str
    password: str
    email: EmailStr
    role: UserRole = UserRole.CLIENT

class UserRead(BaseModel):
    id_user: int
    logon_name: str
    email: EmailStr
    role: UserRole

class UserLogin(BaseModel):
    logon_name: str
    password: str

class UserUpdate(BaseModel):
    logon_name: str
    email: EmailStr
    password: str

def authenticate_user(logon_name: str, password: str, db: Session):
    user = db.query(User).filter(User.logon_name == logon_name).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        logger.warning(f"Authentication failed for user: {logon_name}")
        return None
    return user

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = db.query(User).filter(User.id_user == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token validation failed")

@router.post("/users", response_model=UserRead)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter((User.logon_name == user.logon_name) | (User.email == user.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db_user = User(logon_name=user.logon_name, password=hashed_password, email=user.email, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/users/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(user.logon_name, user.password, db)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token({"sub": str(db_user.id_user)})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role.value}

@router.get("/users/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/users/{id_user}", response_model=UserRead)
def update_user(id_user: int, user: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_user_role(current_user, [UserRole.ADMIN])
    db_user = db.query(User).filter(User.id_user == id_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if db.query(User).filter((User.logon_name == user.logon_name) | (User.email == user.email)).filter(
        User.id_user != id_user
    ).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")
    db_user.logon_name = user.logon_name
    db_user.email = user.email
    db_user.password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{id_user}", response_model=dict)
def delete_user(id_user: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_user_role(current_user, [UserRole.ADMIN])
    db_user = db.query(User).filter(User.id_user == id_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": f"User with ID {id_user} deleted successfully"}

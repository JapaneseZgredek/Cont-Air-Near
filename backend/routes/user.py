from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import bcrypt
import os
from backend.database import get_db
from backend.models.user import User
from backend.logging_config import logger

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "default-fallback-key")
ALGORITHM = "HS256"

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

class UserCreate(BaseModel):
    logon_name: str
    password: str
    email: EmailStr


class UserRead(BaseModel):
    id_user: int
    logon_name: str
    email: EmailStr


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
        return None
    return user


def create_access_token(data: dict):
    to_encode = data.copy()
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info(f"Token payload: {payload}")

        user_id = payload.get("sub")
        if not user_id or not str(user_id).isdigit():
            logger.warning("Invalid token: Missing or invalid 'sub' claim")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = int(user_id)
        user = db.query(User).filter(User.id_user == user_id).first()
        if not user:
            logger.warning(f"User with ID {user_id} not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        logger.info(f"Authenticated user: {user.logon_name}")
        return user
    except JWTError as e:
        logger.error(f"JWT error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Routes
@router.post("/users", response_model=UserRead)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Registering new user: {user.logon_name}")
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
    db_user = authenticate_user(user.logon_name, user.password, db)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    token_data = {"sub": str(db_user.id_user), "logon_name": db_user.logon_name}
    token = create_access_token(token_data)

    return {"access_token": token, "token_type": "bearer"}


@router.get("/users/me", response_model=UserRead)
def get_my_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/users/{id_user}", response_model=UserRead)
def update_user(id_user: int, user: UserUpdate, db: Session = Depends(get_db)):
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
def delete_user(id_user: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id_user == id_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"message": f"User with ID {id_user} deleted successfully"}

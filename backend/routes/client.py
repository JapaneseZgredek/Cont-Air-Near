from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from backend.models.client import Client, UserRole
from backend.database import get_db
from backend.logging_config import logger
from dotenv import load_dotenv
import bcrypt
import os
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from typing import List, Optional

from backend.models.order import Order
from backend.utils.role_validation import check_user_role

from backend.models.debl.email_block_list import email_block_list
from email_validator import validate_email, EmailNotValidError

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "default-fallback-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 90

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/clients/login")

router = APIRouter()


class ClientCreate(BaseModel):
    name: str
    address: str
    telephone_number: Optional[int] = None
    email: str
    logon_name: str
    password: str
    role: UserRole = UserRole.CLIENT


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    telephone_number: Optional[int] = None
    email: Optional[str] = None
    logon_name: str
    password: Optional[str] = None
    role: UserRole

class ClientRead(BaseModel):
    id_client: int
    name: str
    address: str
    telephone_number: Optional[int] = None
    email: str
    logon_name: str
    role: UserRole       ## tutaj musi być zawsze str, bo serializacja w fastapi/pydantic modelu (dla create ma być tak jak jest)

class ClientLogin(BaseModel):
    logon_name: str
    password: str

    class Config:
        orm_mode = True
        use_enum_values = True

class ClientDetailsDTO(BaseModel):
    id_client: int
    name: str
    address: str
    telephone_number: Optional[int]
    email: str
    logon_name: str
    role: str
    orders: List[int]

    class Config:
        orm_mode = True

@router.get("/clients/{id_client}/details", response_model=ClientDetailsDTO)
def get_client_details(id_client: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id_client == id_client).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Pobieranie zamówień związanych z klientem
    orders = db.query(Order.id_order).filter(Order.id_client == id_client).all()
    order_ids = [order.id_order for order in orders]

    return ClientDetailsDTO(
        id_client=client.id_client,
        name=client.name,
        address=client.address,
        telephone_number=client.telephone_number,
        email=client.email,
        logon_name=client.logon_name,
        role=client.role.value,
        orders=order_ids,
    )


def authenticate_client(logon_name: str, password: str, db: Session):
    client = db.query(Client).filter(Client.logon_name == logon_name).first()
    if not client or not bcrypt.checkpw(password.encode('utf-8'), client.password.encode('utf-8')):
        logger.warning(f"Authentication failed for client: {logon_name}")
        return None
    return client

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_client(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_client = payload.get("sub")
        if not id_client:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: Missing 'sub' claim")
        client = db.query(Client).filter(Client.id_client == int(id_client)).first()
        if not client:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
        return client
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token validation failed: {str(e)}")

#CRUD TABELE OG z wcześniej:
@router.get("/clients", response_model=List[ClientRead])
def get_all_clients(db: Session = Depends(get_db), current_client=Depends(get_current_client)):
    check_user_role(current_client, [UserRole.ADMIN, UserRole.CLIENT, UserRole.EMPLOYEE])
    logger.info("Getting all clients")
    clients = db.query(Client).all()
    return clients

@router.get("/clients/me", response_model=ClientRead)
def get_current_client_info(current_client: Client = Depends(get_current_client)):
    return current_client

@router.get("/clients/{id_client}", response_model=ClientRead)
def read_client(id_client: int, db: Session = Depends(get_db), current_client=Depends(get_current_client)):
    check_user_role(current_client, [UserRole.ADMIN])
    logger.info(f"Reading client with id: {id_client}")
    db_client = db.query(Client).filter(Client.id_client == id_client).first()
    if db_client is None:
        logger.warning(f"Client with id: {id_client} not found")
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

def is_disposable_email(email: str, db: Session) -> bool:
    try:
        logger.info(f"Checking if email is disposable: {email}")
        validated_email = validate_email(email).email
        logger.info(f"Validating email: {validated_email}")
        domain = validated_email.split('@')[-1].lower()
        logger.info(f"Validating domain: {domain}")
        is_blocked = db.query(email_block_list).filter(email_block_list.domain == domain).first() is not None
        logger.info(f"Is domain blocked: {is_blocked}")
        return is_blocked
    except EmailNotValidError:
        logger.error(f"Email validation failed: {str(EmailNotValidError)}")
        raise HTTPException(status_code=400, detail="Invalid email format")
@router.post("/clients", response_model=ClientRead)
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
):
    if is_disposable_email(client.email, db):
        raise HTTPException(status_code=400, detail="Disposable email addresses are not allowed")
    if db.query(Client).filter((Client.logon_name == client.logon_name) | (Client.email == client.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")
    logger.info(f"Creating new client: {client}")
    hashed_password = bcrypt.hashpw(client.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    assert client.telephone_number is None or isinstance(client.telephone_number, int), "phone_no should be nullable or an integer"
    db_client = Client(
        name=client.name,
        address=client.address,
        telephone_number=client.telephone_number,
        email=client.email,
        logon_name=client.logon_name,
        password=hashed_password,
        role=client.role.value)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.post("/clients/login")
def login_client(client: ClientLogin, db: Session = Depends(get_db)):
    db_client = authenticate_client(client.logon_name, client.password, db)
    if not db_client:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token({"sub": str(db_client.id_client)})
    return {"access_token": token, "token_type": "bearer", "role": db_client.role.value}

@router.put("/clients/{id_client}", response_model=ClientRead)
def update_client(
    id_client: int,
    client: ClientUpdate,
    db: Session = Depends(get_db),
    current_client=Depends(get_current_client)
):
    check_user_role(current_client, [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT])
    logger.info(f"Updating client with ID: {id_client}")
    if (current_client.role == UserRole.ADMIN or (current_client.id_client == id_client)):
        db_client = db.query(Client).filter(Client.id_client == id_client).first()
        if db_client is None:
            logger.warning(f"Client with ID: {id_client} not found")
            raise HTTPException(status_code=404, detail="Client not found")

        # Prevent duplicate logon_name or email
        if db.query(Client).filter(
            (Client.logon_name == client.logon_name) | (Client.email == client.email)
        ).filter(Client.id_client != id_client).first():
            raise HTTPException(status_code=400, detail="Username or email already exists")

        # Update fields if provided
        if client.name:
            db_client.name = client.name
        if client.address:
            db_client.address = client.address
        if client.telephone_number:
            db_client.telephone_number = client.telephone_number
        if client.email:
            db_client.email = client.email
        if client.logon_name:
            db_client.logon_name = client.logon_name
        if client.password:
            db_client.password = bcrypt.hashpw(client.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        if client.role:
            db_client.role = client.role

        logger.info(f"Updated client fields: {client.dict(exclude_unset=True)}")
        db.commit()
        db.refresh(db_client)
        return db_client
    else:
        logger.warning(f"Client with no admin role can't access other client data")
        raise HTTPException(status_code=403, detail="Cant modify other users data")


@router.delete("/clients/{id_client}", response_model=dict)
def delete_client(
        id_client: int,
        db: Session = Depends(get_db),
        current_client=Depends(get_current_client)
):
    check_user_role(current_client, [UserRole.ADMIN])
    logger.info(f"Deleting client with id: {id_client}")
    db_client = db.query(Client).filter(Client.id_client == id_client).first()
    if db_client is None:
        logger(f"Client with id: {id_client} not found")
        raise HTTPException(status_code=404, detail="Client not found")
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(db_client)
    db.commit()
    return {"message": f"Client with ID {id_client} deleted successfully"}


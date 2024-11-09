from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.models.client import Client
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class ClientCreate(BaseModel):
    name: str
    address: str
    phone_no: Optional[int] = None
    email: str


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone_no: Optional[int] = None
    email: Optional[str] = None


class ClientRead(BaseModel):
    id_client: int
    name: str
    address: str
    phone_no: int
    email: str

    class Config:
        from_attributes = True


@router.get("/clients", response_model=List[ClientRead])
def get_all_clients(db: Session = Depends(get_db)):
    logger.info("Getting all clients")
    clients = db.query(Client).all()
    return clients


@router.get("/clients/{id_client}", response_model=ClientRead)
def read_client(id_client: int, db: Session = Depends(get_db)):
    logger.info(f"Reading client with id: {id_client}")
    db_client = db.query(Client).filter(Client.id_client == id_client).first()
    if db_client is None:
        logger.warning(f"Client with id: {id_client} not found")
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


@router.post("/clients", response_model=ClientRead)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating new client: {client}")
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.put("/clients/id_client}", response_model=ClientRead)
def update_client(id_client: int, client: ClientUpdate, db: Session = Depends(get_db)):
    logger.info(f"Updating client with id: {id_client}")
    db_client = db.query(Client).filter(Client.id_client == id_client).first()
    if db_client is None:
        logger.warning(f"Client with id: {id_client} not found")
        raise HTTPException(status_code=404, detail="Client not found")

    if client.name is not None:
        db_client.name = client.name
    if client.address is not None:
        db_client.address = client.address
    if client.phone_no is not None:
        db_client.phone_no = client.phone_no
    if client.email is not None:
        db_client.email = client.email

    db.commit()
    db.refresh(db_client)
    return db_client


@router.delete("/clients/{id_client}", response_model=dict)
def delete_client(id_client: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting client with id: {id_client}")
    db_client = db.query(Client).filter(Client.id_client == id_client).first()
    if db_client is None:
        logger.warning(f"Client with id: {id_client} not found")
        raise HTTPException(status_code=404, detail="Client not found")

    db.delete(db_client)
    db.commit()
    return {"message": "Client deleted successfully", "client": db_client}

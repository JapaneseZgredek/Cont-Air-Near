from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.models import Operation
from backend.models.order import Order
from backend.models.order_product import Order_product
from backend.models.port import Port
from backend.database import get_db
from backend.logging_config import logger
from backend.utils.role_validation import check_user_role
from pydantic import BaseModel
from typing import List, Optional
from .client import get_current_client
from ..models import UserRole

router = APIRouter()


class PortCreate(BaseModel):
    name: str
    location: str
    country: str


class PortUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None


class PortRead(BaseModel):
    id_port: int
    name: str
    location: str
    country: str

    class Config:
        from_attributes = True


@router.get("/ports", response_model=List[PortRead])
def get_all_ports(
    db: Session = Depends(get_db),
    current_client = Depends(get_current_client)
):
    check_user_role(current_client, [UserRole.EMPLOYEE, UserRole.ADMIN])
    logger.info("Getting all ports")
    ports = db.query(Port).all()
    return ports


@router.get("/ports/{id_port}", response_model=PortRead)
def read_port(
    id_port: int,
    db: Session = Depends(get_db),
    current_client = Depends(get_current_client)
):
    check_user_role(current_client, [UserRole.EMPLOYEE, UserRole.ADMIN])
    logger.info(f"Reading port with id: {id_port}")
    db_port = db.query(Port).filter(Port.id_port == id_port).first()
    if db_port is None:
        logger.warning(f"Port with id: {id_port} not found")
        raise HTTPException(status_code=404, detail="Port not found")
    return db_port


@router.post("/ports", response_model=PortRead)
def create_port(
    port: PortCreate,
    db: Session = Depends(get_db),
    current_client = Depends(get_current_client)
    ):
    check_user_role(current_client, [UserRole.EMPLOYEE, UserRole.ADMIN])
    logger.info(f"Creating port: {port}")
    db_port = Port(**port.dict())
    db.add(db_port)
    db.commit()
    db.refresh(db_port)
    return db_port


@router.put("/ports/{id_port}", response_model=PortRead)
def update_port(
    id_port: int,
    port: PortUpdate,
    db: Session = Depends(get_db),
    current_client = Depends(get_current_client)
):
    check_user_role(current_client, [UserRole.EMPLOYEE, UserRole.ADMIN])
    logger.info(f"Updating port with id: {id_port}")
    db_port = db.query(Port).filter(Port.id_port == id_port).first()
    if db_port is None:
        logger.warning(f"Port with id: {id_port} not found")
        raise HTTPException(status_code=404, detail="Port not found")

    if port.name is not None:
        db_port.name = port.name
    if port.location is not None:
        db_port.location = port.location
    if port.country is not None:
        db_port.country = port.country

    db.commit()
    db.refresh(db_port)
    return db_port


@router.delete("/ports/{id_port}", response_model=dict)
def delete_port(
    id_port: int,
    db: Session = Depends(get_db),
    current_client = Depends(get_current_client)
):
    check_user_role(current_client, [UserRole.EMPLOYEE, UserRole.ADMIN])
    logger.info(f"Deleting port with id: {id_port}")
    db_port = db.query(Port).filter(Port.id_port == id_port).first()
    if db_port is None:
        logger.warning(f"Port with id: {id_port} not found")
        raise HTTPException(status_code=404, detail="Port not found")

    order_ids_to_delete = db.query(Order.id_order).filter(Order.id_port == id_port).all()
    if order_ids_to_delete:
        order_ids_to_delete = [order.id_order for order in order_ids_to_delete]
        db.query(Order_product).filter(Order_product.id_order.in_(order_ids_to_delete)).delete(synchronize_session=False)
        logger.info(f"Deleted related Order_product entries for orders: {order_ids_to_delete}")

    db.query(Order).filter(Order.id_port == id_port).delete(synchronize_session=False)
    logger.info(f"Deleted orders with port id: {id_port}")
    db.query(Operation).filter(Operation.id_port == id_port).delete()

    db.delete(db_port)
    db.commit()
    return {
        "message": "Port deleted successfully",
        "port": PortRead.from_orm(db_port)
    }

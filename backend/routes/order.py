from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from backend.models import Operation
from backend.models.order import Order, OrderStatus
from backend.models.order_product import Order_product
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional
from ..models import Ship, Port, User
from .user import get_current_user

router = APIRouter()

class OrderCreate(BaseModel):
    status: OrderStatus
    date_of_order: Optional[datetime] = None
    id_port: int
    id_client: int

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    date_of_order: Optional[datetime] = None
    id_port: Optional[int] = None
    id_client: Optional[int] = None

class OrderRead(BaseModel):
    id_order: int
    status: OrderStatus
    date_of_order: datetime
    id_port: int
    id_client: int

    class Config:
        # from_attributes = True
        orm_mode = True

@router.get("/orders/port/{id_port}", response_model=List[OrderRead])
def read_orders_by_port(id_port: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    orders = db.query(Order).filter(Order.id_port == id_port).all()
    if not orders:
        raise HTTPException(status_code=404, detail=f"No orders found for port with id: {id_port}")
    return orders

@router.get("/orders/client/{id_client}", response_model=List[OrderRead])
def read_orders_by_client(id_client: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    orders = db.query(Order).filter(Order.id_client == id_client).all()
    if not orders:
        raise HTTPException(status_code=404, detail=f"No orders found for client with id: {id_client}")
    return orders

@router.get("/orders", response_model=List[OrderRead])
def get_all_orders(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    logger.info("Getting all orders")
    orders = db.query(Order).all()
    if not orders:
        raise HTTPException(
            status_code=404, detail="No orders found"
        )
    return orders

@router.post("/orders", response_model=OrderRead)
def create_order(order: OrderCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    logger.info(f"Received data for creating order: {order.dict()}")
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/orders/{id_order}", response_model=OrderRead)
def read_order(id_order: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    logger.info(f"Reading order with id: {id_order}")
    db_order = db.query(Order).filter(Order.id_order == id_order).first()
    if db_order is None:
        logger.error(f"Order with id: {id_order} not found")
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.put("/orders/{id_order}", response_model=OrderRead)
def update_order(id_order: int, order: OrderUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    logger.info(f"Updating order with id: {id_order}")
    db_order = db.query(Order).filter(Order.id_order == id_order).first()
    if db_order is None:
        logger.error(f"Order with id: {id_order} not found")
        raise HTTPException(status_code=404, detail="Order not found")

    if order.id_port is not None:
        db_order.id_port = order.id_port
    if order.status is not None:
        db_order.status = order.status
    if order.date_of_order is not None:
        db_order.date_of_order = order.date_of_order
    if order.id_client is not None:
        db_order.id_client = order.id_client

    db.commit()
    db.refresh(db_order)
    return db_order

@router.delete("/orders/{id_order}", response_model=dict)
def delete_order(id_order: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    logger.info(f"Deleting order with id: {id_order}")
    db_order = db.query(Order).filter(Order.id_order == id_order).first()
    if db_order is None:
        logger.error(f"Order with id: {id_order} not found")
        raise HTTPException(status_code=404, detail="Order not found")
    db.query(Order_product).filter(Order_product.id_order == id_order).delete()
    # TO DO: Usuniecie powiazanych Order_History

    db.delete(db_order)
    db.commit()
    return {
        "message": "Order deleted successfully",
        "order": OrderRead.from_orm(db_order)
    }
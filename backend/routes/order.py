from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.models.order import Order, OrderStatus
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class OrderCreate(BaseModel):
    status: OrderStatus
    date_of_order: Optional[datetime] = None
    id_port: int
    # TO DO: Add id_client when the Client model is available

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    date_of_order: Optional[datetime] = None
    id_port: Optional[int] = None
    # TO DO: Add id_client when the Client model is available

class OrderRead(BaseModel):
    id_order: int
    status: OrderStatus
    date_of_order: datetime
    id_port: int
    # TO DO: Add client informaiton when Client model is available

    class Config:
        from_attributes = True

@router.get("/orders", response_model=List[OrderRead])
def get_all_orders(db: Session = Depends(get_db)):
    logger.info("Getting all orders")
    orders = db.query(Order).all()
    return orders

@router.post("/orders", response_model=OrderRead)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating order: {order}")
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

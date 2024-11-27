from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

from backend.models.order_history import OrderHistory
from backend.models.order import Order
from backend.database import get_db
from backend.logging_config import logger

router = APIRouter()

class OrderHistoryCreate(BaseModel):
    description: str
    date: datetime
    Order_id_order: Optional[int]

class OrderHistoryUpdate(BaseModel):
    description: str
    date: datetime

class OrderHistoryRead(BaseModel):
    id_history: int
    description: str
    date: datetime
    Order_id_order: Optional[int]

    class Config:
        from_attributes = True



@router.get("/order_histories", response_model=List[OrderHistoryRead])
def get_all_order_histories(db: Session = Depends(get_db)):
    logger.info("Getting all order histories")
    histories = db.query(OrderHistory).all()
    return histories


@router.post("/order_histories", response_model=OrderHistoryRead)
def create_order_history(order_history: OrderHistoryCreate, db: Session = Depends(get_db)):
    logger.info(f"Received data for creating order history: {order_history.dict()}")
    db_order = db.query(Order).filter(Order.id_order == order_history.Order_id_order).first()
    if db_order is None:
        logger.error(f"Order with id: {order_history.Order_id_order} not found")
        raise HTTPException(status_code=404, detail="Associated order not found")

    db_order_history = OrderHistory(
        **order_history.dict()
    )
    db.add(db_order_history)
    db.commit()
    db.refresh(db_order_history)
    return db_order_history


@router.get("/order_histories/{id_history}", response_model=OrderHistoryRead)
def read_order_history(id_history: int, db: Session = Depends(get_db)):
    logger.info(f"Reading order history with id: {id_history}")
    db_order_history = db.query(OrderHistory).filter(OrderHistory.id_history == id_history).first()
    if db_order_history is None:
        logger.error(f"Order history with id: {id_history} not found")
        raise HTTPException(status_code=404, detail="Order history not found")
    return db_order_history


@router.put("/order_histories/{id_history}", response_model=OrderHistoryRead)
def update_order_history(id_history: int, order_history: OrderHistoryUpdate, db: Session = Depends(get_db)):
    logger.info(f"Updating order history with id: {id_history}")
    db_order_history = db.query(OrderHistory).filter(OrderHistory.id_history == id_history).first()
    if db_order_history is None:
        logger.error(f"Order history with id: {id_history} not found")
        raise HTTPException(status_code=404, detail="Order history not found")

    if order_history.description is not None:
        db_order_history.description = order_history.description
    if order_history.date is not None:
        db_order_history.date = order_history.date

    db.commit()
    db.refresh(db_order_history)
    return db_order_history


@router.delete("/order_histories/{id_history}", response_model=dict)
def delete_order_history(id_history: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting order history with id: {id_history}")
    db_order_history = db.query(OrderHistory).filter(OrderHistory.id_history == id_history).first()
    if db_order_history is None:
        logger.error(f"Order history with id: {id_history} not found")
        raise HTTPException(status_code=404, detail="Order history not found")

    db.delete(db_order_history)
    db.commit()
    return {
        "message": "Order history deleted successfully",
        "order_history": OrderHistoryRead.from_orm(db_order_history)
    }

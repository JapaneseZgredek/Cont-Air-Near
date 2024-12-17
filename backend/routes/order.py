from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.models import Operation
from backend.models.order import Order, OrderStatus
from backend.models.order_product import Order_product
from backend.models.client import Client
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel, Field
from typing import List, Optional
from ..models import Ship, Port
from .client import get_current_client

router = APIRouter()


class OrderCreate(BaseModel):
    status: OrderStatus  # Ensure this is passed properly
    date_of_order: Optional[datetime] = Field(default_factory=datetime.now)  # Use Field with default_factory for dynamic defaults
    description: Optional[str] = None  # Optional field
    id_port: int  # Required int field
    id_client: int  # Required int field

    class Config:
        orm_mode = True  # Ensures Pydantic works with ORM objects


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    date_of_order: Optional[datetime] = None
    description: Optional[str] = None
    id_port: Optional[int] = None
    id_client: Optional[int] = None


class OrderRead(BaseModel):
    id_order: int
    status: OrderStatus
    date_of_order: datetime
    description: Optional[str]
    id_port: int
    id_client: int

    class Config:
        orm_mode = True  # Ensures Pydantic works with ORM objects


@router.get("/orders/port/{id_port}", response_model=List[OrderRead])
def read_orders_by_port(id_port: int, db: Session = Depends(get_db), current_client=Depends(get_current_client)):
    orders = db.query(Order).filter(Order.id_port == id_port).all()
    if not orders:
        raise HTTPException(status_code=404, detail=f"No orders found for port with id: {id_port}")
    return orders


@router.get("/orders/client/{id_client}", response_model=List[OrderRead])
def read_orders_by_client(id_client: int, db: Session = Depends(get_db), current_client=Depends(get_current_client)):
    orders = db.query(Order).filter(Order.id_client == id_client).all()
    if not orders:
        raise HTTPException(status_code=404, detail=f"No orders found for client with id: {id_client}")
    return orders


@router.get("/orders", response_model=List[OrderRead])
def get_all_orders(db: Session = Depends(get_db), current_client=Depends(get_current_client)):
    logger.info("Getting all orders")
    orders = db.query(Order).all()
    if not orders:
        raise HTTPException(
            status_code=404, detail="No orders found"
        )
    return orders


@router.post("/orders", response_model=OrderRead)
def create_order(order: OrderCreate, db: Session = Depends(get_db), current_client=Depends(get_current_client)):
    try:
        logger.info(f"Received data for creating order: {order.dict()}")

        # Create Order using the Pydantic OrderCreate model
        db_order = Order(**order.dict())

        db.add(db_order)
        db.commit()
        db.refresh(db_order)

        logger.info(f"Order created successfully with id {db_order.id_order}")
        return db_order

    except Exception as e:
        logger.error(f"Error creating order: {e}")
        logger.error(f"Request payload: {order.dict()}")
        raise HTTPException(status_code=400, detail=f"Failed to create order. {str(e)}")


@router.get("/orders/{id_order}", response_model=OrderRead)
def read_order(id_order: int, db: Session = Depends(get_db), current_client=Depends(get_current_client)):
    logger.info(f"Reading order with id: {id_order}")
    db_order = db.query(Order).filter(Order.id_order == id_order).first()
    if db_order is None:
        logger.error(f"Order with id: {id_order} not found")
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order


@router.put("/orders/{id_order}", response_model=OrderRead)
def update_order(id_order: int, order: OrderUpdate, db: Session = Depends(get_db),
                 current_client=Depends(get_current_client)):
    logger.info(f"Updating order with id: {id_order}")
    db_order = db.query(Order).filter(Order.id_order == id_order).first()
    if db_order is None:
        logger.error(f"Order with id: {id_order} not found")
        raise HTTPException(status_code=404, detail="Order not found")

    for key, value in order.dict(exclude_unset=True).items():
        setattr(db_order, key, value)

    db.commit()
    db.refresh(db_order)
    return db_order


@router.delete("/orders/{id_order}", response_model=dict)
def delete_order(id_order: int, db: Session = Depends(get_db), current_client=Depends(get_current_client)):
    logger.info(f"Deleting order with id: {id_order}")
    db_order = db.query(Order).filter(Order.id_order == id_order).first()
    if db_order is None:
        logger.error(f"Order with id: {id_order} not found")
        raise HTTPException(status_code=404, detail="Order not found")

    db.query(Order_product).filter(Order_product.id_order == id_order).delete()
    db.query(Operation).filter(Operation.id_order == id_order).delete()
    db.delete(db_order)
    db.commit()

    return {
        "message": "Order deleted successfully",
    }

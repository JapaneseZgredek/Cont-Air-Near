from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models.order_product import Order_product
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class Order_productCreate(BaseModel):
    id_order: int
    id_product: int
    quantity: int

class Order_productUpdate(BaseModel):
    id_order: Optional[int] = None
    id_product: Optional[int] = None
    quantity: Optional[int] = None

class Order_productRead(BaseModel):
    id_order: int
    id_product: int
    quantity: int

    class Config:
        from_attributes = True

@router.get("/orders_products", response_model=List[Order_productRead])
def get_all_orders_products(db: Session = Depends(get_db)):
    logger.info("Getting all orders_products")
    orders_products = db.query(Order_product).all()
    return orders_products

@router.post("/orders_products", response_model=Order_productRead)
def create_order_product(order_product: Order_productCreate, db: Session = Depends(get_db)):
    logger.info(f"Received data for creating order_product: {order_product.dict()}")
    db_order_product = Order_product(**order_product.dict())
    db.add(db_order_product)
    db.commit()
    db.refresh(db_order_product)
    return db_order_product

@router.get("/orders_products/{id_order}_{id_product}", response_model=Order_productRead)
def get_order_product(id_order: int, id_product: int, db: Session = Depends(get_db)):
    logger.info(f"Reading order_product with ids: {id_order} {id_product}")
    db_order_product = db.query(Order_product).filter(
        Order_product.id_order == id_order).filter(
        Order_product.id_product == id_product).first()
    if db_order_product is None:
        call_out_missing_id(id_order, id_product, db)
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order_product

@router.get("/orders_products/order/{id_order}", response_model=List[Order_productRead])
def get_order_product_by_order(id_order: int, db: Session = Depends(get_db)):
    db_order_product = db.query(Order_product).filter(Order_product.id_order == id_order).all()
    if not db_order_product:
        raise HTTPException(status_code=404, detail="No order_products found with this order ID: {id_order}")
    return db_order_product

@router.get("/orders_products/product/{id_product}", response_model=List[Order_productRead])
def get_order_product_by_product(id_product: int, db: Session = Depends(get_db)):
    logger.info(f"Reading order_product with product id: {id_product}")
    db_order_product = db.query(Order_product).filter(
        Order_product.id_product == id_product).all()
    if not db_order_product:
        call_out_missing_id(id_product, db)
        raise HTTPException(status_code=404, detail="No order_products found with this product ID: {id_product}")
    return db_order_product

@router.put("/orders_products/{id_order}_{id_product}", response_model=Order_productRead)
def update_order_product(id_order: int, id_product: int, order_product: Order_productUpdate, db: Session = Depends(get_db)):
    logger.info(f"Updating order_product with id: {id_order}")
    db_order_product = db.query(Order_product).filter(
        Order_product.id_order == id_order).filter(
        Order_product.id_product == id_product).first()
    if db_order_product is None:
        call_out_missing_id(id_order, id_product, db)
        raise HTTPException(status_code=404, detail="Order not found")

    if order_product.id_order is not None:
        db_order_product.id_order = order_product.id_order
    if order_product.id_product is not None:
        db_order_product.id_product = order_product.id_product
    if order_product.quantity is not None:
        db_order_product.quantity = order_product.quantity

    db.commit()
    db.refresh(db_order_product)
    return db_order_product

@router.delete("/orders_products/{id_order}_{id_product}", response_model=dict)
def delete_order_product(id_order: int, id_product: int,db: Session = Depends(get_db)):
    logger.info(f"Deleting order with order id: {id_order} and product id: {id_product}")
    db_order_product = db.query(Order_product).filter(
        Order_product.id_order == id_order).filter(
        Order_product.id_product == id_product).first()
    if db_order_product is None:
        call_out_missing_id(id_order, id_product, db)
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(db_order_product)
    db.commit()
    return {
        "message": "Order_product deleted successfully",
        "order": Order_productRead.from_orm(db_order_product)
    }

def call_out_missing_id(id_order: int, id_product: int,db: Session = Depends(get_db)):
    OP_by_order = db.query(Order_product).filter(Order_product.id_order == id_order).first()
    if OP_by_order is None:
        logger.error(f"Order_product with order id: {id_order} not found")
    else:
        OP_by_product = db.query(Order_product).filter(Order_product.id_product == id_product).first()
        if OP_by_product is None:
            logger.error(f"Order_product with product id: {id_product} not found")
        else:
            logger.error(f"Order_product with order id: {id_order} and product id: {id_product} not found")
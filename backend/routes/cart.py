from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.models.order_product import Order_product
from backend.models.order import Order
from backend.models.product import Product
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

DEFAULT_PORT_ID = 1

class CartItemCreate(BaseModel):
    id_order: Optional[int] = None
    id_product: int
    quantity: int

class CartItemRead(BaseModel):
    id_order: int
    id_product: int
    quantity: int

    class Config:
        from_attributes = True

class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None


def get_product_by_id(product_id: int, db: Session):
    product = db.query(Product).filter(Product.id_product == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def get_order_by_id(order_id: int, db: Session):
    order = db.query(Order).filter(Order.id_order == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def is_order_shipped(order: Order):
    if order.status == "SHIPPED":
        raise HTTPException(status_code=400, detail="Cannot modify a shipped order")


@router.get("/cart/{id_order}", response_model=List[CartItemRead])
def get_cart_items(id_order: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching cart items for order ID: {id_order}")
    cart_items = db.query(Order_product).filter(Order_product.id_order == id_order).all()
    if not cart_items:
        logger.warning(f"No cart items found for order ID: {id_order}")
    return cart_items


@router.post("/cart", response_model=CartItemRead)
def add_to_cart(cart_item: CartItemCreate, db: Session = Depends(get_db)):
    product = get_product_by_id(cart_item.id_product, db)

    port_id = product.id_port if product.id_port else DEFAULT_PORT_ID
    
    if not cart_item.id_order:
        new_order = Order(status="PENDING", id_port=port_id)
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        cart_item.id_order = new_order.id_order
        logger.info(f"Created a new order with ID: {new_order.id_order} and port ID: {port_id}")

    order = get_order_by_id(cart_item.id_order, db)
    is_order_shipped(order)

    existing_item = db.query(Order_product).filter(
        Order_product.id_order == cart_item.id_order,
        Order_product.id_product == cart_item.id_product
    ).first()

    if existing_item:
        logger.info("Product already in cart, updating quantity")
        existing_item.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    new_cart_item = Order_product(
        id_order=cart_item.id_order,
        id_product=cart_item.id_product,
        quantity=cart_item.quantity
    )
    db.add(new_cart_item)
    db.commit()
    db.refresh(new_cart_item)
    logger.info(f"Added product {cart_item.id_product} to the cart for order {cart_item.id_order}")
    return new_cart_item


@router.delete("/cart/{id_order}/{id_product}", response_model=dict)
def remove_cart_item(id_order: int, id_product: int, db: Session = Depends(get_db)):
    logger.info(f"Removing product {id_product} from order {id_order}")
    cart_item = db.query(Order_product).filter(
        Order_product.id_order == id_order,
        Order_product.id_product == id_product
    ).first()

    if not cart_item:
        logger.error(f"Cart item not found for order {id_order} and product {id_product}")
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    logger.info(f"Product {id_product} removed from cart for order {id_order}")
    return {"message": "Cart item removed successfully"}


@router.delete("/cart/{id_order}", response_model=dict)
def clear_cart(id_order: int, db: Session = Depends(get_db)):
    logger.info(f"Clearing cart for order {id_order}")
    cart_items = db.query(Order_product).filter(Order_product.id_order == id_order).all()

    if not cart_items:
        logger.warning(f"No cart items found for order {id_order}")
        raise HTTPException(status_code=404, detail="Cart is already empty")

    for item in cart_items:
        db.delete(item)

    db.commit()
    logger.info(f"All items removed from cart for order {id_order}")
    return {"message": f"All items removed from cart for order {id_order}"}


@router.post("/checkout/{id_order}", response_model=dict)
def checkout(id_order: int, db: Session = Depends(get_db)):
    order = get_order_by_id(id_order, db)

    cart_items = db.query(Order_product).filter(Order_product.id_order == id_order).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order.status = "SHIPPED"
    db.commit()
    logger.info(f"Order {id_order} has been successfully checked out and shipped")
    
    return {"message": f"Order {id_order} has been successfully checked out"}

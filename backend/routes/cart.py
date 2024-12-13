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


class CartItemCreate(BaseModel):
    id_order: int
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


@router.get("/cart/{id_order}", response_model=List[CartItemRead])
def get_cart_items(id_order: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching cart items for order ID: {id_order}")
    cart_items = db.query(Order_product).filter(Order_product.id_order == id_order).all()
    if not cart_items:
        logger.warning(f"No cart items found for order ID: {id_order}")
    return cart_items


@router.post("/cart", response_model=CartItemRead)
def add_to_cart(cart_item: CartItemCreate, db: Session = Depends(get_db)):
    logger.info(f"Adding product {cart_item.id_product} to order {cart_item.id_order}")

    product = db.query(Product).filter(Product.id_product == cart_item.id_product).first()
    if not product:
        logger.error(f"Product with id {cart_item.id_product} not found")
        raise HTTPException(status_code=404, detail="Product not found")

    order = db.query(Order).filter(Order.id_order == cart_item.id_order).first()
    if not order:
        logger.error(f"Order with id {cart_item.id_order} not found")
        raise HTTPException(status_code=404, detail="Order not found")

    existing_item = (
        db.query(Order_product)
        .filter(Order_product.id_order == cart_item.id_order, Order_product.id_product == cart_item.id_product)
        .first()
    )
    if existing_item:
        logger.info("Product already in cart, updating quantity")
        existing_item.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    new_cart_item = Order_product(**cart_item.dict())
    db.add(new_cart_item)
    db.commit()
    db.refresh(new_cart_item)
    return new_cart_item


@router.delete("/cart/{id_order}/{id_product}", response_model=dict)
def remove_cart_item(id_order: int, id_product: int, db: Session = Depends(get_db)):
    logger.info(f"Removing product {id_product} from order {id_order}")
    cart_item = (
        db.query(Order_product)
        .filter(Order_product.id_order == id_order, Order_product.id_product == id_product)
        .first()
    )

    if not cart_item:
        logger.error(f"Cart item not found for order {id_order} and product {id_product}")
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()

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

    return {"message": f"All items removed from cart for order {id_order}"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.models import Operation, Product
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

# Section responsible for details

class PortDTO(BaseModel):
    id_port: int
    name: str

class ClientDTO(BaseModel):
    id_client: int
    name: str

class OperationDTO(BaseModel):
    id_operation: int
    name: str
    description: Optional[str]

class ProductDTO(BaseModel):
    id_product: int
    name: str
    price: float
    weight: float

class OrderDetailsDTO(BaseModel):
    id_order: int
    date_of_order: datetime
    status: str
    description: Optional[str]
    port: PortDTO
    client: Optional[ClientDTO]
    operations: List[OperationDTO]
    products: List[ProductDTO]  # Produkty zamiast `order_products`

    class Config:
        orm_mode = True


@router.get("/orders/{order_id}", response_model=OrderDetailsDTO)
def get_order_details(order_id: int, db: Session = Depends(get_db)):
    # Pobieranie zamówienia
    order = db.query(Order).filter(Order.id_order == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Pobieranie danych powiązanych
    port = db.query(Port).filter(Port.id_port == order.id_port).first()
    client = db.query(Client).filter(Client.id_client == order.id_client).first()
    operations = db.query(Operation).filter(Operation.id_order == order.id_order).all()
    products = (
        db.query(Product)
        .join(Order_product, Product.id_product == Order_product.id_product)
        .filter(Order_product.id_order == order.id_order)
        .all()
    )

    # Tworzenie odpowiedzi DTO
    return OrderDetailsDTO(
        id_order=order.id_order,
        date_of_order=order.date_of_order,
        status=order.status.value,
        description=order.description,
        port=PortDTO(id_port=port.id_port, name=port.name),
        client=ClientDTO(id_client=client.id_client, name=client.name) if client else None,
        operations=[
            OperationDTO(
                id_operation=op.id_operation,
                name=op.name,
                description=op.description
            )
            for op in operations
        ],
        products=[
            ProductDTO(
                id_product=product.id_product,
                name=product.name,
                price=product.price,
                weight=product.weight
            )
            for product in products
        ]
    )


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


# Commented out due to making details for Order
# @router.get("/orders/{id_order}", response_model=OrderRead)
# def read_order(id_order: int, db: Session = Depends(get_db), current_client=Depends(get_current_client)):
#    logger.info(f"Reading order with id: {id_order}")
#    db_order = db.query(Order).filter(Order.id_order == id_order).first()
#    if db_order is None:
#        logger.error(f"Order with id: {id_order} not found")
#        raise HTTPException(status_code=404, detail="Order not found")
#    return db_order


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

    # Fetch the order from the database
    db_order = db.query(Order).filter(Order.id_order == id_order).first()
    if db_order is None:
        logger.error(f"Order with id: {id_order} not found")
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if the order status is 'delivered' or 'cancelled'
    if db_order.status in [OrderStatus.DELIVERED, OrderStatus.CANCELLED]:
        logger.info(f"Order with id: {id_order} has status '{db_order.status}', fetching linked products to delete")

        # Step 1: Get list of product IDs from Order_product linked to this order
        product_ids = db.query(Order_product.id_product).filter(Order_product.id_order == id_order).all()
        product_ids = [product_id[0] for product_id in product_ids]  # Extract list of product IDs

        if product_ids:
            logger.info(f"Deleting {len(product_ids)} products linked to order id: {id_order}")

            # Step 2: Delete products linked to this order from the Product table
            db.query(Product).filter(Product.id_product.in_(product_ids)).delete(synchronize_session=False)

    # Step 3: Delete all Order_product entries linked to the order
    logger.info(f"Deleting Order_product records for order id: {id_order}")
    db.query(Order_product).filter(Order_product.id_order == id_order).delete()

    # Step 4: Delete all operations linked to this order
    logger.info(f"Deleting operations linked to order id: {id_order}")
    db.query(Operation).filter(Operation.id_order == id_order).delete()

    # Step 5: Delete the order itself
    logger.info(f"Deleting the order with id: {id_order}")
    db.delete(db_order)

    # Commit all changes to the database
    db.commit()

    logger.info(f"Order with id: {id_order} deleted successfully")
    return {
        "message": "Order deleted successfully",
    }

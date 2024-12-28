from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from sqlalchemy.orm import Session

from backend.models import Order_product, Port
from backend.models.order import Order
from backend.models.product import Product
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import FileResponse, StreamingResponse
import base64
from io import BytesIO
import os
from pathlib import Path

router = APIRouter()
uploads_dir = Path(__file__).resolve().parent.parent / 'uploads'

class ProductCreate(BaseModel):
    name: str
    price: float
    weight: float
    image: str
    id_port: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    weight: Optional[float] = None
    image: Optional[str] = None
    id_port: Optional[int] = None

class ProductRead(BaseModel):
    id_product: int
    name: str
    price: float
    weight: float
    image: str
    id_port: int

    class Config:
        from_attributes = True

class ProductDetailsDTO(BaseModel):
    id_product: int
    name: str
    price: float
    weight: float
    image: Optional[str]
    port: str
    port_id: int  # Dodano ID portu
    orders: List[int]

    class Config:
        orm_mode = True


@router.get("/products/{id_product}/details", response_model=ProductDetailsDTO)
def get_product_details(id_product: int, db: Session = Depends(get_db)):
    # Pobranie produktu
    product = db.query(Product).filter(Product.id_product == id_product).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Pobranie zamówień powiązanych z produktem
    orders = (
        db.query(Order.id_order)
        .join(Order_product, Order.id_order == Order_product.id_order)
        .filter(Order_product.id_product == id_product)
        .all()
    )
    order_ids = [order.id_order for order in orders]

    # Pobranie danych portu
    port = db.query(Port).filter(Port.id_port == product.id_port).first()

    return ProductDetailsDTO(
        id_product=product.id_product,
        name=product.name,
        price=product.price,
        weight=product.weight,
        image=product.image,
        port=port.name if port else "Unknown",
        port_id=port.id_port if port else None,  # Dodano port_id
        orders=order_ids,
    )



@router.get("/products/port/{port_id}", response_model=List[ProductRead])
def get_products_by_port(port_id: int, db: Session = Depends(get_db)):
    """
    Get all products for a specific port ID.
    """
    logger.info(f"Getting products for port ID: {port_id}")
    products = db.query(Product).filter(Product.id_port == port_id).all()
    if not products:
        logger.warning(f"No products found for port ID: {port_id}")
    return products


@router.post("/products", response_model=ProductRead)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating new product: {product}")
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/products", response_model=List[ProductRead])
def get_all_products(db: Session = Depends(get_db)):
    logger.info("Getting all products")
    products = db.query(Product).all()
    return products

@router.get("/products/exclude", response_model=List[ProductRead])
def get_all_products(db: Session = Depends(get_db)):
    """
    Get all products that are NOT linked to any Order Product.
    """
    logger.info("Getting all products that are NOT linked to any OrderProduct")
    products = (
        db.query(Product)
        .outerjoin(Order_product, Product.id_product == Order_product.id_product)
        .filter(Order_product.id_product == None)  # Only products NOT linked to OrderProduct
        .all()
    )
    if not products:
        logger.warning("No products found that are not linked to any OrderProduct")
    return products

@router.get("/products/{id_product}", response_model=ProductRead)
def read_product(id_product: int, db: Session = Depends(get_db)):
    logger.info(f"Reading Product with id: {id_product}")
    db_product = db.query(Product).filter(Product.id_product == id_product).first()
    if db_product is None:
        logger.error(f"Product with id: {id_product} not found")
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/products/{id_product}", response_model=ProductRead)
def update_product(id_product: int, product: ProductUpdate, db: Session = Depends(get_db)):
    logger.info(f"Updating Product with id: {id_product}")
    db_product = db.query(Product).filter(Product.id_product == id_product).first()
    if db_product is None:
        logger.error(f"Product with id: {id_product} not found")
        raise HTTPException(status_code=404, detail="/Product not found")

    if product.name is not None:
        db_product.name = product.name
    if product.price is not None:
        db_product.price = product.price
    if product.weight is not None:
        db_product.weight = product.weight
    if product.image is not None:
        db_product.image = product.image
    if product.id_port is not None:
        db_product.id_port = product.id_port

    db.commit()
    db.refresh(db_product)

    return db_product

@router.delete("/products/{id_product}", response_model=dict)
def delete_product(id_product: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting Product with id: {id_product}")
    db_product = db.query(Product).filter(Product.id_product == id_product).first()
    if db_product is None:
        logger.error(f"Product with id: {id_product} not found")
        raise HTTPException(status_code=404, detail="Product not found")

    # TO DO: Usunięcie wszystkich rekordów OrderProduct powiązanych z danym produktem, gdy OrderProduct jest dostępny
    # db.query(OrderProduct).filter(OrderProduct.id_product == id_product).delete()

    db.delete(db_product)
    db.commit()
    return {
        "message": "Product deleted successfully",
        "product": ProductRead.from_orm(db_product)
    }

@router.get("/products/image/{id_product}", response_model=ProductRead)
def get_image(id_product: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id_product == id_product).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    if db_product.image:
        try:
            image_data = base64.b64decode(db_product.image)
            image_io = BytesIO(image_data)
            return StreamingResponse(image_io, media_type="image/jpeg")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to decode image for product {id_product}: {e}")

    else:
        missing_filepath = uploads_dir / 'missing.jpg'
        if os.path.exists(missing_filepath):
            return FileResponse(missing_filepath)
        else:
            raise HTTPException(status_code=404, detail="Image not found and missing.jpg is also missing.")

@router.post("/products/image/{id_product}")
async def upload_image(id_product: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        file_content = await file.read()
        converted_image = base64.b64encode(file_content).decode("utf-8")
        
        db_product = db.query(Product).filter(Product.id_product == id_product).first()
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        db_product.image = converted_image
        db.commit()
        return {"message": f"Image for product with id {id_product} uploaded and saved successfully in Base64."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to upload image for product {id_product}: {e}")

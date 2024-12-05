from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from sqlalchemy.orm import Session
from backend.models.product import Product
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import FileResponse
import os
from pathlib import Path

router = APIRouter()
uploads_dir = Path(__file__).resolve().parent.parent / 'uploads'

class ProductCreate(BaseModel):
    name: str
    price: float
    weight: float
    #id_port: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    weight: Optional[float] = None
    #id_port: Optional[int] = None

class ProductRead(BaseModel):
    id_product: int
    name: str
    price: float
    weight: float
    #id_port: int

    class Config:
        from_attributes = True

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
def get_image(id_product: int):
    filename = f"product_{id_product}.jpg"
    filepath = uploads_dir / filename
    if os.path.exists(filepath):
        return FileResponse(filepath)
    else:
        missing_filepath = uploads_dir / 'missing.jpg'
        if os.path.exists(missing_filepath):
            return FileResponse(missing_filepath)
        else:
            raise HTTPException(status_code=404, detail="Image not found for this product, and missing.jpg is also missing.")

@router.post("/products/image/{id_product}")
async def upload_image(id_product: int, file: UploadFile = File(...)):
    filename = f"product_{id_product}.jpg"
    filepath = uploads_dir / filename

    try:
        uploads_dir.mkdir(parents=True, exist_ok=True)
        with open(filepath, "wb") as buffer:
            buffer.write(await file.read())

        return {"message": "Image for product with id:{id_product} uploaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image for product {id_product}: {e}")
    
@router.delete("/products/image/{id_product}")
def delete_image(id_product: int):
    filename = f"product_{id_product}.jpg"
    filepath = uploads_dir / filename
    if os.path.exists(filepath):
        os.remove(filepath)
        return {"detail": "Image deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Image not found for this product")
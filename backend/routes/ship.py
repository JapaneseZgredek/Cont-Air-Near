from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from sqlalchemy.orm import Session

from backend.models import Operation
from backend.models.ship import Ship, ShipStatus
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional

from fastapi.responses import FileResponse, StreamingResponse
import base64
from io import BytesIO
import os
from pathlib import Path

from .client import get_current_client
from ..models import UserRole
from backend.utils.role_validation import check_user_role
router = APIRouter()
uploads_dir = Path(__file__).resolve().parent.parent / 'uploads'

class ShipCreate(BaseModel):
    name: str
    capacity: int
    status: Optional[ShipStatus] = ShipStatus.ACTIVE
    image: str

class ShipUpdate(BaseModel):
    name: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[ShipStatus] = None
    image: Optional[str] = None

class ShipRead(BaseModel):
    id_ship: int
    name: str
    capacity: int
    status: ShipStatus
    image: str

    class Config:
        from_attributes = True

@router.post("/ships", response_model=ShipRead)  # Response model is ShipRead so there is an id in returned object, this allowed to remove objects from the list without reloading page
def create_ship(
    ship: ShipCreate,
    db: Session = Depends(get_db),
    current_client = Depends(get_current_client)
):
    check_user_role(current_client, [UserRole.EMPLOYEE, UserRole.ADMIN])
    logger.info(f"Creating new ship: {ship}")
    db_ship = Ship(**ship.dict())
    db.add(db_ship)
    db.commit()
    db.refresh(db_ship)
    return db_ship

@router.get("/ships", response_model=List[ShipRead])
def get_all_ships(db: Session = Depends(get_db)):
    logger.info("Getting all ships")
    ships = db.query(Ship).all()
    return ships

@router.get("/ships/{id_ship}", response_model=ShipRead)
def read_ship(id_ship: int, db: Session = Depends(get_db)):
    logger.info(f"Reading Ship with id: {id_ship}")
    db_ship = db.query(Ship).filter(Ship.id_ship == id_ship).first()
    if db_ship is None:
        logger.error(f"Ship with id: {id_ship} not found")
        raise HTTPException(status_code=404, detail="Ship not found")
    return db_ship

@router.put("/ships/{id_ship}", response_model=ShipRead)
def update_ship(id_ship: int, ship: ShipUpdate, db: Session = Depends(get_db)):
    logger.info(f"Updating Ship with id: {id_ship}")
    db_ship = db.query(Ship).filter(Ship.id_ship == id_ship).first()
    if db_ship is None:
        logger.error(f"Ship with id: {id_ship} not found")
        raise HTTPException(status_code=404, detail="Ship not found")

    if ship.name is not None:
        db_ship.name = ship.name
    if ship.capacity is not None:
        db_ship.capacity = ship.capacity
    if ship.status is not None:
        db_ship.status = ship.status
    if ship.image is not None:
        db_ship.image = ship.image

    db.commit()
    db.refresh(db_ship)

    return db_ship

@router.delete("/ships/{id_ship}", response_model=dict)
def delete_ship(id_ship: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting Ship with id: {id_ship}")
    db_ship = db.query(Ship).filter(Ship.id_ship == id_ship).first()
    if db_ship is None:
        logger.error(f"Ship with id: {id_ship} not found")
        raise HTTPException(status_code=404, detail="Ship not found")

    db.query(Operation).filter(Operation.id_ship == id_ship).delete()

    db.delete(db_ship)
    db.commit()
    return {"message": "Ship deleted successfully",
            "ship": ShipRead.from_orm(db_ship)
    }

@router.get("/ships/image/{id_ship}", response_model=ShipRead)
def get_image(id_ship: int, db: Session = Depends(get_db)):
    db_ship = db.query(Ship).filter(Ship.id_ship == id_ship).first()
    if db_ship is None:
        raise HTTPException(status_code=404, detail="Ship not found")

    if db_ship.image:
        try:
            image_data = base64.b64decode(db_ship.image)
            image_io = BytesIO(image_data)
            return StreamingResponse(image_io, media_type="image/jpeg")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to decode image for ship {id_ship}: {e}")

    else:
        missing_filepath = uploads_dir / 'missing.jpg'
        if os.path.exists(missing_filepath):
            return FileResponse(missing_filepath)
        else:
            raise HTTPException(status_code=404, detail="Image not found and missing.jpg is also missing.")
        
@router.post("/ships/image/{id_ship}")
async def upload_image(id_ship: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        file_content = await file.read()
        converted_image = base64.b64encode(file_content).decode("utf-8")
        
        db_ship = db.query(Ship).filter(Ship.id_ship == id_ship).first()
        if db_ship is None:
            raise HTTPException(status_code=404, detail="Product not found")
        db_ship.image = converted_image
        db.commit()
        return {"message": f"Image for ship with id {id_ship} uploaded and saved successfully in Base64."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to upload image for ship {id_ship}: {e}")
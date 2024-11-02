from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.models.ship import Ship, ShipStatus
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ShipCreate(BaseModel):
    name: str
    capacity: int
    status: Optional[ShipStatus] = ShipStatus.ACTIVE

class ShipUpdate(BaseModel):
    name: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[ShipStatus] = None

class ShipRead(BaseModel):
    id_ship: int
    name: str
    capacity: int
    status: ShipStatus

    class Config:
        from_attributes = True

@router.post("/ships", response_model=ShipRead)  # Response model is ShipRead so there is an id in returned object, this allowed to remove objects from the list without reloading page
def create_ship(ship: ShipCreate, db: Session = Depends(get_db)):
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

@router.put("/ships/{id_ship}", response_model=dict)
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

    db.commit()
    db.refresh(db_ship)

    return {
        "message": "Ship updated successfully",
        "ship": ShipRead.from_orm(db_ship)
    }

@router.delete("/ships/{id_ship}", response_model=dict)
def delete_ship(id_ship: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting Ship with id: {id_ship}")
    db_ship = db.query(Ship).filter(Ship.id_ship == id_ship).first()
    if db_ship is None:
        logger.error(f"Ship with id: {id_ship} not found")
        raise HTTPException(status_code=404, detail="Ship not found")
    db.delete(db_ship)
    db.commit()
    return {"message": "Ship deleted successfully",
            "ship": ShipRead.from_orm(db_ship)
    }

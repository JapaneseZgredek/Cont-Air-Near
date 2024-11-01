from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.models.ship import Ship, ShipStatus
from backend.database import get_db
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

@router.post("/ships", response_model=dict)
def create_ship(ship: ShipCreate, db: Session = Depends(get_db)):
    db_ship = Ship(**ship.dict())
    db.add(db_ship)
    db.commit()
    db.refresh(db_ship)
    return {"message": "Ship created successfully", "ship": db_ship.id_ship}

@router.get("/ships/", response_model=List[ShipRead])
def get_all_ships(db: Session = Depends(get_db)):
    ships = db.query(Ship).all()
    return ships

@router.get("/ships/{id_ship}", response_model=ShipRead)
def read_ship(id_ship: int, db: Session = Depends(get_db)):
    db_ship = db.query(Ship).filter(Ship.id_ship == id_ship).first()
    if db_ship is None:
        raise HTTPException(status_code=404, detail="Ship not found")
    return db_ship

from sqlalchemy import Column, Integer, DateTime, Enum, String
from sqlalchemy.orm import declarative_base
from datetime import datetime
import enum

from backend.database import Base

class ShipStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Ship(Base):
    __tablename__ = "ship"
    id_ship = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    capacity = Column(Integer, nullable=False)
    status = Column(Enum(ShipStatus), default=ShipStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

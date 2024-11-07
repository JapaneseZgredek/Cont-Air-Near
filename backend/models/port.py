from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base, relationship

from backend.database import Base

class Port(Base):
    __tablename__ = 'port'
    id_port = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255),  nullable=False)
    location = Column(String(255), nullable=False)
    country = Column(String(255), nullable=False)

    operations = relationship("Operation", back_populates="port")

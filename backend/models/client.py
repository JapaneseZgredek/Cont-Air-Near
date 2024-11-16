from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

from backend.database import Base

class Client(Base):
    __tablename__ = 'client'
    id_client = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255),nullable=False)
    address = Column(String(255),nullable=False)
    telephone_number = Column(Integer)
    email = Column(String(255),nullable=False)

    #order = relationship("Order", back_populates="client")
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

from backend.database import Base

class Product(Base):
    __tablename__ = 'product'
    id_product = Column(Integer, primary_key=True, index= True, autoincrement=True)
    name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())
    image = Column(String, nullable=True)
    id_port = Column(Integer, ForeignKey('port.id_port'), nullable=False)

    port = relationship("Port", back_populates="products")

    order_products = relationship("Order_product", back_populates="product")
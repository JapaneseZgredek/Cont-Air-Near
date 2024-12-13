from sqlalchemy import Column, Integer, ForeignKey
from backend.database import Base
from sqlalchemy.orm import relationship

class Order_product(Base):
    __tablename__ = 'order_products'
    id_order = Column(Integer, ForeignKey('order.id_order'), primary_key=True, nullable=False)
    id_product = Column(Integer, ForeignKey('product.id_product'), primary_key=True, nullable=False)
    quantity = Column(Integer, nullable=False)

    product = relationship("Product", back_populates="order_products")
    order = relationship("Order", back_populates="order_products")

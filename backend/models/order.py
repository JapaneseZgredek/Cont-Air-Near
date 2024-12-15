from sqlalchemy import Column, Integer, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base
import enum

class OrderStatus(enum.Enum):
    PENDING = "pending"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = 'order'
    id_order = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date_of_order = Column(DateTime, default=datetime.now, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    description = Column(String(255), nullable=True)
    id_port = Column(Integer, ForeignKey('port.id_port'), nullable=False)
    id_client = Column(Integer, ForeignKey('client.id_client'), nullable=True)

    port = relationship("Port", back_populates="orders")
    client = relationship("Client", back_populates="orders")

    order_products = relationship("Order_product", back_populates="order")

    # Placeholder for total price calculation
    @property
    def total_price(self):
        # TO DO: Calculate total price based on OrderProduct details when available
        return 0

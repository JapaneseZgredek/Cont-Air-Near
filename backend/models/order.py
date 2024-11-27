from sqlalchemy import Column, Integer, DateTime, Enum, ForeignKey
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
    id_port = Column(Integer, ForeignKey('port.id_port'), nullable=False)
    # TO DO: Add id_client when Client table is available
    # id_client = Column(Integer, ForeignKey('client.id_client'), nullable=True)

    port = relationship("Port", back_populates="orders")
    order_histories = relationship("OrderHistory", back_populates="order")

    # TO DO: Add relationship with Client when the Client model is available
    # client = relationship("Client", back_populates="orders")

    # TO DO: Add relationship with OrderProduct once the OrderProduct table is available
    # order_products = relationship("OrderProduct", back_populates="order", cascade="all, delete-orphan")

    # Placeholder for total price calculation
    @property
    def total_price(self):
        # TO DO: Calculate total price based on OrderProduct details when available
        return 0

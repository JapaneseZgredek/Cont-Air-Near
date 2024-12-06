from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class OrderHistory(Base):
    __tablename__ = 'order_history'
    
    id_history = Column(Integer, primary_key=True)
    description = Column(String(255))
    date = Column(DateTime)
    Order_id_order = Column(Integer, ForeignKey('order.id_order'))
    
    order = relationship("Order", back_populates="order_histories")
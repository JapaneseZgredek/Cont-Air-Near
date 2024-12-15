from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from backend.database import Base
import enum


class UserRole(enum.Enum):
    GUEST = "GUEST"
    CLIENT = "CLIENT"
    EMPLOYEE = "EMPLOYEE"
    ADMIN = "ADMIN"

class Client(Base):
    __tablename__ = 'client'
    id_client = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255),nullable=False)
    address = Column(String(255),nullable=False)
    telephone_number = Column(Integer)
    email = Column(String(255),nullable=False)
    logon_name = Column(String(255),nullable=False)
    password = Column(String(255),nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)

    orders = relationship("Order", back_populates="client")
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
import enum

from backend.database import Base

class UserRole(enum.Enum):
    GUEST = "GUEST"
    CLIENT = "CLIENT"
    EMPLOYEE = "EMPLOYEE"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = 'user'
    id_user = Column(Integer, primary_key=True, index=True, autoincrement=True)
    logon_name = Column(String(255),nullable=False)
    password = Column(String(255),nullable=False)
    email = Column(String(255),nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)
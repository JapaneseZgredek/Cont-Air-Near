from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

from backend.database import Base

class User(Base):
    __tablename__ = 'user'
    id_user = Column(Integer, primary_key=True, index=True, autoincrement=True)
    logon_name = Column(String(255),nullable=False)
    password = Column(String(255),nullable=False)
    email = Column(String(255),nullable=False)


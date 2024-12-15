from sqlalchemy import Column, Integer, String
from backend.database import Base

class email_block_list(Base):
    __tablename__ = 'email_block_list'
    id_domain = Column(Integer, primary_key=True, index=True, autoincrement=True)
    domain = Column(String(255), unique=True, nullable=False)
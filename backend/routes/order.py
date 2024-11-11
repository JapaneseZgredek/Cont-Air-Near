from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.models.order import Order, OrderStatus
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional
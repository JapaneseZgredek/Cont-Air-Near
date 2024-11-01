from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.models.ship import Ship, ShipStatus


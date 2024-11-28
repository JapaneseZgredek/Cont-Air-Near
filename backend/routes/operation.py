from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from backend.models.operation import Operation,OperationType
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional
from ..models import Ship, Port, User
from fastapi import APIRouter, Depends, HTTPException
from .user import get_current_user


router = APIRouter()

class OperationCreate(BaseModel):
    name_of_operation: str
    operation_type: OperationType
    date_of_operation: Optional[datetime]
    id_ship: int
    id_port: int


class OperationUpdate(BaseModel):
    name_of_operation: Optional[str] = None
    operation_type: Optional[OperationType] = None
    date_of_operation: Optional[datetime] = None
    id_ship: Optional[int] = None
    id_port: Optional[int] = None

class OperationRead(BaseModel):
    id_operation: int
    name_of_operation: str
    operation_type: OperationType
    date_of_operation: datetime
    id_ship: int
    id_port: int

    class Config:
        orm_mode = True     # Add   -> wszystko hula trzeba delete tylko fix, bo dziala, ale sie nie odswieza
        # from_attributes = True

@router.get("/operations/{id_operation}", response_model=OperationRead)
def get_operation(
    id_operation: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    logger.info(f"Fetching operation with ID {id_operation}")
    operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if not operation:
        raise HTTPException(
            status_code=404, detail="Operation not found"
        )
    return operation

@router.get("/operations", response_model=List[OperationRead])
def get_all_operations(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    logger.info("Fetching all operations")
    operations = db.query(Operation).all()
    if not operations:
        raise HTTPException(
            status_code=404, detail="No operations found"
        )
    return operations


# @router.get("/operations/{id_operation}", response_model=OperationRead)
# def read_operation(id_operation: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
#     logger.info(f"Reading operation with id: {id_operation}")
#     #operation = db.query(Operation).get(id_operation)
#     db_operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
#     if db_operation is None:
#         logger(f"Operation with id: {id_operation} not found")
#         raise HTTPException(status_code=404, detail="Operation not found")
#     return db_operation

@router.post("/operations", response_model=OperationRead)
def create_operation(
    operation: OperationCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    logger.info(f"Creating operation: {operation}")

    # Ship
    ship = db.query(Ship).filter(Ship.id_ship == operation.id_ship).first()
    if not ship:
        logger.error(f"Ship with ID {operation.id_ship} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ship not found"
        )

    # Port
    port = db.query(Port).filter(Port.id_port == operation.id_port).first()
    if not port:
        logger.error(f"Port with ID {operation.id_port} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Port not found"
        )

    # Operation
    db_operation = Operation(
        name_of_operation=operation.name_of_operation,
        operation_type=operation.operation_type,
        date_of_operation=operation.date_of_operation or datetime.now(),
        id_ship=operation.id_ship,
        id_port=operation.id_port,
    )
    db.add(db_operation)
    db.commit()
    db.refresh(db_operation)
    return db_operation


@router.put("/operations/{id_operation}", response_model=OperationRead)
def update_operation(
    id_operation: int,
    operation: OperationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(f"Updating operation with ID {id_operation}")
    db_operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if not db_operation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Operation not found"
        )

    for field, value in operation.dict(exclude_unset=True).items():
        setattr(db_operation, field, value)

    db.commit()
    db.refresh(db_operation)
    return db_operation


@router.delete("/operations/{id_operation}", response_model=dict)
def delete_operation(id_operation: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    logger.info(f"Deleting operation with id: {id_operation}")
    db_operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if db_operation is None:
        logger(f"Operation with id: {id_operation} not found")
        raise HTTPException(status_code=404, detail="Operation not found")
    db.delete(db_operation)
    db.commit()
    return {"message": "Operation deleted successfully",
            }
    # "operation": OperationRead.from_orm(db_operation)}
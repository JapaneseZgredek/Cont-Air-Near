from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import DateTime
from sqlalchemy.orm import Session
from backend.models.operation import Operation,OperationType            ##dodać port?
from backend.database import get_db
from backend.logging_config import logger
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class OperationCreate(BaseModel):
    name_of_operation: str
    operation_type: OperationType
    date_of_operation: Optional[str]
    id_ship: int #add ship
    id_port: int #and port

class OperationUpdate(BaseModel):
    name_of_operation: Optional[str] = None
    operation_type: Optional[OperationType] = None
    date_of_operation: Optional[DateTime] = None
    id_ship: Optional[int] = None #and ship
    id_port: Optional[int] = None #and port

class OperationRead(BaseModel):
    id_operation: int
    name_of_operation: str
    operation_type: OperationType
    date_of_operation: DateTime
    id_ship: int
    id_port: int

    class Config:
        from_attributes = True

@router.get("/operations", response_model=List[OperationRead])
def get_all_operations(db: Session = Depends(get_db)):
    logger.info("Getting all operations")
    operations = db.query(Operation).all()
    return operations

@router.get("/operations/{operation_id}", response_model=OperationRead)
def read_operation(id_operation: int, db: Session = Depends(get_db)):
    logger.info(f"Reading operation with id: {id_operation}")
    #operation = db.query(Operation).get(id_operation)
    db_operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if db_operation is None:
        logger(f"Operation with id: {id_operation} not found")
        raise HTTPException(status_code=404, detail="Operation not found")
    return db_operation

@router.post("/operations", response_model=OperationRead)
def create_operation(operation: OperationCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating operation: {operation}")
    db_operation = Operation(**operation.dict())
    db.add(db_operation)
    db.commit()
    db.refresh(db_operation)
    return db_operation

@router.put("/operations/{operation_id}", response_model=OperationRead)
def update_operation(id_operation: int, operation: OperationUpdate, db: Session = Depends(get_db)):
    logger.info(f"Updating operation: {operation}")
    db_operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if db_operation is None:
        logger(f"Operation with id: {id_operation} not found")
        raise HTTPException(status_code=404, detail="Operation not found")

    if operation.name_of_operation is None:
        db_operation.name_of_operation = operation.name_of_operation
    if operation.operation_type is None:
        db_operation.operation_type = operation.operation_type
    if operation.date_of_operation is not None:
        db_operation.date_of_operation = operation.date_of_operation
    if operation.id_ship is not None:
        db_operation.id_ship = operation.id_ship
    if operation.id_port is not None:
        db_operation.id_port = operation.id_port

    db.commit()
    db.refresh(db_operation)

    return db_operation

@router.delete("/operations/{operation_id}", response_model=dict)
def delete_operation(id_operation: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting operation with id: {id_operation}")
    db_operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if db_operation is None:
        logger(f"Operation with id: {id_operation} not found")
        raise HTTPException(status_code=404, detail="Operation not found")
    db.delete(db_operation)
    db.commit()
    return {"message": "Operation deleted successfully",
            "operation": OperationRead.from_orm(db_operation)}
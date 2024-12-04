from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from backend.models.operation import Operation, OperationType
from backend.database import get_db
from backend.logging_config import logger
from backend.utils.role_validation import check_user_role
from pydantic import BaseModel
from typing import List, Optional
from ..models import Ship, Port, User, UserRole
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
        orm_mode = True

# Operations endpoints with role validation
@router.get("/operations/port/{id_port}", response_model=List[OperationRead])
def get_operations_by_port(
    id_port: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_user_role(current_user, [UserRole.EMPLOYEE, UserRole.ADMIN])  # Validate roles
    operations = db.query(Operation).filter(Operation.id_port == id_port).all()
    if not operations:
        raise HTTPException(status_code=404, detail=f"No operations found for port with id: {id_port}")
    return operations

@router.get("/operations/ship/{id_ship}", response_model=List[OperationRead])
def get_operations_by_ship(
    id_ship: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_user_role(current_user, [UserRole.EMPLOYEE, UserRole.ADMIN])  # Validate roles
    operations = db.query(Operation).filter(Operation.id_ship == id_ship).all()
    if not operations:
        raise HTTPException(status_code=404, detail=f"No operations found for ship with id: {id_ship}")
    return operations

@router.get("/operations/{id_operation}", response_model=OperationRead)
def get_operation(
    id_operation: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_user_role(current_user, [UserRole.EMPLOYEE, UserRole.ADMIN])  # Validate roles
    logger.info(f"Fetching operation with ID {id_operation}")
    operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if not operation:
        raise HTTPException(status_code=404, detail="Operation not found")
    return operation

@router.get("/operations", response_model=List[OperationRead])
def get_all_operations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_user_role(current_user, [UserRole.EMPLOYEE, UserRole.ADMIN])  # Validate roles
    logger.info("Fetching all operations")
    operations = db.query(Operation).all()
    if not operations:
        raise HTTPException(status_code=404, detail="No operations found")
    return operations

@router.post("/operations", response_model=OperationRead)
def create_operation(
    operation: OperationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_user_role(current_user, [UserRole.EMPLOYEE, UserRole.ADMIN])  # Role validation

    # Payload logger
    logger.info(f"Received operation payload: {operation.dict()}")

    # #verify
    # existing_operation = db.query(Operation).filter(
    #     Operation.name_of_operation == operation.name_of_operation,
    #     Operation.id_ship == operation.id_ship,
    #     Operation.id_port == operation.id_port,
    # ).first()
    #
    # if existing_operation:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Duplicate operation detected",
    #     )

    # Ship validation
    ship = db.query(Ship).filter(Ship.id_ship == operation.id_ship).first()
    if not ship:
        logger.error(f"Ship with ID {operation.id_ship} not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ship not found")

    # Port validation
    port = db.query(Port).filter(Port.id_port == operation.id_port).first()
    if not port:
        logger.error(f"Port with ID {operation.id_port} not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Port not found")

    # Create operation
    try:
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
        logger.info(f"Operation created successfully: {db_operation}")
        return db_operation
    except Exception as e:
        logger.error(f"Error creating operation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create operation"
        )


@router.put("/operations/{id_operation}", response_model=OperationRead)
def update_operation(
    id_operation: int,
    operation: OperationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_user_role(current_user, [UserRole.EMPLOYEE, UserRole.ADMIN])
    logger.info(f"Updating operation with ID {id_operation}")
    db_operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if not db_operation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Operation not found")

    for field, value in operation.dict(exclude_unset=True).items():
        setattr(db_operation, field, value)

    db.commit()
    db.refresh(db_operation)
    return db_operation

@router.delete("/operations/{id_operation}", response_model=dict)
def delete_operation(
    id_operation: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_user_role(current_user, [UserRole.EMPLOYEE, UserRole.ADMIN])
    logger.info(f"Deleting operation with id: {id_operation}")
    db_operation = db.query(Operation).filter(Operation.id_operation == id_operation).first()
    if db_operation is None:
        logger.error(f"Operation with id: {id_operation} not found")
        raise HTTPException(status_code=404, detail="Operation not found")

    db.delete(db_operation)
    db.commit()
    return {"message": "Operation deleted successfully"}

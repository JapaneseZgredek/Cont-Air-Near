from sqlalchemy import Column, Integer, DateTime, Enum, String, ForeignKey
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from backend.database import Base

class OperationType(enum.Enum):
    AT_BAY = "at_bay"
    TRANSPORT = "transport"
    TRANSFER = "transfer"
    DEPARTURE = "departure"
    ARRIVAL = "arrival"
    CARGO_LOADING = "loading"
    CARGO_DISCHARGE = "discharge"

    #A Short disclaimer for others about OperationType (Enum)       TYPE/DESCRIPTION/is there a use case or not
    #                   -> change some of them or remove if not needed
    #   AT_BAY          used to mark that ship is not doing any operation                                         (default state)
    #   TRANSPORT       used to refer for transfer of supply to the client from port to another port              (use case)
    #   TRANSFER        for internal inside the company transfers from port to another port                       (use case)
    #   DEPARTURE       to mark them as goods that are on the route from PORT A to PORT B                         (use case)
    #   CARGO_LOADING   to mark that as load operation                                                            (use case)
    #   ARRIVAL         to mark that as arrival of cargo                                                          (use case)
    #   CARGO_DISCHARGE to mark that as unload operation                                                          (use case)





# id_operation; operation_type, date_of_operation, id_ship FK, id_port FK
class Operation(Base):
    __tablename__ = 'operation'
    id_operation = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name_of_operation = Column(String(255),nullable=False)
    operation_type = Column(Enum(OperationType), default=OperationType.AT_BAY)
    date_of_operation = Column(DateTime, default=datetime.now(), nullable=False)
    id_ship = Column(Integer, ForeignKey('ship.id_ship'), nullable=False) #add
    id_port = Column(Integer, ForeignKey('port.id_port'), nullable=False) #add

    ship = relationship("Ship", back_populates="operations")
    port = relationship("Port", back_populates="operations")




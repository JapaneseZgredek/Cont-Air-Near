from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pathlib import Path
from backend.database import engine, Base

from backend.routes import ship, operation, port, product, order, client, order_product, cart
from backend.models import Client, UserRole
from backend.db_filler import db_filler
from backend.logging_config import logger
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import get_db
import bcrypt
from backend.utils.update_block_list import update_blocklist

#Base.metadata.drop_all(bind=engine)  ## <- to drop tables
Base.metadata.create_all(bind=engine)   # to create them

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database routers
app.include_router(ship.router, prefix='/api')
app.include_router(operation.router, prefix='/api')
app.include_router(port.router, prefix='/api')
app.include_router(product.router, prefix='/api')
app.include_router(client.router, prefix='/api')
app.include_router(order.router, prefix='/api')
app.include_router(order_product.router, prefix='/api')
app.include_router(cart.router, prefix='/api')



@app.on_event('startup')
async def startup_event():
    #update_blocklist()  # Fetch and update the blocklist
    #print("Email blocklist updated")
    logger.info("Server started")
    create_default_users()
    db_filler()

def create_user_if_not_exists(db: Session, logon_name: str, name: str, address: str, telephone_number: int, email: str, password: str, role: UserRole):
    existing_user = db.query(Client).filter(Client.logon_name == logon_name).first()

    if existing_user:
        logger.info(f"User with logon_name '{logon_name}' already exists. Skipping creation of the user")
        return

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = Client(
        name=name,
        address=address,
        telephone_number=telephone_number,
        email=email,
        logon_name=logon_name,
        password=hashed_password,
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"User '{logon_name}' with role '{role}' created successfully.")

def create_default_users():
    db: Session = next(get_db())

    # Default admin
    create_user_if_not_exists(
        db=db,
        logon_name="admin",
        name="Default Admin",
        address="ul. Adminiska 5",
        telephone_number=1234567890,
        email="admin@admin.com",
        password="password",
        role=UserRole.ADMIN
    )

    # Default client
    create_user_if_not_exists(
        db=db,
        logon_name="client",
        name="Default Client",
        address="ul. Cliencka 1",
        telephone_number=200200200,
        email="client@client.com",
        password="password",
        role=UserRole.CLIENT
    )

    # Default employee
    create_user_if_not_exists(
        db=db,
        logon_name="employee",
        name="Default Employee",
        address="ul. Pracownika 12",
        telephone_number=111222333,
        email="employee@employee.com",
        password="password",
        role=UserRole.EMPLOYEE
    )


@app.on_event('shutdown')
async def shutdown_event():
    logger.info("Server stopped")

@app.get('/', response_class=HTMLResponse)
async def read_index():
    index_path = Path('frontend/index.html')
    return HTMLResponse(content=index_path.read_text(), status_code=200)

@app.get('/health_check')
async def health_check():
    logger.info("Health checking")
    return {"message": "API is running"}


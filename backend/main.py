from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pathlib import Path
from backend.database import engine, Base
from backend.routes import ship, operation, port, product, order, client, order_product, user
from backend.logging_config import logger
from fastapi.middleware.cors import CORSMiddleware

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

#Users routers
app.include_router(user.router, prefix='/api')


@app.on_event('startup')
async def startup_event():
    logger.info("Server started")

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


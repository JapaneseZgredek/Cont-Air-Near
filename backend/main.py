from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pathlib import Path
from backend.database import engine, Base
from backend.routes import ship
from backend.logging_config import logger

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(ship.router, prefix='/api')


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


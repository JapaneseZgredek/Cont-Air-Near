from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path
from database import engine, Base
from routes import ship
import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Mount frontend as static files
app.mount('/static', StaticFiles(directory='frontend/static'), name='static')

app.include_router(ship.router, prefix='/api')

@app.get('/', response_class=HTMLResponse)
async def read_index():
    index_path = Path('frontend/index.html')
    return HTMLResponse(content=index_path.read_text(), status_code=200)

@app.get('/health_check')
async def health_check():
    return {"message": "API is running"}

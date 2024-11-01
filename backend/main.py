from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pathlib import Path

app = FastAPI()

@app.get('/', response_class=HTMLResponse)
async def read_index():
    index_path = Path('frontend/index.html')
    return HTMLResponse(content=index_path.read_text(), status_code=200)

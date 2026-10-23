import uvicorn
from app.main import app

print("Starting server...")

uvicorn.run(
    app,
    host="127.0.0.1",
    port=8000,
    reload=False
)
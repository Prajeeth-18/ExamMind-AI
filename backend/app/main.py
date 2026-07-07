from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.camera import router as camera_router
from app.api.capture import router as capture_router
from app.api.upload import router as upload_router
from app.api.debug import router as debug_router

from app.services.ocr_worker import start_worker

app = FastAPI(
    title="ExamMind AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():

    print("Starting OCR Worker...")

    start_worker()


app.include_router(camera_router)
app.include_router(capture_router)
app.include_router(upload_router)
app.include_router(debug_router)


@app.get("/")
def home():

    return {

        "project": "ExamMind AI",

        "status": "Backend Running Successfully 🚀"

    }
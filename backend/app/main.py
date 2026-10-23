import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ==========================
# API Routers
# ==========================
from app.api.camera import router as camera_router
from app.api.capture import router as capture_router
from app.api.upload import router as upload_router
from app.api.debug import router as debug_router
from app.api.question_paper import router as question_paper_router
from app.api.answer_key import router as answer_key_router
from app.api.evaluation import router as evaluation_router
from app.api.exam import router as exam_router

# ==========================
# Background Worker
# ==========================
from app.services.ocr_worker import start_worker

app = FastAPI(
    title="ExamMind AI",
    version="1.0.0"
)

# ==========================
# CORS
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip().rstrip("/")
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173"
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Startup
# ==========================
@app.on_event("startup")
def startup():

    print("=" * 60)
    print("Starting OCR Worker...")
    print("=" * 60)

    start_worker()

    print("=" * 60)
    print("ExamMind AI Backend Started Successfully")
    print("=" * 60)


# ==========================
# Register Routers
# ==========================
app.include_router(exam_router)
app.include_router(camera_router)
app.include_router(capture_router)
app.include_router(upload_router)
app.include_router(debug_router)
app.include_router(question_paper_router)
app.include_router(answer_key_router)
app.include_router(evaluation_router)


# ==========================
# Home API
# ==========================
@app.get("/")
def home():

    return {
        "project": "ExamMind AI",
        "version": "1.0.0",
        "status": "Backend Running Successfully 🚀"
    }
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import os
import shutil

from app.services.session_service import create_scan_session
from app.services.document_detection.detector import detect_document
from app.services.document_detection.blur import check_blur
from app.services.document_detection.lighting import check_lighting

router = APIRouter()


class StartScanRequest(BaseModel):
    exam_id: str


@router.post("/start-scan")
def start_scan(data: StartScanRequest):

    session = create_scan_session(data.exam_id)

    return {
        "message": "Scan session created successfully.",
        "exam_id": data.exam_id,
        "session_id": session["session_id"]
    }


@router.post("/detect-paper")
async def detect_paper(
    image: UploadFile = File(...)
):

    os.makedirs("temp", exist_ok=True)

    temp_path = "temp/frame.jpg"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Document Detection
    paper = detect_document(temp_path)
    print("Paper Detected:", paper)
    # Blur Detection (temporary)
    blur = {
        "sharp": True,
        "score": 999
   }

# Lighting Detection (temporary)
    lighting = {
        "good": True,
        "brightness": 150
    }
    return {

        "paper_detected": paper,

        "sharp": blur["sharp"],

        "blur_score": blur["score"],

        "lighting": lighting["good"],

        "brightness": lighting["brightness"]

    }
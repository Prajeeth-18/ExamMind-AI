from fastapi import APIRouter, UploadFile, File
import os
import shutil

router = APIRouter()


UPLOAD_FOLDER = "uploads/answer_sheets"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload-answer-sheet")
async def upload_answer_sheet(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Answer sheet uploaded successfully!",
        "filename": file.filename
    }
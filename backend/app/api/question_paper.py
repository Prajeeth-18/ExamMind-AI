from fastapi import APIRouter, UploadFile, File, Form
import os
import shutil

from app.services.question_paper.pdf_reader import pdf_to_images
from app.services.question_paper.extractor import extract_questions
from app.services.exam_manager import save_question_paper

router = APIRouter()

UPLOAD_FOLDER = "uploads/question_papers"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload-question-paper")
async def upload_question_paper(
    exam_id: str = Form(...),
    file: UploadFile = File(...)
):

    try:

        pdf_path = os.path.join(
            UPLOAD_FOLDER,
            f"{exam_id}.pdf"
        )

        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        pages = pdf_to_images(pdf_path)

        all_questions = []

        for page in pages:

            print("=" * 60)
            print("Reading:", page)
            print("=" * 60)

            result = extract_questions(page)

            # Extraction failed
            if result.get("success") is False:
                return {
                    "success": False,
                    "message": "Question paper extraction failed.",
                    "error": result.get("error")
                }

            if "questions" in result:
                all_questions.extend(result["questions"])

        save_question_paper(
            exam_id,
            all_questions
        )

        return {
            "success": True,
            "exam_id": exam_id,
            "questions": all_questions
        }

    except Exception as e:

        print("=" * 60)
        print("UPLOAD QUESTION PAPER FAILED")
        print(type(e).__name__)
        print(e)
        print("=" * 60)

        return {
            "success": False,
            "message": "Internal server error.",
            "error": str(e)
        }
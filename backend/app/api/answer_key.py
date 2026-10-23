from fastapi import APIRouter, UploadFile, File, Form
import os
import shutil

from app.services.question_paper.pdf_reader import pdf_to_images
from app.services.answer_key.extractor import extract_answer_key
from app.services.knowledge.knowledge_builder import build_knowledge
from app.services.exam_manager import save_answer_key

router = APIRouter()

UPLOAD_FOLDER = "uploads/answer_keys"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload-answer-key")
async def upload_answer_key(
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

        complete_text = ""

        for page in pages:

            print("=" * 60)
            print("Reading Answer Key:", page)
            print("=" * 60)

            result = extract_answer_key(page)

            # Stop if Gemini extraction failed
            if isinstance(result, dict) and result.get("success") is False:

                return {
                    "success": False,
                    "message": "Answer key extraction failed.",
                    "error": result.get("error")
                }

            if isinstance(result, dict):

                if "answers" in result:

                    for answer in result["answers"]:

                        complete_text += (
                            f"Question {answer['question_no']}\n"
                            f"{answer['ideal_answer']}\n\n"
                        )

                else:

                    complete_text += str(result) + "\n"

            else:

                complete_text += str(result) + "\n"

        print("=" * 60)
        print("BUILDING KNOWLEDGE...")
        print("=" * 60)

        knowledge = build_knowledge(complete_text)

        # Stop if Knowledge Builder failed
        if isinstance(knowledge, dict) and knowledge.get("success") is False:

            return {
                "success": False,
                "message": "Knowledge builder failed.",
                "error": knowledge.get("error")
            }

        print("=" * 60)
        print("KNOWLEDGE BUILDER OUTPUT")
        print("=" * 60)
        print(type(knowledge))
        print(knowledge)

        save_answer_key(
            exam_id,
            knowledge
        )

        return {
            "success": True,
            "exam_id": exam_id,
            "knowledge": knowledge
        }

    except Exception as e:

        print("=" * 60)
        print("UPLOAD ANSWER KEY FAILED")
        print(type(e).__name__)
        print(e)
        print("=" * 60)

        return {
            "success": False,
            "message": "Internal server error.",
            "error": str(e)
        }
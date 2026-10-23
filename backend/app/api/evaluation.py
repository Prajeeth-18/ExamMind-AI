
import time

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.processing_queue import is_processing
from app.services.session_service import get_exam_id
from app.services.question_buffer_service import get_answers
from app.services.exam_manager import save_student_answers
from app.services.evaluation.evaluation_service import evaluate_exam

router = APIRouter()


class FinishScanRequest(BaseModel):
    session_id: str


@router.get("/scan-status/{session_id}")
def scan_status(session_id: str):
    return {
        "success": True,
        "processing": is_processing(session_id),
    }


@router.post("/finish-scan")
def finish_scan(data: FinishScanRequest):
    exam_id = get_exam_id(data.session_id)

    if exam_id is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid scan session. Please start a new scan.",
        )

    # Wait for queued pages to finish processing.
    deadline = time.monotonic() + 90

    while is_processing(data.session_id):
        if time.monotonic() >= deadline:
            raise HTTPException(
                status_code=504,
                detail="OCR processing timed out. Please check the backend logs.",
            )
        time.sleep(0.25)

    answers = get_answers(data.session_id)

    print("=" * 60)
    print("ANSWERS BEFORE EVALUATION")
    print(answers)
    print("=" * 60)

    # Do not report empty evaluations as successful.
    if not answers or not any(
        isinstance(answer, dict) and answer.get("text", "").strip()
        for answer in answers.values()
    ):
        raise HTTPException(
            status_code=422,
            detail=(
                "No student answers were extracted. "
                "Check page capture and OCR logs before evaluating."
            ),
        )

    save_student_answers(exam_id, data.session_id, answers)

    result = evaluate_exam(
        exam_id=exam_id,
        session_id=data.session_id,
    )

    if not result:
        raise HTTPException(
            status_code=422,
            detail=(
                "No questions could be evaluated. "
                "Check question-number mapping and Knowledge Builder output."
            ),
        )

    return {
        "success": True,
        "exam_id": exam_id,
        "results": result,
    }

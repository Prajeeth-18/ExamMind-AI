from fastapi import APIRouter
from pydantic import BaseModel
import uuid

from app.services.exam_manager import create_exam

router = APIRouter()


class CreateExamRequest(BaseModel):
    exam_name: str


@router.post("/create-exam")
def create_new_exam(data: CreateExamRequest):

    exam_id = str(uuid.uuid4())

    create_exam(exam_id)

    return {
        "success": True,
        "exam_id": exam_id,
        "exam_name": data.exam_name
    }
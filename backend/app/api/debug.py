from fastapi import APIRouter

from app.services.question_buffer_service import get_answers

router = APIRouter()


@router.get("/debug/{session_id}")
def debug(session_id):

    return get_answers(session_id)
import os
from datetime import datetime

from app.services.question_buffer_service import create_session
from app.services.exam_manager import create_student

UPLOAD_DIRECTORY = "uploads/answer_sheets"

scan_sessions = {}


def create_scan_session(exam_id):

    session_id = datetime.now().strftime(
        "SCAN_%Y%m%d_%H%M%S"
    )

    session_folder = os.path.join(
        UPLOAD_DIRECTORY,
        session_id
    )

    os.makedirs(session_folder, exist_ok=True)

    create_session(session_id)

    # Register student in Exam Manager
    create_student(
        exam_id,
        session_id
    )

    scan_sessions[session_id] = {
        "exam_id": exam_id,
        "folder": session_folder
    }

    return {
        "session_id": session_id,
        "exam_id": exam_id,
        "folder": session_folder
    }


def get_exam_id(session_id):

    if session_id not in scan_sessions:
        return None

    return scan_sessions[session_id]["exam_id"]


def get_session(session_id):

    return scan_sessions.get(session_id)
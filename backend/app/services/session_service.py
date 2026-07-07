import os
from datetime import datetime

from app.services.question_buffer_service import create_session

UPLOAD_DIRECTORY = "uploads/answer_sheets"


def create_scan_session():

    session_id = datetime.now().strftime(
        "SCAN_%Y%m%d_%H%M%S"
    )

    session_folder = os.path.join(
        UPLOAD_DIRECTORY,
        session_id
    )

    os.makedirs(session_folder, exist_ok=True)

    create_session(session_id)

    return {
        "session_id": session_id,
        "folder": session_folder
    }
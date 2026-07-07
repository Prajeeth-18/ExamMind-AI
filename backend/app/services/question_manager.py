from app.services.question_buffer_service import (
    start_question,
    close_question
)

from app.services.ocr.question_detector import (
    detect_question
)


def process_page_text(
    session_id,
    page_number,
    text
):

    detected_question = detect_question(text)

    if detected_question is None:

        return None

    close_question(session_id)

    start_question(
        session_id,
        detected_question
    )

    return detected_question
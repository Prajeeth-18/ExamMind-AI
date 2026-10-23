import os
import shutil

from app.services.processing_queue import add_page
from app.services.document_detection.blur import check_blur

UPLOAD_DIRECTORY = "uploads/answer_sheets"


async def save_page(
    session_id,
    page_number,
    image
):

    session_folder = os.path.join(
        UPLOAD_DIRECTORY,
        session_id
    )

    os.makedirs(
        session_folder,
        exist_ok=True
    )

    filename = f"page_{page_number}.jpg"

    file_path = os.path.join(
        session_folder,
        filename
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            image.file,
            buffer
        )

    # Check image blur
    blur_result = check_blur(file_path)

    # Add page to processing queue
    add_page(
        session_id,
        page_number,
        file_path
    )

    return {

        "success": True,

        "page": page_number,

        "status": "Queued",

        "blur": blur_result

    }
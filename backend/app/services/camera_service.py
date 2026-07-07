import os
import shutil


def save_page(session_id, page_number, image):

    folder_path = os.path.join(
        "uploads",
        "answer_sheets",
        session_id
    )

    os.makedirs(folder_path, exist_ok=True)

    file_path = os.path.join(
        folder_path,
        f"page_{page_number}.jpg"
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return file_path
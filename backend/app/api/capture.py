from fastapi import APIRouter, UploadFile, File, Form
from app.services.capture_service import save_page

router = APIRouter()


@router.post("/capture-page")
async def capture_page(
    session_id: str = Form(...),
    page_number: int = Form(...),
    image: UploadFile = File(...)
):

    result = await save_page(
        session_id=session_id,
        page_number=page_number,
        image=image
    )

    return result
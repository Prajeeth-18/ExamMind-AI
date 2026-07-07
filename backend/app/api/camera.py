from fastapi import APIRouter

from app.services.session_service import create_scan_session

router = APIRouter()


@router.post("/start-scan")
def start_scan():

    session = create_scan_session()

    return {
        "message": "Scan session created successfully.",
        "session_id": session["session_id"]
    }
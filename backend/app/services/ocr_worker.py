
import threading
import time
import traceback

from app.services.processing_queue import (
    get_next_page,
    page_completed,
)
from app.services.ocr.ocr_service import run_ocr
from app.services.question_buffer_service import (
    create_session,
    get_answers,
)
from app.services.question_manager import process_page_text


worker_running = False
worker_lock = threading.Lock()


def worker():
    global worker_running

    while worker_running:
        job = get_next_page()

        if job is None:
            time.sleep(0.2)
            continue

        session_id = job["session_id"]
        page_number = job["page_number"]

        try:
            print("=" * 60)
            print(
                f"OCR PROCESSING: Session={session_id}, "
                f"Page={page_number}"
            )
            print("=" * 60)

            # Create the buffer if this session has not been seen yet.
            try:
                get_answers(session_id)
            except KeyError:
                create_session(session_id)

            ocr = run_ocr(job["image_path"])

            if not ocr or ocr.get("success") is not True:
                raise RuntimeError(
                    f"OCR failed for page {page_number}: "
                    f"{(ocr or {}).get('error', 'No OCR result')}"
                )

            page_text = ocr.get("page_text", "")
            question_headings = ocr.get("question_headings", [])

            if not page_text.strip():
                print(
                    f"WARNING: No text extracted from page {page_number}."
                )
            else:
                process_page_text(
                    session_id=session_id,
                    page_number=page_number,
                    text=page_text,
                    question_headings=question_headings,
                )

            print("CURRENT SESSION ANSWERS:")
            print(get_answers(session_id))

        except Exception as e:
            print(
                f"ERROR processing page {page_number}: "
                f"{type(e).__name__}: {e}"
            )
            traceback.print_exc()

        finally:
            # Always release this page from the pending count.
            page_completed(session_id)
            print(f"Page {page_number} processing finished.")


def start_worker():
    global worker_running

    with worker_lock:
        if worker_running:
            return

        worker_running = True

        threading.Thread(
            target=worker,
            daemon=True,
            name="exam-ocr-worker",
        ).start()

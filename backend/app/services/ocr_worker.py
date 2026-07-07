import threading
import time

from app.services.processing_queue import (
    get_next_page
)

from app.services.ocr.ocr_service import (
    run_ocr
)


worker_running = False


def worker():

    global worker_running

    while worker_running:

        job = get_next_page()

        if job is None:

            time.sleep(1)

            continue

        print("=" * 60)

        print(
            f"Processing Page {job['page_number']}"
        )

        ocr = run_ocr(
            job["image_path"]
        )

        print(
            "OCR Finished"
        )

        print("=" * 60)


def start_worker():

    global worker_running

    if worker_running:

        return

    worker_running = True

    thread = threading.Thread(
        target=worker,
        daemon=True
    )

    thread.start()
import threading
import time


def process_page(session_id, page_number):

    print(f"Processing Page {page_number}...")

    time.sleep(5)

    print(
        f"Finished Processing Page {page_number}"
    )


def start_background_processing(session_id, page_number):

    worker = threading.Thread(

        target=process_page,

        args=(session_id, page_number)

    )

    worker.start()
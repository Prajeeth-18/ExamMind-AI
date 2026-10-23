from queue import Queue

processing_queue = Queue()

# Keeps track of pending pages for each session
session_pending = {}


def add_page(session_id, page_number, image_path):

    if session_id not in session_pending:
        session_pending[session_id] = 0

    session_pending[session_id] += 1

    processing_queue.put({
        "session_id": session_id,
        "page_number": page_number,
        "image_path": image_path
    })


def get_next_page():

    if processing_queue.empty():
        return None

    return processing_queue.get()


def page_completed(session_id):

    if session_id not in session_pending:
        return True

    session_pending[session_id] -= 1

    if session_pending[session_id] <= 0:
        del session_pending[session_id]
        return True

    return False


def is_processing(session_id):

    return session_id in session_pending


def queue_size():

    return processing_queue.qsize()
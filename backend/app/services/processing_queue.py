from queue import Queue

processing_queue = Queue()


def add_page(session_id, page_number, image_path):

    processing_queue.put({

        "session_id": session_id,

        "page_number": page_number,

        "image_path": image_path

    })


def get_next_page():

    if processing_queue.empty():

        return None

    return processing_queue.get()


def queue_size():

    return processing_queue.qsize()
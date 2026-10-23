processing_status = {}

def start_processing(session_id):
    processing_status[session_id] = True

def finish_processing(session_id):
    processing_status[session_id] = False

def is_processing(session_id):
    return processing_status.get(session_id, False)
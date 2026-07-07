question_buffers = {}


def create_session(session_id):

    question_buffers[session_id] = {
        "current_question": None,
        "answers": {}
    }


def start_question(session_id, question_number):

    session = question_buffers[session_id]

    session["current_question"] = question_number

    session["answers"][question_number] = {
        "status": "OPEN",
        "pages": [],
        "text": ""
    }


def append_text(
    session_id,
    page_number,
    text
):

    session = question_buffers[session_id]

    question = session["current_question"]

    if question is None:
        return

    answer = session["answers"][question]

    if page_number not in answer["pages"]:
        answer["pages"].append(page_number)

    answer["text"] += "\n" + text


def close_question(session_id):

    session = question_buffers[session_id]

    question = session["current_question"]

    if question is None:
        return

    session["answers"][question]["status"] = "COMPLETE"

    session["current_question"] = None


def get_answers(session_id):

    return question_buffers[session_id]["answers"]
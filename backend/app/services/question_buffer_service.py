question_buffers = {}


def create_session(session_id):

    question_buffers[session_id] = {

        "answers": {}

    }


def add_question(
    session_id,
    question_number,
    answer_text,
    page_number
):

    session = question_buffers[session_id]

    answers = session["answers"]

    if question_number not in answers:

        answers[question_number] = {

            "status": "OPEN",

            "pages": [],

            "text": ""

        }

    answer = answers[question_number]

    if page_number not in answer["pages"]:

        answer["pages"].append(page_number)

    if answer["text"] != "":

        answer["text"] += "\n"

    answer["text"] += answer_text


def complete_question(
    session_id,
    question_number
):

    session = question_buffers[session_id]

    if question_number in session["answers"]:

        session["answers"][question_number]["status"] = "COMPLETE"


def get_open_question(session_id):

    session = question_buffers[session_id]

    for qno in reversed(session["answers"]):

        if session["answers"][qno]["status"] == "OPEN":

            return qno

    return None


def append_to_open_question(
    session_id,
    page_number,
    text
):

    question = get_open_question(session_id)

    if question is None:

        return

    answer = question_buffers[session_id]["answers"][question]

    if page_number not in answer["pages"]:

        answer["pages"].append(page_number)

    answer["text"] += "\n" + text


def get_answers(session_id):

    return question_buffers[session_id]["answers"]
def get_all_answers(session_id):

    return question_buffers[session_id]["answers"]
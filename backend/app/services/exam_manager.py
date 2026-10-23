exam_bank = {}


def create_exam(exam_id):

    exam_bank[exam_id] = {

        "question_paper": [],

        "answer_key": [],

        "students": {}

    }


def save_question_paper(
    exam_id,
    questions
):

    if exam_id not in exam_bank:
        create_exam(exam_id)

    exam_bank[exam_id]["question_paper"] = questions


def save_answer_key(
    exam_id,
    answers
):

    if exam_id not in exam_bank:
        create_exam(exam_id)

    exam_bank[exam_id]["answer_key"] = answers

    print("=" * 60)
    print("ANSWER KEY SAVED")
    print("=" * 60)
    print("Type:", type(answers))
    print(answers)


def create_student(
    exam_id,
    session_id
):

    if exam_id not in exam_bank:
        create_exam(exam_id)

    exam_bank[exam_id]["students"][session_id] = {

        "answers": {},

        "result": None

    }


def save_student_answers(
    exam_id,
    session_id,
    answers
):

    exam_bank[exam_id]["students"][session_id]["answers"] = answers


def get_exam(
    exam_id
):

    exam = exam_bank.get(exam_id)

    print("=" * 60)
    print("GET EXAM")
    print("=" * 60)

    if exam is None:
        print("Exam NOT Found")
    else:
        print("Answer Key Type:", type(exam["answer_key"]))
        print("Answer Key Value:")
        print(exam["answer_key"])

    return exam


def get_student(
    exam_id,
    session_id
):

    return exam_bank[exam_id]["students"][session_id]
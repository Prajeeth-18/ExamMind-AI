question_bank = {}


def save_exam(exam_id, questions):

    question_bank[exam_id] = questions


def get_exam(exam_id):

    return question_bank.get(exam_id)


def list_exams():

    return question_bank
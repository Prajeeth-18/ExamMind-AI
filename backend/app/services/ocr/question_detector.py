import re


def detect_questions(text):

    lines = text.splitlines()

    questions = []

    current_question = None

    current_answer = []

    pattern = re.compile(
        r'^\s*(\d+)[.):-]?\s*'
    )

    for line in lines:

        line = line.strip()

        if line == "":
            continue

        match = pattern.match(line)

        if match:

            if current_question is not None:

                questions.append({

                    "question_no": current_question,

                    "answer": "\n".join(current_answer).strip()

                })

            current_question = match.group(1)

            current_answer = [line]

        else:

            current_answer.append(line)

    if current_question is not None:

        questions.append({

            "question_no": current_question,

            "answer": "\n".join(current_answer).strip()

        })

    return questions
import re


QUESTION_PATTERNS = [

    r"\bQ\s*\.?\s*(\d+)\b",

    r"\bQuestion\s*(\d+)\b",

    r"^(\d+)[.)]",

]


def detect_question(text):

    lines = text.splitlines()

    for line in lines:

        line = line.strip()

        for pattern in QUESTION_PATTERNS:

            match = re.search(
                pattern,
                line,
                re.IGNORECASE
            )

            if match:

                return "Q" + match.group(1)

    return None
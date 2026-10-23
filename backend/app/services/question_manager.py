
from app.services.question_buffer_service import (
    add_question,
    append_to_open_question,
    complete_question,
    get_open_question,
)


def process_page_text(
    session_id,
    page_number,
    text,
    question_headings
):
    """
    Process one OCR page in reading order.

    Text before the first detected question heading is treated as
    continuation of the currently open answer.

    A question stays open until a different question number is detected.
    """

    if not text or not text.strip():
        print(f"WARNING: Page {page_number} contains no OCR text.")
        return

    lines = text.splitlines()

    # Validate and order the heading positions.
    headings = []

    for heading in question_headings or []:
        try:
            question_no = str(heading["question_no"]).strip()
            line_number = int(heading["line_number"])
        except (KeyError, TypeError, ValueError):
            continue

        if (
            question_no.isdigit()
            and 1 <= line_number <= len(lines)
        ):
            headings.append({
                "question_no": question_no,
                "line_index": line_number - 1
            })

    headings.sort(key=lambda item: item["line_index"])

    # No new question heading: the whole page continues the open answer.
    if not headings:
        open_question = get_open_question(session_id)

        if open_question is not None:
            append_to_open_question(
                session_id,
                page_number,
                text.strip()
            )
            print(
                f"Page {page_number}: appended text to "
                f"Q{open_question}."
            )
        else:
            print(
                f"WARNING: Page {page_number} has no question heading "
                "and there is no open answer to append to."
            )
        return

    # Any text before the first question heading belongs to the
    # previous open answer, if one exists.
    first_heading_index = headings[0]["line_index"]
    prefix = "\n".join(lines[:first_heading_index]).strip()

    if prefix:
        open_question = get_open_question(session_id)

        if open_question is not None:
            append_to_open_question(
                session_id,
                page_number,
                prefix
            )
            print(
                f"Page {page_number}: appended leading text to "
                f"Q{open_question}."
            )
        else:
            print(
                f"WARNING: Ignoring unassigned text before the first "
                f"question heading on page {page_number}."
            )

    # Each heading starts a section. The section ends just before
    # the next heading, or at the end of the page.
    for index, heading in enumerate(headings):
        start = heading["line_index"]

        if index + 1 < len(headings):
            end = headings[index + 1]["line_index"]
        else:
            end = len(lines)

        section_text = "\n".join(lines[start:end]).strip()
        question_no = heading["question_no"]

        if not section_text:
            continue

        previous_open = get_open_question(session_id)

        # A different question number means the previous answer ended.
        if (
            previous_open is not None
            and str(previous_open) != question_no
        ):
            complete_question(session_id, previous_open)
            print(f"Question {previous_open} completed.")

        add_question(
            session_id,
            question_no,
            section_text,
            page_number
        )

        # Intentionally leave this question OPEN.
        # It may continue on the next page.
        print(
            f"Page {page_number}: added text to Q{question_no}; "
            "answer remains open until another question is detected."
        )


import re

from app.services.exam_manager import get_exam, get_student
from app.services.evaluation.evaluator import evaluate_answer


def evaluate_exam(exam_id, session_id):

    print("=" * 60)
    print("EVALUATION STARTED")
    print("=" * 60)

    exam = get_exam(exam_id)

    if exam is None:
        print("Exam not found")
        return []

    student = get_student(exam_id, session_id)

    if student is None:
        print("Student not found")
        return []

    answers = student.get("answers", {})
    question_paper = exam.get("question_paper", [])
    answer_key = exam.get("answer_key", {})

    print("Student Answers:")
    print(answers)

    print("Question Paper:")
    print(question_paper)

    print("Answer Key:")
    print(answer_key)

    # Extract knowledge objects from supported answer-key formats.
    if isinstance(answer_key, list):
        knowledge_questions = answer_key

    elif isinstance(answer_key, dict):
        if isinstance(answer_key.get("questions"), list):
            knowledge_questions = answer_key["questions"]

        elif isinstance(
            answer_key.get("conceptual_knowledge_representation"), list
        ):
            knowledge_questions = answer_key[
                "conceptual_knowledge_representation"
            ]

        else:
            knowledge_questions = []

            for key, value in answer_key.items():
                if not isinstance(value, dict):
                    continue

                # Supports "Question 1", "question_1", "question 1", etc.
                match = re.fullmatch(
                    r"\s*question[\s_-]*(\d+)\s*",
                    str(key),
                    flags=re.IGNORECASE
                )

                if match:
                    item = dict(value)
                    item["question_number"] = match.group(1)
                    knowledge_questions.append(item)

    else:
        knowledge_questions = []

    print("Knowledge Questions Found:", len(knowledge_questions))

    # Map knowledge objects by question number.
    knowledge_by_number = {}

    for item in knowledge_questions:
        if not isinstance(item, dict):
            continue

        question_no = item.get(
            "question_number",
            item.get("question_no", item.get("questionNo"))
        )

        if question_no is not None:
            normalized_no = str(question_no).strip()

            # Keep the original knowledge fields intact.
            knowledge_by_number[normalized_no] = item

    print("Knowledge Question Numbers:", list(knowledge_by_number.keys()))

    results = []

    for question in question_paper:

        question_no = str(question.get("question_no", "")).strip()

        print("-" * 50)
        print("Processing Question:", question_no)

        student_answer = answers.get(question_no)

        if student_answer is None:
            print("Student answer not found")
            continue

        answer_text = student_answer.get("text", "").strip()

        if not answer_text:
            print("Student answer is empty")
            continue

        print("Student Answer Found")

        knowledge_object = knowledge_by_number.get(question_no)

        if knowledge_object is None:
            print("Knowledge object not found for:", question_no)
            continue

        print("Knowledge object found")
        print("Calling answer evaluator...")

        max_marks = question.get("marks")
        if max_marks is None:
            max_marks = 10

        try:
            evaluation = evaluate_answer(
                question.get("question", ""),
                knowledge_object,
                answer_text,
                max_marks
            )

            print("Evaluation returned:")
            print(evaluation)

            results.append({
                "question_no": question_no,
                "evaluation": evaluation
            })

        except Exception as e:
            print(
                f"Evaluation failed for question {question_no}: "
                f"{type(e).__name__}: {e}"
            )

            results.append({
                "question_no": question_no,
                "error": str(e)
            })

    student["result"] = results

    print("=" * 60)
    print("FINAL RESULTS")
    print(results)
    print("=" * 60)

    return results

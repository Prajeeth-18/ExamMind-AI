from app.services.question_paper.extractor import extract_questions

text = """
1. What is Deep Learning? (10 Marks)

2. Explain CNN Architecture. (10 Marks)
"""

print(extract_questions(text))

import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


def evaluate_answer(question, knowledge, student_answer, max_marks):
    print("=" * 60)
    print("EVALUATE ANSWER STARTED")
    print("Question:", question)
    print("=" * 60)

    if client is None:
        raise RuntimeError("GEMINI_API_KEY is missing from the backend environment.")

    prompt = f"""
You are an experienced university professor.

Evaluate the student's conceptual understanding, not exact wording.
Accept logically correct alternative explanations.
Award marks fairly based on the mandatory concepts covered.
Do not penalize grammar unless it changes meaning.

Question:
{question}

Conceptual knowledge:
{json.dumps(knowledge, indent=2)}

Student answer:
{student_answer}

Maximum marks:
{max_marks}

Return ONLY valid JSON in this structure:
{{
  "marks": 0,
  "percentage": 0,
  "strengths": [],
  "missing_points": [],
  "concepts_understood": [],
  "concepts_missing": [],
  "feedback": ""
}}

Rules:
- marks must be between 0 and {max_marks}.
- percentage must be between 0 and 100.
- Use lists for strengths, missing_points, concepts_understood, and concepts_missing.
- Return JSON only, without Markdown fences.
"""

    try:
        # Use a specific model ID rather than the moving "latest" alias.
        # This model may still have a separate quota; verify availability.
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        raw_text = (response.text or "").strip()

        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "", 1)
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

        result = json.loads(raw_text)

        if not isinstance(result, dict):
            raise ValueError("Evaluator returned an invalid JSON object.")

        marks = float(result.get("marks", 0))
        maximum = float(max_marks)

        if maximum <= 0:
            raise ValueError("Maximum marks must be greater than zero.")

        result["marks"] = max(0, min(marks, maximum))
        result["percentage"] = round(result["marks"] / maximum * 100, 2)

        for field in (
            "strengths",
            "missing_points",
            "concepts_understood",
            "concepts_missing"
        ):
            if not isinstance(result.get(field), list):
                result[field] = []

        if not isinstance(result.get("feedback"), str):
            result["feedback"] = str(result.get("feedback", ""))

        print("Gemini evaluation completed")
        print(result)

        return result

    except Exception as exc:
        print("ANSWER EVALUATION FAILED:", type(exc).__name__, str(exc))
        # Do not silently turn an API failure into a zero-mark evaluation.
        raise

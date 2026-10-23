
import os
import json
import time

from PIL import Image
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


def extract_questions(image_path):
    if client is None:
        return {
            "success": False,
            "error": "GEMINI_API_KEY is missing. Check your backend .env file.",
            "questions": []
        }

    try:
        image = Image.open(image_path)
    except Exception as e:
        return {
            "success": False,
            "error": f"Could not open question paper image: {e}",
            "questions": []
        }

    prompt = """
You are reading a university question paper.

Extract every question in the original order.

Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "question_no": "1",
      "part": "A",
      "question": "What is Deep Learning?",
      "marks": 10
    }
  ]
}

Rules:
1. Preserve each question's wording as accurately as possible.
2. Keep question numbers as strings.
3. Include part when shown; otherwise use null.
4. Include marks as a number when visible; otherwise use null.
5. Do not invent missing questions, marks, or parts.
6. Include subquestions as separate entries when appropriate.
7. Return JSON only, without Markdown fences or explanations.
"""

    max_attempts = 3

    for attempt in range(max_attempts):
        try:
            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=[prompt, image]
            )

            raw_text = (response.text or "").strip()

            if raw_text.startswith("```"):
                raw_text = raw_text.replace("```json", "", 1)
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                raw_text = raw_text.strip()

            result = json.loads(raw_text)

            if not isinstance(result, dict):
                raise ValueError("Gemini did not return a JSON object.")

            questions = result.get("questions")

            if not isinstance(questions, list):
                raise ValueError(
                    "Gemini response does not contain a questions list."
                )

            print(
                f"Question paper extraction successful: "
                f"{len(questions)} questions found."
            )

            return {
                "success": True,
                "questions": questions
            }

        except Exception as e:
            error_text = f"{type(e).__name__}: {e}"
            lower_error = error_text.lower()

            retryable = any(term in lower_error for term in [
                "503",
                "429",
                "500",
                "502",
                "504",
                "unavailable",
                "resource_exhausted",
                "too many requests",
                "timeout",
                "connecterror",
                "getaddrinfo failed",
                "connection reset"
            ])

            print(
                f"Question paper extraction attempt "
                f"{attempt + 1}/{max_attempts} failed: {error_text}"
            )

            if not retryable or attempt == max_attempts - 1:
                print("QUESTION PAPER EXTRACTION FAILED")

                return {
                    "success": False,
                    "error": error_text,
                    "questions": []
                }

            wait_seconds = 2 ** (attempt + 1)
            print(f"Retrying in {wait_seconds} seconds...")
            time.sleep(wait_seconds)

    return {
        "success": False,
        "error": "Extraction failed after retries.",
        "questions": []
    }

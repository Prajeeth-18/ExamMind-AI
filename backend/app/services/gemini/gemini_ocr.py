
import os
import json
import time
from PIL import Image
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key) if api_key else None


def extract_text(image_path):
    if client is None:
        return {
            "success": False,
            "error": "GEMINI_API_KEY is missing from the environment.",
            "page_text": "",
            "question_headings": []
        }

    try:
        image = Image.open(image_path)
    except Exception as e:
        return {
            "success": False,
            "error": f"Could not open image: {e}",
            "page_text": "",
            "question_headings": []
        }

    prompt = """
You are transcribing a handwritten university answer sheet.

Return ONLY valid JSON with this exact structure:
{
  "page_text": "Complete transcription of the page, preserving line breaks.",
  "question_headings": [
    {"question_no": "1", "line_number": 1}
  ]
}

RULES:
1. Transcribe the entire page in its original reading order.
2. Preserve wording, line breaks, paragraphs, equations and bullet points.
3. Identify actual exam question headings only, not numbered answer points.
4. Accept headings such as "1.", "2)", "Question 3" or "Q4"
   only when they introduce a new exam question.
5. Question numbers must be numeric strings.
6. line_number is the 1-based line number in page_text.
7. Keep the complete heading in page_text.
8. If the page begins with continuation text and has no new question,
   return an empty question_headings array.
9. Do not omit text or invent headings.
10. Return valid JSON only, without Markdown fences.
"""

    # Retry temporary service, quota and connection errors.
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

            page_text = result.get("page_text", "")
            headings = result.get("question_headings", [])

            if not isinstance(page_text, str):
                raise ValueError("Invalid page_text returned by Gemini.")

            if not isinstance(headings, list):
                raise ValueError("Invalid question_headings returned by Gemini.")

            validated_headings = []

            for heading in headings:
                if not isinstance(heading, dict):
                    continue

                question_no = str(
                    heading.get("question_no", "")
                ).strip()

                try:
                    line_number = int(heading.get("line_number"))
                except (TypeError, ValueError):
                    continue

                if question_no.isdigit() and line_number >= 1:
                    validated_headings.append({
                        "question_no": question_no,
                        "line_number": line_number
                    })

            validated_headings.sort(
                key=lambda item: item["line_number"]
            )

            return {
                "success": True,
                "page_text": page_text,
                "question_headings": validated_headings
            }

        except Exception as e:
            error_text = f"{type(e).__name__}: {e}"
            retryable = any(term in error_text.lower() for term in [
                "503", "429", "500", "502", "504",
                "unavailable", "resource_exhausted",
                "too many requests", "timeout",
                "connecterror", "getaddrinfo failed"
            ])

            print(f"OCR attempt {attempt + 1}/{max_attempts} failed: {error_text}")

            if not retryable or attempt == max_attempts - 1:
                return {
                    "success": False,
                    "error": error_text,
                    "page_text": "",
                    "question_headings": []
                }

            wait_seconds = 2 ** (attempt + 1)
            print(f"Retrying Gemini in {wait_seconds} seconds...")
            time.sleep(wait_seconds)

    return {
        "success": False,
        "error": "Gemini failed after retries.",
        "page_text": "",
        "question_headings": []
    }


import os
import json
import re
import time

from PIL import Image
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

client = genai.Client(api_key=API_KEY) if API_KEY else None

MAX_ATTEMPTS = 3


def extract_answer_key(image_path):
    """
    Extract the teacher's answer key from an image.

    Returns the extracted JSON on success.
    Returns a structured error dictionary on failure.
    """

    if client is None:
        return {
            "success": False,
            "error": "GEMINI_API_KEY is missing from the environment.",
            "answers": []
        }

    if not os.path.isfile(image_path):
        return {
            "success": False,
            "error": f"Answer key image not found: {image_path}",
            "answers": []
        }

    prompt = """
You are reading a teacher's official answer key.

Extract every question and its answer from the supplied image.

Return ONLY valid JSON. Do not include Markdown fences or explanations.

Use this exact structure:

{
    "answers": [
        {
            "question_no": "1",
            "ideal_answer": "The complete expected answer",
            "maximum_marks": 10
        }
    ]
}

Rules:
- Preserve the question numbering.
- Extract only information supported by the image.
- Do not invent unreadable answers or marks.
- Use null for maximum_marks if the marks are not specified.
- Return an empty answers list only if no answer can be extracted.
"""

    try:
        with Image.open(image_path) as source_image:
            image = source_image.convert("RGB")

            for attempt in range(1, MAX_ATTEMPTS + 1):
                try:
                    response = client.models.generate_content(
                        model=MODEL_NAME,
                        contents=[prompt, image]
                    )

                    text = response.text

                    if not text or not text.strip():
                        raise ValueError(
                            "Gemini returned an empty answer-key response."
                        )

                    text = text.strip()

                    # Remove optional Markdown JSON fences.
                    text = re.sub(
                        r"^```(?:json)?\s*|\s*```$",
                        "",
                        text,
                        flags=re.IGNORECASE
                    ).strip()

                    # Parse and validate the expected response structure.
                    data = json.loads(text)

                    if not isinstance(data, dict):
                        raise ValueError(
                            "Gemini response must be a JSON object."
                        )

                    if not isinstance(data.get("answers"), list):
                        raise ValueError(
                            "Gemini response is missing the answers list."
                        )

                    print(
                        f"Answer key extracted successfully "
                        f"using {MODEL_NAME}."
                    )

                    return data

                except Exception as error:
                    error_text = str(error).lower()

                    temporary_error = (
                        "503" in error_text
                        or "unavailable" in error_text
                        or "429" in error_text
                        or "resource_exhausted" in error_text
                        or "high demand" in error_text
                    )

                    if temporary_error and attempt < MAX_ATTEMPTS:
                        delay = 2 ** attempt

                        print(
                            f"Temporary Gemini error "
                            f"(attempt {attempt}/{MAX_ATTEMPTS}). "
                            f"Retrying in {delay} seconds..."
                        )

                        time.sleep(delay)
                        continue

                    raise

    except Exception as error:
        print("\n" + "=" * 60)
        print("ANSWER KEY EXTRACTION FAILED")
        print(f"Model: {MODEL_NAME}")
        print(f"Error type: {type(error).__name__}")
        print(f"Error: {error}")
        print("=" * 60 + "\n")

        return {
            "success": False,
            "error": str(error),
            "answers": []
        }

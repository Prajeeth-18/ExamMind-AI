
import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


def build_knowledge(answer_key_text):

    if client is None:
        return {
            "success": False,
            "error": "GEMINI_API_KEY is missing from the backend environment.",
            "knowledge": {}
        }

    prompt = f"""
You are an expert teacher.

Study the following answer key carefully.

Do NOT summarize.

Build a conceptual knowledge representation for every question.

For every question identify:
1. Main Concept
2. Core Ideas
3. Logical Flow
4. Mandatory Points
5. Optional Supporting Points
6. Common Alternative Valid Explanations
7. Common Student Misconceptions

Return ONLY valid JSON.

Use this structure:
{{
  "Question 1": {{
    "Main Concept": "...",
    "Core Ideas": [],
    "Logical Flow": [],
    "Mandatory Points": [],
    "Optional Supporting Points": [],
    "Common Alternative Valid Explanations": [],
    "Common Student Misconceptions": []
  }}
}}

Replace the example with the actual question numbers and content.
Do not invent information absent from the answer key.

Answer Key:
{answer_key_text}
"""

    try:
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
            raise ValueError("Knowledge builder did not return a JSON object.")

        return result

    except Exception as e:
        print("\n" + "=" * 60)
        print("KNOWLEDGE BUILDER FAILED")
        print(type(e).__name__)
        print(e)
        print("=" * 60 + "\n")

        return {
            "success": False,
            "error": str(e),
            "knowledge": {}
        }

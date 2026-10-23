import os
from dotenv import load_dotenv
from PIL import Image
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

image = Image.open(
    "uploads/answer_sheets/SCAN_20260707_094322/page_1_processed.jpg"
)

prompt = """
Read every handwritten word from this answer sheet.

Return ONLY the extracted text.
Do not explain anything.
"""

response = client.models.generate_content(
    model="gemini-flash-latest",
    contents=[prompt, image]
)

print("\n===== GEMINI OUTPUT =====\n")
print(response.text)

from app.services.ocr.image_preprocessor import preprocess_image
from app.services.gemini.gemini_ocr import extract_text


def run_ocr(image_path):
    print("=" * 60)
    print("OCR STARTED")
    print("=" * 60)

    try:
        processed_image = preprocess_image(image_path)
        ocr_result = extract_text(processed_image)

        if not ocr_result or ocr_result.get("success") is not True:
            return {
                "success": False,
                "error": (ocr_result or {}).get(
                    "error", "Gemini OCR failed."
                ),
                "processed_image": processed_image,
                "page_text": "",
                "question_headings": []
            }

        page_text = ocr_result.get("page_text", "")
        question_headings = ocr_result.get("question_headings", [])

        print("FULL PAGE TEXT:")
        print(page_text)
        print("QUESTION HEADINGS:")
        print(question_headings)
        print("=" * 60)

        return {
            "success": True,
            "processed_image": processed_image,
            "page_text": page_text,
            "question_headings": question_headings
        }

    except Exception as e:
        print(f"OCR SERVICE ERROR: {type(e).__name__}: {e}")

        return {
            "success": False,
            "error": str(e),
            "page_text": "",
            "question_headings": []
        }

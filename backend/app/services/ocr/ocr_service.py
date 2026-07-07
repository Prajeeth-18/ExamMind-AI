from app.services.ocr.image_preprocessor import preprocess_image
from app.services.ocr.paddle_engine import extract_text


def run_ocr(image_path):

    print("=" * 60)
    print("OCR STARTED")
    print("=" * 60)

    # Step 1 - Preprocess image
    processed_image = preprocess_image(image_path)

    # Step 2 - OCR
    ocr_result = extract_text(processed_image)

    print("\n")
    print("=" * 60)
    print("OCR RESULT")
    print("=" * 60)
    print(ocr_result["text"])
    print("=" * 60)

    return {

        "success": True,

        "processed_image": processed_image,

        "text": ocr_result["text"],

        "lines": ocr_result["lines"]

    }
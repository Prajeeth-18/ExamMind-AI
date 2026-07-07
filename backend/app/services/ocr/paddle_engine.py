from paddleocr import PaddleOCR
import cv2
import numpy as np

print("=" * 60)
print("Loading PaddleOCR...")
print("=" * 60)

ocr = PaddleOCR(
    use_angle_cls=True,
    lang="en"
)

print("=" * 60)
print("PaddleOCR Ready")
print("=" * 60)


def extract_text(image_path):

    print("\nRunning PaddleOCR...\n")

    result = ocr.ocr(
        image_path,
        cls=True
    )

    if (
        result is None
        or len(result) == 0
        or result[0] is None
    ):
        print("No text detected.")
        return {
            "text": "",
            "lines": []
        }

    image = cv2.imread(image_path)

    detected_lines = []
    extracted_text = []

    for line in result[0]:

        if line is None:
            continue

        box = line[0]

        pts = np.array(box, dtype=np.int32)

        cv2.polylines(
            image,
            [pts],
            True,
            (0, 255, 0),
            2
        )

        text = line[1][0]
        confidence = float(line[1][1])

        print(
            f"{confidence:.2f} -> {text}"
        )

        detected_lines.append({
            "text": text,
            "confidence": confidence,
            "box": pts.tolist()
        })

        extracted_text.append(text)

    detected_image = image_path.replace(
        "_processed.jpg",
        "_detected.jpg"
    )

    cv2.imwrite(
        detected_image,
        image
    )

    print("\nDetection Image Saved:")
    print(detected_image)

    return {
        "text": "\n".join(extracted_text),
        "lines": detected_lines
    }
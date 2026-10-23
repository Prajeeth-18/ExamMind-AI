from paddleocr import PaddleOCR
from app.services.ocr.trocr_engine import recognize_text

import cv2
import numpy as np
import os

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

    print("\nRunning PaddleOCR Detection...\n")

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

    crop_folder = image_path.replace(
        "_processed.jpg",
        "_crops"
    )

    os.makedirs(
        crop_folder,
        exist_ok=True
    )

    crop_number = 1

    for line in result[0]:

        if line is None:
            continue

        box = line[0]

        pts = np.array(
            box,
            dtype=np.int32
        )

        cv2.polylines(
            image,
            [pts],
            True,
            (0, 255, 0),
            2
        )

        x, y, w, h = cv2.boundingRect(pts)

        pad = 8

        x = max(0, x - pad)
        y = max(0, y - pad)

        w = min(
            image.shape[1] - x,
            w + pad * 2
        )

        h = min(
            image.shape[0] - y,
            h + pad * 2
        )

        crop = image[
            y:y+h,
            x:x+w
        ]

        crop_path = os.path.join(
            crop_folder,
            f"crop_{crop_number}.jpg"
        )

        cv2.imwrite(
            crop_path,
            crop
        )

        paddle_text = line[1][0]

        confidence = float(
            line[1][1]
        )

        try:

            trocr_text = recognize_text(
                crop_path
            )

            final_text = trocr_text.strip()

            if final_text == "":
                final_text = paddle_text

        except Exception as e:

            print(
                "TrOCR Failed:",
                e
            )

            final_text = paddle_text

        print(
            f"{confidence:.2f} -> {final_text}"
        )

        detected_lines.append({

            "text": final_text,

            "confidence": confidence,

            "box": pts.tolist()

        })

        extracted_text.append(
            final_text
        )

        crop_number += 1

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

        "text": "\n".join(
            extracted_text
        ),

        "lines": detected_lines

    }
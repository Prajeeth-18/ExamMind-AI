
import cv2


def detect_document(image_path: str) -> bool:
    image = cv2.imread(image_path)

    if image is None:
        print("Paper detection failed: image could not be read.")
        return False

    height, width = image.shape[:2]
    image_area = height * width

    print(f"Detection image size: {width}x{height}")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Try both edge detection and threshold-based segmentation.
    edges = cv2.Canny(blurred, 40, 120)

    _, threshold = cv2.threshold(
        blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    candidates = []

    for mask in (edges, threshold):
        contours, _ = cv2.findContours(
            mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        candidates.extend(contours)

    if not candidates:
        print("Paper Detected: False — no contours found.")
        return False

    candidates.sort(key=cv2.contourArea, reverse=True)

    for contour in candidates[:10]:
        area = cv2.contourArea(contour)
        area_ratio = area / image_area

        perimeter = cv2.arcLength(contour, True)
        if perimeter <= 0:
            continue

        approx = cv2.approxPolyDP(
            contour, 0.02 * perimeter, True
        )

        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = w / h if h else 0

        print(
            f"Candidate area={area:.1f}, "
            f"ratio={area_ratio:.3f}, "
            f"corners={len(approx)}, "
            f"aspect={aspect_ratio:.2f}"
        )

        # Reject tiny contours relative to the camera frame.
        if area_ratio < 0.10:
            continue

        # A sheet should have a roughly rectangular outline.
        if len(approx) == 4 and 0.45 <= aspect_ratio <= 1.15:
            print("Paper Detected: True")
            return True

    print("Paper Detected: False — no plausible paper outline.")
    return False

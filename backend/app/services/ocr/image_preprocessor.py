import cv2
import numpy as np


def preprocess_image(image_path):

    print("=" * 60)
    print("DOCUMENT SCANNER")
    print("=" * 60)

    image = cv2.imread(image_path)

    if image is None:
        raise Exception(f"Cannot read {image_path}")

    original = image.copy()

    # ----------------------------------------
    # Resize
    # ----------------------------------------
    image = cv2.resize(
        image,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    original = image.copy()

    # ----------------------------------------
    # Gray
    # ----------------------------------------
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # ----------------------------------------
    # Blur
    # ----------------------------------------
    blurred = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    # ----------------------------------------
    # Edge Detection
    # ----------------------------------------
    edges = cv2.Canny(
        blurred,
        50,
        150
    )

    # ----------------------------------------
    # Find Contours
    # ----------------------------------------
    contours, _ = cv2.findContours(
        edges,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    page_contour = None
    max_area = 0

    for contour in contours:

        area = cv2.contourArea(contour)

        if area < 50000:
            continue

        perimeter = cv2.arcLength(
            contour,
            True
        )

        approx = cv2.approxPolyDP(
            contour,
            0.02 * perimeter,
            True
        )

        if len(approx) == 4 and area > max_area:

            page_contour = approx
            max_area = area

    debug = original.copy()

    if page_contour is not None:

        print("Document detected.")

        cv2.drawContours(
            debug,
            [page_contour],
            -1,
            (0, 255, 0),
            5
        )

    else:

        print("Document NOT detected.")

        print("Contours found:", len(contours))

        for c in contours:
            area = cv2.contourArea(c)
            peri = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02 * peri, True)
            print("Area:", area, "Corners:", len(approx))

    debug_path = image_path.replace(
        ".jpg",
        "_document.jpg"
    )

    cv2.imwrite(
        debug_path,
        debug
    )

    print("Document Debug Saved:")
    print(debug_path)

    # ----------------------------------------
    # Continue with current enhancement
    # ----------------------------------------

    background = cv2.medianBlur(
        gray,
        41
    )

    gray = cv2.divide(
        gray,
        background,
        scale=255
    )

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    gray = clahe.apply(gray)

    gray = cv2.fastNlMeansDenoising(
        gray,
        None,
        10,
        7,
        21
    )

    gray = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        11
    )

    kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (2, 2)
    )

    gray = cv2.morphologyEx(
        gray,
        cv2.MORPH_CLOSE,
        kernel
    )

    output_path = image_path.replace(
        ".jpg",
        "_processed.jpg"
    )

    cv2.imwrite(
        output_path,
        gray
    )

    print("Processed Image Saved")
    print(output_path)

    return output_path
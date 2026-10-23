import cv2


def check_blur(image_path):

    image = cv2.imread(image_path)

    if image is None:
        return {
            "sharp": False,
            "score": 0.0
        }

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    score = cv2.Laplacian(gray, cv2.CV_64F).var()

    return {

        # Convert NumPy types to Python types
        "sharp": bool(score > 120),

        "score": float(score)

    }
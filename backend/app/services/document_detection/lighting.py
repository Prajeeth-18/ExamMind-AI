import cv2


def check_lighting(image_path):

    image = cv2.imread(image_path)

    if image is None:
        return {
            "good": False,
            "brightness": 0.0
        }

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    brightness = gray.mean()

    return {

        "good": bool(70 <= brightness <= 200),

        "brightness": float(brightness)

    }
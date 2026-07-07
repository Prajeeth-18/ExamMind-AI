def extract_text(image_path):

    """
    Temporary OCR.

    Later this will become PaddleOCR.
    """

    samples = {

        "page_1.jpg": """
Q1.
Explain Operating System.

Operating System is system software.
It manages computer hardware.
""",

        "page_2.jpg": """
Memory management
Process management
Device management
""",

        "page_3.jpg": """
Q2.
Explain Deadlock.

Deadlock occurs when...
"""

    }

    for file in samples:

        if image_path.endswith(file):

            return samples[file]

    return ""
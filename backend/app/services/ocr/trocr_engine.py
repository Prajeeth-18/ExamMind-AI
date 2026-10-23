print("===== TROCR ENGINE START =====")

import torch
print("Torch imported")

from transformers import TrOCRProcessor
print("Processor imported")

from transformers import VisionEncoderDecoderModel
print("Model imported")

from PIL import Image

processor = TrOCRProcessor.from_pretrained(
    "microsoft/trocr-base-handwritten"
)

model = VisionEncoderDecoderModel.from_pretrained(
    "microsoft/trocr-base-handwritten"
)

print("===== TROCR READY =====")


def recognize_text(image_path):
    return ""
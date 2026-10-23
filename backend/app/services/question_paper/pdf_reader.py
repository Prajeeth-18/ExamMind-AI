import fitz
import os


def pdf_to_images(pdf_path):

    document = fitz.open(pdf_path)

    output_folder = pdf_path.replace(".pdf", "")

    os.makedirs(output_folder, exist_ok=True)

    image_paths = []

    for page_number in range(len(document)):

        page = document.load_page(page_number)

        pix = page.get_pixmap(matrix=fitz.Matrix(3, 3))

        image_path = os.path.join(
            output_folder,
            f"page_{page_number+1}.jpg"
        )

        pix.save(image_path)

        image_paths.append(image_path)

    document.close()

    return image_paths
from PIL import Image
import pytesseract

def extract_text(file_path: str) -> str:
    # Read plain text files directly
    if file_path.lower().endswith(".txt"):
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    img = Image.open(file_path)

    # Hindi + English OCR
    text = pytesseract.image_to_string(
        img,
        lang="hin+eng",
        config="--oem 3 --psm 6"
    )

    # Clean Tesseract artifacts
    text = text.replace("\x0c", "").strip()

    return text

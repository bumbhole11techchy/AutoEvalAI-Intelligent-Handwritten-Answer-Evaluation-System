from PIL import Image
import pytesseract

def extract_text(file_path: str):
    print("Processing file:", file_path)

    if file_path.lower().endswith(".txt"):
        print("Reading text file...")
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
            print(text)
            return text

    print("Running OCR...")

    img = Image.open(file_path)

    text = pytesseract.image_to_string(
        img,
        lang="hin+eng",
        config="--oem 3 --psm 6"
    )

    text = text.replace("\x0c", "").strip()

    print("\n===== OCR OUTPUT =====\n")
    print(text if text else "⚠️ No text detected")
    print("\n======================\n")

    return text

import pytesseract
from PIL import Image
import cv2
import numpy as np

def extract_text(image_path: str, lang: str = "eng+hin") -> str:
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    pil_img = Image.fromarray(gray)

    text = pytesseract.image_to_string(
        pil_img,
        lang=lang,
        config="--psm 6"
    )

    return text.strip()

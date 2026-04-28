import re
import unicodedata

def normalize_text(text: str) -> str:
    if not text:
        return ""

    text = unicodedata.normalize("NFKC", text)
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)

    return text
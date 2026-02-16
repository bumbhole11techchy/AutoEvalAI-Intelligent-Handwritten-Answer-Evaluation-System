import re

def detect_language_type(text: str) -> str:
    has_english = bool(re.search(r"[a-zA-Z]", text))
    has_hindi = bool(re.search(r"[\u0900-\u097F]", text))

    if has_english and has_hindi:
        return "mixed"
    elif has_english:
        return "english"
    elif has_hindi:
        return "hindi"
    else:
        return "unknown"

from backend.services.ocr_service import extract_text
from backend.services.embedding_service import get_embedding

def process_answer(image_path: str):
    text = extract_text(image_path)
    embedding = get_embedding(text)
    return text, embedding

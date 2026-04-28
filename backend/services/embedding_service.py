from sentence_transformers import SentenceTransformer
from backend.services.nlp_service import normalize_text

# Load model once at startup
model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

def get_embedding(text: str):
    """
    Generate normalized semantic embedding for input text.
    Works for English and Hindi.
    """

    # ✅ CLEAN TEXT HERE ONLY
    clean_text = normalize_text(text)

    if not clean_text:
        return [0.0] * 384  # safe fallback

    embedding = model.encode(
        clean_text,
        normalize_embeddings=True
    )

    return embedding.tolist()
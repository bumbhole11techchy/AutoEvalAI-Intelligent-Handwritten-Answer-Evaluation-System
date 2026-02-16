from sentence_transformers import SentenceTransformer

# Load model once at startup
model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

def get_embedding(text: str):
    """
    Generate normalized semantic embedding for input text.
    Works for English and Hindi.
    """
    embedding = model.encode(
        text,
        normalize_embeddings=True
    )
    return embedding.tolist()

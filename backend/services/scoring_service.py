import numpy as np

def calculate_similarity(vec1, vec2):
    vec1 = np.array(vec1, dtype=np.float32)
    vec2 = np.array(vec2, dtype=np.float32)

    if vec1.shape != vec2.shape:
        raise ValueError("Embedding dimension mismatch")

    return float(
        np.dot(vec1, vec2) /
        (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    )

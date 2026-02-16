import hashlib
from sqlalchemy import Column, String, Text
from backend.db.session import Base, SessionLocal


class GroundTruthCache(Base):
    __tablename__ = "ground_truth_cache"

    cache_key = Column(String, primary_key=True, index=True)
    answer = Column(Text)


def make_cache_key(context: str, question: str, language: str) -> str:
    raw = f"{context}|{question}|{language}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def get_cached_answer(cache_key: str) -> str | None:
    db = SessionLocal()
    try:
        row = (
            db.query(GroundTruthCache)
            .filter(GroundTruthCache.cache_key == cache_key)
            .first()
        )
        return row.answer if row else None
    finally:
        db.close()


def save_cached_answer(cache_key: str, answer: str):
    db = SessionLocal()
    try:
        row = GroundTruthCache(
            cache_key=cache_key,
            answer=answer
        )
        db.add(row)
        db.commit()
    finally:
        db.close()

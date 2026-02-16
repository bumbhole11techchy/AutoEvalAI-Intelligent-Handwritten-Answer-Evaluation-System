from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    TIMESTAMP
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func

from .session import Base


# -------------------- USER -------------------- #
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    rollno = Column(String, unique=True, nullable=False)


# -------------------- QUESTION -------------------- #
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)

    # Generated question text
    question = Column(String, nullable=False)

    # Ground truth / model answer
    model_answer = Column(String, nullable=False)

    # Embedding of ground truth answer
    model_embedding = Column(ARRAY(Float), nullable=False)

    # NEW: difficulty level (easy | medium | hard)
    difficulty = Column(String(10), nullable=False)

    # NEW: language (english | hindi)
    language = Column(String(10), nullable=False)

    # NEW: max marks for this question
    max_marks = Column(Integer, nullable=False)


# -------------------- SUBMISSION -------------------- #
class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)

    # OCR extracted answer text
    extracted_text = Column(String, nullable=False)

    # Embedding of student's answer
    user_embedding = Column(ARRAY(Float), nullable=False)

    # Semantic similarity score (0–1)
    similarity_score = Column(Float, nullable=False)

    # Final awarded marks
    awarded_marks = Column(Float, nullable=False)

    submitted_at = Column(
        TIMESTAMP,
        server_default=func.now(),
        nullable=False
    )


# -------------------- GROUND TRUTH CACHE -------------------- #
class GroundTruthCache(Base):
    __tablename__ = "ground_truth_cache"

    id = Column(Integer, primary_key=True)

    question = Column(String, nullable=False)
    context_hash = Column(String, nullable=False)

    ground_truth_answer = Column(String, nullable=False)

    language = Column(String(10), nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now(),
        nullable=False
    )

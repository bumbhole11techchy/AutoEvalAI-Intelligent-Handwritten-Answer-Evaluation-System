from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.db.session import SessionLocal
from backend.db.models import User, Question, Submission, GroundTruthCache
from backend.services.embedding_service import get_embedding
from backend.services.scoring_service import calculate_similarity
from backend.services.language_validator import detect_language_type

router = APIRouter(prefix="/evaluate", tags=["Evaluate"])


# 🔹 Request body schema
class EvaluateRequest(BaseModel):
    rollno: str
    question_id: int
    answer_text: str


@router.post("/")
def evaluate_answer(payload: EvaluateRequest):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.rollno == payload.rollno).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        question = db.query(Question).filter(
            Question.id == payload.question_id
        ).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        lang = detect_language_type(payload.answer_text)
        if not lang:
            raise HTTPException(
                status_code=400,
                detail="Unable to detect answer language"
            )

        cached_gt = (
            db.query(GroundTruthCache)
            .filter(GroundTruthCache.question == question.question)
            .first()
        )

        ground_truth_answer = (
            cached_gt.ground_truth_answer
            if cached_gt
            else question.model_answer
        )

        if not ground_truth_answer:
            raise HTTPException(
                status_code=500,
                detail="Ground truth answer not available"
            )

        user_embedding = get_embedding(payload.answer_text)
        ground_truth_embedding = get_embedding(ground_truth_answer)

        if user_embedding is None or ground_truth_embedding is None:
            raise HTTPException(
                status_code=500,
                detail="Embedding generation failed"
            )

        similarity_score = calculate_similarity(
            user_embedding,
            ground_truth_embedding
        )

        awarded_marks = round(
            similarity_score * question.max_marks,
            2
        )

        submission = Submission(
            user_id=user.id,
            question_id=question.id,
            extracted_text=payload.answer_text,
            user_embedding=user_embedding,  # serialize if needed
            similarity_score=similarity_score,
            awarded_marks=awarded_marks
        )

        db.add(submission)
        db.commit()
        db.refresh(submission)

        return {
            "rollno": payload.rollno,
            "question_id": question.id,
            "language": lang,
            "similarity_score": round(similarity_score, 4),
            "awarded_marks": awarded_marks,
            "max_marks": question.max_marks,
            "result": (
                "Correct" if similarity_score >= 0.75
                else "Partially Correct" if similarity_score >= 0.5
                else "Incorrect"
            )
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Evaluate Error:", repr(e))
        raise HTTPException(status_code=500, detail="Evaluation failed")
    finally:
        db.close()

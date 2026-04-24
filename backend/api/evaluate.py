from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.db.session import SessionLocal
from backend.db.models import User, Question, Submission, GroundTruthCache
from backend.services.embedding_service import get_embedding
from backend.services.scoring_service import calculate_similarity
from backend.services.language_validator import detect_language_type

router = APIRouter(prefix="/evaluate", tags=["Evaluate"])


class EvaluateRequest(BaseModel):
    rollno: str
    question_id: int
    answer_text: str


@router.post("/")
def evaluate_answer(payload: EvaluateRequest):
    db = SessionLocal()

    try:
        # ===== USER =====
        user = db.query(User).filter(User.rollno == payload.rollno).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # ===== QUESTION =====
        question = db.query(Question).filter(
            Question.id == payload.question_id
        ).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        # ===== LANGUAGE =====
        lang = detect_language_type(payload.answer_text)
        if not lang:
            raise HTTPException(
                status_code=400,
                detail="Unable to detect answer language"
            )

        # ===== GROUND TRUTH CACHE =====
        cached_gt = (
            db.query(GroundTruthCache)
            .filter(GroundTruthCache.question == question.question)
            .first()
        )

        # ===== SELECT ANSWER + EMBEDDING CONSISTENTLY =====
        if cached_gt:
            ground_truth_answer = cached_gt.ground_truth_answer
            ground_truth_embedding = get_embedding(ground_truth_answer)  # 🔥 FIX
        else:
            ground_truth_answer = question.model_answer
            ground_truth_embedding = question.model_embedding  # ⚡ FAST PATH

        if not ground_truth_answer:
            raise HTTPException(
                status_code=500,
                detail="Ground truth answer not available"
            )

        # 🔍 DEBUG
        print("\n====================")
        print("QUESTION:", question.question[:80])
        print("GROUND TRUTH:", ground_truth_answer[:80])
        print("====================\n")

        # ===== USER EMBEDDING =====
        user_embedding = get_embedding(payload.answer_text)

        if user_embedding is None or ground_truth_embedding is None:
            raise HTTPException(
                status_code=500,
                detail="Embedding generation failed"
            )

        # ===== SIMILARITY =====
        similarity_score = calculate_similarity(
            user_embedding,
            ground_truth_embedding
        )

        similarity_score = max(0, similarity_score)
        similarity_score = round(similarity_score, 4)

        # ===== MARKS =====
        awarded_marks = round(
            similarity_score * question.max_marks,
            2
        )

        # ===== SAVE =====
        submission = Submission(
            user_id=user.id,
            question_id=question.id,
            extracted_text=payload.answer_text,
            user_embedding=user_embedding,
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
            "similarity_score": similarity_score,
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
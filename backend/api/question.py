from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.db.session import SessionLocal
from backend.db.models import Question
from backend.services.question_generator import generate_questions

router = APIRouter(prefix="/question", tags=["Questions"])


class AutoQuestionRequest(BaseModel):
    context: str = Field(..., min_length=10)
    difficulty: str = Field(..., example="easy")  # easy | medium | hard
    num_questions: int = Field(3, ge=1, le=10)


@router.post("/auto")
def auto_generate_questions(payload: AutoQuestionRequest):
    context = payload.context.strip()

    if not context:
        raise HTTPException(status_code=400, detail="Context is required")

    if payload.difficulty not in {"easy", "medium", "hard"}:
        raise HTTPException(
            status_code=400,
            detail="Difficulty must be easy, medium, or hard"
        )

    db = SessionLocal()

    try:
        # 🔥 DO NOT PASS LANGUAGE (generator handles it)
        generated = generate_questions(
            context=context,
            difficulty=payload.difficulty,
            num_questions=payload.num_questions
        )

        results = []

        for item in generated:
            q = Question(
                question=item["question"],
                model_answer=item["reference_answer"],          # ✅ FIX
                model_embedding=item["reference_embedding"],    # ✅ FIX
                difficulty=item["difficulty"],
                language=item["language"],
                max_marks=item["max_marks"]
            )

            db.add(q)
            db.commit()
            db.refresh(q)

            results.append({
                "question_id": q.id,
                "question": q.question,
                "language": q.language,
                "difficulty": q.difficulty,
                "max_marks": q.max_marks
            })

        return {
            "language_detected": results[0]["language"] if results else None,
            "count": len(results),
            "questions": results
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()

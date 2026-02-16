from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os

from backend.services.ocr_service import extract_text
from backend.services.embedding_service import get_embedding
from backend.services.scoring_service import calculate_similarity

from backend.db.session import SessionLocal
from backend.db.models import Submission, Question, User

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "storage/handwritten"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def calculate_awarded_marks(similarity: float, max_marks: int) -> int:
    if similarity <= 0:
        return 0
    return round(similarity * max_marks)


@router.post("/")
def upload_answer(
    question_id: int,
    rollno: str,
    file: UploadFile = File(...)
):
    db = SessionLocal()

    try:
        # 1️⃣ Validate file type
        filename = file.filename.lower()
        if not filename.endswith((".png", ".jpg", ".jpeg", ".txt")):
            raise HTTPException(
                status_code=400,
                detail="Only image or .txt files allowed"
            )

        # 2️⃣ Save file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 3️⃣ OCR
        extracted_text = extract_text(file_path)

        # Hindi-safe validation (🔥 FIX)
        if len(extracted_text) < 5:
            raise HTTPException(
                status_code=400,
                detail="Text too short or unclear in uploaded file"
            )

        # 4️⃣ Get or create user
        user = db.query(User).filter(User.rollno == rollno).first()
        if not user:
            user = User(rollno=rollno)
            db.add(user)
            db.commit()
            db.refresh(user)

        # 5️⃣ Get question
        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise HTTPException(
                status_code=404,
                detail="Question not found"
            )

        if question.model_embedding is None:
            raise HTTPException(
                status_code=500,
                detail="Model answer embedding missing"
            )

        # 6️⃣ Embedding (must be MULTILINGUAL)
        user_embedding = get_embedding(extracted_text)

        # 7️⃣ Similarity
        similarity_score = calculate_similarity(
            user_embedding,
            question.model_embedding
        )

        # 8️⃣ Marks
        awarded_marks = calculate_awarded_marks(
            similarity=similarity_score,
            max_marks=question.max_marks
        )

        # 9️⃣ Save submission
        submission = Submission(
            user_id=user.id,
            question_id=question.id,
            extracted_text=extracted_text,
            user_embedding=user_embedding,
            similarity_score=similarity_score,
            awarded_marks=awarded_marks
        )

        db.add(submission)
        db.commit()
        db.refresh(submission)

        # 🔟 Response
        return {
            "rollno": rollno,
            "question_id": question_id,
            "similarity_score": round(similarity_score, 4),
            "awarded_marks": awarded_marks,
            "max_marks": question.max_marks,
            "extracted_text": extracted_text
        }

    except Exception as e:
        print("UPLOAD ERROR:", e)
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        db.close()
    print("OCR TEXT:", extracted_text[:500])

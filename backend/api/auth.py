from fastapi import APIRouter, HTTPException
from backend.db.session import SessionLocal
from backend.db.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(rollno: str):
    db = SessionLocal()
    try:
        if not rollno.strip():
            raise HTTPException(
                status_code=400,
                detail="Roll number is required"
            )

        # 🔹 Check if user exists
        user = db.query(User).filter(User.rollno == rollno).first()

        # 🔹 Auto-create user if not exists
        if not user:
            user = User(rollno=rollno)
            db.add(user)
            db.commit()
            db.refresh(user)

        return {
            "user_id": user.id,
            "rollno": user.rollno,
            "message": "Login successful"
        }

    finally:
        db.close()

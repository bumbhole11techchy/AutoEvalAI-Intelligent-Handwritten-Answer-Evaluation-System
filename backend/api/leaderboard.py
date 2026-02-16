from fastapi import APIRouter
from sqlalchemy import func
from backend.db.session import SessionLocal
from backend.db.models import Submission, User

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("/")
def leaderboard():
    db = SessionLocal()
    try:
        results = (
            db.query(
                User.rollno.label("rollno"),
                func.avg(Submission.similarity_score).label("score")
            )
            .join(Submission, Submission.user_id == User.id)
            .group_by(User.rollno)
            .order_by(func.avg(Submission.similarity_score).desc())
            .all()
        )

        leaderboard = []
        for rank, row in enumerate(results, start=1):
            leaderboard.append({
                "rank": rank,
                "rollno": row.rollno,
                "score": round(row.score, 4)
            })

        return leaderboard

    finally:
        db.close()

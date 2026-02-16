from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Routers
from backend.api import auth, upload, evaluate, leaderboard, question

# Database
from backend.db.session import engine, Base
from backend.db import models  # 👈 IMPORTANT: registers all tables

app = FastAPI(title="Cross-Lingual Answer Evaluation API")

# ✅ Create DB tables at startup
Base.metadata.create_all(bind=engine)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(evaluate.router)
app.include_router(leaderboard.router)
app.include_router(question.router)

@app.get("/")
def root():
    return {"status": "Backend running successfully 🚀"}

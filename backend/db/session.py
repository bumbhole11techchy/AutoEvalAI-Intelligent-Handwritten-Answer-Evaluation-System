from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql+psycopg2://postgres:9307034876@127.0.0.1:5433/cross_lingual_eval"

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

try:
    with engine.connect() as conn:
        print("✅ PostgreSQL connected successfully")
except Exception as e:
    print("❌ DB connection failed:", e)

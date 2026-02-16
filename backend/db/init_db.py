from backend.db.session import engine, Base
from backend.db import models

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created")

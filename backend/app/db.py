from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create tables automatically on cold start (convenience for development).
# If the DB is unreachable at import time, catch and log the error so Lambda
# initialization doesn't fail outright.
try:
    from .models import Base
    Base.metadata.create_all(bind=engine)
except Exception as _e:
    print(f"Warning: could not create tables at startup: {_e}")

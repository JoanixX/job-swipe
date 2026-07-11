import os

from dotenv import load_dotenv

load_dotenv()

QDRANT_HOST = os.getenv(
    "QDRANT_HOST",
    "http://localhost:6333",
)

BACKEND_API_URL = os.getenv("BACKEND_API_URL")
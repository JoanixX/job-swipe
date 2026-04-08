# connection.py
import os
from qdrant_client import QdrantClient

QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", None)

client = QdrantClient(
    url=QDRANT_HOST,
    api_key=QDRANT_API_KEY
)
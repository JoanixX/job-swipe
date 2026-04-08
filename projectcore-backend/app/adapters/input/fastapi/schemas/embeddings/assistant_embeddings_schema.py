from pydantic import BaseModel
from typing import List, Dict, Any

class AssistantEmbeddingsRequest(BaseModel):
    chat_id: str
    vector: List[float]
    k: int = 5

class AssistantEmbeddingsResponse(BaseModel):
    matches: List[Dict[str, Any]] | None = None
    status: str = "ok"
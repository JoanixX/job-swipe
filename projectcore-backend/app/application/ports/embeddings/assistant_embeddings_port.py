from abc import ABC, abstractmethod
from typing import List, Dict, Any

from app.domain.entities.embeddings.assistant_embeddings import AssistantEmbedding

class AssistantEmbeddingsPort(ABC):
    @abstractmethod
    def upsert(self, items: List[AssistantEmbedding]) -> None:
        pass

    @abstractmethod
    def search(self, vector: List[float], k: int = 5, where: Dict[str, Any] | None = None):
        pass
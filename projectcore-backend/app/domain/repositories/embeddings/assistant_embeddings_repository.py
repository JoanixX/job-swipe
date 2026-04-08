from abc import ABC, abstractmethod
from typing import List, Dict, Any

from app.domain.entities.embeddings.assistant_embeddings import AssistantEmbeddings

class AssistantEmbeddingsRepository(ABC):
    @abstractmethod
    async def save(self, embedding: AssistantEmbeddings) -> None:
        pass

    @abstractmethod
    async def bulk_save(self, embeddings: List[AssistantEmbeddings]) -> None:
        pass

    @abstractmethod
    async def search(self, vector: List[float], k: int = 5) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def delete(self, embedding_id: str) -> None:
        pass
from typing import List, Dict, Any

from app.domain.entities.embeddings.assistant_embeddings import AssistantEmbeddings
from app.domain.repositories.embeddings.assistant_embeddings_repository import AssistantEmbeddingsRepository

class AssistantEmbeddingsService:
    def __init__(self, repo: AssistantEmbeddingsRepository):
        self.repo = repo

    async def save(self, chat_id: str | int, vector: List[float]) -> None:
        entity = AssistantEmbeddings(id=str(chat_id), vector=vector)
        await self.repo.save(entity)

    async def bulk_save(self, items: List[Dict[str, Any]]) -> None:
        embeddings = [AssistantEmbeddings(id=str(it["chat_id"]), vector=it["vector"]) for it in items]
        await self.repo.bulk_save(embeddings)

    async def search(self, vector: List[float], k: int = 5):
        return await self.repo.search(vector, k)

    async def delete(self, chat_id: str | int) -> None:
        await self.repo.delete(str(chat_id))
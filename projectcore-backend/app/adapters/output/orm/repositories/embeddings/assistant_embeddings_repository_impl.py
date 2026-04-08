import anyio
from typing import List

from app.domain.entities.embeddings.assistant_embeddings import AssistantEmbeddings
from app.domain.repositories.embeddings.assistant_embeddings_repository import AssistantEmbeddingsRepository
from app.adapters.output.ports.embeddings.assistant_embeddings_port_impl import AssistantEmbeddingsPortImpl

class AssistantEmbeddingsRepositoryImpl(AssistantEmbeddingsRepository):
    def __init__(self, port: AssistantEmbeddingsPortImpl | None = None):
        self.port = port or AssistantEmbeddingsPortImpl()
        self.collection = "chat_history"

    async def save(self, embedding: AssistantEmbeddings) -> None:
        await anyio.to_thread.run_sync(self.port.upsert, [embedding])

    async def bulk_save(self, embeddings: List[AssistantEmbeddings]) -> None:
        await anyio.to_thread.run_sync(self.port.upsert, embeddings)

    async def search(self, vector: List[float], k: int = 5):
        return await anyio.to_thread.run_sync(self.port.search, self.collection, vector, k)

    async def delete(self, embedding_id: str) -> None:
        await anyio.to_thread.run_sync(self.port.delete, self.collection, embedding_id)
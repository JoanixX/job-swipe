from typing import List

from app.domain.entities.embeddings.assistant_embeddings import AssistantEmbedding
from app.adapters.output.ports.embeddings.assistant_embeddings_port_impl import QdrantAssistantEmbeddingsImpl

class AssistantEmbeddingUseCase:
    def __init__(self, repo: QdrantAssistantEmbeddingsImpl | None = None):
        self.repo = repo or QdrantAssistantEmbeddingsImpl()

    def execute(self, chat_id: str | int, vector: List[float]):
        emb = AssistantEmbedding(id=str(chat_id), vector=vector, collection="chat_history")
        self.repo.upsert([emb])

    def __init__(self, repo: QdrantAssistantEmbeddingsImpl | None = None):
        self.repo = repo or QdrantAssistantEmbeddingsImpl()

    def execute(self, vector: List[float], k: int = 5):
        return self.repo.search(vector, k)
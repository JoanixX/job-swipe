from typing import List, Dict, Any
from qdrant_client.models import PointStruct, VectorParams, Distance
from app.domain.entities.embeddings.assistant_embeddings import AssistantEmbeddings
from app.infraestructure.vector_database.connection import client

class AssistantEmbeddingsPortImpl:
    def ensure_collection(self, collection: str, dim: int):
        collections = client.get_collections().collections
        names = [c.name for c in collections]
        if collection not in names:
            client.recreate_collection(
                collection_name=collection,
                vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
            )

    def upsert(self, items: List[AssistantEmbeddings]) -> None:
        if not items:
            return
        collection = items[0].collection
        dim = len(items[0].vector)
        self.ensure_collection(collection, dim)

        points = [PointStruct(id=it.id, vector=it.vector) for it in items]
        client.upsert(collection_name=collection, points=points)

    def search(self, collection: str, vector: List[float], k: int = 5) -> List[Dict[str, Any]]:
        results = client.search(collection_name=collection, query_vector=vector, limit=k)
        return [{"id": r.id, "score": getattr(r, "score", None)} for r in results]

    def delete(self, collection: str, point_id: str) -> None:
        client.delete(collection_name=collection, points=[point_id])
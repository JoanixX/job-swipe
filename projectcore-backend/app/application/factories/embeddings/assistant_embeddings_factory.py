from app.adapters.output.orm.repositories.embeddings.assistant_embeddings_repository_impl import AssistantEmbeddingsRepositoryImpl
from app.domain.services.embeddings.assistant_embeddings_service import AssistantEmbeddingsService

class AssistantEmbeddingsFactory:
    @staticmethod
    def build_service() -> AssistantEmbeddingsService:
        repo = AssistantEmbeddingsRepositoryImpl()
        return AssistantEmbeddingsService(repo)
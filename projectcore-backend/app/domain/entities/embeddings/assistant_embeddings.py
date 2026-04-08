from dataclasses import dataclass
from typing import List

@dataclass(frozen=True)
class AssistantEmbeddings:
    id: str
    vector: List[float]
    collection: str = "chat_history"
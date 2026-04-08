from dataclasses import dataclass
from typing import List

@dataclass(frozen=True)
class KawsAIEmbeddings:
    id: str
    vector: List[float]
    collection: str = "kawsai_data"
import requests
from typing import List, Dict, Any

class EmbeddingClient:
	def __init__(self, backend_url: str):
		self.backend_url = backend_url.rstrip('/')

	def send_assistant_embeddings(self, embeddings: List[Dict[str, Any]]) -> requests.Response:
		"""
		Envía una lista de embeddings de Assistant al backend.
		embeddings: List[Dict] con la estructura esperada por el backend.
		"""
		url = f"{self.backend_url}/embeddings/assistant/"
		response = requests.post(url, json={"embeddings": embeddings})
		return response

# Ejemplo de uso:
# client = EmbeddingClient("http://localhost:8000")
# assistant_embs = [{"id": "doc1", "embedding": [0.1, 0.2, ...], "metadata": {...}}]
# resp = client.send_assistant_embeddings(assistant_embs)
# print(resp.status_code, resp.json())

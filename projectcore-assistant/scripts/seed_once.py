# scripts/seed_once.py
import sys
import os
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import fitz  # pymupdf

def run():
    print("🚀 Seeding inicial ejecutado correctamente")

    QDRANT_HOST = os.getenv("QDRANT_HOST")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
    COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME", "fragmentos_pdf")

    client = QdrantClient(QDRANT_HOST, api_key=QDRANT_API_KEY)
    modelo = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')

    pdf_dir = os.path.join(os.path.dirname(__file__), '../docs')
    for filename in os.listdir(pdf_dir):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(pdf_dir, filename)
            doc = fitz.open(pdf_path)
            for page in doc:
                text = page.get_text()
                if text.strip():
                    embedding = modelo.encode([text], convert_to_tensor=False)
                    if isinstance(embedding, list) and len(embedding) == 1 and isinstance(embedding[0], list):
                        embedding = embedding[0]
                    # Verifica si ya existe el fragmento en Qdrant usando algún campo único
                    point_id = f"{filename}_{page.number}"
                    # Evita duplicados: busca por id
                    existing = client.retrieve(collection_name=COLLECTION_NAME, ids=[point_id])
                    if not existing or not existing.get('points'):
                        client.upsert(
                            collection_name=COLLECTION_NAME,
                            points=[{
                                "id": point_id,
                                "vector": embedding,
                                "payload": {"fragmento": text, "source": filename}
                            }]
                        )
    print("Embeddings de PDFs cargados en Qdrant.")

if __name__ == "__main__":
    try:
        run()
    except Exception as e:
        print(f"❌ Error en el seeding: {e}")
        sys.exit(1)
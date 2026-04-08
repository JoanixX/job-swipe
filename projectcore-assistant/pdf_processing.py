import pymupdf
import textwrap
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
import os
from dotenv import load_dotenv

load_dotenv()

QDRANT_HOST = os.getenv("QDRANT_HOST")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME", "fragmentos_pdf")

def extraer_fragmentos_pdf(ruta_pdf, largo_max=500):
    doc = pymupdf.open(ruta_pdf)
    texto = ""
    for page in doc:
        texto += page.get_text() + "\n"
    fragmentos = textwrap.wrap(texto, width=largo_max, break_long_words=False)
    return fragmentos

def generar_embeddings(fragmentos):
    modelo = SentenceTransformer('all-MiniLM-L6-v2')
    vectores = modelo.encode(fragmentos, convert_to_tensor=False)
    return vectores

def guardar_en_qdrant(fragmentos, vectores, source_name):
    client = QdrantClient(QDRANT_HOST, api_key=QDRANT_API_KEY)
    # Crear colección si no existe
    if COLLECTION_NAME not in [c.name for c in client.get_collections().collections]:
        client.create_collection(
            COLLECTION_NAME,
            vectors_config=VectorParams(size=len(vectores[0]), distance=Distance.COSINE)
        )
    # Verificar si ya existen fragmentos de este PDF
    scroll_result = client.scroll(
        collection_name=COLLECTION_NAME,
        filter={"must": [{"key": "source", "match": {"value": source_name}}]},
        limit=1
    )
    if scroll_result[1]:  # Si hay resultados, ya está cargado
        print(f"Fragmentos de {source_name} ya existen en Qdrant. No se cargan de nuevo.")
        return
    # Guardar cada fragmento y vector con 'source' en el payload
    points = [
        PointStruct(
            id=f"{source_name}_{i}",
            vector=vector.tolist() if hasattr(vector, "tolist") else vector,
            payload={"fragmento": fragmentos[i], "source": source_name}
        )
        for i, vector in enumerate(vectores)
    ]
    client.upsert(collection_name=COLLECTION_NAME, points=points)
    print(f"Guardados {len(points)} fragmentos de {source_name} en Qdrant.")

import glob
import os

def procesar_y_guardar_pdf(ruta_pdf):
    source_name = os.path.basename(ruta_pdf)
    print(f"Procesando {source_name} ...")
    fragmentos = extraer_fragmentos_pdf(ruta_pdf)
    vectores = generar_embeddings(fragmentos)
    guardar_en_qdrant(fragmentos, vectores, source_name)

if __name__ == "__main__":
    # Buscar todos los archivos PDF en el directorio actual
    pdfs = glob.glob(os.path.join(os.path.dirname(__file__), '*.pdf'))
    if not pdfs:
        print("No se encontraron archivos PDF en el directorio.")
    for ruta in pdfs:
        procesar_y_guardar_pdf(ruta)
    print("Carga de PDFs en Qdrant completada.")